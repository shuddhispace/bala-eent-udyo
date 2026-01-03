
const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true
  },
  amount: { type: Number, required: true },
  note: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);
