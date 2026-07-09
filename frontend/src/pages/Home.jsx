import React from 'react'
import Sidebar from '../components/Sidebar'
import MessageArea from '../components/MessageArea'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import getMessages from '../customHooks/getMessages'

const Home = () => {
  getMessages();
  let { userData } = useSelector((state) => state.user);
  if (!userData) {
    return <Navigate to="/login" />
  }
  return (

    <div className='w-screen h-screen flex'>
      <Sidebar />
      <MessageArea />
    </div>
  )
}
export default Home