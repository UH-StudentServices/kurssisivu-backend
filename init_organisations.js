async function run(codes) {
  const redisClient = require('./src/util/redis')
  const config = require('./src/config')
  await redisClient.setAsync(config.ORGANIZATIONS_KEY, JSON.stringify(codes))
  redisClient.quit()
}

if (process.argv.length>2) {
  const codes = require(process.argv[2])
  run(codes)
} 