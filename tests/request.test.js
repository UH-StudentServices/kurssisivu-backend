const axios = require('axios')
const MockAdapter = require('axios-mock-adapter')
const request = require('../src/util/request')

describe('request to OodiApi', () => {
  it('if HTTP GET succeeds, field data of response body is returned', async () => {
    const mock = new MockAdapter(axios)

    mock.onGet('/courseunitrealisations/periods').reply(200, {
      "md5": "2dbeda235e3f6cd89ecb69647c4be296",
      "status": 200,
      "elapsed": 0.528599927,
      "data": [
        {
          "id": 55604246,
          "start_date": "2005-09-04T21:00:00.000Z",
          "end_date": "2005-10-22T21:00:00.000Z",
          "abbreviation": [
            {
              "langcode": "fi",
              "text": "1"
            },
            {
              "langcode": "sv",
              "text": "1"
            },
            {
              "langcode": "en",
              "text": "1"
            }
          ],
          "name": [
            {
              "langcode": "fi",
              "text": "2005-2006, 1. periodi"
            },
            {
              "langcode": "sv",
              "text": "2005-2006, 1. perioden"
            },
            {
              "langcode": "en",
              "text": "2005-2006, 1. period"
            }
          ]
        }
      ]
    })

    const response = await request('/courseunitrealisations/periods')
    expect(response.length).toEqual(1)
    expect(Object.keys(response[0])).toEqual(['id', 'start_date', 'end_date', 'abbreviation', 'name'])
  })

  it('if HTTP GET fails, exception is thrown', async () => {
    const mock = new MockAdapter(axios)

    mock.onGet('/courseunitrealisations/periods').reply(503, {})

    let exception = false
    try {
      await request('/courseunitrealisations/periods') 
    } catch(e) {
      exception = true
    }
   
    expect(exception).toBeTruthy()

  
  })
})

