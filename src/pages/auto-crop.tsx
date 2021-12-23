import { useState, useRef, useEffect } from 'react'
import { getCropPosition } from 'utils/autoCrop'

export const AutoCrop = () => {
  let image: File
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [originalImage, setImage] = useState<string>()
  const [points, setPoints] = useState([])

  const getImagePolygons = async (image: File) => {
    const data = await getCropPosition(image)
    const { result } = data
    if (result) setPoints(result)
  }
  useEffect(() => {
    if (points.length > 0) {
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.beginPath()
          ctx.moveTo(points[0][0], points[0][1])
          for (let i = 1; i < points.length; i++) {
            const p = points[i]
            ctx.lineTo(points[i][0], points[i][1])
          }
          ctx.closePath()
        }
      }
    }
  }, [points])

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e && e.target && e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      image = file
      setImage(URL.createObjectURL(file))
      getImagePolygons(file)
    }
  }
  return (
    <div>
      <h1>Image Resizer</h1>
      <input type="file" onChange={handleFile}></input>
      <div className="container">
        <div className="flex flex-row space-x-4 px-4 py-4 shadow">
          <div className="flex flex-col ">
            {originalImage && (
              <img className="image" height={100} src={originalImage} />
            )}
          </div>
          <div className="flex flex-col">
            <canvas ref={canvasRef} className="image" height={100} />
          </div>
        </div>
      </div>
    </div>
  )
}
