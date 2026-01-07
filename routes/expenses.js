const router = require("express").Router();
const Expense = require("../models/Expense");
const Employee = require("../models/Employee");

/* ADD EXPENSE */
router.post("/", async (req, res) => {
  try {
    const { employee, ownerName, amount, expenseDate, note } = req.body;

    if (!employee || !ownerName || !amount) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    const emp = await Employee.findById(employee);
    if (!emp) return res.status(400).json({ msg: "Employee not found" });

    const expense = await Expense.create({
      employee,
      ownerName,
      amount,
      note,
      expenseDate: expenseDate || null
    });

    res.json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* GET EXPENSES (PAGINATION) */
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page || 1);
  const limit = parseInt(req.query.limit || 10);
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Expense.find()
      .populate("employee", "name empId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Expense.countDocuments()
  ]);

  res.json({
    data,
    page,
    pages: Math.ceil(total / limit)
  });
});

module.exports = router;
