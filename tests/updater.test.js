require('dotenv').config()

const redisClient = require('../src/util/redis')
const updater = require('../src/cache_updater')

jest.mock('../src/util/redis')
jest.mock('../src/util/oodi_api')

const idsOf = (courses) => courses.map(c => c.course_id).sort()

describe('given one valid oganisation', () => {
  let organisationCodes = ['400-K005']
  beforeAll(async () => {
    await redisClient.setAsync(process.env.ORGANIZATIONS_KEY, JSON.stringify(organisationCodes))
  })

  it('courses are cached in correct format', async () => {
    await updater.run()

    const cached = await redisClient.getAsync(process.env.COURSES_KEY)
    const cachedCourses = JSON.parse(cached)

    expect(Object.keys(cachedCourses)).toEqual(organisationCodes)

    const coursesOforganisation = cachedCourses[organisationCodes[0]]
    expect(coursesOforganisation.length).toEqual(1)

    const course = {
      "start_date": "2017-10-29T22:00:00.000Z",
      "end_date": "2017-12-12T22:00:00.000Z",
      "credit_points": 5,
      "course_id": 119953040,
      "parent_id": null,
      "learningopportunity_id": "KUKA-103",
      "languages": [
        {
          "langcode": "fi"
        }
      ],
      "realisation_name": [
        {
          "langcode": "fi",
          "text": "”Kotona, metrossa, metsässä” – Paikan koetut merkitykset"
        }
      ],
      "realisation_type_code": 17,
      "organisations": [
        "400-K005"
      ],
      "periods": [
        2
      ],
      "years": [
        2017
      ],
      "learningopportunity_type_code": 12
    }

    expect(coursesOforganisation[0]).toEqual(course)
  })
})
