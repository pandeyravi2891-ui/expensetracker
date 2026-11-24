const OTP = require("../Models/otpschema");
const { sendMail } = require("../Utils/Nodemailer");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const resendotp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required."
            });
        }

        const record = await OTP.findOne({ email });

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "No pending OTP found. Please signup first."
            });
        }

        if (record.blocked_time && record.blocked_time > new Date()) {
            const timeRemaining = Math.ceil((record.blocked_time - new Date()) / 1000);
            return res.status(403).json({
                success: false,
                message: `Too many attempts. Try again in ${timeRemaining} seconds.`
            })
        }

        if (record.resend_block && record.resend_block > new Date()) {
            const timeRemaining = Math.ceil((record.resend_block - new Date()) / 1000);
            return res.status(403).json({
                success: false,
                message: `Too many resend attempts. Try again in ${timeRemaining} seconds.`
            });
        }

        if (record.resend_counter >= 3) {
            record.resend_block = new Date(Date.now() + 24 * 60 * 60 * 1000);
            await record.save();
            return res.status(403).json({
                success: false,
                message: "Too many resend attempts. Try again later."
            })
        }
        else {
            await OTP.findOneAndUpdate(
                { email },
                {
                    resend_counter: record.resend_counter + 1
                }
            )
        }

        const otp = crypto.randomInt(100000, 1000000).toString();
        const otpHash = await bcrypt.hash(otp, 10);

        await OTP.findOneAndUpdate(
            { email },
            {
                otpHash,
                email,
                expires_at: new Date(Date.now() + 5 * 60 * 1000),
                attempts: 0,
                blocked_time: null
            },
            { upsert: true, new: true }
        );

        await sendMail({
            email,
            otp
        });

        return res.status(200).json({
            success: true,
            message: "OTP has been resent successfully."
        });
    } catch (err) {
        console.log("error in resend_otp controller:", err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

module.exports = { resendotp };
