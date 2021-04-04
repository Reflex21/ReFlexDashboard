import React, { useState } from 'react'
import AuthService from '../auth/auth-service'

const Settings = ({ api_key }) => {
  const [showToken, setShowToken] = useState(false)
  const [displayName, setDisplayName] = useState('')

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
                <p style={{ wordBreak: 'break-all' }}>
                  <b>API Token:</b>
                  {api_key}
                </p>
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

            <div className="form-row p-3">
              <label>Display Name:</label>
              <input
                id="new-username-form"
                className="form-control"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
              />
            </div>

            <div className="form-row p-3">
              <label>Home Screen Graph 1:</label>
              <select
                className="form-control"
                id="graph-1"
                defaultValue="null"
              >
                <option value={0}>None</option>
                <option value={1}>Reaction Times</option>
                <option value={2}>Accuracy</option>
              </select>
            </div>

            <div className="form-row p-3">
              <label>Home Screen Graph 2:</label>
              <select
                className="form-control"
                id="graph-2"
                defaultValue="null"
              >
                <option value={0}>None</option>
                <option value={1}>Reaction Times</option>
                <option value={2}>Accuracy</option>
              </select>
            </div>

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
