import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../models/User.js";

// Register User
export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;

        const alreadyExistEmail = await User.findOne({email});

        if(alreadyExistEmail) return res.status(400).json({message: "Email Already Exist"});

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10),
            impressions: Math.floor(Math.random() * 10)
        });

        const savedUser = await newUser.save();
        res.status(200).json(savedUser);

    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Cannot register User " + error});
    }
}

// Login Route
export const login = async (req,res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email: email});

        if(!user) return res.status(400).json({message: "No User Found"});

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) return res.status(400).json({message: "Invalid Credentials"});

        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET);

        user.password = undefined; // in order to not send password as a responce 

        res.status(200).json({token, user});

    } catch (error) {
        res.status(500).json({message: "Cannot login User"});
    }
}