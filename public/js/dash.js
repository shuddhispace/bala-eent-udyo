const API = "/api";

// DOM References
const dt = document.getElementById("datetime");
const employeeTable = document.getElementById("employeeTable");
const expenseTable = document.getElementById("expenseTable");
const productionTable = document.getElementById("productionTable");

const employeeSearch = document.getElementById("employeeSearch");
const expenseSearch = document.getElementById("expenseSearch");
const prodSearch = document.getElementById("prodSearch");

const expenseEmployee = document.getElementById("expenseEmployee");
const prodEmployee = document.getElementById("prodEmployee");

const addEmployeeForm = document.getElementById("addEmployeeForm");
const empName = document.getElementById("empName");
const empPhone = document.getElementById("empPhone");
const empAdvance = document.getElementById("empAdvance");

const addExpenseBtn = document.getElementById("addExpenseBtn");
const expenseAmount = document.getElementById("expenseAmount");
const expenseNote = document.getElementById("expenseNote");

const addProdBtn = document.getElementById("addProdBtn");
const prodQty = document.getElementById("prodQty");
const prodPrice = document.getElementById("prodPrice");

// Stats DOM
const employeeCount = document.getElementById("employeeCount");
const totalAdvance = document.getElementById("totalAdvance");
const totalExpense = document.getElementById("totalExpense");
const totalPayable = document.getElementById("totalPayable");

const ownerInvestment = document.getElementById("ownerInvestment");
const ownerProfit = document.getElementById("ownerProfit");
const ownerWithdrawal = document.getElementById("ownerWithdrawal");
const ownerBalance = document.getElementById("ownerBalance");
const distributeProfitBtn = document.getElementById("distributeProfitBtn");

const addOwnerForm = document.getElementById("addOwnerForm");
const ownerName = document.getElementById("ownerName");
const ownerShare = document.getElementById("ownerShare");

addOwnerForm.onsubmit = async (e) => {
  e.preventDefault();
  
  try {
    const res = await fetch("/api/owners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: ownerName.value,
        sharePercent: +ownerShare.value
      })
    });

    const data = await res.json();
    if (!res.ok) return notify(data.msg || "Failed", "error");

    notify("Owner added successfully", "success");
    ownerName.value = "";
    ownerShare.value = "";

    loadOwners(); // reload select dropdowns
  } catch {
    notify("Server error", "error");
  }
};

function notify(msg, type = "info") {
  const box = document.createElement("div");
  box.className = `toast ${type}`;
  box.innerText = msg;

  document.getElementById("toastContainer").appendChild(box);

  setTimeout(() => box.remove(), 4000);
}

