import axios from 'axios'
import authHeader from './auth-header'

const API_URL = 'http://localhost:5000/api/'

class UserService {
  getUserAccuracyData() {
    return axios.get(API_URL + 'data/accuracy', { headers: authHeader() })
  }
}

export default new UserService()
