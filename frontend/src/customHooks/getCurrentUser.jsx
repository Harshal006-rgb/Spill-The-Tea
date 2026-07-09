import { useEffect, useState } from "react"
import axios from "axios"
import { serverUrl } from "../config"
import { useDispatch } from "react-redux"
import { setUserData, setIsCheckingAuth } from "../redux/userSlice";


const getCurrentUser = () => {
    let dispatch = useDispatch();
    useEffect(() => {
        const fetchUser = async () => {
            try {
                let result = await axios.get(`${serverUrl}/api/user/current`,{withCredentials: true});
                dispatch(setUserData(result.data));
            }
            catch (err) {
                console.log(err);
            }
            finally {
                dispatch(setIsCheckingAuth(false));
            }
        }
        fetchUser();
    }, [])
}

export default getCurrentUser;