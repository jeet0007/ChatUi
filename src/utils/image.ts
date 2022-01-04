export const getBlobFromFile = (file: File) => {
  file.arrayBuffer().then((arrayBuffer) => {
    const blob = new Blob([new Uint8Array(arrayBuffer)], { type: file.type })
    return blob
  })
}
