const _ = require('lodash')
const moment = require('moment')

const util = require('./util')
const logger = require('./util/logger')
const oodiApi = require('./util/oodi_api')
const cache = require('./util/cache')

const run = async () => {
  const validOrganizationCodes = await cache.validOrganizationCodes()
  const learningOpportunityTypecodes = await cache.learningOpportunityTypecodes()

  const learningOpportunityTypecode = async (opportunity_id) => {
    if (learningOpportunityTypecodes[opportunity_id]===undefined) {
      const learningOpportunity = await oodiApi.learningOpportunityInfo(opportunity_id)
      learningOpportunityTypecodes[opportunity_id] = learningOpportunity.learningopportunity_type_code
    }
    return learningOpportunityTypecodes[opportunity_id]
  }

  let allPeriods = await oodiApi.periodInfo()

  const periodsOf = util.getCoursePeriods(allPeriods)

  const coursesOfOrganization = validOrganizationCodes.reduce((object, code) => {
    object[code] = []; return object
  },{})
  
  logger.info('started cache refresh')

  let stop = 0

  for (let i = 0; i < validOrganizationCodes.length && stop==0; i++) {
    const organization = validOrganizationCodes[i]
    logger.info(` organization ${organization}`)

    const courseIds = await oodiApi.courseIdsOfOrganization(organization)

    for (let j = 0; j < courseIds.length && j == 0; j++ ) {
      const courseId = courseIds[j]
      
      const course = await oodiApi.courseInfo(courseId)

      if (course===null) {
        continue
      }

      stop = 1

      course.periods = await periodsOf(course)

      course.years = _.uniq([ moment(course.start_date).year(), moment(course.end_date).year()])

      course.learningopportunity_type_code = await learningOpportunityTypecode(course.learningopportunity_id)

      course.organisations.filter(code => validOrganizationCodes.includes(code)).forEach(organisationOfCourse=>{
        coursesOfOrganization[organisationOfCourse].push(course)
      })
    } 
    logger.info(` ready ${organization}`)
  }
  
  await cache.saveCoursesOfOrganization(coursesOfOrganization)
  await cache.saveLearningOpportunityTypecodes(learningOpportunityTypecodes)

  logger.info('finished cache refresh')

  cache.exit()
}

process.on('unhandledRejection', (reason, p) => {
  console.log(reason)
})

module.exports = { run }