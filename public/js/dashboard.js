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


// Toast notifications
function notify(msg, type="info"){
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
let currentPage = 1;
let pageLimit = 10;
let totalEmployees = 0;

async function loadEmployees(showAll = false) {
  const url = showAll
    ? `${API}/employees?limit=100000`
    : `${API}/employees?page=${currentPage}&limit=${pageLimit}`;

  const res = await fetch(url);
  const json = await res.json();

  employees = json.data;
  totalEmployees = json.totalCount;

  renderEmployees(employees);
  fillSelects(employees);

  if (showAll) {
    document.getElementById("pageInfo").innerText =
      `All ${totalEmployees} records`;
    document.getElementById("prevPage").disabled = true;
    document.getElementById("nextPage").disabled = true;
  } else {
    updatePagination(totalEmployees);
  }
}


function updatePagination(total) {
  const totalPages = Math.ceil(total / pageLimit) || 1;

  document.getElementById("pageInfo").innerText =
    `Page ${currentPage} of ${totalPages}`;

  document.getElementById("prevPage").disabled = currentPage <= 1;
  document.getElementById("nextPage").disabled = currentPage >= totalPages;
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
        <td>${e.totalBricks || 0}</td>   
        <td>₹${e.totalProduction || 0}</td>
        <td>₹${e.balance || 0}</td>
      </tr>
    `;
  });

  employeeCount.innerText = totalEmployees;
  // totalAdvance.innerText = "₹" + adv;
  totalAdvance.innerText = "₹" + adv + " (Page)";
  totalExpense.innerText = "₹" + exp;
  totalPayable.innerText = "₹" + pay;
}

document.getElementById("pageLimitSelect").onchange = e => {
  pageLimit = Number(e.target.value);
  currentPage = 1;
  loadEmployees();
};

document.getElementById("prevPage").onclick = () => {
  if (currentPage > 1) {
    currentPage--;
    loadEmployees();
  }
};

document.getElementById("nextPage").onclick = () => {
  currentPage++;
  loadEmployees();
};

document.getElementById("showAll").onclick = () => {
  currentPage = 1;
  loadEmployees(true);
};



// ====== Search Handlers ======
employeeSearch.oninput = e => {
  const v = e.target.value.trim().toLowerCase();

  if (!v) {
    loadEmployees();
    return;
  }

  loadEmployees(true).then(() => {
    renderEmployees(
      employees.filter(x => x.name.toLowerCase().includes(v))
    );
  });
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

// Button to open owner-ledger.html in new tab
const openOwnerLedgerBtn = document.getElementById("openOwnerLedger");

if(openOwnerLedgerBtn){
  openOwnerLedgerBtn.onclick = () => {
    window.open("owner-ledger.html", "_blank"); // Opens in a new tab
  };
}