// ====== Clock ======
setInterval(() => {
  const d = new Date();
  dt.innerText = d.toLocaleString("hi-IN", {
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}, 1000);

// ====== Employee State ======
let employees = [];

// ====== Load Employees ======
async function loadEmployees() {
  const res = await fetch(`${API}/employees`);
  employees = await res.json();
  renderEmployees(employees);
  fillSelects(employees);
}

// ====== Fill Select Boxes ======
function fillSelects(list) {
  expenseEmployee.innerHTML = "";
  prodEmployee.innerHTML = "";
  list.forEach(e => {
    const option = `<option value="${e._id}">${e.empId} - ${e.name}</option>`;
    expenseEmployee.innerHTML += option;
    prodEmployee.innerHTML += option;
  });
}

// ====== Render Employees Table ======
function renderEmployees(list) {
  const tb = employeeTable.querySelector("tbody");
  tb.innerHTML = "";
  let adv = 0, exp = 0, pay = 0;

  list.forEach(e => {
    adv += e.advance || 0;
    exp += e.totalExpense || 0;
    pay += e.balance || 0;

    tb.innerHTML += `
      <tr>
        <td>${e.empId}</td>
        <td>${e.name}</td>
        <td>₹${e.advance || 0}</td>
        <td>₹${e.totalExpense || 0}</td>
        <td>₹${e.totalProduction || 0}</td>
        <td>₹${e.balance || 0}</td>
      </tr>
    `;
  });

  employeeCount.innerText = list.length;
  totalAdvance.innerText = "₹" + adv;
  totalExpense.innerText = "₹" + exp;
  totalPayable.innerText = "₹" + pay;
}

// ====== Search Handlers ======
employeeSearch.oninput = e => {
  const v = e.target.value.toLowerCase();
  renderEmployees(employees.filter(x => x.name.toLowerCase().includes(v)));
};

expenseSearch.oninput = e => {
  const v = e.target.value.toLowerCase();
  fillSelects(employees.filter(x => x.name.toLowerCase().includes(v)));
};

prodSearch.oninput = e => {
  const v = e.target.value.toLowerCase();
  fillSelects(employees.filter(x => x.name.toLowerCase().includes(v)));
};

// ====== Add Employee ======
addEmployeeForm.onsubmit = async e => {
  e.preventDefault();

  try {
    const res = await fetch(`${API}/employees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: empName.value,
        phone: empPhone.value,
        advance: +empAdvance.value || 0
      })
    });

    if (!res.ok) {
      notify("कर्मचारी जोड़ने में error", "error");
      return;
    }

    notify("कर्मचारी सफलतापूर्वक जोड़ा गया", "success");
    e.target.reset();
    loadEmployees();

  } catch {
    notify("Server error", "error");
  }
};

// ====== Add Expense ======
addExpenseBtn.onclick = async () => {
  try {
    const res = await fetch(`${API}/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employee: expenseEmployee.value,
        amount: +expenseAmount.value,
        note: expenseNote.value
      })
    });

    if (!res.ok) {
      notify("खर्च जोड़ने में error", "error");
      return;
    }

    notify("खर्च सफलतापूर्वक जोड़ा गया", "success");
    expenseAmount.value = "";
    expenseNote.value = "";
    loadEmployees();
    loadExpenses();

  } catch {
    notify("Server error", "error");
  }
};

// ====== Add Production ======

addProdBtn.onclick = async () => {
  try {
    const res = await fetch(`${API}/production`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employee: prodEmployee.value,
        qty: +prodQty.value,
        price: +prodPrice.value
      })
    });

    if (!res.ok) {
      notify("Production entry failed", "error");
      return;
    }

    notify("Production सफलतापूर्वक जोड़ा गया", "success");
    prodQty.value = "";
    prodPrice.value = "";
    loadEmployees();
    loadProduction();

  } catch {
    notify("Server error", "error");
  }
};


