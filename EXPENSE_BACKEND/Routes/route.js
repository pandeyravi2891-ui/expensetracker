const express = require("express");

const router = express.Router();

const {user,login,logout,checkAuth} = require("../controller/user");
const {otpverify} = require("../controller/otpVerification");
const {forgotpassotp} = require("../controller/forgotpasswordotp");
const {resetotpverify} = require("../controller/resetotpverification");
const {resetpass} = require("../controller/resetpassword");
const {resendotp} = require("../controller/resend_otp");
const {expenseadd} = require("../controller/expense_add");
const {fetchexpense, deleteexpense, updateexpense} = require("../controller/fetch_expense");
const {deleteAccount} = require("../controller/delete_account");
const upload = require("../middleware/upload");
const { uploadProfileImage, updateProfile, getProfile } = require("../controller/profile");
const { auth } = require("../middleware/auth");


router.post("/user",user);
router.post("/otp_verify",otpverify);
router.post("/login",login);
router.post("/logout",logout);
router.get("/logout",logout);
router.get("/check-auth",checkAuth);
router.post("/check-auth",checkAuth);
router.post("/password_reset",forgotpassotp);
router.post("/resetotp_verify",resetotpverify);
router.post("/resetpass",resetpass);
router.post("/resend_otp",resendotp);

// Profile routes
router.post(
    "/upload-profile",
    upload.single("profileImage"),
    uploadProfileImage
);
router.post("/update-profile", updateProfile);
router.put("/update-profile", updateProfile);
router.get("/get-profile", getProfile);
router.post("/get-profile", getProfile);

// Expense routes
router.post("/expense_add",expenseadd);
router.get("/fetch_expense",fetchexpense);
router.post("/fetch_expense",fetchexpense);
router.delete("/expense/:id", deleteexpense);
router.put("/expense/:id", updateexpense);
router.delete("/delete_account", deleteAccount);
router.post("/delete_account", deleteAccount);

module.exports = router;
