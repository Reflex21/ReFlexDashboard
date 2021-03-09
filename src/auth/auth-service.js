import axios from 'axios'
import { useEffect, useState } from 'react'

const API_URL = 'http://localhost:5000/api/'

class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + 'login', {
        username,
        password
      })
      .then(res => {
        if (res.data.access_token) {
          const data = { username, access_token: res.data.access_token }
          localStorage.setItem('user', JSON.stringify(data))
        }
        return res.data
      })
  }

  logout() {
    localStorage.removeItem('user')
  }

  signup(username, password) {
    return axios.post(API_URL + 'signup', {
      username,
      password
    }).then(res => {
      if (res.data.access_token) {
        const data = { username, access_token: res.data.access_token }
        localStorage.setItem('user', JSON.stringify(data))
      }
      return res.data
    })
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'))
  }

  isLogged() {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      return true
    }
    return false
  }
}

export default new AuthService()
