import React, { useState, useRef } from 'react'
import dp from "../assets/dp.jpg";
import { FaCameraRetro, FaArrowLeft } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { serverUrl } from '../config';
import { setUserData } from '../redux/userSlice';

const Profile = () => {

  const { userData } = useSelector((state) => state.user)

  let [name, setName] = useState(userData?.name || "");
  let [profileImg, setProfileImg] = useState(userData?.image || dp)
  let [backendImg, setBackendImg] = useState(null);
  let image = useRef(null);
  let dispatch = useDispatch();
  let [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImg(file);
    setProfileImg(URL.createObjectURL(file));
  }

  const handleProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let formData = new FormData();
      formData.append("name", name);
      if (backendImg) {
        formData.append("image", backendImg);
      }
      let result = await axios.put(`${serverUrl}/api/user/profile`, formData, { withCredentials: true });
      setSaving(false);
      dispatch(setUserData(result.data));
      navigate('/');


    } catch (error) {
      setSaving(false);
      console.log(error);


    }
  }

  return (
    <div className='h-screen w-screen flex items-center justify-center bg-green-300 '>
      <div className='flex flex-col w-125 h-125 gap-2 items-center bg-white p-8 rounded-lg shadow-2xl relative'>
        <FaArrowLeft onClick={() => navigate('/')} className='absolute top-3 left-3 text-3xl cursor-pointer hover:text-white hover:bg-green-300 rounded-full p-2 transition-all duration-200' />
        <div className='relative w-50 h-50'>
          {/* Circular profile image */}
          <div className='w-full h-full bg-gray-200 rounded-full shadow-gray-500 shadow-lg overflow-hidden border-3 border-white flex justify-center items-center'>
            <img src={profileImg} alt="dp" className='w-full h-full object-cover' />
          </div>
          {/* Floating camera icon at the bottom-right */}
          <button type="button" onClick={() => image.current.click()} className='absolute bottom-1 right-1 text-gray-600 bg-green-300 hover:text-white hover:bg-green-600 rounded-full p-3 cursor-pointer shadow-md border-2 border-white transition-all duration-200 flex items-center justify-center hover:scale-105'>
            <FaCameraRetro className='text-lg' />
          </button>
        </div>
        <div className='w-full'>
          <form onSubmit={handleProfile} className='flex w-full flex-col gap-2 items-center justify-center p-4'>
            <input type="file" accept='image/*' className='hidden' ref={image} onChange={handleImage} />
            <input className='w-full p-2 border border-gray-300 rounded-lg' type='text' value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter your name' />
            <input className='w-full p-2 border border-gray-300 rounded-lg text-gray-500' type='text' value={userData?.userName || ""} readOnly placeholder='Enter your Username' />
            <input className='w-full p-2 border border-gray-300 rounded-lg text-gray-500' type='email' value={userData?.email || ""} readOnly placeholder='Enter your email' />

            <button disabled={saving ? true : false} className='bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 transition-colors duration-300 cursor-pointer'>{saving ? ' Saving...' : "Save"}</button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile 