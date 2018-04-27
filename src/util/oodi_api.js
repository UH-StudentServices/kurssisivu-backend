const axios = require('axios')
const config = require('../config')

const BASE_URL = config.OODI_BASE_URL

const get = async (url) => {
  try {
    const response = await axios.get(url)
    return response.data.data
  } catch(e) {
    throw `${e.code} ${e.config.url}`
  }
}

const courseInfo = async (id) => 
  await get(`${BASE_URL}/courseunitrealisations/${id}`)

const learningOpportunityInfo = async (opportunityId) => 
  await get(`${BASE_URL}/learningopportunities/${opportunityId}`)

const periodInfo = async () =>  {
  await get(`${BASE_URL}/codes/courseunitrealisations/periods`)
}
  
const courseIdsOfOrganization = async (organization) => {
  const data = await get(`${BASE_URL}/courseunitrealisations/organisations/${organization}`)
  return data.map(course => course.course_id)
}

module.exports = {
  courseInfo,
  learningOpportunityInfo,
  courseIdsOfOrganization,
  periodInfo
}