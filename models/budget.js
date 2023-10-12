const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
   // category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    name: { type: String, required: true },
    total: Number,
    date: { type: Date, required: true },
    type: { type: Number, required: true },
    amount: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  });

  const Budget = mongoose.model("Budget", budgetSchema);

module.exports = Budget