import React, { useState } from 'react'
import * as XLSX from 'xlsx'

const Upload = ({ importData }) => {
  const [trainingData, setTrainingData] = useState({})
  // process CSV data
  const processAccuracy = dataStringLines => {
    const output = { trial: [], accuracy: [] }
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/)
      if (row.length > 1) {
        output.trial.push(row[0])
        output.accuracy.push(row[1])
      }
    }

    return output
  }

  const processReactionTime = dataStringLines => {
    const output = { trial: [], time: [] }
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/)
      if (row.length > 1) {
        output.trial.push(row[0])
        output.time.push(row[1])
      }
    }

    return output
  }

  // handle file upload
  const handleFileUpload = e => {
    // Setup
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onload = evt => {
      // Parse data
      const bstr = evt.target.result
      const wb = XLSX.read(bstr, { type: 'binary' })
      // Get first worksheet
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      // Convert array of arrays
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 })

      const dataStringLines = data.split(/\r\n|\n/)
      const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/)

      if (headers[1] === 'accuracy') {
        const formattedData = processAccuracy(dataStringLines)
        setTrainingData({ type: 'accuracy', values: formattedData })
      } else if (headers[1] === 'time') {
        const formattedData = processReactionTime(dataStringLines)
        setTrainingData({ type: 'time', values: formattedData })
      } else {
        alert('Invalid data')
        e.target.value = null
      }
    }

    // Check File Type and read file
    const ext = file.name.split('.').pop()
    if ((ext === 'csv') || (ext === 'txt')) {
      reader.readAsBinaryString(file)
    } else {
      alert('Invalid file-type.')
      e.target.value = null
    }
  }

  return (
    <div className="modal" id="uploadBox" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Upload your data</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body text-center">
            <p>Accepted File Types: *.csv, *.txt</p>
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
            />
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                importData(trainingData)
                setTrainingData({})
                $('#uploadBox').modal('hide')
              }}
            >Upload</button>
            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Upload
