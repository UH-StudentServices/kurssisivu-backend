const redisClient = require('../src/util/redis')
const updater = require('../src/cache_updater')
const config = require('../src/config')

jest.mock('../src/util/redis')
jest.mock('../src/util/oodi_api')

const idsOf = (courses) => courses.map(c => c.course_id).sort()

describe('given one valid oganisation', () => {
  let organisationCodes = ['500-K005']
  beforeAll(async () => {
    await redisClient.setAsync(config.ORGANIZATIONS_KEY, JSON.stringify(organisationCodes))
  })

  it('courses are cached in correct format', async () => {
    await updater.run()

    const cached = await redisClient.getAsync(config.COURSES_KEY)
    const cachedCourses = JSON.parse(cached)

    expect(Object.keys(cachedCourses)).toEqual(organisationCodes)

    const coursesOforganisation = cachedCourses[organisationCodes[0]]
    expect(coursesOforganisation.length).toEqual(1)

    const course = {
      start_date: "2017-10-31T22:00:00.000Z",
      end_date: "2017-12-14T22:00:00.000Z",
      credit_points: 5,
      course_id: 119284687,
      parent_id: null,
      learningopportunity_id: "TKT21002",
      languages: [
        {
          langcode: "en"
        }
      ],
      realisation_name: [
        {
          langcode: "fi",
          text: "Introduction to Game Programming"
        }
      ],
      realisation_type_code: 5,
      organisations: [
        "500-K005"
      ],
      periods: [
        2
      ],
      years: [
        2017
      ],
      learningopportunity_type_code: 2
    }

    expect(coursesOforganisation[0]).toEqual(course)
  })
})
