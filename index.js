const express = require('express')
const cors = require('cors')
const _ = require('lodash')
const redis = require('redis')

require('dotenv').config()

require('bluebird').promisifyAll(redis.RedisClient.prototype)

const app = express()

const redisClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST)

app.use(cors())

const periodsOfSemester = (semester) => {
  if (semester === 'autumn') {
    return [1, 2]
  } else if (semester==='spring') {
    return [3, 4]
  } else if (semester === 'summer') {
    return [5]
  } 
  
  return [1,2,3,4,5]
}

const byQuery = (params) => (course) => {
  const semester = params.semester
  const year = params.year

  if (semester && _.intersection(periodsOfSemester(semester), course.periods).length===0 ) {
    return false
  }

  if ( year && !course.years.includes(Number(year)) ) {
    return false
  }

  return true
}

// TODO: poista muut kuin kurssit, virheellisen organisaatiokoodin käsittely

app.get('/courses/:codes', async (req, res) => {
  const coursesOfOrganization = JSON.parse(await redisClient.getAsync(process.env.COURSES_KEY))
  const organizationCodes = req.params.codes.split(',')

  const courses = organizationCodes
    .reduce((courseSet, code) => courseSet.concat(...coursesOfOrganization[code]), [])
    .filter(byQuery(req.query))

  res.json(_.uniqBy(courses, (c) => c.course_id))
})

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})