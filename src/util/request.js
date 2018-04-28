const axios = require('axios')

module.exports = async (url) => {
  try {
    const response = await axios.get(url)
    return response.data.data
  } catch (e) {
    throw `${e.code} ${e.config.url}`
  }
}
