const redisClient = require('./util/redis')
require('dotenv').config()

async function run() {
  const codes = [ 
    '400-K005', 
    '400-K006',
    '500-K001',
    '500-K002',
    '500-K003',
    '500-K004',
    '500-K005', 
    '500-M001', 
    '500-M002', 
    '500-M008',
    '500-M009', 
    '500-M010', 
  ]

  await redisClient.setAsync(process.env.ORGANIZATIONS_KEY, JSON.stringify(codes))
  redisClient.quit()
}

//run()

async function run2() {

  const courses = await redisClient.getAsync(process.env.COURSES_KEY)
  console.log(JSON.stringify(JSON.parse(courses), null, 2))
  redisClient.quit()
}

run2()