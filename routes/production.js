
const router = require("express").Router();
const Production = require("../models/Production");
const Employee = require("../models/Employee");

router.post("/", async (req, res) => {
  const { employee, qty, price } = req.body;

  if (!employee || !qty || !price) {
    return res.status(400).json({ msg: "Invalid production data" });
  }

  const emp = await Employee.findById(employee);
  if (!emp) return res.status(400).json({ msg: "Employee not found" });

  const prod = new Production({ employee, qty, price });
  await prod.save();

  res.json(prod);
});

router.get("/", async (req, res) => {
  const production = await Production
    .find()
    .populate("employee", "empId name")
    .sort({ date: -1 });

  res.json(production);
});


module.exports = router;
