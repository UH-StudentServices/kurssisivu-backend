const supertest = require('supertest')
const app = require('../src/app')
jest.mock('../src/util/redis')
const config = require('../src/config')
const redisClient = require('../src/util/redis')
const api = supertest(app)


const idsOf = (courses) => courses.map(c => c.course_id).sort()

describe('API', () => {
  it('should pong when pinged', async () => {
    const response = await api
      .get('/ping')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toEqual({ message: 'pong' })
  })

  describe('given there are courses cached in Redis', () => {
    beforeAll(async () => {
      const data = require('./courses_in_redis.json')
      await redisClient.setAsync(config.COURSES_KEY, JSON.stringify(data))
    })

    it('valid organisation codes can be queried', async () => {
      const response = await api
        .get('/organizations')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body).toEqual(['500-K001', '500-K002', '500-K005', '500-M010'])
    })

    describe('when courses of one organisation are requested', () => {
      it('returns all at specified year for autumn term', async () => {
        const response = await api
          .get('/organizations/500-K005/courses_list.json?semester=autumn&year=2017')
          .expect(200)
          .expect('Content-Type', /application\/json/)

        const courses = response.body

        expect(courses.length).toEqual(3)
        expect(idsOf(courses)).toEqual([119284687, 119284698, 119284736])
      })

      it('returns all at specified year for spring term', async () => {
        const response = await api
          .get('/organizations/500-K005/courses_list.json?semester=spring&year=2018')
          .expect(200)
          .expect('Content-Type', /application\/json/)

        const courses = response.body

        expect(courses.length).toEqual(2)
        expect(idsOf(courses)).toEqual([119553005, 119553016])
      })

      it('returns all at specified year for summer term', async () => {
        const response = await api
          .get('/organizations/500-K005/courses_list.json?semester=summer&year=2018')
          .expect(200)
          .expect('Content-Type', /application\/json/)

        const courses = response.body

        expect(courses.length).toEqual(1)
        expect(idsOf(courses)).toEqual([124236673])
      })

      it('returns empty set if no courses at specified year/term', async () => {
        const response = await api
          .get('/organizations/500-K005/courses_list.json?semester=spring&year=2017')
          .expect(200)
          .expect('Content-Type', /application\/json/)

        expect(response.body.length).toEqual(0)
      })
    })

    describe('when courses of two organisations are requested', () => {
      it('returns all courses of two requested organisations at specified year/term', async () => {
        const response = await api
          .get('/organizations/500-K005,500-M010/courses_list.json?semester=spring&year=2018')
          .expect(200)
          .expect('Content-Type', /application\/json/)

        const courses = response.body

        expect(courses.length).toEqual(3)
        expect(idsOf(courses)).toEqual([119553005, 119553016, 122767445])
      })

      it('does not return duplicates if same course provided by both organisation', async () => {
        const response = await api
          .get('/organizations/500-K005,500-K001/courses_list.json?semester=spring&year=2018')
          .expect(200)
          .expect('Content-Type', /application\/json/)

        const courses = response.body

        expect(courses.length).toEqual(2)
        expect(idsOf(courses)).toEqual([119553005, 119553016])
      })

    })

    describe('when courses of invalid organisation are requested', () => {
      it('responds with a proper error code', async () => {
        await api
          .get('/organizations/500-K000/courses_list.json?semester=autumn&year=2017')
          .expect(400)
          .expect('Content-Type', /application\/json/)
      })
    })

  })
})