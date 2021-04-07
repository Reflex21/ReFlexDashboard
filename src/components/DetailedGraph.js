import React, { useEffect, useState, useRef } from 'react'
import { ScatterChart, Scatter, Tooltip, YAxis, XAxis, ZAxis, Label } from 'recharts'
import UserService from '../auth/user-service'

const DetailedGraph = ({ user, type, game, title, xLabel, yLabel}) => {
  const [showLatest, setShowLatest] = useState(true)
  const [graphData, setGraphData] = useState([])
  const [currentGame, setCurrentGame] = useState(game)
  const [currentType, setCurrentType] = useState(type)
  const stateRef = useRef()
  const gameRef = useRef()
  const baseType = type

  stateRef.current = showLatest
  gameRef.current = currentGame

  const getData = async (currentType, currentGame) => {
    const res = UserService.getUserData(currentType, currentGame, 0)
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

  const getLatest = data => {
    data.sort((a, b) => ((a.timestamp > b.timestamp) ? 1 : -1))
    const latest = data.slice(Math.max(data.length - 50, 0))
    latest.sort((a, b) => ((a.id > b.id) ? 1 : -1))
    return reformatData(latest)
  }

  const getAvg = data => {
    const maxSet = data.reduce((max, p) => (p.set_id > max ? p.set_id : max), data[0].set_id)
    const avg = []
    let i
    let trial = 0
    for (i = 0; i < maxSet + 1; i++) {
      const currentSet = data.filter(x => x.set_id == i)
      if (currentSet.length !== 0) {
        let avgTime = 0
        const len = currentSet.length
        currentSet.forEach((item, index) => {
          avgTime += item.value
        })
        avg.push({
          trial,
          value: avgTime / len,
        })
        trial += 1
      }
    }
    return avg
  }

  const refreshData = (currentType, currentGame) => {
    getData(currentType, currentGame).then(res => {
      console.log(res.data)
      // Check if there's any data
      if (res.data.length > 0) {
        if (stateRef.current) {
          const latest = getLatest(res.data)
          setGraphData(latest)
        } else {
          const avg = getAvg(res.data)
          setGraphData(avg)
        }
      } else {
        setGraphData([])
      }
    })
  }

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{ title }</h5>
        <ScatterChart
          width={600}
          height={300}
          margin={{
            top: 10, right: 10, bottom: 20, left: 10,
          }}
        >
          <Tooltip
            formatter={(value, name) => {
              if (name === 'value') {
                if (type === 'reaction') {
                  return `${value}ms`
                }
                if (type === 'accuracy') {
                  return `${value * 100}%`
                }
              }
              return value
            }}
            cursor={{ strokeDasharray: '3 3' }}
          />
          <XAxis type="number" dataKey="trial" name={xLabel} allowDecimals={false} domain={['dataMin', 'dataMax']}>
            <Label value={xLabel} position="bottom" />
          </XAxis>
          <YAxis type="number" dataKey="value" name={yLabel}>
            <Label value={yLabel} angle={-90} position="left" />
          </YAxis>
          <Scatter name={title} data={graphData} fill="#66a8ff" line shape="circle" />
        </ScatterChart>
      </div>
      <div className="btn-group text-center">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setShowLatest(true)
            refreshData(currentType, currentGame)
          }}
        >
          Show Latest
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setShowLatest(false)
            refreshData(currentType, currentGame)
          }}
        >
          Show Average
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
                  refreshData(currentType, 'all')
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
                  refreshData(currentType, 'moba')
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
                  refreshData(currentType, 'fps')
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
                  refreshData(currentType, '3d')
                }}
              >
                3D Sports
              </a>
            </li>
          </ul>
        </div>

        <div className="btn-group">
          <button className="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">
            Filter by type
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li>
              <a
                className="dropdown-item"
                href="#/"
                onClick={() => {
                  setCurrentType(baseType)
                  refreshData(baseType, currentGame)
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
                  const t = `${baseType}_key`
                  setCurrentType(t)
                  refreshData(t, currentGame)
                }}
              >
                Key Presses
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#/"
                onClick={() => {
                  const t = `${baseType}_mouse`
                  setCurrentType(t)
                  refreshData(t, currentGame)
                }}
              >
                Mouse Clicks
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#/"
                onClick={() => {
                  const t = `${baseType}_Q`
                  setCurrentType(t)
                  refreshData(t, currentGame)
                }}
              >
                Q Key
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#/"
                onClick={() => {
                  const t = `${baseType}_W`
                  setCurrentType(t)
                  refreshData(t, currentGame)
                }}
              >
                W Key
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#/"
                onClick={() => {
                  const t = `${baseType}_E`
                  setCurrentType(t)
                  refreshData(t, currentGame)
                }}
              >
                E Key
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#/"
                onClick={() => {
                  const t = `${baseType}_R`
                  setCurrentType(t)
                  refreshData(t, currentGame)
                }}
              >
                R Key
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#/"
                onClick={() => {
                  const t = `${baseType}_1`
                  setCurrentType(t)
                  refreshData(t, currentGame)
                }}
              >
                1 Key
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#/"
                onClick={() => {
                  const t = `${baseType}_2`
                  setCurrentType(t)
                  refreshData(t, currentGame)
                }}
              >
                2 Key
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#/"
                onClick={() => {
                  const t = `${baseType}_3`
                  setCurrentType(t)
                  refreshData(t, currentGame)
                }}
              >
                3 Key
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default DetailedGraph
