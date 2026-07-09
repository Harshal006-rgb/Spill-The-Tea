import React from 'react'
import dp from "../assets/dp.jpg"

const SenderMessage = ({ image, message, onImageLoad }) => {
  return (
    <div className='flex flex-col gap-2 mt-4 ml-auto mb-4 px-3 py-2 rounded-2xl rounded-br-none w-fit max-w-125 p-2 bg-green-300 '>
      {image && <img src={image} onLoad={onImageLoad} alt="" className='w-35 rounded-lg object-cover' />}
      {message && <span>{message}</span>}
    </div>
  )
}

export default SenderMessage