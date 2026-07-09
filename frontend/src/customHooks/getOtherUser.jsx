import { useEffect, useState } from "react"
import axios from "axios"
import { serverUrl } from "../config"
import { useDispatch, useSelector } from "react-redux"
import { setOtherUsers } from "../redux/userSlice";


const getOtherUser = () => {
    let dispatch = useDispatch();
    let { userData } = useSelector((state) => state.user);
    useEffect(() => {
        if (!userData) return;
        const fetchUser = async () => {
            try {
                let result = await axios.get(`${serverUrl}/api/user/other`, {
                    withCredentials: true
                });
                dispatch(setOtherUsers(result.data));
            }
            catch (err) {
                console.log(err);
            }
        }
        fetchUser();
    }, [userData])
}


export default getOtherUser;