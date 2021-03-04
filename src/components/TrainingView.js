import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ProgressChart from './ProgressChart'

const TrainingView = ({ currentUser }) => {

  return (
    <div className="col-10">
      <div className="row p-5">

        <div className="col-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Training Progress</h5>
              <ProgressChart currentUser={currentUser} />
            </div>
          </div>
        </div>

        <div className="col-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Game Stats</h5>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default TrainingView
