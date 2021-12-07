import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBell,
  faMicrophone,
  faSearch,
} from '@fortawesome/free-solid-svg-icons'

export const Chatbot = () => {
  return (
    <div className="h-screen justify-center  bg-base-300 p-20 font-sans">
      <div className="container flex flex-row  bg-gray-200 min-w-full rounded-box p-10">
        <div className="w-2/5 ">
          <p className="text-lg font-medium text-left pl-2 ">ChatBOT </p>
          <div className="pt-5">
            <div className="flex-1 lg:flex-none bg-white rounded-btn w-4/6">
              <div className="form-control">
                <input
                  type="text"
                  placeholder="Search"
                  className="input input-ghost"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-4/5 uppercase font-semibold ">
          <div className="tabs md:tabs-sm ">
            <a className="tab">home</a>
            <p className="tab tab-active border-b-4 font-bold border-green-600">
              chat
            </p>
            <a className="tab">contacts</a>
            <a className="tab">settings</a>
            <a className="tab">Faqs</a>
            <a className="tab">t&#38;C's</a>
            <div className="justify-center flex pb-0.5 pt-0.5 space-x-2">
              <img
                className="w-5 image-full"
                src="https://img.icons8.com/ios/50/000000/bell.png"
              />
              <FontAwesomeIcon
                className="text-xl"
                icon={faSearch}
              ></FontAwesomeIcon>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
