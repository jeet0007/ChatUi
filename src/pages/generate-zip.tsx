import { CARTER_ENDPOINT } from 'config/env'
import { useCallback, useState } from 'react'

export const GenetrateZip = () => {
  // get room id from user using a input tag
  const [roomId, setRoomId] = useState('')

  // callback function to call api to fetch all the files in roomID
  const getFiles = useCallback(async () => {
    console.log(process.env)

    return fetch(`${CARTER_ENDPOINT}/rooms/${roomId}/download`)
  }, [roomId])

  const handleSubmit = () => {
    getFiles().then((res) => {
      console.log(res)
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
    </div>
  )
}
