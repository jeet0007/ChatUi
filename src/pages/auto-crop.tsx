/* eslint-disable no-restricted-properties */
import { useState, useRef, useEffect } from 'react'
import { getCropPosition } from 'utils/autoCrop'
import ReactCrop, { Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import LoadingOverlay from 'react-loading-overlay'

export const AutoCrop = () => {
  const canvasRef = useRef(null)
  const [originalImage, setOriginalImage] = useState<string>()
  const [isLoading, setLoading] = useState(false)
  const [crop, setCrop] = useState<Crop>({
    x: 10,
    y: 25,
    width: 80,
    height: 60,
    unit: '%',
  })
  const [points, setPoints] = useState([])

  const getImagePolygons = async (image: File) => {
    setLoading(true)
    setPoints([])
    const data = await getCropPosition(image)
    const { result } = data
    if (result) setPoints(result)
    setLoading(false)
  }
  useEffect(() => {
    if (points.length && canvasRef.current && originalImage) {
      const canvas = canvasRef.current as any
      const img = new Image()
      img.src = originalImage
      img.onload = () => {
        const scale = Math.max(
          canvas.componentRef.current.clientWidth / img.width,
          canvas.componentRef.current.clientHeight / img.height
        )
        const width =
          Math.sqrt(
            Math.pow(points[1][0] - points[0][0], 2) +
              Math.pow(points[1][1] - points[0][1], 2)
          ) * scale
        const height =
          Math.sqrt(
            Math.pow(points[2][0] - points[1][0], 2) +
              Math.pow(points[2][1] - points[1][1], 2)
          ) * scale
        setCrop({
          ...crop,
          x: points[0][0] * scale,
          y: points[0][1] * scale,
          width,
          height,
        })
        console.log(width, height)
      }
    }
  }, [originalImage, points])

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e && e.target && e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setOriginalImage(URL.createObjectURL(file))
      getImagePolygons(file)
    }
  }
  return (
    <div className="container">
      <h1>Image Resizer</h1>
      <input type="file" accept="image/*" onChange={handleFile}></input>
      <LoadingOverlay active={isLoading} spinner text="Processing Image">
        {originalImage && points && (
          <ReactCrop
            ref={canvasRef}
            className="max-h-full"
            src={originalImage}
            crop={crop}
            keepSelection
            onChange={setCrop}
          />
        )}
        <canvas ref={canvasRef}></canvas>
      </LoadingOverlay>
    </div>
  )
}
