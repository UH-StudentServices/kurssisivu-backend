# kurssisivu-backend

[![Build Status](https://travis-ci.org/UniversityOfHelsinkiCS/kurssisivu-backend.svg?branch=master)](https://travis-ci.org/UniversityOfHelsinkiCS/kurssisivu-backend)

## API

Backend specifies three endpoints  

### For testing

```
GET /ping
```

pongs.

### Organization codes

```
GET /organizations
```

returns the organization codes saved in Redis.

### Courses of organization(s)

```
GET /organizations/{codes}/courses_list.json?semester={semester}&year={year}
```

returs courses of the specified organizations.

_codes_ is a comma separated list of organization codes. 

Query parameters _semester_ and _year_ are optional. 

Valid values of semester are _autumn, spring_ and _summer_.

Eg. to get the spring 2018 courses of Department of Computer Science _GET_ to

```
https://opetushallinto.cs.helsinki.fi/organizations/500-K005,500-M009,500-M010/courses_list.json?semester=spring&year=2018
```

Response is a JSON-array of the type:

```
[
  {
    "start_date": "2018-03-11T22:00:00.000Z",
    "end_date": "2018-05-01T21:00:00.000Z",
    "credit_points": 5,
    "course_id": 119553005,
    "parent_id": null,
    "learningopportunity_id": "TKT21004",
    "languages": [{
        "langcode": "en"
      },
      {
        "langcode": "fi"
      }
    ],
    "realisation_name": [{
      "langcode": "fi",
      "text": "Computer Organization II"
    }],
    "realisation_type_code": 5,
    "organisations": [
      "500-K005"
    ],
    "periods": [
      4
    ],
    "years": [
      2018
    ],
    "learningopportunity_type_code": 2
  }
]
```

**NOTE** response includes now keys _periods_ and _years_. The current version of fronend has a logic for calculationg the period of the course, see [here](https://github.com/UH-StudentServices/kurssisivu/blob/master/src/utils/semesters/index.js) which should be deprecated (since it does not work properly) and the period info provided by API used instead.

## Configuration

Backend uses following environment variables (default values at left):

```
COURSES_KEY=courses
ORGANIZATIONS_KEY=codes
LEARNING_OPPORTUNITIES_KEY=opportunities
REDIS_HOST=localhost
REDIS_PORT=6379
PORT=3001
OODI_BASE_URL=
```

## Development

Fetch dependencies: `npm install`

Run backend: `npm run watch`
- To get any meaningful responses, course info should be cached in Redis by running the _updater_

Run cache updater: `npm run updater`

### Initialisation of Redis

Before running updater,  organisation keys should be saved in REdis with key _ORGANIZATIONS_KEY_ as an json of the form

```
[
  "400-K005", 
  "400-K006",
  "500-K001",
  "500-K002",
  "500-K003",
  "500-K004",
  "500-K005",
  "500-M001", 
  "500-M002", 
  "500-M008",
  "500-M009", 
  "500-M010"
]
```

Initialisation can be done by running `node init_organisations.js ./organisation_codes.json`

where _./organisation_codes.json_ is the location of keys in json form.

## Testing

Run with: `npm test`

Coverage raport: `npm run coverage` 

## Production setup

Currently Travis runs tests and on success builds a new container [toska/coursepage-backend](https://hub.docker.com/r/toska/coursepage-backend/) that is pushed to DockerHub 

### Backend

_docker-compose.yml_ for backend and Redis:

```
version: '3.5'

services:
 backend:
   environment:
     COURSES_KEY: courses
     ORGANIZATIONS_KEY: codes
     LEARNING_OPPORTUNITIES_KEY: opportunities
     REDIS_HOST: redis
     REDIS_PORT: 6379
     PORT: 3001
   image: toska/coursepage-backend
   restart: unless-stopped
   ports:
     - "3005:3001"
   container_name: coursepage-backend
   depends_on:
      - "redis"
   volumes:
     - ./data:/data
     - ./logs:/usr/src/app/logs
   command: ["npm", "start" ]

 redis:
   image: redis
   command: ["redis-server", "--appendonly", "yes"]
   restart: unless-stopped
   container_name: coursepage-redis
   volumes:
     - ./redis-data:/data
   networks:
     - redis
     - default

networks:
  redis:
    driver: bridge
    name: redis
```

Redis saves data in directory _./redis-data_, you need also directory _./data_ for initialising the organisation codes in Redis.

Logs are saved in directory _./logs/_, currently backend is not logging much.

Deploy with: 

```
#!/bin/bash
docker login -u $DOCKER_USER -p $DOCKER_PW
docker-compose pull&&docker-compose up -d
```

### Initialising organisation codes

Once backend is running, assuming that you have organisation codes as JSON-array in file _./data/organisation_codes.json_, save those to Redis with 

```
docker exec -i -t coursepage-backend node init_organisations.js /data/organisation_codes.json
```

### Cache updater

```
version: '3.5'

services:
 backend:
   environment:
     COURSES_KEY: courses
     ORGANIZATIONS_KEY: codes
     LEARNING_OPPORTUNITIES_KEY: opportunities
     REDIS_HOST: redis
     REDIS_PORT: 6379
     OODI_BASE_URL: https://esbmt1.it.helsinki.fi/doo-oodi/v1/productiondb
   image: toska/coursepage-backend
   container_name: coursepage-updater
   volumes:
     - ./data:/data
     - ./logs:/usr/src/app/logs
   networks:
     - redis
     - default
   command: ["npm", "run", "updater" ]

networks:
  redis:
    external: true
```

Run with 

```
#!/bin/bash
docker-compose stop&&docker-compose up -d
```
