const User = require("../Models/userschema");
const OTP = require("../Models/otpschema");
const { sendMail } = require("../Utils/Nodemailer");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");


const user = async(req,res) =>{
    try{
        const {firstName , lastName , email , password , confirm_password} = req.body;

        if(!firstName || !lastName || !email || !password || !confirm_password){
            return res.status(400).json({
                success : false,
                message : "All fields are required.",
            })
        }

        const record = await User.findOne({email});

        if(record){
            return res.status(400).json({
                success : false,
                message : "User already exist."
            })
        }

        if(password != confirm_password){
            return res.status(400).json({
                success : false,
                message : "Password and Confirm password do not match."
            })
        }

        const hashedPassword = await bcrypt.hash (password,10);
        const hashedconfirm_password = await bcrypt.hash(confirm_password,10);

            const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        // await User.create({
        //     firstName,
        //     lastName,
        //     email,
        //     password : hashedPassword,
        //     confirm_password : hashedconfirm_password,
        //     token
        // })

        const otp = crypto.randomInt(100000, 1000000).toString();
        const otpHash = await bcrypt.hash(otp,10);

        await OTP.create({
            otpHash : otpHash,
            email ,
            expires_at: new Date(Date.now() + 1 * 60 * 1000),
            firstName,
            lastName,
            password : hashedPassword,
            confirm_password : hashedconfirm_password,
            token
        })

        await sendMail({
            email,
            otp
        })

        return res.status(200).json({
            success : true,
            message : "user created successfully.",
        })
    }catch(err){
        console.log("error in user controller.",err);

        return res.status(500).json({
            success : false,
            message : err.message,
        })
    }
}

const login = async(req,res) =>{
    try{

        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success : false,
                message : "All fields are required."
            })
        }

        const record = await User.findOne({email});

        if(!record){
            return res.status(400).json({
                success : false,
                message : "User Not Found."
            })
        }

        const isMatch = await bcrypt.compare(
            password,
            record.password
        )

        if(!isMatch){
            return res.status(400).json({
                success : false,
                message : "Invalid password."
            })
        }

        const token = jwt.sign(
            { id: record._id, email: record.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        await User.findOneAndUpdate({ email: record.email }, { token }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Login Successfully.",
            user: {
                firstName: record.firstName,
                lastName: record.lastName,
                email: record.email,
                profileImage: record.profileImage || "",
                bio: record.bio || ""
            }
        });

    }catch(err){
        return res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

module.exports = {user,login};
