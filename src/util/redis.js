const redis = require('redis')
require('bluebird').promisifyAll(redis.RedisClient.prototype)
const config = require('../config')

const redisClient = redis.createClient(config.REDIS_PORT, config.REDIS_HOST)

module.exports = redisClient