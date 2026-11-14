const OTP = require("../Models/otpschema");
const User = require("../Models/userschema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "expense_tracker_jwt_secret_key_2026";

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

        // Generate JWT token and set authentication cookie
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        await User.findByIdAndUpdate(newUser._id, { token });

        return res.status(200).json({
            success: true,
            message: "OTP verified.",
            token,
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
