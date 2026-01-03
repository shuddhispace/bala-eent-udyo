require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const router = express.Router();


/* ===== Middleware ===== */
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/* ===== MongoDB ===== */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error(err));

/* ===== Routes ===== */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/employees", require("./routes/employees"));
app.use("/api/production", require("./routes/production"));
app.use("/api/expenses", require("./routes/expenses"));
app.use("/api/owners", require("./routes/owners"));
app.use("/api/ledger", require("./routes/ownerLedger"));
app.use("/api/dev", require("./routes/devClean"));



/* ===== Frontend ===== */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/owner/owner-dashboard.html'));
});

/* ===== Server ===== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
