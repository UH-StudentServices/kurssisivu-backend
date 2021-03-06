const winston = require('winston')

module.exports = new winston.Logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/coursepage-backend.log' })
  ]
})