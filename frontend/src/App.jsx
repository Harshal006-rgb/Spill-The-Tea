import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import Profile from './pages/Profile.jsx'
import Home from './pages/Home.jsx'
import getCurrentUser from './customHooks/getCurrentUser'
import getOtherUser from './customHooks/getOtherUser'
import { useDispatch, useSelector } from 'react-redux'
import { io } from "socket.io-client"
import { serverUrl } from './config.js'
import { setSocket, setOnlineUsers } from './redux/userSlice.js'

function App() {
  getCurrentUser();
  getOtherUser();
  let { userData, socket, onlineUsers, isCheckingAuth } = useSelector((state) => state.user);
  let dispatch = useDispatch();

  useEffect(() => {
    if (userData) {
      const socketio = io(`${serverUrl}`, {
        query: {
          userId: userData?._id
        }
      });
      dispatch(setSocket(socketio));

      socketio.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    }
    else{
      if(socket){
        socket.close();
        dispatch(setSocket(null));
      }
    }
  }, [userData, dispatch])

  if (isCheckingAuth) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-200">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

return (
  <Routes>
    <Route path='/login' element={!userData ? <Login /> : <Navigate to='/' />} />
    <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to='/profile' />} />
    <Route path='/profile' element={userData ? <Profile /> : <Navigate to='/login' />} />
    <Route path='/' element={userData ? <Home /> : <Navigate to='/login' />} />
  </Routes>
)

}

export default App
