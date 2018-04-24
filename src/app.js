const express = require('express')
const cors = require('cors')
const _ = require('lodash')
const redisClient = require('./util/redis')
const cache = require('./util/cache')
const util = require('./util')

const app = express()

app.use(cors())

const byQuery = (params) => (course) => {
  const semester = params.semester
  const year = params.year

  if (semester && _.intersection(util.periodsOfSemester(semester), course.periods).length === 0) {
    return false
  }

  if (year && !course.years.includes(Number(year))) {
    return false
  }

  return true
}

app.get('/ping', (req, res) => {
  res.json({ message: 'pong' })
})

app.get('/organizations/:codes/courses_list.json', async (req, res) => {
  try {
    const coursesOfOrganization = await cache.coursesOfOrganization()
    const organizationCodes = req.params.codes.split(',')

    const invalidCodes = _.difference(organizationCodes, Object.keys(coursesOfOrganization))
    if (invalidCodes.length > 0) {
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

module.exports = app