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

    token : {
        type : String
    },

    attempts :{
        type : Number,
        default : 0
    },

    blocked_time : {
        type: Date,
        default : null
    },

    resend_counter :{
        type : Number,
        default : 0
    },

    resend_block : {
        type : Date,
        default : null
    }
})

module.exports = mongoose.model("OTP",otp);