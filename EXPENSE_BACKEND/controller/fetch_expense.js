const Expense = require("../Models/expenseschema");

const fetchexpense = async(req,res) =>{
    try{
        const email = req.query.email || req.body?.email;

        if(!email){
            return res.status(400).json({
                success: false,
                message: "Email is required to fetch expenses"
            });
        }

        const expenses = await Expense.find({ email }).sort({ date: -1 });

        return res.status(200).json({
            success: true,
            message: "Expenses fetched successfully",
            expenses
        });
    }catch(err){
        console.log("error in fetchexpense:", err);
        return res.status(500).json({
            success : false,
            message : err.message
        });
    }
}

const deleteexpense = async(req,res) =>{
    try{
        const { id } = req.params;
        const deleted = await Expense.findByIdAndDelete(id);

        if(!deleted){
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Expense deleted successfully"
        });
    }catch(err){
        console.log("error in deleteexpense:", err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

const updateexpense = async(req,res) =>{
    try{
        const { id } = req.params;
        const { amount, category, date, description } = req.body;

        const updated = await Expense.findByIdAndUpdate(
            id,
            {
                amount: Number(amount),
                category,
                date: new Date(date),
                description
            },
            { new: true }
        );

        if(!updated){
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Expense updated successfully",
            expense: updated
        });
    }catch(err){
        console.log("error in updateexpense:", err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

module.exports = { fetchexpense, deleteexpense, updateexpense };
