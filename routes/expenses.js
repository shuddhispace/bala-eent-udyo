
const router = require("express").Router();
const Expense = require("../models/Expense");
const Employee = require("../models/Employee");

router.post("/", async (req, res) => {
  const { employee, amount, note } = req.body;

  if (!employee || !amount) {
    return res.status(400).json({ msg: "Invalid data" });
  }

  const emp = await Employee.findById(employee);
  if (!emp) return res.status(400).json({ msg: "Employee not found" });

  const expense = new Expense({ employee, amount, note });
  await expense.save();

  res.json(expense);
});

router.get("/", async (req, res) => {
  const expenses = await Expense
    .find()
    .populate("employee", "empId name")
    .sort({ date: -1 });

  res.json(expenses);
});


module.exports = router;
