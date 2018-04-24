const http = require('http')
const app = require('./src/app')

const config = require('./src/config')

const server = http.createServer(app)

server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})

process.on('unhandledRejection', (reason, p) => {
  console.log(reason)
})