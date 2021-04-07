import React, { useEffect, useState, useRef } from 'react'
import { LineChart, Line, Tooltip, YAxis, XAxis, Label } from 'recharts'
import UserService from '../auth/user-service'

const MovingAvgGraph = ({ user, type, game, title, xLabel, yLabel }) => {
  const [graphData, setGraphData] = useState([])
  const [windowSize, setWindowSize] = useState(0)
  const [currentGame, setCurrentGame] = useState(game)

  const getData = async winSize => {
    const res = UserService.getUserData(type, currentGame, winSize)
    return res
  }

  const reformatData = data => {
    const formattedData = []
    let i = 0
    data.forEach((item, index) => {
      formattedData.push({
        trial: i,
        value: item.value,
      })
      i += 1
    })
    return formattedData
  }

  const refreshData = winSize => {
    getData(winSize).then(res => {
      console.log(res.data)
      // Check if there's any data
      if (res.data.length > 0) {
        const data = reformatData(res.data)
        setGraphData(data)
      } else {
        setGraphData([])
      }
    })
  }

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{ title }</h5>
        <h6 className="card-title">Window Size: {windowSize}</h6>
        <LineChart
          width={600}
          height={300}
          data={graphData}
          margin={{
            top: 10, right: 10, bottom: 20, left: 10,
          }}
        >
          <XAxis type="number" dataKey="trial" name={xLabel} allowDecimals={false} domain={['dataMin', 'dataMax']}>
            <Label value={xLabel} position="bottom" />
          </XAxis>
          <YAxis type="number" dataKey="value" name={yLabel} domain={[0, dataMax => Math.ceil(dataMax / 1000) * 1000]}>
            <Label value={yLabel} angle={-90} position="left" />
          </YAxis>
          <Line name={title} dataKey="value" stroke="#66a8ff" strokeWidth={1} dot={false} />
        </LineChart>
      </div>
      <div className="btn-group text-center">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            refreshData(5)
            setWindowSize(5)
          }}
        >
          5
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            refreshData(10)
            setWindowSize(10)
          }}
        >
          10
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            refreshData(50)
            setWindowSize(50)
          }}
        >
          50
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            refreshData(100)
            setWindowSize(100)
          }}
        >
          100
        </button>
        <div className="btn-group">
          <button className="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">
            Filter by Game
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li>
              <a
                className="dropdown-item"
                href="#/"
                onClick={() => {
                  setCurrentGame('all')
                  refreshData()
                }}
              >
                All
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#/"
                onClick={() => {
                  setCurrentGame('moba')
                  refreshData()
                }}
              >
                MOBA
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#/"
                onClick={() => {
                  setCurrentGame('fps')
                  refreshData()
                }}
              >
                FPS
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#/"
                onClick={() => {
                  setCurrentGame('3d')
                  refreshData()
                }}
              >
                3D Sports
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default MovingAvgGraph
