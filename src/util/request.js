const axios = require('axios')
const config = require('../config')

const BASE_URL = config.OODI_BASE_URL

module.exports = async (url) => {
  try {
    const response = await axios.get(url)
    return response.data.data
  } catch (e) {
    throw `${e.code} ${e.config.url}`
  }
}