// ====== Format Date ======
function formatDate(d) {
  return new Date(d).toLocaleString("hi-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

// ====== Load Expenses Table ======
async function loadExpenses() {
  const res = await fetch(`${API}/expenses`);
  const data = await res.json();
  const tb = expenseTable.querySelector("tbody");
  tb.innerHTML = "";

  data.forEach(e => {
    tb.innerHTML += `
      <tr>
        <td>
  ${e.employee ? `${e.employee.empId} - ${e.employee.name}` : "Deleted Employee"}
</td>
        <td>₹${e.amount}</td>
        <td>${e.note || "-"}</td>
        <td>${formatDate(e.date)}</td>
      </tr>
    `;
  });
}

// ====== Load Production Table ======
async function loadProduction() {
  const res = await fetch(`${API}/production`);
  const data = await res.json();
  const tb = productionTable.querySelector("tbody");
  tb.innerHTML = "";

  data.forEach(p => {
    tb.innerHTML += `
      <tr>
        <td>${p.employee.empId} - ${p.employee.name}</td>
        <td>${p.qty}</td>
        <td>₹${p.price}</td>
        <td>₹${p.qty * p.price}</td>
        <td>${formatDate(p.date)}</td>
      </tr>
    `;
  });
}



// ====== Initial Load ======
loadEmployees();
loadExpenses();
loadProduction();


async function loadOwnerSummary() {
  const res = await fetch("/api/owners/summary");
  const data = await res.json();

  ownerInvestment.innerText = "₹" + data.investment;
  ownerProfit.innerText = "₹" + data.profit;
  ownerWithdrawal.innerText = "₹" + data.withdrawal;
  ownerBalance.innerText = "₹" + data.balance;
}
/*
distributeProfitBtn.onclick = async () => {
  if (!confirm("Profit distribute करना है?")) return;

  try {
    const res = await fetch("/api/profit/distribute", {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });

    const data = await res.json();

    if (!res.ok) {
      notify(data.msg || "Profit distribution failed", "error");
      return;
    }

    notify(data.msg, "success");
    loadOwnerSummary();
    loadOwnerLedger();

  } catch (err) {
    notify("Server error while distributing profit", "error");
    console.error(err);
  }
};

*/

if (distributeProfitBtn) {
  distributeProfitBtn.onclick = async () => {
    const amount = prompt("Enter total profit");

    if (!amount) return;

    const res = await fetch("/api/profit/distribute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ totalProfit: +amount })
    });

    const data = await res.json();

    notify(data.msg, "success");
    loadOwnerLedger();
    loadOwnerSummary();
  };
}




const ownerLedgerTable = document.getElementById("ownerLedgerTable");
const ledgerFilter = document.getElementById("ledgerFilter");

let ownerLedger = [];

if (addLedgerBtn) {
  addLedgerBtn.onclick = async () => {
  if (!ledgerOwner || !ledgerOwner.value) return notify("Select owner", "error");
  if (!ledgerType || !ledgerType.value) return notify("Select type", "error");
  if (!ledgerAmount || isNaN(+ledgerAmount.value) || +ledgerAmount.value <= 0)
    return notify("Enter valid amount", "error");

  try {
    const res = await fetch("/api/ownerLedger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ownerId: ledgerOwner.value,
        type: ledgerType.value,
        amount: +ledgerAmount.value,
        reference: ledgerRef.value || "-"
      })
    });

    const data = await res.json();
    if (!res.ok) return notify(data.msg || "Failed", "error");

    notify("Ledger entry added", "success");
    ledgerAmount.value = "";
    ledgerRef.value = "";
    loadOwnerLedger();
    loadOwnerSummary();

  } catch {
    notify("Server error", "error");
  }
};
}


async function loadOwnerLedger() {
  const res = await fetch("/api/owners/ledger");
  ownerLedger = await res.json();
  renderOwnerLedger(ownerLedger);
}


function renderOwnerLedger(list) {
  const tb = ownerLedgerTable.querySelector("tbody");
  tb.innerHTML = "";

  list.forEach(l => {
    tb.innerHTML += `
      <tr>
        <td>${l.owner?.name || "-"}</td>
        <td>${l.type}</td>
        <td>₹${l.amount}</td>
        <td>${l.reference || "-"}</td>
        <td>${formatDate(l.date)}</td>
      </tr>
    `;
  });
}

ledgerFilter.onchange = e => {
  const type = e.target.value;
  if (!type) return renderOwnerLedger(ownerLedger);
  renderOwnerLedger(ownerLedger.filter(l => l.type === type));
};



async function loadOwners() {
  const res = await fetch("/api/owners");
  const owners = await res.json();

  ledgerOwner.innerHTML = "";
  owners.forEach(o => {
    ledgerOwner.innerHTML += `<option value="${o._id}">${o.name}</option>`;
  });
}

addLedgerBtn.onclick = async () => {
  try {
    const res = await fetch("/api/ownerLedger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ownerId: ledgerOwner.value,
        type: ledgerType.value,
        amount: +ledgerAmount.value,
        reference: ledgerRef.value
      })
    });

    const data = await res.json();

    if (!res.ok) {
      notify(data.msg || "Failed", "error");
      return;
    }

    notify("Ledger entry added", "success");
    ledgerAmount.value = "";
    ledgerRef.value = "";

    loadOwnerLedger();
    loadOwnerSummary();

  } catch {
    notify("Server error", "error");
  }
};
loadOwnerSummary();
loadOwnerLedger();

if (ledgerOwner) {
  loadOwners();
}

