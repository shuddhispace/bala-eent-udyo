const express = require("express");
const router = express.Router();
const Buyer = require("../models/Buyer");

router.get("/:mobile", async (req, res) => {
  try {
    const buyer = await Buyer.findOne({ mobile: req.params.mobile });

    if (!buyer) {
      return res.status(404).json({
        success: false,
        message: "Buyer not found"
      });
    }

    res.json({ success: true, data: buyer });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = router;
