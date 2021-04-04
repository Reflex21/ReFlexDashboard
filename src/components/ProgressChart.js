import React, { useEffect, useState, useRef } from 'react'
import { PieChart, Pie, Label, Tooltip } from 'recharts'

const ProgressChart = ({ user }) => {
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
          <h5 className="card-title">Training Progress</h5>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <h6 className="text-center">FPS</h6>
          <PieChart width={200} height={200}>
            <Pie data={dataFPS} dataKey="value" outerRadius={80} innerRadius={60} fill="#8884d8">
              <Label
                value={`${dataFPS[0].value}%`}
                position="center"
                fill="grey"
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  fontFamily: 'Roboto',
                }}
              />
            </Pie>
          </PieChart>
        </div>
        <div className="col">
          <h6 className="text-center">MOBA</h6>
          <PieChart width={200} height={200}>
            <Pie data={dataMOBA} dataKey="value" outerRadius={80} innerRadius={60} fill="#8884d8">
              <Label
                value={`${dataMOBA[0].value}%`}
                position="center"
                fill="grey"
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  fontFamily: 'Roboto',
                }}
              />
            </Pie>
          </PieChart>
        </div>
        <div className="col">
          <h6 className="text-center">3D Sports</h6>
          <PieChart width={200} height={200}>
            <Pie data={data3D} dataKey="value" outerRadius={80} innerRadius={60} fill="#8884d8">
              <Label
                value={`${data3D[0].value}%`}
                position="center"
                fill="grey"
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  fontFamily: 'Roboto',
                }}
              />
            </Pie>
          </PieChart>
        </div>
      </div>
    </>
  )
}

export default ProgressChart
