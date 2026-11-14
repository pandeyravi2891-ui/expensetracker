const Expense = require("../Models/expenseschema");
const { getUserFromReq } = require("../middleware/auth");

const expenseadd = async(req,res) =>{
    try{
        // 1. Read user from cookie (via cookie-parser), or fallback to request body
        const authUser = getUserFromReq(req);
        const { amount, category, date, description } = req.body;
        const email = authUser?.email || req.body?.email;

        if(!email || !amount || !category || !date){
            return res.status(400).json({
                success : false,
                message : "Email, amount, category, and date are required."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const newExpense = await Expense.create({
            email: normalizedEmail,
            amount: Number(amount),
            category,
            date: new Date(date),
            description: description || ""
        });

        return res.status(200).json({
            success : true,
            message : "Expense added successfully.",
            expense: newExpense
        });
    }catch(err){
        console.log("error in expenseadd:", err);
        return res.status(500).json({
            success : false,
            message : err.message
        });
    }
}

module.exports = {expenseadd};
