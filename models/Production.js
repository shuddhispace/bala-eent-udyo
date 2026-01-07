const mongoose = require("mongoose");

const ProductionSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
  date: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Production || mongoose.model("Production", ProductionSchema);
