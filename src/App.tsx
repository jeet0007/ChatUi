import './App.css'

import { QrReader } from 'pages/qrReader'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ImageResizer } from 'pages/image-resizer'
import Chatbot from 'pages/chatbot'
import { Suspense } from 'react'
import Loading from 'components/Loading'
import { callApi, signMessage } from 'utils/encode'

function App() {
  const date = new Date()
  date.setHours(date.getHours() + 7)
  const formatted = date.toISOString()
  const format = formatted.substring(0, formatted.length - 5)
  const sign = signMessage(`A58|${format}`)
  callApi(sign, format)
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route exact path="/" component={Chatbot} />
          <Route exact path="/Image-resizer" component={QrReader} />
          <Route exact path="/Qr-reader" component={ImageResizer} />
        </Switch>
      </Suspense>
    </Router>
  )
}

export default App
