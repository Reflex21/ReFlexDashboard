import React, { useState, useEffect } from 'react'
import axios from 'axios'
import AccuracyGraph from './AccuracyGraph'
import ReactionTimeGraph from './ReactionTimeGraph'

const InsightView = () => {

  return (
    <div className="col-10">
      <div className="row p-5">
        <div className="col-6">
          <AccuracyGraph />
        </div>

        <div className="col-6">
          <ReactionTimeGraph />
        </div>

      </div>
    </div>
  )
}

export default InsightView
