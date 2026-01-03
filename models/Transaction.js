const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  type: {
    type: String,
    enum: ['advance', 'kharch', 'earning', 'salary'],
    required: true
  },
  amount: Number,
  note: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
