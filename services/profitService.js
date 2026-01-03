const Owner = require("../models/Owner");
const OwnerLedger = require("../models/OwnerLedger");

async function distributeProfit(totalProfit, reference = "Brick Sale Profit") {
  const owners = await Owner.find({ active: true });

  for (const o of owners) {
    const shareAmount = (totalProfit * o.sharePercent) / 100;

    await OwnerLedger.create({
      owner: o._id,
      type: "PROFIT",
      amount: shareAmount,
      reference
    });
  }
}

module.exports = { distributeProfit };
