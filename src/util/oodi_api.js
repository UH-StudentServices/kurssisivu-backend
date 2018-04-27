const config = require('../config')
const request = require('./request')

const BASE_URL = config.OODI_BASE_URL

const courseInfo = async (id) => 
  await request(`${BASE_URL}/courseunitrealisations/${id}`)

const learningOpportunityInfo = async (opportunityId) => 
  await request(`${BASE_URL}/learningopportunities/${opportunityId}`)

const periodInfo = async () =>  
  await request(`${BASE_URL}/codes/courseunitrealisations/periods`)
  
const courseIdsOfOrganization = async (organization) => {
  const data = await request(`${BASE_URL}/courseunitrealisations/organisations/${organization}`)
  return data.map(course => course.course_id)
}

module.exports = {
  courseInfo,
  learningOpportunityInfo,
  courseIdsOfOrganization,
  periodInfo
}