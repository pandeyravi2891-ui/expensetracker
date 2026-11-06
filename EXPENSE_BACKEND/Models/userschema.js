const mongoose = require("mongoose");

const user = new mongoose.Schema({
    firstName :{
        type : String,
        required : true,
    },

    lastName : {
        type : String,
        required : true,
    },

    email : {
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
    },

    bio: {
        type: String,
        default: ""
    },

    profileImage: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model("User", user);
