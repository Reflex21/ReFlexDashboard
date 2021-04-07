import React, { useEffect, useState, useRef } from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'

const GameStatsGraph = ({ user }) => {
  const data = [
    {
      stat: 'Accuracy',
      value: 65,
    },
    {
      stat: 'Reaction',
      value: 80,
    },
    {
      stat: 'Precison',
      value: 40,
    },
  ]

  return (
    <>
      <div className="row">
        <div className="col">
          <h5 className="card-title">Training Progress</h5>
        </div>
      </div>
      <div className="row py-2">
        <div className="col">
          <div className="btn-group text-center">
            <button
              type="button"
              className="btn btn-secondary"
            >
              MOBA
            </button>
            <button
              type="button"
              className="btn btn-secondary"
            >
              FPS
            </button>
            <button
              type="button"
              className="btn btn-secondary"
            >
              3D Sports
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default GameStatsGraph
