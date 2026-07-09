import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import dp from "../assets/dp.jpg";
import { useNavigate } from 'react-router-dom';
import { LuSearch } from "react-icons/lu";
import { TbLogout2 } from "react-icons/tb";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setOtherUsers, setSelectedUser, setUserData, setSearchData } from '../redux/userSlice';
import { serverUrl } from '../config';

const Sidebar = () => {
    let { userData, otherUsers, selectedUser, onlineUsers, searchData } = useSelector(state => state.user);
    let navigate = useNavigate();
    let dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState("");


    const handleLogout = async () => {
        try {

            let result = await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
            localStorage.removeItem("token");
            dispatch(setUserData(null));
            dispatch(setOtherUsers(null));
            navigate("/login");

        } catch (error) {
            console.log(error.message);
        }
    }
    const handleSearch = async (query) => {
        try {

            let result = await axios.get(`${serverUrl}/api/user/search?query=${query}`, { withCredentials: true })
            dispatch(setSearchData(result.data));
            console.log(result.data);
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        if (searchQuery.length > 0) {
            handleSearch(searchQuery);
        }
        else {
            dispatch(setSearchData(null));
        }
    }, [searchQuery])



    return (
        <div className={`md:w-[30%] w-screen h-screen flex-col bg-slate-200 ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
            <div onClick={handleLogout}> <TbLogout2 className='w-12 h-12 p-3 z-50 bg-white shadow-lg fixed bottom-5 left-5 cursor-pointer hover:text-white hover:bg-blue-500 rounded-full  transition-all duration-200' /></div>
            <div className=' bg-blue-500 w-full shadow-lg shrink-0' >

                <h1 className='text-2xl font-bold text-center p-3 '> Spill The Tea </h1>

                <div className='w-full flex items-center justify-between px-4'>
                    <h1 className='text-xl font-bold text-center p-3 '>Hii , {userData?.name || "User"} </h1>
                    <div onClick={() => navigate('/profile')} className='w-16 h-16 bg-gray-200 rounded-full overflow-hidden border-3 border-white flex justify-center items-center cursor-pointer hover:scale-105 transition-transform duration-200'>
                        <img src={userData?.image || dp} alt="dp" className='w-full h-full object-cover' />
                    </div>
                </div>

                <div className='w-full px-4 mt-2'>
                    <div className='flex items-center bg-white rounded-full px-3 py-1 shadow-md focus-within:ring-2 focus-within:ring-blue-300 transition-all duration-200'>
                        <LuSearch className='text-gray-500 text-xl mr-2 cursor-pointer' />
                        <input type="text" onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery} placeholder='Search...' className='w-full bg-transparent outline-none py-2 text-sm text-gray-700 placeholder-gray-400' />

                    </div>
                </div>

                {/* Search Results */}
                <div hidden={!searchData} className='m-4 p-4 bg-gray-200 flex flex-col gap-2 rounded-2xl'>
                    {searchData?.length == 0 && (<h1>No users found</h1>)}
                    {searchData?.map((user) => (
                        <div key={user._id} onClick={() => dispatch(setSelectedUser(user))} className=' flex items-center gap-4 p-3 bg-white hover:bg-blue-200 rounded-2xl cursor-pointer transition-all duration-200 border border-transparent hover:shadow-lg hover:border-gray-100'>
                            <div className='relative shrink-0'>
                                <img className='w-12 h-12 rounded-full border-2 border-white shadow-md object-cover' src={user.image || dp} alt="dp" />
                            </div>
                            <div className='flex flex-col overflow-hidden'>
                                <h2 className='font-semibold text-gray-800 text-sm truncate'>{user.name || "User"}</h2>
                                <p className='text-xs text-gray-500 truncate'>@{user.userName}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div hidden={searchData} className='flex p-5 overflow-y-auto gap-4 items-center justify-center'>
                    {otherUsers?.map((user) =>
                        onlineUsers?.includes(user._id) && (
                            <div key={user._id} onClick={() => dispatch(setSelectedUser(user))} className='shrink-0 relative'>
                                <img className='w-14 h-14 rounded-full border-2 border-white shadow-lg object-cover' src={user.image || dp} alt="dp" />
                                <span className='absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full'></span>
                            </div>
                        )
                    )}
                </div>


            </div>


            <div className='w-full flex-1 min-h-0 flex flex-col gap-2 p-4 overflow-y-auto'>
                {otherUsers?.map((user) => (
                    <div key={user._id} onClick={() => dispatch(setSelectedUser(user))} className='flex items-center gap-4 p-3 bg-white hover:bg-blue-200 rounded-2xl cursor-pointer transition-all duration-200 border border-transparent hover:shadow-lg hover:border-gray-100'>
                        <div className='relative shrink-0'>
                            <img className='w-12 h-12 rounded-full border-2 border-white shadow-md object-cover' src={user.image || dp} alt="dp" />
                        </div>
                        <div className='flex flex-col overflow-hidden'>
                            <h2 className='font-semibold text-gray-800 text-sm truncate'>{user.name || "User"}</h2>
                            <p className='text-xs text-gray-500 truncate'>@{user.userName}</p>
                        </div>
                    </div>
                ))}
            </div>

        </div >
    )
}

export default Sidebar