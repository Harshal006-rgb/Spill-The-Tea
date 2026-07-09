import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {serverUrl} from "../config";
import { useDispatch ,useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';


function SignUp() {
    const navigate = useNavigate();
    let [show,setshow] = useState(false);
    let [userName,setUserName] = useState('');
    let [email,setEmail] = useState('');
    let [password,setPassword] = useState('');
    let [confirmPassword,setConfirmPassword] = useState(''); 
    let [err,setErr] = useState("");
    let dispatch = useDispatch();


    const handleShow = () =>{
        setshow(!show);
    }


    const handleSignUp = async(e)=>{
        e.preventDefault();
        setErr("");
        try{
            if(confirmPassword !== password) return setErr("Passwords do not match");

            let result = await axios.post(serverUrl + "/api/auth/signup",{userName,email,password},
            {withCredentials:true}); //needed to parse cookies`
            
            localStorage.setItem("token", result.data.token);
            dispatch(setUserData(result.data.user));
            //clear the fields
            setEmail("");
            setPassword("");
            setUserName("");
            setConfirmPassword("");
            navigate('/profile');
        }
        catch(error){
            setErr(error.response.data.message);
        }
    }


    
    return (
        <div className='h-screen w-screen flex items-center justify-center bg-green-300 '>
            <div className='flex flex-col w-125 h-125 gap-2 items-center justify-center bg-white p-8 rounded-lg shadow-2xl'>
                <h1 className='text-3xl font-bold'>Sign Up</h1>
                <form className='flex w-full flex-col gap-2 items-center justify-center p-4' action="" onSubmit={handleSignUp}>
                    <input className='w-full p-2 border border-gray-300 rounded-lg' value={userName} type='text' onChange={(e)=>setUserName(e.target.value)} placeholder='Enter your name' />
                    <input className='w-full p-2 border border-gray-300 rounded-lg' value={email} type='email' onChange={(e)=>setEmail(e.target.value)} placeholder='Enter your email' />
                    <input className='w-full p-2 border border-gray-300 rounded-lg' value={password} type='password' onChange={(e)=>setPassword(e.target.value)} placeholder='Enter your password' />
                    <div className='flex relative w-full gap-2'>
                        <input className='w-full p-2 border border-gray-300 rounded-lg' type={show?'text':'password'} value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} placeholder='Confirm your password' />
                        <span className='absolute text-gray-500 hover:text-black cursor-pointer top-2 right-5'onClick={handleShow}> {show? 'hide' : 'show'} </span>
                    </div>
                    {err && <p className='text-red-500'>{err}</p>}
                <button className='bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 transition-colors duration-300 cursor-pointer'>Sign Up</button>
                </form>
                <p>Already have an account ? <Link to='/login'><span className='text-blue-500 font-bold cursor-pointer'>Login</span></Link></p>
            </div>
        </div>
    )
}

export default SignUp;