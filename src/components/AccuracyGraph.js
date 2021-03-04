import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { ScatterChart, Scatter, Tooltip, YAxis, XAxis, Label } from 'recharts'

const AccuracyGraph = ({ currentUser }) => {
  const [showLatest, setShowLatest] = useState(true)
  const [accuracyData, setAccuracyData] = useState([])
  const stateRef = useRef()

  stateRef.current = showLatest

  const getAccuracyData = async () => {
    const res = await axios.get(`/api/data/${currentUser}/accuracy`)
    return res
  }

  const reformatData = data => {
    const formattedData = []
    const len = data.trial.length
    for (let i = 0; i < len; i += 1) {
      formattedData.push({
        trial: data.trial[i],
        accuracy: data.accuracy[i],
      })
    }
    return formattedData
  }

  const getLatest = data => {
    let latest = data[0]
    data.forEach((item, index) => {
      if (item.createdAt > latest.createdAt) {
        latest = item
      }
    })
    return latest
  }

  const getAvg = data => {
    const avg = []
    data.forEach((item, index) => {
      const avgAccuracy = (item.accuracy.reduce((a, b) => a + b, 0)) / item.accuracy.length
      avg.push({
        trial: index + 1,
        accuracy: avgAccuracy,
      })
    })
    return avg
  }

  useEffect(() => {
    const intervalID = setInterval(() => {
      getAccuracyData().then(res => {
        if (stateRef.current) {
          const latest = getLatest(res.data)
          setAccuracyData(reformatData(latest))
        } else {
          const avg = getAvg(res.data)
          setAccuracyData(avg)
        }
      })
    }, 1000)

    return () => clearInterval(intervalID)
  }, [])

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
      </div>
    </div>
  )
}

export default AccuracyGraph