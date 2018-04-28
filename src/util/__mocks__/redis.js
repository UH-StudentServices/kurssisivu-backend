const redis = require('redis-mock')
require('bluebird').promisifyAll(redis.RedisClient.prototype)
const redisClient = redis.createClient()

module.exports = redisClient