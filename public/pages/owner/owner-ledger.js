<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Owner Dashboard</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<style>
*{box-sizing:border-box;font-family:system-ui,sans-serif}
body{margin:0;background:#f4f6fa;color:#222}

header{
  background:#111;color:#fff;
  padding:14px;font-size:18px
}

.summary{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(150px,1fr));
  gap:12px;padding:15px
}
.card{
  padding:14px;border-radius:10px;color:#fff
}
.blue{background:#1976d2}
.green{background:#2e7d32}
.red{background:#c62828}
.dark{background:#333}

.owners{
  display:flex;gap:12px;
  padding:15px;overflow-x:auto
}
.owner-card{
  background:#fff;padding:12px;
  border-radius:10px;
  min-width:180px;
  box-shadow:0 2px 6px rgba(0,0,0,.1)
}
.balance{font-size:18px;font-weight:700}
.positive{color:#2e7d32}
.negative{color:#c62828}

.ledger{padding:15px}
.ledger-item{
  background:#fff;padding:10px;
  border-radius:8px;
  display:grid;
  grid-template-columns:repeat(5,1fr);
  gap:8px;font-size:14px;
  margin-bottom:8px
}
.invest{border-left:4px solid #1976d2}
.profit{border-left:4px solid #2e7d32}
.withdraw{border-left:4px solid #c62828}

.pagination{
  display:flex;gap:10px;
  justify-content:center;margin-top:10px
}
button{
  padding:6px 12px;
  border:none;border-radius:6px;
  background:#111;color:#fff;
  cursor:pointer
}
button:disabled{opacity:.4}

@media(max-width:700px){
  .ledger-item{grid-template-columns:1fr}
}
</style>
</head>

<body>

<header>Owner Dashboard</header>

<div class="summary">
  <div class="card blue">Investment<br><b id="sumInvestment">₹0</b></div>
  <div class="card green">Profit<br><b id="sumProfit">₹0</b></div>
  <div class="card red">Withdraw<br><b id="sumWithdrawal">₹0</b></div>
  <div class="card dark">Balance<br><b id="sumBalance">₹0</b></div>
</div>

<div class="owners" id="ownersList"></div>

<div class="ledger" id="ledgerList"></div>

<script>
/* ===== SAME LOGIC AS YOUR WORKING BACKEND ===== */
const API = "/api";

/* STATE */
let owners = [];
let ledger = [];
let page = 1;
const PAGE_SIZE = 10;

/* LOAD OWNERS */
async function loadOwners(){
  const res = await fetch(API + "/owners");
  owners = await res.json();
  renderOwners();
}

/* LOAD LEDGER */
async function loadLedger(){
  const res = await fetch(API + "/ledger");
  ledger = await res.json();
  renderLedger();
}

/* OWNER SUMMARY (CALCULATED FROM LEDGER – SAME AS BACKEND IDEA) */
function ownerSummary(ownerId){
  let invest=0, profit=0, withdraw=0;
  ledger.filter(l=>l.ownerId===ownerId).forEach(l=>{
    if(l.type==="INVEST") invest+=l.amount;
    if(l.type==="PROFIT") profit+=l.amount;
    if(l.type==="WITHDRAW") withdraw+=Math.abs(l.amount);
  });
  return {
    invest, profit, withdraw,
    balance: invest + profit - withdraw,
    percent: invest ? ((profit/invest)*100).toFixed(2) : "0.00"
  };
}

/* RENDER OWNER CARDS */
function renderOwners(){
  const box = document.getElementById("ownersList");
  box.innerHTML="";
  owners.forEach(o=>{
    const s = ownerSummary(o._id);
    box.innerHTML+=`
      <div class="owner-card">
        <b>${o.name}</b>
        <div class="balance ${s.balance>=0?"positive":"negative"}">
          ₹${s.balance.toLocaleString("en-IN")}
        </div>
        <div style="font-size:12px">
          Invested: ₹${s.invest.toLocaleString("en-IN")}<br>
          Profit: ₹${s.profit.toLocaleString("en-IN")}<br>
          Withdraw: ₹${s.withdraw.toLocaleString("en-IN")}<br>
          Profit %: ${s.percent}%
        </div>
      </div>
    `;
  });
}

/* RENDER LEDGER WITH PAGINATION */
function renderLedger(){
  const list = document.getElementById("ledgerList");
  list.innerHTML="";

  let invest=0, profit=0, withdraw=0;
  const start=(page-1)*PAGE_SIZE;
  const data=ledger.slice(start,start+PAGE_SIZE);

  data.forEach(l=>{
    if(l.type==="INVEST") invest+=l.amount;
    if(l.type==="PROFIT") profit+=l.amount;
    if(l.type==="WITHDRAW") withdraw+=Math.abs(l.amount);

    list.innerHTML+=`
      <div class="ledger-item ${l.type.toLowerCase()}">
        <div>${new Date(l.date).toLocaleDateString()}</div>
        <div>${l.owner}</div>
        <div>${l.type}</div>
        <div>₹${l.amount}</div>
        <div>${l.note}</div>
      </div>
    `;
  });

  document.getElementById("sumInvestment").innerText="₹"+invest;
  document.getElementById("sumProfit").innerText="₹"+profit;
  document.getElementById("sumWithdrawal").innerText="₹"+withdraw;
  document.getElementById("sumBalance").innerText="₹"+(invest+profit-withdraw);

  list.innerHTML+=`
    <div class="pagination">
      <button ${page===1?"disabled":""} onclick="page--;renderLedger()">Prev</button>
      <span>Page ${page}</span>
      <button ${(page*PAGE_SIZE)>=ledger.length?"disabled":""}
        onclick="page++;renderLedger()">Next</button>
    </div>
  `;
}

/* INIT */
loadLedger().then(loadOwners);
</script>

</body>
</html>
