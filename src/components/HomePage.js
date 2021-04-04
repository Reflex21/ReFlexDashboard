import React, { useState, useEffect } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import Header from './Header'
import SideBar from './SideBar'
import HomeView from './HomeView'
import InsightView from './InsightView'
import TrainingView from './TrainingView'
import AuthService from '../auth/auth-service'

const HomePage = ({ themeToggler }) => {
  const [currentView, setCurrentView] = useState(0)
  const [isLogged, setIsLogged] = useState(AuthService.isLogged())

  useEffect(() => {
    const intervalID = setInterval(() => {
      setIsLogged(AuthService.isLogged())
    }, 1000)

    return () => clearInterval(intervalID)
  }, [])

  return (
    <>
      {(isLogged) && (
      <>
        <Header />
        <div className="container-fluid w-100 h-100">
          <div className="row">
            <SideBar
              setCurrentView={setCurrentView}
              themeToggler={themeToggler}
            />
            {
              (currentView === 0) && (<HomeView />)
            }
            {
              (currentView === 1) && (<InsightView />)
            }
            {
              (currentView === 2) && (<TrainingView />)
            }
          </div>
        </div>
      </>
      )}
      {(!isLogged) && (
        <Redirect to="/login" />
      )}
    </>
  )
}

export default HomePage
