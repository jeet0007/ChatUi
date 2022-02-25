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
      console.error('Error: ', error)
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
      canvasWidth: image.width - 500,
      canvasHeight: image.height / 6 - 200,
      x: -image.width / 2 - 450,
      y: -250,
      regionName: 'Top half',
      scale: 1.5,
    },
  ]
  return scanRegions
}

export const getQrData = async (file: File): Promise<string> => {
  const div = document.getElementById('crops')
  if (div) div.innerHTML = ''
  const resize = file
  return new Promise((resolve) => {
    getBase64(resize).then((base64) => {
      const image = new Image()
      image.src = base64 as string
      image.onload = () => {
        generateScanRegion(resize).then((scanRegions) => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          for (let index = 0; index < scanRegions.length; index++) {
            const region = scanRegions[index]
            canvas.width = region.canvasWidth
            canvas.height = region.canvasHeight

            ctx?.drawImage(
              image,
              region.x,
              region.y,
              image.naturalWidth,
              image.naturalHeight
            )

            const imgUrl = canvas.toDataURL('image/png')
            const img = document.createElement('img')
            const text = document.createElement('p')
            if (text) text.innerHTML = region.regionName || ''
            div?.appendChild(text)
            div?.appendChild(img)
            img.src = imgUrl
            const imageData = ctx?.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
            )
            if (imageData) {
              const code = jsQR(imageData.data, canvas.width, canvas.height, {
                inversionAttempts: 'dontInvert',
              })
              if (code) {
                return resolve(code.data)
              }
            }
          }
          return ''
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
      setQr('')
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
            <input type="file" accept="image/*" onChange={handleFile}></input>
          </div>
          <img className="image-full" src={img}></img>
        </div>
        <iframe className="flex-auto" src={qr}></iframe>
      </div>
      <div id="crops" className="ul"></div>
    </div>
  )
}
