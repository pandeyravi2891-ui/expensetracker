const mongoose = require("mongoose");

const otp = new mongoose.Schema({
    otpHash : {
        type : String,
        required : true
    },

    email : {
        type : String,
        required : true
    },

    date: {
        type: Date,
        default: Date.now
    },

    expires_at : {
        type : Date,
        required : true
    },

     firstName :{
        type : String,
        required : true,
    },

    lastName : {
        type : String,
        required : true,
    },

    password : {
        type : String,
        required : true,
    },

    confirm_password : {
        type : String,
        required : true,
    },

    token : {
        type : String
    }
})

module.exports = mongoose.model("OTP",otp);