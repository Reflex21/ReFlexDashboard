import axios from 'axios'
import authHeader from './auth-header'

const API_URL = 'http://3.232.32.88:5000/api/'

class UserService {
  /*
  getUserAccuracyData() {
    return axios.get(API_URL + 'data/accuracy', { headers: authHeader() })
  }

  getUserReactionData() {
    return axios.get(API_URL + 'data/reaction', { headers: authHeader() })
  } */

  getUserAllData(type) {
    return axios.get(`${API_URL}data/${type}`, { headers: authHeader() })
  }

  // TODO: Implement getting data from a specific game only
  getUserSpecificData(type) {
    return axios.get(`${API_URL}data/${type}`, { headers: authHeader() })
  }

  importUserData(data) {
    alert('Function not implemented')
    // const res = await axios.post(API_URL + 'data/add', { headers: authHeader() })
  }
}

export default new UserService()
