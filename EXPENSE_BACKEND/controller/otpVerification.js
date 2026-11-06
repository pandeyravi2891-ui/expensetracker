const OTP = require("../Models/otpschema");
const User = require("../Models/userschema");
const bcrypt = require("bcrypt");

const otpverify = async (req, res) => {
    try {
        const { entered_otp, email } = req.body;

        if (!entered_otp || !email) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const record = await OTP.findOne({ email });

        if (!record) {
            return res.status(400).json({
                success: false,
                message: "User not found or OTP already verified."
            });
        }

        if (record.expires_at < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP expired"
            });
        }

        const isMatch = await bcrypt.compare(
            entered_otp,
            record.otpHash
        );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        const newUser = await User.create({
            firstName: record.firstName,
            lastName: record.lastName,
            email: record.email,
            password: record.password,
            confirm_password: record.confirm_password,
            profileImage: "",
            bio: ""
        });

        // await OTP.deleteMany({ email: record.email });

        return res.status(200).json({
            success: true,
            message: "OTP verified.",
            user: {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                profileImage: "",
                bio: ""
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = { otpverify };
