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
          ctx.globalCompositeOperation = 'destination-over'
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          if (imageFile.current) {
            const img = new Image()
            img.src = URL.createObjectURL(imageFile.current)
            img.onload = () => {
              ctx.drawImage(img, 0, 0)
            }
            ctx.beginPath()
            points.forEach((point, index) => {
              const x = point[0]
              const y = point[1]
              console.log(x, y)
              if (index === 0) ctx.moveTo(x, y)
              ctx.lineTo(x, y)
            })
            ctx.closePath()
            ctx.clip()
            ctx.save()
            ctx.globalCompositeOperation = 'source-over'
          }
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
          width={Math.max(...points.map((point) => point[0]))}
          height={Math.max(...points.map((point) => point[1]))}
        />
      </div>
    </LoadingOverlay>
  )
}
