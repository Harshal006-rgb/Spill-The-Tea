import { useEffect, useState } from "react"
import axios from "axios"
import { serverUrl } from "../config"
import { useDispatch, useSelector } from "react-redux"
import { setMessages } from "../redux/messageSlice"



const getMessages = () => {
    let dispatch = useDispatch();
    let { selectedUser } = useSelector((state) => state.user);
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                if (!selectedUser) {
                    return dispatch(setMessages([]));
                }

                let result = await axios.get(`${serverUrl}/api/message/get/${selectedUser._id}`, {
                    withCredentials: true
                });

                dispatch(setMessages(result.data.data));
            }
            catch (err) {
                console.log(err);
            }
        }
        fetchMessages();
    }, [selectedUser])
}


export default getMessages;