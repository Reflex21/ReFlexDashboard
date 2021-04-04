import React, { useEffect, useState, useRef } from 'react'
import { ScatterChart, Scatter, Tooltip, YAxis, XAxis, Label } from 'recharts'
import UserService from '../auth/user-service'

const GenericGraph = ({ user, type, game, title, xLabel, yLabel }) => {
  const [showLatest, setShowLatest] = useState(true)
  const [graphData, setGraphData] = useState([])
  const stateRef = useRef()

  stateRef.current = showLatest

  const getData = async () => {
    let res
    if (game) {
      res = await UserService.getUserSpecificData(type)
    } else {
      res = await UserService.getUserAllData(type)
    }
    return res
  }

  const reformatData = data => {
    const formattedData = []
    data.forEach((item, index) => {
      formattedData.push({
        trial: index,
        value: item.value,
      })
    })
    return formattedData
  }

  const getLatest = data => {
    data.sort((a, b) => ((a.timestamp > b.timestamp) ? 1 : -1))
    const latest = data.slice(Math.max(data.length - 10, 0))
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

  const refreshData = () => {
    getData().then(res => {
      if (stateRef.current) {
        const latest = getLatest(res.data)
        setGraphData(latest)
      } else {
        const avg = getAvg(res.data)
        setGraphData(avg)
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
              if (type === 'reaction') {
                return `${value}ms`
              }
              if (type === 'accuracy') {
                return `${value * 100}%`
              }
              return value
            }}
            cursor={{ strokeDasharray: '3 3' }}
          />
          <XAxis type="number" dataKey="trial" name={xLabel} allowDecimals={false} domain={['dataMin', 'dataMax']}>
            <Label value={xLabel} position="bottom" />
          </XAxis>
          <YAxis type="number" dataKey="value" name={yLabel} domain={[0, dataMax => Math.ceil(dataMax / 1000) * 1000]}>
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
            refreshData()
          }}
        >
          Show Latest
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setShowLatest(false)
            refreshData()
          }}
        >
          Show Average
        </button>
      </div>
    </div>
  )
}

export default GenericGraph
