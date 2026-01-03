const API = "/api";

const ownersList = document.getElementById("ownersList");
const ownerSelect = document.getElementById("ownerSelect");
const ledgerList = document.getElementById("ledgerList");
const ownerFilter = document.getElementById("ownerFilter");
const dateFilter = document.getElementById("dateFilter");

const sumInvestment = document.getElementById("sumInvestment");
const sumProfit = document.getElementById("sumProfit");
const sumWithdrawal = document.getElementById("sumWithdrawal");
const sumBalance = document.getElementById("sumBalance");

const addOwnerForm = document.getElementById("addOwnerForm");
const ownerNameInput = document.getElementById("ownerNameInput");

const ledgerForm = document.getElementById("ledgerForm");
const typeSelect = document.getElementById("typeSelect");
const amountInput = document.getElementById("amountInput");
const noteInput = document.getElementById("noteInput");
const dateInput = document.getElementById("dateInput");

let owners = [];
let ledger = [];

// Load Owners
async function loadOwners() {
  const res = await fetch(`${API}/owners`);
  owners = await res.json();

  ownersList.innerHTML = "";
  ownerSelect.innerHTML = "";
  ownerFilter.innerHTML = `<option value="">All Owners</option>`;

  owners.forEach(o => {
    const bal = calculateOwnerBalance(o._id);
    ownersList.innerHTML += `
      <div class="owner-card">
        <strong>${o.name}</strong>
        <div class="balance ${bal>=0?"positive":"negative"}">₹${bal}</div>
      </div>
    `;
    ownerSelect.innerHTML += `<option value="${o._id}">${o.name}</option>`;
    ownerFilter.innerHTML += `<option value="${o._id}">${o.name}</option>`;
  });
}

// Load Ledger
async function loadLedger() {
  const res = await fetch(`${API}/ledger`);
  ledger = await res.json();
  renderLedger();
}

// Calculate Owner Balance
function calculateOwnerBalance(ownerId){
  return ledger
    .filter(l => l.ownerId === ownerId)
    .reduce((sum,l)=> sum + l.amount, 0);
}

// Apply Filters
function applyFilters(list){
  let data = [...list];
  if(ownerFilter.value){
    data = data.filter(l => l.ownerId === ownerFilter.value);
  }
  if(dateFilter.value !== "all"){
    const now = new Date();
    data = data.filter(l => {
      const d = new Date(l.date);
      if(dateFilter.value==="today") return d.toDateString()===now.toDateString();
      if(dateFilter.value==="week") return (now-d)/86400000 <=7;
      if(dateFilter.value==="month") return d.getMonth()===now.getMonth();
      if(dateFilter.value==="year") return d.getFullYear()===now.getFullYear();
    });
  }
  return data;
}

// Render Ledger
function renderLedger(){
  const data = applyFilters(ledger);
  ledgerList.innerHTML = "";

  let invest=0, profit=0, withdraw=0;

  data.forEach(l=>{
    if(l.type==="INVEST") invest+=l.amount;
    if(l.type==="PROFIT") profit+=l.amount;
    if(l.type==="WITHDRAW") withdraw+=Math.abs(l.amount);

    ledgerList.innerHTML += `
      <div class="ledger-item ${l.type.toLowerCase()}">
        <div>${new Date(l.date).toLocaleDateString()}</div>
        <div>${owners.find(o=>o._id===l.ownerId)?.name || "Unknown"}</div>
        <div>${l.type}</div>
        <div>₹${l.amount}</div>
        <div>${l.note||"-"}</div>
      </div>
    `;
  });

  sumInvestment.innerText = "₹"+invest;
  sumProfit.innerText = "₹"+profit;
  sumWithdrawal.innerText = "₹"+withdraw;
  sumBalance.innerText = "₹"+(invest+profit-withdraw);
}

// Add Owner
addOwnerForm.onsubmit = async e=>{
  e.preventDefault();
  const name = ownerNameInput.value.trim();
  if(!name) return alert("Enter owner name");
  const res = await fetch(`${API}/owners`, {
    method:"POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ name })
  });
  if(!res.ok){ alert("Failed to add owner"); return; }
  ownerNameInput.value="";
  await loadOwners();
  alert("Owner added successfully");
};

// Add Ledger Entry
ledgerForm.onsubmit = async e=>{
  e.preventDefault();
  const body = {
    ownerId: ownerSelect.value,
    type: typeSelect.value,
    amount: typeSelect.value==="WITHDRAW"? -Number(amountInput.value) : Number(amountInput.value),
    note: noteInput.value,
    date: dateInput.value || new Date()
  };
  await fetch(`${API}/ledger`, {
    method:"POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify(body)
  });
  ledgerForm.reset();
  await loadLedger();
  await loadOwners();
};

ownerFilter.onchange = renderLedger;
dateFilter.onchange = renderLedger;

// Initial load
loadLedger().then(loadOwners);
