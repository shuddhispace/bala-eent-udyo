const express = require("express");
const router = express.Router();

// LOGIN ROUTE
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "balaowner" && password === "12345") {
    return res.json({
      msg: "Login successful",
      owner: { name: "Shri Bala Eent Udyog Owner" }
    });
  }

  res.status(401).json({ msg: "Invalid credentials" });
});

module.exports = router;
