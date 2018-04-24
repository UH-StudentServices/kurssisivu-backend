const axios = require('axios')
const config = require('../config')

const BASE_URL = config.OODI_BASE_URL

const courseInfo = async (id) => {
  const url = `${BASE_URL}/courseunitrealisations/${id}`
  const response = await axios.get(url)

  return response.data.data
}

const learningOpportunityInfo = async (opportunityId) => {
  const url = `${BASE_URL}/learningopportunities/${opportunityId}`
  const response = await axios.get(url)
  
  return response.data.data
}

const courseIdsOfOrganization = async (organization) => {
  const url = `${BASE_URL}/courseunitrealisations/organisations/${organization}`
  const response = await axios.get(url)

  return response.data.data.map(course => course.course_id)
}

const periodInfo = async () => {
  const url = `${BASE_URL}/codes/courseunitrealisations/periods`
  const response = await axios.get(url)
  
  return response.data.data
}

module.exports = {
  courseInfo,
  learningOpportunityInfo,
  courseIdsOfOrganization,
  periodInfo
}