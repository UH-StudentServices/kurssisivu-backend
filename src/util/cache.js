const redisClient = require('./redis')

require('dotenv').config()

const validOrganizationCodes = async () => 
  JSON.parse(await redisClient.getAsync(process.env.ORGANIZATIONS_KEY))

const learningOpportunityTypecodes = async () => 
  JSON.parse(await redisClient.getAsync(process.env.LEARNING_OPPORTUNITIES_KEY)) || {}

const saveCoursesOfOrganization = async (coursesOfOrganization) =>
  await redisClient.setAsync(process.env.COURSES_KEY, JSON.stringify(coursesOfOrganization))

const saveLearningOpportunityTypecodes = async (learningOpportunityTypecodes) =>  
  await redisClient.setAsync(process.env.LEARNING_OPPORTUNITIES_KEY, JSON.stringify(learningOpportunityTypecodes))

const coursesOfOrganization = async () => JSON.parse(await redisClient.getAsync(process.env.COURSES_KEY))
  
const exit = () => redisClient.quit()

module.exports = {
  validOrganizationCodes,
  learningOpportunityTypecodes,
  saveCoursesOfOrganization,
  saveLearningOpportunityTypecodes,
  coursesOfOrganization,
  exit
}
