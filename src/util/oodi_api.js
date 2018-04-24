const axios = require('axios')
const moment = require('moment')
const _ = require('lodash')

const util = ('./index')
require('dotenv').config()

const courseInfo = async (id) => {
  const url = `${process.env.OODI_BASE_URL}/courseunitrealisations/${id}`
  const response = await axios.get(url)

  return util.formatCourse(response.data.data)
}

const learningOpportunityInfo = async (opportunityId) => {
  const url = `${process.env.OODI_BASE_URL}/learningopportunities/${opportunityId}`
  const response = await axios.get(url)
  console.log(JSON.stringify(response.data.data, null, 2))
  
  return response.data.data
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

module.exports = {
  courseInfo,
  learningOpportunityInfo,
  courseIdsOfOrganization,
  periodInfo
}