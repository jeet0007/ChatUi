import { useEffect, useState } from 'react'
import { resizeImage } from 'utils/resize'

export const ImageResizer = () => {
  const [originalImage, setImage] = useState<{ image: string; size: string }>()
  const [resizedImage, setResizedImage] =
    useState<{ image: string; size: string }>()
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e && e.target && e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setImage({ image: URL.createObjectURL(file), size: `${file.size}` })
    }
  }
  const handleResize = async (originalImage: string) => {
    const data = await resizeImage(originalImage, 20000)
    console.log(data)

    if (data) {
      setResizedImage({
        image: originalImage,
        size: `${(data as File).size}`,
      })
    }
  }
  useEffect(() => {
    if (originalImage && originalImage) handleResize(originalImage.image)
  }, [originalImage])

  return (
    <div>
      <h1>Image Resizer</h1>
      <input type="file" onChange={handleFile}></input>
      <div className="container">
        <div className="flex flex-row space-x-4 px-4 py-4 shadow">
          <div className="flex flex-col ">
            {originalImage && (
              <img className="image" height={100} src={originalImage.image} />
            )}
            {originalImage && <span> {originalImage?.size} kb</span>}
          </div>
          <div className="flex flex-col">
            {resizedImage && resizedImage.image && (
              <img className="image" height={100} src={resizedImage.image} />
            )}
            {resizedImage && resizedImage.size && (
              <span> {resizedImage?.size}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
