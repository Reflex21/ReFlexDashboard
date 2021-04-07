import React, { useState, useEffect } from 'react'
import ProgressChart from './ProgressChart'
import GameStatsGraph from './GameStatsGraph'

const TrainingView = ({ user }) => {

  return (
    <div className="col-10">
      <div className="row p-5">

        <div className="col-6">
          <div className="card">
            <div className="card-body">
              <ProgressChart user={user} />
            </div>
          </div>
        </div>

        <div className="col-6">
          <div className="card">
            <div className="card-body">
              <GameStatsGraph />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default TrainingView
