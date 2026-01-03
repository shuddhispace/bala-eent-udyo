const mongoose = require("mongoose");

const OwnerSchema = new mongoose.Schema({
  name: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Owner", OwnerSchema);
