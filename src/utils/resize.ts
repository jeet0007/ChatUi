/* eslint-disable no-await-in-loop */
export const urltoFile = async (
  url: string,
  filename: string,
  mimeType: string
) => {
  return fetch(url)
    .then(function (res) {
      return res.arrayBuffer()
    })
    .then(function (buf) {
      return new File([buf], filename, { type: mimeType })
    })
}
const dataURItoBlob = (dataURI: string) => {
  const bytes =
    dataURI.split(',')[0].indexOf('base64') >= 0
      ? atob(dataURI.split(',')[1])
      : unescape(dataURI.split(',')[1])
  const mime = dataURI.split(',')[0].split(':')[1].split(';')[0]
  const max = bytes.length
  const ia = new Uint8Array(max)
  for (let i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i)
  return new Blob([ia], { type: mime })
}
export const canvasToFile = (canvas: HTMLCanvasElement, fileName: string) => {
  const dataUrl = canvas.toDataURL('image/png', 1) // 1.0 is the quality
  const blob = dataURItoBlob(dataUrl)
  return new File([blob], fileName, {
    type: blob.type,
  })
}

export const resizeImage = async (
  dataUrl: string,
  targetFileSizeKb: number,
  maxDeviation = 50
) => {
  const originalFile = await urltoFile(dataUrl, 'test.png', 'image/png')
  if (originalFile.size / 1000 < targetFileSizeKb) return dataUrl // File is already smaller

  let low = 0.0
  let middle = 0.5
  let high = 1.0

  let result

  let file = originalFile
  while (Math.abs(file.size / 1000 - targetFileSizeKb) > maxDeviation) {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    const img = document.createElement('img')
    const promise = new Promise((resolve, reject) => {
      img.onload = () => resolve
      img.onerror = reject
    })

    img.src = dataUrl

    await promise
    canvas.width = Math.round(img.width * middle)
    canvas.height = Math.round(img.height * middle)
    context?.scale(canvas.width / img.width, canvas.height / img.height)
    context?.drawImage(img, 0, 0)
    file = await urltoFile(canvas.toDataURL(), 'test.png', 'image/png')

    if (file.size / 1000 < targetFileSizeKb - maxDeviation) {
      low = middle
    } else if (file.size / 1000 > targetFileSizeKb) {
      high = middle
    }

    middle = (low + high) / 2
    result = canvasToFile(canvas, 'test.png')
  }
  console.log('result ', result)

  return result as File
}
