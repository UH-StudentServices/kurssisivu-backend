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

app.use((req, res, next)=>{
  console.log(req.path)
  next()
})

app.get('/ping', (req, res) => {
  res.json({ message:'pong' })
})

app.get('/organizations/:codes/courses_list.json', async (req, res) => {
  try {
    const coursesOfOrganization = JSON.parse(await redisClient.getAsync(process.env.COURSES_KEY))
    const organizationCodes = req.params.codes.split(',')

    const invalidCodes = _.difference(organizationCodes, Object.keys(coursesOfOrganization))
    if (invalidCodes.length>0) {
      return res.status(400).json({ error: `invalid organization codes ${_.join(invalidCodes, ', ')}` })
    }

    const courses = organizationCodes
      .reduce((courseSet, code) => courseSet.concat(...coursesOfOrganization[code]), [])
      .filter(byQuery(req.query))

    res.json(_.uniqBy(courses, (c) => c.course_id))
  } catch (e) {
    res.status(500).json({ error: 'something went wrong' })
  }

})

const server = app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})

//http://localhost:3001/courses/500-k005

process
  // Handle normal exits
  .on('exit', (code) => {
    nodemon.emit('quit');
    process.exit(code);
  })

  // Handle CTRL+C
  .on('SIGINT', () => {
    nodemon.emit('quit');
    process.exit(0);
  });