import axios from 'axios'
import Loading from 'components/Loading'
import { CARTER_ENDPOINT } from 'config/env'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { useCallback, useEffect, useState } from 'react'

export interface IFile {
  path: string
  url: string
  dounloadLink?: string
  status?: 'Downloading' | 'Downloaded' | 'Error' | 'Pending'
}
export const GenetrateZip = () => {
  // get room id from user using a input tag
  const [roomId, setRoomId] = useState('TestRoomID')
  const [files, setFiles] = useState<Array<IFile>>([])
  const [isLoading, setLoading] = useState(false)
  const [zip, setZip] = useState<JSZip>(new JSZip())

  // callback function to call api to fetch all the files in roomID
  const getFiles = useCallback(async () => {
    return axios
      .get(`${CARTER_ENDPOINT}/rooms/${roomId}/download`)
      .then((res) => res.data)
  }, [roomId])

  const downloadAll = async (files: IFile[]) => {
    return Promise.all(
      files.map(
        (file: IFile) =>
          new Promise((resolve) => {
            axios
              .get(file.url, {
                responseType: 'blob',
                headers: {
                  'x-api-key': '4otmGcp2Xcvetg9lmAK25xy8FrXIJbdS',
                },
              })
              .then((res) => {
                zip.file(file.path, res.data)
                resolve(res.data)
              })
          })
      )
    )
  }

  const handleSubmit = () => {
    if (!roomId) return
    setLoading(true)
    getFiles().then((files) => {
      setFiles(files.data)
    })
    setLoading(false)
  }
  const handleGenerate = () => {
    setLoading(true)
    downloadAll(files).then(() => {
      zip.generateAsync({ type: 'blob' }).then(function (content) {
        saveAs(content, `${roomId}.zip`)
      })
    })
    setLoading(false)
  }

  return (
    <div className="container-fluid">
      {isLoading && <Loading />}
      <label className="label">Room ID</label>
      <input
        className="input bordered border-solid border-gray-300"
        type="text"
        required
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button className="btn btn-sm" onClick={handleSubmit}>
        Get Files
      </button>
      <button className="btn btn-sm" onClick={handleGenerate}>
        Generate zip
      </button>
      <ul>
        {files &&
          files.length &&
          files.map((file, index) => (
            <div className="flex-root flex-col " key={index}>
              <li className="flex justify-between">
                <div>
                  <label> {`${index + 1} :`}</label>
                  <label> {file.path} </label>
                </div>

                <div className="flex justify-between">
                  {file.dounloadLink && <a href={file.dounloadLink}> Open </a>}
                </div>
              </li>
            </div>
          ))}
      </ul>
    </div>
  )
}
