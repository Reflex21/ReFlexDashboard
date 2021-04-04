import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { login } from './auth'

import GlobalStyle from './components/GlobalStyle'
import { lightTheme, darkTheme } from './components/Themes'

import HomePage from './components/HomePage'
import Login from './components/Login'
import SignUp from './components/SignUp'

const App = () => {
  const [theme, setTheme] = useState('light')
  const themeToggler = () => {
    theme === 'light' ? setTheme('dark') : setTheme('light')
  }

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <>
        <GlobalStyle />
        <Router>
          <Switch>
            <Route path="/signup">
              <SignUp />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/">
              <HomePage themeToggler={themeToggler} />
            </Route>
          </Switch>
        </Router>
      </>
    </ThemeProvider>
  )
}

export default App
