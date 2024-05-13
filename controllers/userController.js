import { User } from "../models/user.Model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



// register api
export const register = async (req, res) => {
    try {
        const { fullName, userName, password, confirmPassword, gender, profilePhoto } = req.body;
        if (!fullName || !userName || !password || !confirmPassword || !gender) {
            return res.status(400).json({ message: "All fields are required." })
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password not matched!" })
        }

        const user = await User.findOne({ userName });
        if (user) {
            return res.status(400).json({ message: "Username already exist." })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        // profilePhoto
        const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
        const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${userName}`;

        await User.create({
            fullName,
            userName,
            password: hashedPassword,
            profilePhoto: profilePhoto ? profilePhoto : gender === "female" ? femaleProfilePhoto : maleProfilePhoto,
            gender
        });
        return res.status(201).json({ message: "User created successfully!", success: true })
    }
    catch (error) {
        console.log(error)
    }
};




// login api

export const login = async (req, res) => {
    try {
        const { userName, password } = req.body;
        if (!userName || !password) {
            return res.status(400).json({ message: "All fields are required." })
        }
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect username or password.",
                success: false
            })
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password)
        if (!isPasswordMatched) {
            return res.status(400).json({
                message: "Incorrect username or password.",
                success: false
            })
        };
        const tokenData = {
            userId: user._id
        };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            _id: user._id,
            userName: user.userName,
            fullName: user.fullName,
            profilePhoto: user.profilePhoto
        })
    }
    catch (error) {
        console.log(error)
    }
};



// Logout api

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "User successfully logged out!"
        })
    } catch (error) {
        console.log(error)
    }
};


export const getOtherUsers = async (req, res) => {
    try {
        const loggedInUserId = req.id;
        const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        return res.status(200).json(otherUsers)
    } catch (error) {
        console.log(error)
    }
};