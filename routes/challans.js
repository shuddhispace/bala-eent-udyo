const express = require("express");
const router = express.Router();

const Buyer = require("../models/Buyer");
const Challan = require("../models/Challan");

async function generateChallanNo() {
  const count = await Challan.countDocuments();
  return `CH-2026-${String(count + 1).padStart(3, "0")}`;
}

router.post("/", async (req, res) => {
  try {
    const { mobile, brick, qty, amount } = req.body;

    const buyer = await Buyer.findOne({ mobile });
    if (!buyer) {
      return res.status(404).json({
        success: false,
        message: "Buyer not found"
      });
    }

    const advanceUsed = Math.min(buyer.advanceBalance, amount);
    const payable = amount - advanceUsed;
    const remainingAdvance = buyer.advanceBalance - advanceUsed;

    buyer.advanceBalance = remainingAdvance;
    await buyer.save();

    const challanNo = await generateChallanNo();

    const challan = await Challan.create({
      challanNo,
      buyerMobile: mobile,
      buyerName: buyer.name,
      address: buyer.address,
      brick,
      qty,
      amount,
      advanceUsed,
      payable,
      remainingAdvance
    });

    res.json({ success: true, data: challan });

  } catch (err) {
    console.error("CHALLAN ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const search = req.query.search || "";

    const query = search
      ? { buyerName: { $regex: search, $options: "i" } }
      : {};

    const data = await Challan.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Challan.countDocuments(query);

    res.json({ success: true, data, total });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = router;
