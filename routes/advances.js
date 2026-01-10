const express = require("express");
const router = express.Router();

const Buyer = require("../models/Buyer");
const Advance = require("../models/Advance");

router.post("/", async (req, res) => {
  try {
    const { mobile, name = "", address = "", amount, owner } = req.body;

    if (!mobile || !amount || !owner) {
      return res.status(400).json({
        success: false,
        message: "Mobile, amount and owner are required"
      });
    }

    let buyer = await Buyer.findOne({ mobile });

    if (!buyer) {
      buyer = await Buyer.create({
        mobile,
        name,
        address,
        advanceBalance: Number(amount)
      });
    } else {
      buyer.advanceBalance += Number(amount);
      if (name) buyer.name = name;
      if (address) buyer.address = address;
      await buyer.save();
    }

    await Advance.create({
      buyerMobile: mobile,
      buyerName: buyer.name || "Advance Buyer",
      amount: Number(amount),
      owner
    });

    res.json({
      success: true,
      message: "Advance added successfully"
    });

  } catch (err) {
    console.error("ADVANCE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await Advance.find().sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
