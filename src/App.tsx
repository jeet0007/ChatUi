import './App.css'

import { QrReader } from 'pages/qrReader'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ImageResizer } from 'pages/image-resizer'
import { TableOfContext } from 'pages'
import { Suspense } from 'react'
import Loading from 'components/Loading'
import { AutoCrop } from 'pages/auto-crop'
import { HtmlQrReader } from 'pages/canvasQr'
import { callApi, signMessage } from 'utils/encode'

function App() {
  // const date = new Date()
  // date.setHours(date.getHours() + 7)
  // const formatted = date.toISOString()
  // const format = formatted.substring(0, formatted.length - 5)
  // const sign = signMessage('A58|abc')
  // callApi(sign, format)
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route exact path="/" component={TableOfContext} />
          <Route exact path="/Image-resizer" component={ImageResizer} />
          <Route exact path="/Qr-reader" component={QrReader} />
          <Route exact path="/auto-crop" component={AutoCrop} />
          <Route exact path="/HtmlQrReader" component={HtmlQrReader} />
        </Switch>
      </Suspense>
    </Router>
  )
}

export default App
