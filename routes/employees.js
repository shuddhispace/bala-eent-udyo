
const router = require("express").Router();
const Employee = require("../models/Employee");
const Expense = require("../models/Expense");
const Production = require("../models/Production");

router.get("/", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const employees = await Employee.find()
    .skip(skip)
    .limit(limit);

  const totalCount = await Employee.countDocuments();

  const result = [];
  for (const emp of employees) {
    const expenses = await Expense.find({ employee: emp._id });
    const productions = await Production.find({ employee: emp._id });

    const totalExpense = expenses.reduce((a, b) => a + b.amount, 0);
    const totalBricks = productions.reduce((a,b)=>a+b.qty,0);
    const totalProduction = productions.reduce((a, b) => a + (b.qty * b.price), 0);


    result.push({
      ...emp.toObject(),
      totalExpense,
      totalBricks,
      totalProduction,
      balance: totalProduction - emp.advance - totalExpense
    });
  }

  res.json({
    data: result,
    totalCount
  });
});

router.post("/", async (req, res) => {
  const emp = new Employee(req.body);
  await emp.save();
  res.json(emp);
});

module.exports = router;
