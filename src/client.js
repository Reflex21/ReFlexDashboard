const axios = require('axios')

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
  /* other custom settings */
})

module.exports = axiosInstance
