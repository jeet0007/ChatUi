import { cropPreview } from 'components/cropPreview'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from 'react-image-crop'

import 'react-image-crop/dist/ReactCrop.css'
import { getCropPosition } from 'utils/autoCrop'
import { generateDownload } from 'utils/image'

export const AutoCrop = () => {
  const [imgSrc, setImgSrc] = useState('')
  const imgRef = useRef<HTMLImageElement>()
  const previewCanvasRef = useRef(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const [points, setPoints] = useState([])

  const getImagePolygons = async (image: File) => {
    setPoints([])
    const data = await getCropPosition(image)
    const { result } = data
    if (result) setPoints(result)
  }
  const onSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const image = e.target.files[0] as File
      setCrop(undefined) // Makes crop preview update between images.
      const reader = new FileReader()
      reader.addEventListener('load', () =>
        setImgSrc(reader?.result?.toString() || '')
      )
      reader.readAsDataURL(image)
      await getImagePolygons(image)
    }
  }
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (imgRef.current && (e.currentTarget as HTMLImageElement))
      imgRef.current = e.currentTarget
    const image = new Image()
    image.src = imgSrc
    if (image)
      image.addEventListener('load', (e) => {
        const { width: originalW, height: originalH } = image
        const aspect = originalW / originalH
        const xScale = image.naturalWidth / originalW
        const yScale = image.naturalHeight / originalH

        const minX = Math.min(...points.map((p) => p[0]))
        const minY = Math.min(...points.map((p) => p[1]))
        const maxX = Math.max(...points.map((p) => p[0]))
        const maxY = Math.max(...points.map((p) => p[1]))
        const width = (((maxX - minX) * xScale) / image.naturalWidth) * 100
        const height = (((maxY - minY) * yScale) / image.naturalHeight) * 100
        const crop = centerCrop(
          {
            x: minX * xScale,
            y: minY * yScale,
            width,
            height,
            unit: '%',
          },
          image.naturalWidth,
          image.naturalHeight
        )

        console.log(crop)

        setCrop(crop)
      })

    // This is to demonstate how to make and center a % aspect crop
    // which is a bit trickier so we use some helper functions.
  }

  const updateCropPreview = useCallback(() => {
    if (completedCrop && previewCanvasRef.current && imgRef.current) {
      cropPreview(
        imgRef.current,
        previewCanvasRef.current,
        completedCrop,
        rotate
      )
    }
  }, [completedCrop, rotate])

  useEffect(() => {
    updateCropPreview()
  }, [updateCropPreview])

  return (
    <div className="App">
      <div>
        <input type="file" accept="image/*" onChange={onSelectFile} />
        <div>
          <label htmlFor="scale-input">Scale: </label>
          <input
            id="scale-input"
            type="number"
            step="0.1"
            value={scale}
            disabled={!imgSrc}
            onChange={(e) => setScale(Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="rotate-input">Rotate: </label>
          <input
            id="rotate-input"
            type="number"
            value={rotate}
            disabled={!imgSrc}
            onChange={(e) =>
              setRotate(Math.min(180, Math.max(-180, Number(e.target.value))))
            }
          />
        </div>
      </div>
      {Boolean(imgSrc) && points?.length && (
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          keepSelection
        >
          <img
            alt="Crop me"
            src={imgSrc}
            style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
            onLoad={onImageLoad}
          />
        </ReactCrop>
      )}
      <div>
        <canvas
          ref={previewCanvasRef}
          style={{
            // Rounding is important for sharpness.
            width: Math.floor(completedCrop?.width ?? 0),
            height: Math.floor(completedCrop?.height ?? 0),
          }}
        />
      </div>
      {Boolean(completedCrop && previewCanvasRef.current) && (
        <button
          type="button"
          disabled={!completedCrop?.width || !completedCrop.height}
          onClick={() => {
            if (previewCanvasRef.current && completedCrop)
              generateDownload(previewCanvasRef.current, completedCrop)
          }}
        >
          Download cropped image
        </button>
      )}
    </div>
  )
}
