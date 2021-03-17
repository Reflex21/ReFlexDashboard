import React, { useState, useRef } from 'react'
import { Link, useHistory } from 'react-router-dom'
import AuthService from '../auth/auth-service'

const SignUp = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [signupMsg, setSignupMsg] = useState('')
  const history = useHistory()
  const signupButton = useRef()

  const hasWhiteSpace = s => s.indexOf(' ') >= 0

  const isValid = s => s.trim() !== '' && !hasWhiteSpace(s)

  const signup = async () => {
    if (isValid(username) && isValid(password)) {
      signupButton.current.setAttribute('disabled', 'disabled')
      const res = await AuthService.signup(username, password)
      if (res.access_token) {
        signupButton.current.removeAttribute('disabled')
        history.push('/')
      } else {
        signupButton.current.removeAttribute('disabled')
        alert(res.message)
      }
    } else {
      alert('Invalid Username/Password.')
    }
  }

  const checkPassword = pass => {
    if (pass !== password) {
      setSignupMsg('Passwords do not match.')
      signupButton.current.setAttribute('disabled', 'disabled')
    } else {
      setSignupMsg('Passwords match!')
      signupButton.current.removeAttribute('disabled')
    }
  }

  return (
    <div className="card shadow mx-auto mt-5" style={{ width: '30rem' }}>
      <div className="container mx-1">
        <div className="card-body p-xs">
          <h2 className="card-title text-center font-weight-bold">Sign Up</h2>
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
          <div className="form-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              className="form-control"
              onChange={e => checkPassword(e.target.value)}
            />
          </div>
          <p> {signupMsg} </p>
          <div className="form-group">
            <button
              ref={signupButton}
              type="button"
              className="btn btn-primary w-100"
              onClick={() => signup(username, password, history)}
            >
              Sign Up
            </button>
          </div>
          <p>
            Already have an account?&nbsp;
            <Link to="/login">Log in here!</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp
