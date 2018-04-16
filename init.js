const redis = require('redis')
require('bluebird').promisifyAll(redis.RedisClient.prototype)
require('dotenv').config()

const redisClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST)

async function run() {
  const codes = [ 
    '400-K005', 
    '400-K006',
    '500-K001',
    '500-K002',
    '500-K003',
    '500-K004',
    '500-K005', 
    '500-M001', 
    '500-M002', 
    '500-M008',
    '500-M009', 
    '500-M010', 
  ]

  await redisClient.setAsync(process.env.ORGANIZATIONS_KEY, JSON.stringify(codes))
  redisClient.quit()
}

run()