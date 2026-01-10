const mongoose = require("mongoose");

const AdvanceSchema = new mongoose.Schema({
  buyerMobile: String,
  buyerName: String,
  amount: Number,
  owner: String
}, { timestamps: true });

module.exports = mongoose.model("Advance", AdvanceSchema);
