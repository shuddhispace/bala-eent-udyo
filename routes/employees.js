
const router = require("express").Router();
const Employee = require("../models/Employee");
const Expense = require("../models/Expense");
const Production = require("../models/Production");

router.get("/", async (req, res) => {
  const employees = await Employee.find();

  const result = [];
  for (const emp of employees) {
    const expenses = await Expense.find({ employee: emp._id });
    const productions = await Production.find({ employee: emp._id });

    const totalExpense = expenses.reduce((a, b) => a + b.amount, 0);
    const totalProduction = productions.reduce((a, b) => a + (b.qty * b.price), 0);

    result.push({
      ...emp.toObject(),
      totalExpense,
      totalProduction,
      balance: totalProduction - emp.advance - totalExpense
    });
  }

  res.json(result);
});

router.post("/", async (req, res) => {
  const emp = new Employee(req.body);
  await emp.save();
  res.json(emp);
});

module.exports = router;
