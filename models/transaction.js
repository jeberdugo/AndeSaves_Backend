const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  expense: { type: mongoose.Schema.Types.ObjectId, ref: "Expense"},
    income: { type: mongoose.Schema.Types.ObjectId, ref: "Income"},
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction