import './App.css'

import { QrReader } from 'pages/qrReader'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ImageResizer } from 'pages/image-resizer'
import { TableOfContext } from 'pages'
import { Suspense } from 'react'
import Loading from 'components/Loading'
import { AutoCrop } from 'pages/auto-crop'
import { HtmlQrReader } from 'pages/canvasQr'
import { GenetrateZip } from 'pages/generate-zip'

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route exact path="/" component={TableOfContext} />
          <Route exact path="/Image-resizer" component={ImageResizer} />
          <Route exact path="/Qr-reader" component={QrReader} />
          <Route exact path="/auto-crop" component={AutoCrop} />
          <Route exact path="/HtmlQrReader" component={HtmlQrReader} />
          <Route exact path="/GenetrateZip" component={GenetrateZip} />
        </Switch>
      </Suspense>
    </Router>
  )
}

export default App
