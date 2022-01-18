/* eslint-disable no-restricted-properties */
import { useState, useRef, useEffect } from 'react'
import { getCropPosition } from 'utils/autoCrop'
import LoadingOverlay from 'react-loading-overlay'

export const AutoCrop = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [originalImage, setImage] = useState<string>()
  const [resizedImg, setResizedImg] = useState<string>()
  const [points, setPoints] = useState([])
  const [isLoading, setLoading] = useState(false)
  const imageFile = useRef<File>()
  const sortFunction = (a, b) => {
    if (a[0] === b[0]) {
      return 0
    }
    return a[0] < b[0] ? -1 : 1
  }
  const getImagePolygons = async (image: File) => {
    setLoading(true)
    setPoints([])
    const data = await getCropPosition(image)
    const { result } = data
    if (result) setPoints(result)

    setLoading(false)
  }

  useEffect(() => {
    setResizedImg('')
    if (points.length > 0 && originalImage) {
      points.sort(sortFunction)
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
          const width = Math.sqrt(
            Math.pow(points[1][0] - points[0][0], 2) +
              Math.pow(points[1][1] - points[0][1], 2)
          )
          const height = Math.sqrt(
            Math.pow(points[2][0] - points[1][0], 2) +
              Math.pow(points[2][1] - points[1][1], 2)
          )
          const croppData = {
            boundaries: {
              x: points[0][0],
              y: points[0][1],
              x_width: width,
              y_height: height,
            },
          }

          console.log(croppData)
          ctx.globalCompositeOperation = 'destination-over'
          canvas.width = croppData.boundaries.x_width
          canvas.height = croppData.boundaries.y_height
          if (imageFile.current) {
            const img = new Image()
            img.src = URL.createObjectURL(imageFile.current)
            img.onload = () => {
              ctx.drawImage(
                img,
                croppData.boundaries.x,
                croppData.boundaries.y,
                croppData.boundaries.x_width,
                croppData.boundaries.y_height,
                0,
                0,
                croppData.boundaries.x_width,
                croppData.boundaries.y_height
              )
            }
          }
          ctx.globalCompositeOperation = 'source-over'
          setResizedImg(canvasRef.current.toDataURL('image/png'))
        }
      }
    }
    return () => {
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        ctx?.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
  }, [points, originalImage])

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e && e.target && e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setImage(URL.createObjectURL(file))
      getImagePolygons(file)
      imageFile.current = file
    }
  }
  return (
    <LoadingOverlay active={isLoading} spinner text="Processing Image">
      <div>
        <h1>Image Resizer</h1>
        <input type="file" accept="image/*" onChange={handleFile}></input>
        <div className="container">
          <div className="flex flex-row space-x-4 px-4 py-4 shadow">
            <div className="flex flex-col ">
              {originalImage && <img className="image" src={originalImage} />}
            </div>
            <div className="flex flex-col">
              {resizedImg && <img className="image" src={resizedImg} />}
            </div>
          </div>
        </div>

        <canvas
          className=" bordered border-solid border-black bg-gray-900 "
          ref={canvasRef}
        />
      </div>
    </LoadingOverlay>
  )
}
