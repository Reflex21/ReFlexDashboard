import React, { useState } from 'react'

import { Link, useHistory } from 'react-router-dom'
import AuthService from '../auth/auth-service'

const Login = ({ setUser, setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const history = useHistory()

  const loginUser = async () => {
    const res = await AuthService.login(username, password)
    console.log(res)
    if (res.access_token) {
      history.push('/')
    } else {
      alert(res.message)
    }
  }

  return (
    <div className="card shadow mx-auto mt-5" style={{ width: '30rem' }}>
      <div className="container mx-1">
        <div className="card-body p-xs">
          <h2 className="card-title text-center font-weight-bold">Log In</h2>
          <div className="form-group">
            <label>Username:</label>
            <input
              id="new-username-form"
              className="form-control"
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              className="form-control"
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group text-center">
            <button
              type="button"
              className="btn btn-primary w-100"
              onClick={() => loginUser(username, password)}
            >
              Log In
            </button>
          </div>
          <p>
            Don&apos;t have an account?&nbsp;
            <Link to="/signup">Sign Up!</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
