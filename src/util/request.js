const axios = require('axios')

const agent = KEY_PATH && CERT_PATH ?
  new https.Agent({
    cert: fs.readFileSync(process.env.CERT_PATH, 'utf8'),
    key: fs.readFileSync(process.env.KEY_PATH, 'utf8'),
  }) :
  new https.Agent({
    rejectUnauthorized: false
  })

const instance = axios.create({
  httpsAgent: agent
})

module.exports = async (url) => {
  try {
    const response = await instance.get(url)
    console.log(response.data.data)
    return response.data.data
  } catch (e) {
    throw `${e.code} ${e.config.url}`
  }
}
