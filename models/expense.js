const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: Date,
  category: { type: String, required: true },
  description: { type: String, required: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isRecurring: { type: Boolean, required: false },
  recurrenceType: { type: String, required: false },
  recurrenceEndDate: { type: Date, required: false },
});

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
