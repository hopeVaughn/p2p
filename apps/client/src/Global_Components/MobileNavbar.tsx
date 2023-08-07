import React from 'react'
import { AiOutlineUser, AiOutlineSearch, AiOutlinePlus } from 'react-icons/ai'

const MobileNavbar: React.FC = () => {
  return (
    <nav className="fixed bottom-0 flex justify-between items-center p-5 bg-gray-400 rounded-tl-3xl rounded-tr-3xl bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-gray-100 shadow-lg w-full">
      <div className="w-1/3 flex justify-center">
        <a href="#">
          <AiOutlineSearch className="text-lg text-teal-900 hover:text-teal-500" />
        </a>
      </div>
      <div className="w-1/3 flex justify-center">
        <a href="#">
          <AiOutlineUser className="text-lg text-teal-900 hover:text-teal-500" />
        </a>
      </div>
      <div className="w-1/3 flex justify-center">
        <a href="#">
          <AiOutlinePlus className="text-lg text-teal-900 hover:text-teal-500" />
        </a>
      </div>
    </nav>
  )
}

export default MobileNavbar
