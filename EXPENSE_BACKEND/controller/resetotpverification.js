const OTP = require("../Models/otpschema");
const bcrypt = require("bcrypt");

const resetotpverify = async(req,res) => {
    try{
        const {email,entered_otp} = req.body;

        if(!email || !entered_otp){
            return res.status(400).json({
                success : false,
                message : "All fields are required."
            })
        }

        const record = await OTP.findOne({email});

        if(!record){
             return res.status(400).json({
                success : false,
                message : "User not found."
            })
        }

        if (record.expires_at && record.expires_at < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP expired"
            });
        }

        const isMatch = await bcrypt.compare(
            entered_otp,
            record.otpHash
        );

        if(!isMatch){
            return res.status(400).json({
                success : false,
                message : "Invalid otp."
            })
        }

        return res.status(200).json({
            success : true,
            message : "OTP verified."
        })

    }catch(err){
        console.log("error in reset otp verify controller:", err);
        return res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

module.exports = {resetotpverify};
