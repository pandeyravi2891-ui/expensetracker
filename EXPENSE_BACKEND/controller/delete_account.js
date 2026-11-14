const User = require("../Models/userschema");
const Expense = require("../Models/expenseschema");
const OTP = require("../Models/otpschema"); 
const { getUserFromReq } = require("../middleware/auth");

const deleteAccount = async (req, res) => {
    try {
        const authUser = getUserFromReq(req);
        const email = authUser?.email || req.body?.email || req.query?.email;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required to delete account."
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            // Also clean up any orphan records just in case
            await Expense.deleteMany({ email });
            await OTP.deleteMany({ email });
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // Delete user, their OTPs, and all their expenses
        await User.findOneAndDelete({ email });
        await OTP.deleteMany({ email });
        await Expense.deleteMany({ email });

        // Clear the authentication cookie
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        });

        return res.status(200).json({
            success: true,
            message: "Account and all associated expenses deleted successfully."
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}; 

module.exports = { deleteAccount };
