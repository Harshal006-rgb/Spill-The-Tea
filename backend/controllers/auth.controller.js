import genToken from "../config/token.js";
import User from "../models/use.model.js"
import bcrypt from "bcryptjs"

export const signUp = async (req, res) => {
    try {
        const { userName, email, password } = req.body

        // unique user
        const checkUserByUserName = await User.findOne({ userName });
        if (checkUserByUserName) {
            return res.status(400).json({ message: "user is already exists" });
        }
        // unique email
        const checkUserByEmail = await User.findOne({ email });
        if (checkUserByEmail) {
            return res.status(400).json({ message: "email is already exists" });
        }
        //password length check
        if (password.length < 6) {
            return res.status(400).json({ message: "password is too short" });
        }
        //hashing the password
        const hashedPassword = await bcrypt.hash(password, 10);  //salth length -> 10;

        //create new user
        const user = new User({
            userName,
            email,
            password: hashedPassword
        })
        await user.save();

        //generating token
        const token = await genToken(user._id);

        //saving the cookie in key pair token : generated token
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: false
        })

        //201->successfully singup
        return res.status(201).json(user)

    }
    catch (error) {
        return res.status(500).json({ message: `singup error ${error}` })

    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email });
        //check for email
        if (!user) {
            return res.status(400).json({ message: "user does not exist" });
        }
        //password check
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "incorrect password" });
        }
        //generating token
        const token = await genToken(user._id);

        //saving the cookie in key pair token : generated token
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: false
        })
        //200->no problem "ok"
        return res.status(200).json(user)

    }
    catch (error) {
        return res.status(500).json({ message: `login error ${error}` })
    }
}


export const logOut = async (req, res) => {
    try {
        // res.cookie("token","");
        res.clearCookie("token")
        return res.status(200).json({ message: "successfully loged out" })
    }
    catch (error) {
        return res.status(500).json({ message: `logout error ${error}` })

    }
}