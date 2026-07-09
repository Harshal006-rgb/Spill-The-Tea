import jwt from "jsonwebtoken";

const isAuth = async(req,res,next) =>{
    try{
        let token = req.cookies.token;
        if(!token){
            return res.status(400).json({message:"Please login first"});
        }
        let verifyToken = await jwt.verify(token,process.env.JWT_SECRET);
        req.userId = verifyToken.userId;
        
        next();
    }
    catch(err){
        res.status(500).json({message:`is auth middleware error ${err}`})
    }
}

export default isAuth;