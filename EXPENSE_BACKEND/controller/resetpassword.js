const User = require("../Models/userschema");
const bcrypt = require("bcrypt");
const { resetpassmail } = require("../Utils/Nodemailer");

const resetpass = async(req,res) =>{
    try{

        const {email,password,confirm_password} = req.body;

        if(!email || !password || !confirm_password){
            return res.status(400).json({
                success : false,
                message : "All fields are required."
            })
        }

        if(password !== confirm_password){
            return res.status(400).json({
                success : false,
                message : "Password and Confirm password do not match."
            })
        }

        const hashedpass = await bcrypt.hash(password,10);
        const hashedconfirmpass = await bcrypt.hash(confirm_password,10);

        const updateuser = await User.findOneAndUpdate(
            {email},
            {password: hashedpass, confirm_password: hashedconfirmpass},
            {new: true}
        );

        if(!updateuser){
            return res.status(400).json({
                success : false,
                message : "No such email found."
            })
        }

        await resetpassmail({email});

        return res.status(200).json({
            success : true,
            message : "Password Reset Successfully."
        })

    }catch(err){
        console.log("error in reset password controller:", err);
        return res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

module.exports = {resetpass};
