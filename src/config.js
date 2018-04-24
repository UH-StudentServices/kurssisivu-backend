require('dotenv').config()

module.exports = {
  COURSES_KEY: process.env.COURSES_KEY || 'courses',
  ORGANIZATIONS_KEY: process.env.ORGANIZATIONS_KEY  || 'codes', 
  LEARNING_OPPORTUNITIES_KEY: process.env.LEARNING_OPPORTUNITIES_KEY || 'opportunities',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  PORT: process.env.PORT || 3001,
  OODI_BASE_URL: process.env.OODI_BASE_URL
}  
