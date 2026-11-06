const nodemailer = require("nodemailer");

const sendMail = async ({email, otp}) => {
  try {
    const mailUser = process.env.MAIL_USER;
    const mailPass = process.env.MAIL_PASS;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: mailUser,
        pass: mailPass,
      },
    });

    const info = await transporter.sendMail({
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

    console.log("Mail sent successfully. Message ID:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending mail:", error);
    throw error;
  }
};

const sendresetotp = async ({email, otp}) => {
  try {
    const mailUser = process.env.MAIL_USER;
    const mailPass = process.env.MAIL_PASS;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: mailUser,
        pass: mailPass,
      },
    });

    const info = await transporter.sendMail({
      to: email,
      subject: "Password Reset OTP",
      html: `
            <h2>Password Reset OTP</h2>
            <p>Your OTP for resetting password is:</p>
            <h1>${otp}</h1>
            <p>This OTP is valid for 5 minutes.</p>
            <p>Please do not share your OTP with anyone.</p>
       `
    });

    console.log("Mail sent successfully. Message ID:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending mail:", error);
    throw error;
  }
};

const resetpassmail = async ({email}) => {
  try {
    const mailUser = process.env.MAIL_USER;
    const mailPass = process.env.MAIL_PASS;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: mailUser,
        pass: mailPass,
      },
    });

    const info = await transporter.sendMail({
      to: email,
      subject: "Password Reset Successfully",
      html: `
            <h2>Password Reset Successfully</h2>
            <p>Your password has been changed successfully.</p>
       `
    });

    console.log("Mail sent successfully. Message ID:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending mail:", error);
    throw error;
  }
};

module.exports = {
  sendMail,
  sendresetotp,
  resetpassmail
};
