const axios = require('axios')
const winston = require('winston')
const _ = require('lodash')
const moment = require('moment')
const redis = require('redis')
require('bluebird').promisifyAll(redis.RedisClient.prototype)

require('dotenv').config()

const formatCourse = (course) => {
  const organizationsOf = (course) => {
    const codes = course['organisations'].map(o => o.code)
      .concat(...course['courses_extra_organisations'].map(o => o.code))
      .concat(...course['providing_organisation'].map(o => o.code))

    return _.uniq(codes)
  }

  const relevantKeys = [
    'start_date', 'end_date', 'credit_points', 'course_id', 
    'learningopportunity_id', 'languages', 'realisation_name', 'realisation_type_code',
  ]

  const formattedCourse = relevantKeys.reduce((object, key) => { 
    object[key] = course[key] ; return object
  } ,{})

  formattedCourse.organisations = organizationsOf(course)

  return formattedCourse
}

const courseInfo = async (id) => {
  const url = `${process.env.OODI_BASE_URL}/courseunitrealisations/${id}`
  const response = await axios.get(url)
  return formatCourse(response.data.data)
}

const courseIdsOfOrganization = async (organization) => {
  const url = `${process.env.OODI_BASE_URL}/courseunitrealisations/organisations/${organization}`
  const response = await axios.get(url)
  return response.data.data.map(course => course.course_id)
}

const periodInfo = async () => {
  const url = `${process.env.OODI_BASE_URL}/codes/courseunitrealisations/periods`
  const response = await axios.get(url)
  
  const reducer = (periods, period) => {
    const year = moment(period.start_date).year()

    periods[year] = periods[year] ? periods[year].concat(period) : [period]

    return periods
  }

  return response.data.data.reduce(reducer, {})
}

const getPeriods = (periods, course) => {
  const courseStart = moment(course.start_date)
  const courseEnd = moment(course.end_date)
  const possiblePeriods = periods[courseStart.year()]

  const periodNumber = (period) => {
    const finnishName = period.name.find(name =>  name.langcode === 'fi')

    if (finnishName.text[11]==='K') {
      return 5
    }

    return Number(finnishName.text[11])
  }

  const intersectsWithCourse = (period) => {
    const periodStart = moment(period.start_date)
    const periodEnd = moment(period.end_date)
    
    return courseStart.isBetween(periodStart, periodEnd, null, '[]') 
      || courseEnd.isBetween(periodStart, periodEnd, null, '[]') 
  }

  return possiblePeriods.filter(intersectsWithCourse).map(periodNumber)
}

async function run() {
  const periods = await periodInfo()
  const periodsOf = getPeriods.bind(null, periods)

  const redisClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST)

  const validOrganizationCodes = JSON.parse(await redisClient.getAsync(process.env.ORGANIZATIONS_KEY))

  const coursesOfOrganization = validOrganizationCodes.reduce((object, code) => {
    object[code] = []; return object
  },{})
  
  winston.info('started cache refresh')

  for (let i = 0; i < validOrganizationCodes.length; i++) {
    const organization = validOrganizationCodes[i]
    winston.info(` organization ${organization}`)

    const courseIds = await courseIdsOfOrganization(organization)
    for (let j = 0; j < courseIds.length; j++) {
      const courseId = courseIds[j];
      
      const course = await courseInfo(courseId)
      course.periods = periodsOf(course)
      course.years = _.uniq([ moment(course.start_date).year(), moment(course.end_date).year()])

      course.organisations.filter(code => validOrganizationCodes.includes(code)).forEach(organisationOfCourse=>{
        coursesOfOrganization[organisationOfCourse].push(course)
      })
    } 
  }
  
  await redisClient.setAsync(process.env.COURSES_KEY, JSON.stringify(coursesOfOrganization))

  winston.info('finished cache refresh')

  redisClient.quit()
}

run()