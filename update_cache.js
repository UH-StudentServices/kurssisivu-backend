(async function () {
  await require('./src/cache_updater').run()
})()

process.on('unhandledRejection', (reason, p) => {
 const logger = require('./src/util/logger')
  logger.error(reason)
  logger.error('exiting script')
  process.exit()
})