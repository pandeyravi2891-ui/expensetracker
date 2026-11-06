const OTP = require("../Models/otpschema");
const {sendMail} = require("../Utils/Nodemailer");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const resendotp = async(req,res) =>{
    try{
        const {email} = req.body;

        if(!email){
            return res.status(400).json({
                success : false,
                message : "Email is required."
            });
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

        await sendMail({
            email,
            otp
        });

        return res.status(200).json({
            success : true,
            message : "OTP has been resent successfully."
        });
    }catch(err){
        console.log("error in resend_otp controller:", err);
        return res.status(500).json({
            success : false,
            message : err.message
        });
    }
}

module.exports = {resendotp};
