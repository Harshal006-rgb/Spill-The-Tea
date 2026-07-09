import uploadCloudinary from "../config/couldinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";


export const sendMessage = async(req,res)=>{
    try {

        let sender = req.userId;
        let {receiver} = req.params;
        let {message} = req.body;
    
        let image;
        if(req.file){
            image = await uploadCloudinary(req.file.path)
        }

        //finding Conversation
        let conversation = await Conversation.findOne({
            participants:{$all:[sender,receiver]}
        })

        let newMessage = new Message({
            sender,
            receiver,
            message,
            image
        })

        await newMessage.save();

        if(!conversation){
            let newconversation = new Conversation({
                participants:[sender,receiver],
                messages:[newMessage._id]
            })
            await newconversation.save();
        }else{
            conversation.messages.push(newMessage._id);
            await conversation.save();
        }

        const receiverSocketId = getReceiverSocketId(receiver);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }

        return res.status(200).json({message:"Message sent successfully",data:newMessage});

    } catch (error) {
        console.error("Error in sendMessage controller:", error);
        return res.status(500).json({message:"Internal server error"})
    }
}

export const getMessage = async( req,res )=>{
    try {

        let sender = req.userId;
        let {receiver} = req.params;

        let conversation = await Conversation.findOne({
            participants:{$all:[sender,receiver]}
        }).populate("messages")

        if(!conversation){
            return res.status(200).json({message:"No messages found",data:[]})
        }
        
        return res.status(200).json({message:"Messages fetched successfully",data:conversation.messages})
        
    } catch (error) {
        console.error("Error in getMessage controller:", error);
        return res.status(500).json({message:"Internal server error"})
    }
}


