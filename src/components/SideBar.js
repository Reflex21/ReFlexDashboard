import React, { useState, useEffect } from 'react'
import s from 'styled-components'
import axios from 'axios'
import Upload from './Upload'
import Settings from './Settings'
import blankUserIcon from '../../blankUser.png' // Temp photo

const Wrapper = s.div`
  border-right: 1px solid #d3d3d3;
`

const LeftSideBar = s.ul`
  position: sticky;
  top:0;
  height: calc(100vh - 70px);
`

const SideBar = ({ setCurrentView, currentUser }) => {
  const importData = async data => {
    const res = await axios.post('/api/data/add', { data })
    if (res.data !== 'Data Added') {
      alert(res.data)
    }
  }

  return (
    <>
      <Upload importData={importData} />
      <Settings />
      <Wrapper className="col-2 bg-light p-0">
        <LeftSideBar className="nav nav-pills flex-column">
          <div className="nav-item border-bottom text-center pt-3">
            <img
              className="rounded-circle"
              src={blankUserIcon}
              height="100"
              width="100"
              alt=""
            />
            <h6 className="text-center">Welcome {currentUser.charAt(0).toUpperCase() + currentUser.slice(1)}!</h6>
          </div>
          <li className="nav-item border-bottom">
            <a
              className="nav-link text-center"
              href="#/"
              onClick={e => {
                e.preventDefault()
                setCurrentView(0)
              }}
            >
              Insights
            </a>
          </li>
          <li className="nav-item border-bottom">
            <a
              className="nav-link text-center"
              href="#/"
              onClick={e => {
                e.preventDefault()
                setCurrentView(1)
              }}
            >
              Training
            </a>
          </li>
          <li className="nav-item border-bottom">
            <a className="nav-link text-center" href="#/" data-toggle="modal" data-target="#settingsBox"> Settings </a>
          </li>
          <li className="nav-item border-bottom">
            <a className="nav-link text-center" href="#/" data-toggle="modal" data-target="#uploadBox">Upload Data</a>
          </li>
        </LeftSideBar>
      </Wrapper>
    </>
  )
}

export default SideBar
