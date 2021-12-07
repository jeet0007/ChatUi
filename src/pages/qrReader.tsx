import jsQR from 'jsqr'
import { useEffect, useRef, useState } from 'react'
import { ScanRegion } from 'types/qr'

export const getBase64 = (file: File) => {
  return new Promise((ok) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function () {
      ok(reader.result)
    }
    reader.onerror = function (error) {
      console.log('Error: ', error)
      ok('')
    }
  })
}

export const resizeImage = (
  file: File,
  maxWidth: number,
  maxHeight: number
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.src = URL.createObjectURL(file)
    image.onload = () => {
      const { width, height } = image

      if (width <= maxWidth && height <= maxHeight) {
        resolve(file)
      }

      let newWidth = 0
      let newHeight = 0

      if (width > height) {
        newHeight = height * (maxWidth / width)
        newWidth = maxWidth
      } else {
        newWidth = width * (maxHeight / height)
        newHeight = maxHeight
      }

      const canvas = document.createElement('canvas')
      canvas.width = newWidth
      canvas.height = newHeight

      const context = canvas.getContext('2d')
      if (context) {
        context.drawImage(image, 0, 0, newWidth, newHeight)
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob)
          }
          reject(new Error('Canvas is empty'))
        })
      }
    }
    image.onerror = reject
  })
}

type QrData = {
  image: string
  qr?: string
}
const generateScanRegion = async (img: File) => {
  const base64 = (await getBase64(img)) as string
  const image = new Image()
  image.src = base64
  const scanRegions: Array<ScanRegion> = [
    {
      canvasWidth: image.width,
      canvasHeight: image.height,
      x: 0,
      y: 0,
      regionName: 'Full image',
    },
    {
      canvasWidth: image.width,
      canvasHeight: image.height / 2,
      x: 0,
      y: 0,
      regionName: 'Top half',
    },
    {
      canvasWidth: image.width / 2,
      canvasHeight: image.height,
      x: 0,
      y: 0,
      regionName: 'left half ',
    },
    {
      canvasWidth: image.width / 2,
      canvasHeight: image.height / 2,
      x: 0,
      y: 0,
      regionName: 'top left quarter',
    },
    {
      canvasWidth: image.width / 2,
      canvasHeight: image.height / 2,
      x: -image.width / 2,
      y: 0,
      regionName: 'top right quarter',
    },
  ]
  return scanRegions
}

export const getQrData = async (
  file: File,
  ref: React.RefObject<HTMLCanvasElement>
): Promise<string> => {
  return new Promise((resolve) => {
    getBase64(file).then((base64) => {
      const image = new Image()
      image.src = base64 as string
      image.onload = () => {
        const canvas = ref.current
        if (canvas) {
          const ctx = canvas.getContext('2d')
          generateScanRegion(file).then((scanRegions) => {
            scanRegions.forEach((region) => {
              canvas.width = region.canvasWidth || image.width
              canvas.height = region.canvasHeight || image.height
              ctx?.drawImage(image, region.x, region.y)
              const imageData = ctx?.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
              )
              if (imageData) {
                const code = jsQR(imageData.data, canvas.width, canvas.height)
                if (code) {
                  resolve(code.data)
                }
              }
            })
          })
        }
      }
    })
  })
}

export const QrReader = () => {
  const [img, setImg] = useState('')
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {}, [img])
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e && e.target && e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setImg(URL.createObjectURL(file))
      try {
        const data = await getQrData(file, ref)
        console.log(data)
      } catch (error) {}
    }
  }
  return (
    <div className="container  w-full flex flex-row">
      <div className="flex-auto">
        <div>
          QR Reader
          <input type="file" onChange={handleFile}></input>
        </div>
        <img className="image-full" src={img}></img>
      </div>
      <div className="flex-">
        <canvas ref={ref}></canvas>
      </div>
    </div>
  )
}
