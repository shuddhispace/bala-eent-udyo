const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true
  },
  ownerName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  note: String,
  expenseDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Expense", ExpenseSchema);
