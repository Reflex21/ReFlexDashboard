import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { PieChart, Pie, RadialBarChart, RadialBar, Tooltip } from 'recharts'

const ProgressChart = ({ currentUser }) => {
  const dataFPS = [
    {
      value: 70,
      fill: '#8884d8',
    },
    {
      value: 30,
      fill: '#F8F8F8',
    },
  ]
  const dataMOBA = [
    {
      value: 20,
      fill: '#58D68D',
    },
    {
      value: 80,
      fill: '#F8F8F8',
    },
  ]
  const data3D = [
    {
      value: 40,
      fill: '#F8C471',
    },
    {
      value: 60,
      fill: '#F8F8F8',
    },
  ]
  return (
    <>
      <div className="row">
        <div className="col">
          <h6 className="text-center">FPS</h6>
          <PieChart width={200} height={200}>
            <Pie data={dataFPS} dataKey="value" outerRadius={80} innerRadius={50} fill="#8884d8" />
          </PieChart>
        </div>
        <div className="col">
          <h6 className="text-center">MOBA</h6>
          <PieChart width={200} height={200}>
            <Pie data={dataMOBA} dataKey="value" outerRadius={80} innerRadius={50} fill="#8884d8" />
          </PieChart>
        </div>
        <div className="col">
          <h6 className="text-center">3D Sports</h6>
          <PieChart width={200} height={200}>
            <Pie data={data3D} dataKey="value" outerRadius={80} innerRadius={50} fill="#8884d8" />
          </PieChart>
        </div>
      </div>
    </>
  )
}

export default ProgressChart
