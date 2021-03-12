import React, { useState } from 'react'
import AuthService from '../auth/auth-service'

const Settings = ({ api_token }) => {
  const [showToken, setShowToken] = useState(false)

  return (
    <div className="modal" id="settingsBox" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Settings</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body text-center">
            <p>Change your preferences here!</p>
            {
              (showToken) && (
                <p>API Token: {api_token}</p>
              )
            }
            <button
              type="button"
              className="btn btn-primary"
              onClick={e => {
                e.preventDefault()
                setShowToken(!showToken)
              }}
            >
              Show/Hide API Token
            </button>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary">Save</button>
            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
