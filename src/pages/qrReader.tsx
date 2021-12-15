import jsQR from 'jsqr'
import { useEffect, useState } from 'react'
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
      canvasWidth: image.width,
      canvasHeight: image.height / 2,
      x: 0,
      y: -image.height / 2,
      regionName: 'bottom half',
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
      canvasHeight: image.height,
      x: -image.width / 2,
      y: 0,
      regionName: 'right half ',
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
    {
      canvasWidth: image.width / 2,
      canvasHeight: image.height / 2,
      x: 0,
      y: -image.height / 2,
      regionName: 'bottom left quarter',
    },
    {
      canvasWidth: image.width / 2,
      canvasHeight: image.height / 2,
      x: -image.width / 2,
      y: -image.height / 2,
      regionName: 'bottom right quarter',
    },
  ]
  return scanRegions
}

export const getQrData = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    getBase64(file).then((base64) => {
      const image = new Image()
      image.src = base64 as string
      image.onload = () => {
        const arrays = Array<HTMLCanvasElement>()
        generateScanRegion(file).then((scanRegions) => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          scanRegions.forEach((region) => {
            canvas.width = region.canvasWidth
            canvas.height = region.canvasHeight
            ctx?.drawImage(image, region.x, region.y)
            const imageData = ctx?.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
            )
            arrays.push(canvas)
            if (imageData) {
              const code = jsQR(imageData.data, canvas.width, canvas.height)
              if (code) {
                console.log('found in', region.regionName)
                return resolve(code.data)
              }
              console.log('not found in', region.regionName)

              return ''
            }
            return ''
          })
        })
      }
    })
  })
}

export const QrReader = () => {
  const [img, setImg] = useState('')
  const [qr, setQr] = useState('')
  useEffect(() => {}, [img])
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e && e.target && e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setImg(URL.createObjectURL(file))
      try {
        const data = await getQrData(file)
        if (data) {
          setQr(data)
        } else {
          setQr('')
        }
      } catch (error) {}
    }
  }
  return (
    <div className="container w-full h-full">
      <div className="flex flex-row">
        <div className="flex-auto">
          <div>
            QR Reader
            <input type="file" onChange={handleFile}></input>
          </div>
          <img className="image-full" src={img}></img>
        </div>
        <iframe className="flex-auto" src={qr}></iframe>
      </div>
    </div>
  )
}
