const router = require("express").Router();
const OwnerLedger = require("../models/OwnerLedger");
const Owner = require("../models/Owner");

router.get("/test", (req, res) => {
  res.json({ msg: "Ledger route works!" });
});

// GET ledger
router.get("/", async (req, res) => {
  try {
    const data = await OwnerLedger.find()
      .populate("ownerId", "name")
      .sort({ date: -1 });

    const safeData = data.map(l => ({
      id: l._id,
      ownerId: l.ownerId ? l.ownerId._id : null,
      owner: l.ownerId ? l.ownerId.name : "Deleted / Unknown",
      type: l.type,
      amount: l.amount,
      note: l.note || "-",
      date: l.date
    }));

    res.json(safeData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Ledger fetch failed" });
  }
});


// ADD ledger entry
router.post("/", async (req, res) => {
  const entry = await OwnerLedger.create(req.body);
  res.json(entry);
});

// DISTRIBUTE PROFIT
router.post("/distribute-profit", async (req, res) => {
  const { totalProfit } = req.body;

  const investments = await OwnerLedger.find({ type: "INVEST" });
  const owners = await Owner.find();

  const totalInvestment = investments.reduce((s,l)=>s+l.amount,0);
  if (!totalInvestment) {
    return res.status(400).json({ msg: "No investments found" });
  }

  for (const owner of owners) {
    const ownerInvestment = investments
      .filter(l => String(l.ownerId) === String(owner._id))
      .reduce((s,l)=>s+l.amount,0);

    if (!ownerInvestment) continue;

    const share = (ownerInvestment / totalInvestment) * totalProfit;

    await OwnerLedger.create({
      ownerId: owner._id,
      type: "PROFIT",
      amount: Math.round(share),
      note: "Auto profit distribution"
    });
  }

  res.json({ msg: "Profit distributed" });
});

module.exports = router;
