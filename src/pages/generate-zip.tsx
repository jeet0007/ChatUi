import { CARTER_ENDPOINT } from 'config/env'
import { useCallback, useState } from 'react'

export interface IFile {
  path: string
  url: string
}
export const GenetrateZip = () => {
  // get room id from user using a input tag
  const [roomId, setRoomId] = useState('')
  const [files, setFiles] = useState<Array<IFile>>([])

  // callback function to call api to fetch all the files in roomID
  const getFiles = useCallback(async () => {
    return fetch(`${CARTER_ENDPOINT}/rooms/${roomId}/download`)
  }, [roomId])

  const handleSubmit = () => {
    getFiles().then((res: any) => {
      const { data } = res
      setFiles(data)
    })
  }

  return (
    <div className="container">
      <label className="label">Room ID</label>
      <input
        className="input bordered border-solid border-gray-300"
        type="text"
        required
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={handleSubmit}>Generate</button>
      <ul>
        {files &&
          files.length &&
          files.map((file) => (
            <li>
              <label> {file.path} </label>
            </li>
          ))}
      </ul>
    </div>
  )
}
