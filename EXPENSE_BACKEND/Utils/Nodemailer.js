
const nodemailer = require("nodemailer");

const mailUser = process.env.MAIL_USER;
const mailPass = process.env.MAIL_PASS;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: mailUser,
        pass: mailPass,
    },
});

const sendMail = async ({ email, otp }) => {
    const info = await transporter.sendMail({
        from: mailUser,
        to: email,
        subject: "Email Verification OTP",
        html: `
            <h2>Email Verification</h2>
            <p>Your OTP for email verification is:</p>
            <h1>${otp}</h1>
            <p>This OTP is valid for 5 minutes.</p>
            <p>Please do not share your OTP with anyone.</p>
        `
    });

    return info;
};

const sendresetotp = async ({ email, otp }) => {
    const info = await transporter.sendMail({
        from: mailUser,
        to: email,
        subject: "Password Reset OTP",
        html: `
            <h2>Password Reset OTP</h2>
            <p>Your OTP is:</p>
            <h1>${otp}</h1>
            <p>This OTP is valid for 5 minutes.</p>
        `
    });

    return info;
};

const resetpassmail = async ({ email }) => {
    const info = await transporter.sendMail({
        from: mailUser,
        to: email,
        subject: "Password Reset Successfully",
        html: `
            <h2>Password Reset Successfully</h2>
            <p>Your password has been changed successfully.</p>
        `
    });

    return info;
};

module.exports = {
    sendMail,
    sendresetotp,
    resetpassmail
};
