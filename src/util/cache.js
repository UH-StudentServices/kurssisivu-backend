const redisClient = require('./redis')
const config = require('../config')

const validOrganizationCodes = async () => {
  const codeJson = await redisClient.getAsync(config.ORGANIZATIONS_KEY)
  return codeJson===null ? [] : JSON.parse(codeJson)
}
  
const learningOpportunityTypecodes = async () => 
  JSON.parse(await redisClient.getAsync(config.LEARNING_OPPORTUNITIES_KEY)) || {}

const saveCoursesOfOrganization = async (coursesOfOrganization) =>
  await redisClient.setAsync(config.COURSES_KEY, JSON.stringify(coursesOfOrganization))

const saveLearningOpportunityTypecodes = async (learningOpportunityTypecodes) =>  
  await redisClient.setAsync(config.LEARNING_OPPORTUNITIES_KEY, JSON.stringify(learningOpportunityTypecodes))

const coursesOfOrganization = async () => JSON.parse(await redisClient.getAsync(config.COURSES_KEY))
  
const exit = () => redisClient.quit()

module.exports = {
  validOrganizationCodes,
  learningOpportunityTypecodes,
  saveCoursesOfOrganization,
  saveLearningOpportunityTypecodes,
  coursesOfOrganization,
  exit
}
