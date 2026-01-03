const router = require("express").Router();
const Owner = require("../models/Owner");
const OwnerLedger = require("../models/OwnerLedger");

router.delete("/reset-owners", async (req, res) => {
  await Owner.deleteMany({});
  await OwnerLedger.deleteMany({});
  res.json({ msg: "Owners & ledger cleaned" });
});

module.exports = router;
