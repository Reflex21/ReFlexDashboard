import React, { useState, useEffect } from 'react'
import GenericGraph from './GenericGraph'

const InsightView = () => {

  return (
    <div className="col-10">
      <div className="row p-5">
        <div className="col-6">
          <GenericGraph
            type="accuracy"
            title="Accuracy"
            xLabel="Trial"
            yLabel="Accuracy (%)"
          />
        </div>

        <div className="col-6">
          <GenericGraph
            type="reaction"
            title="Reaction Time"
            xLabel="Trial"
            yLabel="Reaction Time (ms)"
          />
        </div>

      </div>
    </div>
  )
}

export default InsightView
