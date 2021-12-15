import FullScreen from 'react-div-100vh'
import Spinner from './Spinner'

const Loading = () => {
  return (
    <FullScreen className="fixed w-full flex justify-center items-center">
      <Spinner size={45} className="text-primary" />
    </FullScreen>
  )
}

export default Loading
