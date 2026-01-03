const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  empId: { type: String, unique: true },
  name: { type: String, required: true },
  phone: String,
  advance: { type: Number, default: 0 },
  joiningDate: { type: Date, default: Date.now }
}, { timestamps: true });

EmployeeSchema.pre("save", async function (next) {
  if (!this.empId) {
    const count = await mongoose.model("Employee").countDocuments();
    this.empId = "EMP" + String(count + 1).padStart(3, "0");
  }
  next();
});

module.exports = mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);