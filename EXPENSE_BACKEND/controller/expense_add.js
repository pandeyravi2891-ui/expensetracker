const Expense = require("../Models/expenseschema");

const expenseadd = async(req,res) =>{
    try{
        const {email,amount,category,date,description} = req.body;

        if(!email || !amount || !category || !date){
            return res.status(400).json({
                success : false,
                message : "Email, amount, category, and date are required."
            });
        }

        const newExpense = await Expense.create({
            email,
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
