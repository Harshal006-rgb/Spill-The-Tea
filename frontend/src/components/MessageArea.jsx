import React, { useEffect, useRef, useState } from 'react'
import dp from "../assets/dp.jpg";
import { FaPhone } from "react-icons/fa6";
import { IoVideocam } from "react-icons/io5";
import { useSelector, useDispatch } from 'react-redux';
import { FaArrowLeft } from "react-icons/fa6";
import { setSelectedUser } from '../redux/userSlice';
import { IoImages } from "react-icons/io5";
import { RiEmojiStickerFill } from "react-icons/ri";
import EmojiPicker from 'emoji-picker-react';
import RecieverMessage from './RecieverMessage';
import SenderMessage from './SenderMessage';
import axios from 'axios';
import { serverUrl } from '../config';
import { setMessages } from '../redux/messageSlice';

const MessageArea = () => {
  let { messages } = useSelector((state) => state.message);
  let { userData, selectedUser, socket } = useSelector((state) => state.user)
  let dispatch = useDispatch();
  let [showPicker, setShowPicker] = useState(false);
  let [input, setInput] = useState("");
  let [frontEndImage, setFrontEndImage] = useState(null);
  let [backEndImage, setBackEndImage] = useState(null);
  let imageref = useRef();
  const scrollRef = useRef();
  const lastMessageCount = useRef(0);


  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() && !backEndImage) return;

    try {
      let formData = new FormData();
      formData.append('message', input);
      if (backEndImage) {
        formData.append('image', backEndImage);
      }
      let result = await axios.post(`${serverUrl}/api/message/send/${selectedUser._id}`, formData, { withCredentials: true });

      dispatch(setMessages([...messages, result.data.data]));
      setInput("");
      setFrontEndImage(null);
      setBackEndImage(null);

    }
    catch (error) {
      console.log(error);
    }
  }

  const handleImage = (e) => {
    let file = e.target.files[0];
    if (file) {
      setBackEndImage(file);
      setFrontEndImage(URL.createObjectURL(file));
    } else {
      setBackEndImage(null);
      setFrontEndImage(null);
    }
  }


  const onEmojiClick = (emojiObject) => {
    setInput((prev) => prev + emojiObject.emoji);
  }

  useEffect(() => {
    socket?.on("newMessage", (mess) => {
      dispatch(setMessages([...messages, mess]))
    })
    return () => socket?.off("newMessage")
  }, [messages, setMessages, socket])



  // ai help to scroll
  useEffect(() => {
    lastMessageCount.current = 0;
  }, [selectedUser])

  useEffect(() => {
    if (scrollRef.current) {
      const isNewMessage = messages?.length > lastMessageCount.current && lastMessageCount.current > 0;
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: isNewMessage ? "smooth" : "auto"
      });
      lastMessageCount.current = messages?.length || 0;
    }
  }, [messages])
  //////////

  const handleImageLoad = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }


  if (!selectedUser) {
    return (
      <div className='md:w-[70%] w-full hidden md:flex h-screen bg-amber-50 items-center justify-center text-gray-500'>
        <p className='text-lg font-medium'>Ready to Spill Your Tea !!</p>
      </div>
    )
  }

  return (
    <div className='md:w-[70%] w-full flex flex-col h-screen bg-[#e5ddd5] relative'>

      {/* Chat Header */}
      <div className='w-full h-[12%] bg-slate-200 flex items-center justify-between px-8 shadow-lg shrink-0'>
        {/* User Info (Left side) */}
        <div className='flex items-center gap-3'>
          <FaArrowLeft onClick={() => dispatch(setSelectedUser(null))} className='w-10 h-10 cursor-pointer hover:text-white hover:bg-blue-500 rounded-full p-2 transition-all duration-200' />
          <div className='relative shrink-0'>
            <img className='w-15 h-15 rounded-full object-cover border border-gray-200' src={selectedUser.image || dp} alt="profile" />
            {/* <span className='absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full'></span> */}
          </div>
          <div className='flex flex-col'>
            <h2 className='font-semibold text-gray-800 text-sm leading-tight'>{selectedUser.name}</h2>
            <span className='text-xs text-green-500 font-medium'>@{selectedUser.userName}</span>
          </div>
        </div>
        {/* Action Icons (Right side) */}
        <div className='flex items-center gap-4 text-gray-500 text-xl'>
          <button className='hover:text-blue-500 cursor-pointer p-1.5 hover:bg-gray-100 rounded-full transition-all duration-200'><FaPhone /></button>
          <button className='hover:text-blue-500 cursor-pointer p-1.5 hover:bg-gray-100 rounded-full transition-all duration-200'><IoVideocam /></button>
        </div>
      </div>


      {/* Message Area */}
      <div onClick={() => setShowPicker(false)} ref={scrollRef} className='w-full flex-1 p-4 pb-24 relative overflow-y-auto'>

        {messages?.map((mess) => (
          mess.sender === userData._id
            ? <SenderMessage key={mess._id} image={mess.image} message={mess.message} onImageLoad={handleImageLoad} />
            : <RecieverMessage key={mess._id} image={mess.image} message={mess.message} onImageLoad={handleImageLoad} />
        ))}

      </div>

      {showPicker && (
        <div className='absolute shadow-lg rounded-2xl overflow-hidden bottom-21.25 left-6 z-50'>
          <EmojiPicker width={350} height={350} open={showPicker} onEmojiClick={onEmojiClick} />
        </div>
      )}

      {frontEndImage && (
        <img src={frontEndImage} alt="preview" className='w-80 shadow-lg rounded-2xl absolute bottom-21.25 right-8 z-50' />
      )}

      {/* TextBox */}
      <div className='h-15 flex justify-center items-center p-2 absolute bottom-3 left-4 right-4 shadow-md border border-gray-200 bg-white rounded-3xl m-2'>

        <form onSubmit={handleSendMessage} className='flex justify-center items-center gap-2 p-2 w-full'>
          <RiEmojiStickerFill onClick={() => setShowPicker(prev => !prev)} className='text-2xl cursor-pointer hover:text-blue-600' />
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder='Type a message...' className='outline-none border-none bg-transparent text-sm text-gray-700 placeholder-gray-400 w-full h-full' />
          <input type="file" hidden accept='image/*' ref={imageref} onChange={handleImage} />




          <IoImages onClick={() => { imageref.current.click() }} className='text-2xl cursor-pointer hover:text-blue-600' />
          <button type="submit" className='bg-blue-500 text-sm font-bold px-2 py-1 rounded-2xl text-white cursor-pointer hover:bg-blue-600 transition-colors'>Send</button>
        </form>
      </div>
    </div>
  )
}

export default MessageArea