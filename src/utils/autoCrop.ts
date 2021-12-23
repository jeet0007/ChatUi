import axios from 'axios'

export const getCropPosition = (image: File) => {
  const formData = new FormData()
  formData.append('image', image)
  const token = 'wZNdYibwf74PbCSY5XwqXad5saEy2C2msnECwxq5'
  return axios
    .post('https://ml.appman.co.th/v1/thailand-id-card/front/align', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-api-key': token,
      },
    })
    .then((d) => d.data)
}
