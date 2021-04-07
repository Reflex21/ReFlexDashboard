import React, { useState, useEffect } from 'react'
import GenericGraph from './GenericGraph'
import MovingAvgGraph from './MovingAvgGraph'

const InsightView = () => {

  return (
    <div className="col-10">
      <div className="row p-5">
        <div className="col-6">
          <MovingAvgGraph
            type="reaction"
            game="all"
            windowSize={20}
            title="Moving Average - Reaction Time"
            xLabel="Trial"
            yLabel="Reaction Time (ms)"
          />
        </div>
      </div>
    </div>
  )
}

export default InsightView
