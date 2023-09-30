const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    source: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  });
  
  const Income = mongoose.model('Income', incomeSchema);

module.exports = Income;
