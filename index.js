const http = require('http')
const app = require('./src/app')
const logger = require('./src/util/logger')

const config = require('./src/config')

const server = http.createServer(app)

server.listen(config.PORT, () => {
  logger.info(`Server started on port ${config.PORT}`)
})

process.on('unhandledRejection', (reason) => {
  logger.error(reason)
})