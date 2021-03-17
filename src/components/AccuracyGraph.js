import React, { useEffect, useState, useRef } from 'react'
import { ScatterChart, Scatter, Tooltip, YAxis, XAxis, Label } from 'recharts'
import UserService from '../auth/user-service'

const AccuracyGraph = () => {
  const [showLatest, setShowLatest] = useState(true)
  const [accuracyData, setAccuracyData] = useState([])
  const stateRef = useRef()

  stateRef.current = showLatest

  const getAccuracyData = async () => {
    const res = await UserService.getUserAccuracyData()
    return res
  }

  const reformatData = data => {
    const formattedData = []
    data.forEach((item, index) => {
      formattedData.push({
        trial: index,
        accuracy: item.value,
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
        let avgAccuracy = 0
        const len = currentSet.length
        currentSet.forEach((item, index) => {
          avgAccuracy += item.value
        })
        avg.push({
          trial,
          accuracy: avgAccuracy / len,
        })
        trial += 1
      }
    }
    return avg
  }

  const refreshData = () => {
    getAccuracyData().then(res => {
      if (stateRef.current) {
        const latest = getLatest(res.data)
        setAccuracyData(latest)
      } else {
        const avg = getAvg(res.data)
        setAccuracyData(avg)
      }
    })
  }

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Accuracy</h5>
        <ScatterChart
          width={600}
          height={300}
          margin={{
            top: 10, right: 10, bottom: 20, left: 10,
          }}
        >
          <Tooltip
            formatter={(value, name) => {
              if (name === 'Accuracy') {
                return `${value * 100}%`
              }
              return value
            }}
            cursor={{ strokeDasharray: '3 3' }}
          />
          <XAxis type="number" dataKey="trial" name="Trial" allowDecimals={false} domain={['dataMin', 'dataMax']}>
            <Label value="Trial" position="bottom" />
          </XAxis>
          <YAxis type="number" dataKey="accuracy" name="Accuracy" domain={[0, 1]}>
            <Label value="Accuracy (%)" angle={-90} position="left" />
          </YAxis>
          <Scatter name="Accuracy" data={accuracyData} fill="#82ca9d" line shape="circle" />
        </ScatterChart>
      </div>
      <div className="btn-group text-center">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setShowLatest(true)}
        >
          Show Latest
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setShowLatest(false)}
        >
          Show Average
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => refreshData()}
        >
          Refresh
        </button>
      </div>
    </div>
  )
}

export default AccuracyGraph
