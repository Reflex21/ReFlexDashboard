import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { ScatterChart, Scatter, Tooltip, YAxis, XAxis, Label } from 'recharts'

const ReactionTimeGraph = ({ currentUser }) => {
  const [showLatest, setShowLatest] = useState(true)
  const [reactionTimeData, setReactionTimeData] = useState([])
  const stateRef = useRef()

  stateRef.current = showLatest

  const getReactionTimeData = async () => {
    const res = await axios.get(`/api/data/${currentUser}/time`)
    return res
  }

  const reformatData = data => {
    const formattedData = []
    const len = data.trial.length
    for (let i = 0; i < len; i += 1) {
      formattedData.push({
        trial: data.trial[i],
        time: data.time[i],
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
      const avgTime = (item.time.reduce((a, b) => a + b, 0)) / item.time.length
      avg.push({
        trial: index + 1,
        time: avgTime,
      })
    })
    console.log(avg)
    return avg
  }

  useEffect(() => {
    const intervalID = setInterval(() => {
      getReactionTimeData().then(res => {
        if (stateRef.current) {
          const latest = getLatest(res.data)
          setReactionTimeData(reformatData(latest))
        } else {
          const avg = getAvg(res.data)
          setReactionTimeData(avg)
        }
      })
    }, 1000)

    return () => clearInterval(intervalID)
  }, [])

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Reaction Time</h5>
        <ScatterChart
          width={600}
          height={300}
          margin={{
            top: 10, right: 10, bottom: 20, left: 10,
          }}
        >
          <Tooltip
            formatter={(value, name) => {
              if (name === 'Reaction Time') {
                return `${value}ms`
              }
              return value
            }}
            cursor={{ strokeDasharray: '3 3' }}
          />
          <XAxis type="number" dataKey="trial" name="Trial" allowDecimals={false} domain={['dataMin', 'dataMax']}>
            <Label value="Trial" position="bottom" />
          </XAxis>
          <YAxis type="number" dataKey="time" name="Reaction Time" domain={[0, dataMax => Math.ceil(dataMax / 1000) * 1000]}>
            <Label value="Reaction Time (ms)" angle={-90} position="left" />
          </YAxis>
          <Scatter name="Reaction Time" data={reactionTimeData} fill="#66a8ff" line shape="circle" />
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

export default ReactionTimeGraph
