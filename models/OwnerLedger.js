const mongoose = require("mongoose");

const OwnerLedgerSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owner",
    required: true
  },
  type: {
    type: String,
    enum: ["INVEST", "PROFIT", "WITHDRAW"],
    required: true
  },
  amount: { type: Number, required: true },
  note: String,
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("OwnerLedger", OwnerLedgerSchema);
