const User = require("../Models/userschema");
const OTP = require("../Models/otpschema");
const { sendMail } = require("../Utils/Nodemailer");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "expense_tracker_jwt_secret_key_2026";


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

       

        const otp = crypto.randomInt(100000, 1000000).toString();
        const otpHash = await bcrypt.hash(otp,10);

        const otpdb = await OTP.find({email}); 

        if(otpdb){
            await OTP.deleteMany({email});
        }

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
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        await User.findOneAndUpdate({ email: record.email }, { token }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Login Successfully.",
            token,
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

const logout = async (req, res) => {
    try {
        // Clear cookie set by cookie-parser
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const checkAuth = async (req, res) => {
    try {
        const { getUserFromReq } = require("../middleware/auth");
        const authUser = getUserFromReq(req);

        if (!authUser) {
            return res.status(401).json({
                success: false,
                message: "No active session found."
            });
        }

        const foundUser = (authUser.id ? await User.findById(authUser.id) : null) ||
                          (authUser.email ? await User.findOne({ email: authUser.email }) : null);

        if (!foundUser) {
            return res.status(401).json({
                success: false,
                message: "User session expired or user not found."
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                firstName: foundUser.firstName,
                lastName: foundUser.lastName,
                email: foundUser.email,
                profileImage: foundUser.profileImage || "",
                bio: foundUser.bio || ""
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = { user, login, logout, checkAuth };
