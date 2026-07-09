import User from "../models/use.model.js"
import uploadCloudinary from "../config/couldinary.js";

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }
        return res.status(200).json(user)
    }
    catch (err) {
        return res.status(500).json({ message: `user controller error ${err}` })
    }
}


export const editProfile = async (req, res) => {
    try {

        let { name } = req.body
        let image
        if (req.file) {
            image = await uploadCloudinary(req.file.path);
        }

        let updateFields = { name };
        if (image) {
            updateFields.image = image;
        }

        let user = await User.findByIdAndUpdate(req.userId, updateFields, { new: true })

        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }

        return res.status(200).json(user)

    }
    catch (error) {
        return res.status(500).json({ message: `edit profile controller error ${error}` })
    }
}


export const getOtherUsers = async(req,res)=>{
    try{

        let users = await User.find({
            _id: { $ne: req.userId } // 
        }).select("-password")

        if(!users){
            return res.status(400).json({message : "users not found"})
        }
        return res.status(200).json(users)

    }catch(error){
        return res.status(500).json({message: `get other users error ${error}`})
    }
}


export const search = async(req,res) =>{
    try {

        let {query} = req.query;
        if(!query){
            return res.status(400).json({message:"Query is required"})
        }

        let users = await User.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { userName: { $regex: query, $options: "i" } }
            ],
            _id: { $ne: req.userId }
        }).select("-password")

        if (!users){
            return res.status(400).json({message:"No users found"})
        }
        
        return res.status(200).json(users)

    } catch (error) {
        return res.status(500).json({message: `search controller error ${error}`})
    }
}