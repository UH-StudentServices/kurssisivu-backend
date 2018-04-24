(async function () {
  await require('./src/cache_updater').run()
})()

process.on('unhandledRejection', (reason, p) => {
  console.log(reason)
})