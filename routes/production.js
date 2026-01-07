const router = require("express").Router();
const Production = require("../models/Production");
const Employee = require("../models/Employee");

// POST - add production
router.post("/", async (req, res) => {
  const { employee, qty, price, date } = req.body;

  if (!employee || !qty || !price) return res.status(400).json({ msg: "Invalid production data" });

  const emp = await Employee.findById(employee);
  if (!emp) return res.status(400).json({ msg: "Employee not found" });

  const now = new Date();
  const productionDate = date ? (() => {
    const d = new Date(date);
    d.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
    return d;
  })() : null;

  const prod = new Production({ employee, qty, price, date: productionDate });
  await prod.save();

  res.json(prod);
});

// GET - fetch all
router.get("/", async (req, res) => {
  const production = await Production
    .find()
    .populate("employee", "empId name")
    .sort({ createdAt: -1 }); // sort by createdAt
  res.json(production);
});

module.exports = router;
