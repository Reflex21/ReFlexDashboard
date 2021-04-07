import React, { useState, useEffect } from 'react'
import GenericGraph from './GenericGraph'
import DetailedGraph from './DetailedGraph'

const HomeView = () => {

  return (
    <div className="col-10">
      <div className="row p-5">
        <div className="col-6">
          <DetailedGraph
            type="reaction"
            title="Reaction Times"
            xLabel="Trial"
            yLabel="Reaction Time (ms)"
          />
        </div>

        <div className="col-6">
          <DetailedGraph
            type="accuracy"
            title="Accuracy"
            xLabel="Trial"
            yLabel="Accuracy (%)"
          />
        </div>
      </div>
    </div>
  )
}

export default HomeView
