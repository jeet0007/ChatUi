import { Html5QrcodeScannerState, Html5Qrcode } from 'html5-qrcode'
import { useEffect, useState } from 'react'

const qrcodeRegionId = 'html5qr-code-full-region'

const Html5QrcodePlugin = () => {
  const [qrScanner, setScanner] = useState<Html5Qrcode | null>(null)
  const [url, setUrl] = useState('')
  const [state, setState] = useState(
    qrScanner?.getState() as Html5QrcodeScannerState
  )

  const onSuccess = (decodedText, decodedResult) => {
    if (decodedText) setUrl(decodedText)
    console.log('decodedResult', decodedResult)
  }
  useEffect(() => {
    if (qrScanner) {
      const state = qrScanner.getState()
      if (state === Html5QrcodeScannerState.SCANNING) {
        qrScanner.stop()
      }
      setState(state)
    }
  }, [url, qrScanner, state])
  console.log(state)

  const onFailure = () => {}
  useEffect(() => {
    if (!qrScanner) {
      Html5Qrcode.getCameras().then((cameras) => {
        const backCameras = cameras.filter((camera) =>
          camera.label.toLowerCase().includes('back' || 'rear' || 'environment')
        )
        const qrScanner = new Html5Qrcode(qrcodeRegionId, false)
        qrScanner.start(
          backCameras[0]?.id || {
            facingMode: 'environment',
          },
          { fps: 10, qrbox: 250, disableFlip: false },
          onSuccess,
          onFailure
        )
        setScanner(qrScanner)
      })
    }
    return () => {}
  }, [qrScanner])

  return (
    <div className="container">
      <div className="w-screen h-2/4" id={qrcodeRegionId} />
      <p>Choose camera</p>
      <ul id="cameras"></ul>

      <div id="result">
        {url && <iframe src={url} width={500} height={1000} />}
      </div>
    </div>
  )
}

export default Html5QrcodePlugin
