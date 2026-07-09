import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from "../config";
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';

function Login() {
    const navigate = useNavigate();
    let [show, setshow] = useState(false);
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [err, setErr] = useState("");
    let dispatch = useDispatch();


    const handleShow = () => {
        setshow(!show);
    }


    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            let result = await axios.post(serverUrl + "/api/auth/login", { email, password },
                { withCredentials: true }); //needed to parse cookies

            dispatch(setUserData(result.data));

            //clear the fields
            setEmail("");
            setPassword("");
            // alert("Login successful! ");
            // navigate('/');
        }
        catch (error) {
            setErr(error.response.data.message);
        }
    }

    return (
        <div className='h-screen w-screen flex items-center justify-center bg-green-300 '>
            <div className='flex flex-col w-125 h-125 gap-2 items-center justify-center bg-white p-8 rounded-lg shadow-2xl'>
                <h1 className='text-3xl font-bold'>Login</h1>
                <form onSubmit={handleLogin} className='flex w-full flex-col gap-2 items-center justify-center p-4'>
                    <input className='w-full p-2 border border-gray-300 rounded-lg' value={email} type='email' onChange={(e) => setEmail(e.target.value)} placeholder='Enter your email' />

                    <div className='flex relative w-full gap-2'>
                        <input className='w-full p-2 border border-gray-300 rounded-lg' type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter your password' />
                        <span className='absolute text-gray-500 hover:text-black cursor-pointer top-2 right-5' onClick={handleShow}>
                            {show ? 'hide' : 'show'}
                        </span>
                    </div>
                    <button className='bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 transition-colors duration-300 cursor-pointer'>Login</button>
                    {err && <p className='text-red-500'>{err}</p>}
                </form>
                <p>Don't have an account ? <Link to='/signup'><span className='text-blue-500 font-bold cursor-pointer'>Sign Up</span></Link></p>
            </div>
        </div>
    )
}

export default Login