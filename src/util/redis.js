require('dotenv').config()
const redis = require('redis')
require('bluebird').promisifyAll(redis.RedisClient.prototype)

const redisClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST)

module.exports = redisClient