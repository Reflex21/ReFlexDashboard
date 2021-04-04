import React, { useEffect, useState, useRef } from 'react'

const StatDisplay = () => {

  return (
    <>
      <div className="row">
        <div className="col">
          <h5 className="card-title">Game Stats</h5>
        </div>
      </div>

      <div className="row">
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

export default StatDisplay
