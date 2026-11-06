const User = require("../Models/userschema");
const OTP = require("../Models/otpschema");
const { sendresetotp } = require("../Utils/Nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const forgotpassotp = async(req,res) =>{
    try{
        const {email} = req.body;

        if(!email){
            return res.status(400).json({
                success : false,
                message : "All fields are required."
            })
        }

        const record = await User.findOne({email});

        if(!record){
            return res.status(400).json({
                success : false,
                message : "User not found."
            })
        }

        const otp = crypto.randomInt(100000, 1000000).toString();
        const otpHash = await bcrypt.hash(otp,10);

        await OTP.findOneAndUpdate(
            {email},
            {
                otpHash,
                email,
                expires_at: new Date(Date.now() + 5 * 60 * 1000)
            },
            {upsert: true, new: true}
        );

        await sendresetotp({email,otp});

        return res.status(200).json({
            success : true,
            message : "Reset OTP sent successfully."
        })

    }catch(err){
        console.log("error in forgot password otp controller:", err);
        return res.status(500).json({
            success : false,
            message : err.message || "Error in sending reset OTP."
        })
    }
}

module.exports = {forgotpassotp};
