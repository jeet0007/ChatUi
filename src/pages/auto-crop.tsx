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
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          const img = new Image()
          img.src = originalImage
          img.onload = () => {
            const scale = Math.max(
              canvas.width / img.width,
              canvas.height / img.height
            )
            const x = canvas.width / 2 - (img.width / 2) * scale
            const y = canvas.height / 2 - (img.height / 2) * scale

            ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
            ctx.lineWidth = 3
            ctx.strokeStyle = 'red'
            ctx.beginPath()
            points.forEach((point, index) => {
              if (index === 0) {
                ctx.moveTo(point[0] * scale + x, point[1] * scale + y)
              } else {
                ctx.lineTo(point[0] * scale + x, point[1] * scale + y)
              }
            })
            // ctx.scale()

            ctx.lineTo(points[0][0] * scale + x, points[0][1] * scale + y)
            ctx.closePath()
            ctx.stroke()

            // ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
          }
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
      <h1>Image Resizer</h1>
      <input type="file" accept="image/*" onChange={handleFile}></input>
      <div className="flex flex-row">
        <div className="flex">
          <div className="flex flex-row space-x-4 px-4 py-4 shadow">
            <div className="flex flex-col ">
              {originalImage && (
                <img className="image w-1/2" src={originalImage} />
              )}
            </div>
            <div className="flex flex-col">
              {resizedImg && <img className="image w-1/2" src={resizedImg} />}
            </div>
          </div>
        </div>
      </div>
      <canvas
        height={500}
        width={500}
        className=" bordered border-solid border-black bg-gray-900  "
        ref={canvasRef}
      />
    </LoadingOverlay>
  )
}
