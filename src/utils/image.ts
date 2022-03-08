import { PixelCrop } from 'react-image-crop'

let previewUrl: string

export const generateDownload = (
  canvas: HTMLCanvasElement,
  crop: PixelCrop
) => {
  // Since we may have scaled the crop preview canvas up for retina,
  // we need to scale it down when saving.
  const fileCanvas = document.createElement('canvas')
  const pixelRatio = window.devicePixelRatio || 1
  const scaleDown = 1 / pixelRatio

  fileCanvas.width = Math.floor(canvas.width * scaleDown)
  fileCanvas.height = Math.floor(canvas.height * scaleDown)

  const ctx = fileCanvas.getContext('2d')
  if (!ctx) {
    throw new Error('No 2d context')
  }

  ctx.imageSmoothingQuality = 'high'
  ctx.scale(scaleDown, scaleDown)
  ctx.drawImage(canvas, 0, 0)

  fileCanvas.toBlob(
    (blob) => {
      if (previewUrl) {
        window.URL.revokeObjectURL(previewUrl)
      }

      previewUrl = window.URL.createObjectURL(blob)

      const anchor = document.createElement('a')
      anchor.download = 'cropPreview.png'
      anchor.href = URL.createObjectURL(blob)
      anchor.click()
    },
    'image/png',
    1
  )
}

export const getBlobFromFile = (file: File) => {
  file.arrayBuffer().then((arrayBuffer) => {
    const blob = new Blob([new Uint8Array(arrayBuffer)], { type: file.type })
    return blob
  })
}
