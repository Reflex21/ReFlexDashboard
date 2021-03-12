const axios = require('axios')

const axiosInstance = axios.create({
  baseURL: 'http://3.232.32.88:5000',
  /* other custom settings */
})

module.exports = axiosInstance
