import React, { useState, useEffect } from 'react'
import s from 'styled-components'
import AuthService from '../auth/auth-service'

const NavItems = s.ul`
  display: inline-block;
`

const Header = () => {

  return (
    <nav className="navbar navbar-dark bg-dark">
      <a className="navbar-brand text-white" href="#/"> Re-Flex</a>
      <ul className="navbar-nav px-3">
        <li className="nav-item text-nowrap">
          <a className="nav-link" href="#/" onClick={() => AuthService.logout()}>Logout</a>
        </li>
      </ul>
    </nav>
  )
}

export default Header
