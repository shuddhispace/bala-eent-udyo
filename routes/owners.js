const router = require("express").Router();
const Owner = require("../models/Owner");
const OwnerLedger = require("../models/OwnerLedger");

// GET owners with balances
router.get("/", async (req, res) => {
  try {
    const owners = await Owner.find().lean();
    const ledger = await OwnerLedger.find();

    const data = owners.map(o => {
      const balance = ledger
        .filter(l => String(l.ownerId) === String(o._id))
        .reduce((sum, l) => sum + l.amount, 0);

      return { _id: o._id, name: o.name, balance };
    });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch owners" });
  }
});

// ADD owner
router.post("/", async (req, res) => {
  try {
    const owner = await Owner.create({ name: req.body.name });
    res.json(owner);
  } catch (err) {
    console.error("Error adding owner:", err);
    res.status(500).json({ msg: "Failed to add owner" });
  }
});

module.exports = router;
