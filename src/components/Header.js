import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import s from 'styled-components'
import axios from 'axios'

const NavItems = s.ul`
  display: inline-block;
`

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const history = useHistory()

  const logout = async () => {
    await axios.post('/account/logout')
    history.push('/login')
  }

  return (
    <nav className="navbar navbar-dark bg-dark">
      <a className="navbar-brand text-white" href="#/"> Re-Flex</a>
      <input type="text" className="form-control w-75" placeholder="Search..." />
      {
        (isLoggedIn) && (
          <>
            <ul className="navbar-nav px-3">
              <li className="nav-item text-nowrap">
                <a className="nav-link" href="#/" onClick={() => logout()}>Logout</a>
              </li>
            </ul>
          </>
        )
      }
    </nav>
  )
}

export default Header
