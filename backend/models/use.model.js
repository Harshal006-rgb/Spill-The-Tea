import mongoose from "mongoose"

const useSchema = new mongoose.Schema({
    name:{
        type:String
    },
    userName:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        default:""
    }, 
},{timestamps:true}) //tracks the time of creation / updatation

const User = mongoose.model("User",useSchema)
export default User