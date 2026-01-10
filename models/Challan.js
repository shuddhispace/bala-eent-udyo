const mongoose = require("mongoose");

const ChallanSchema = new mongoose.Schema({
  challanNo: String,

  buyerMobile: String,
  buyerName: String,
  address: String,

  brick: String,
  qty: Number,
  amount: Number,

  advanceUsed: Number,
  payable: Number,
  remainingAdvance: Number
}, { timestamps: true });

module.exports = mongoose.model("Challan", ChallanSchema);
