const mongoose = require("mongoose");

const expenseschema = new mongoose.Schema({

    email : {
        type : String,
        required : true
    },

    amount :{
        type : Number,
        required : true
    },

    category : {
        type : String,
        required : true
    },

    date : {
        type : Date,
        required : true
    },

    description : {
        type : String,
    }
})

module.exports = mongoose.model("Expense" , expenseschema);