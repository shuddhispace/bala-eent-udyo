const mongoose = require("mongoose");

const BuyerSchema = new mongoose.Schema({
  mobile: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    default: ""
  },
  address: {
    type: String,
    default: ""
  },
  advanceBalance: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("Buyer", BuyerSchema);
