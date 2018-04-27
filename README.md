# kurssisivu-backend

[![Build Status](https://travis-ci.org/UniversityOfHelsinkiCS/kurssisivu-backend.svg?branch=master)](https://travis-ci.org/UniversityOfHelsinkiCS/kurssisivu-backend)

## Configuration

Backend uses following environment variables (defaults):

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

Run batch processor: `npm run updater`

### Initialization of Redis

Before running batch processor,  organisation keys should be saved in REdis with key _ORGANIZATIONS_KEY_ as an json of the form

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

```
```

```
```
