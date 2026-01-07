const API = "/api";

/* ================= DOM REFERENCES ================= */
const dt = document.getElementById("datetime");

const employeeTableBody = document.getElementById("employeeTableBody");
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

// Stats
const employeeCount = document.getElementById("employeeCount");
const totalAdvance = document.getElementById("totalAdvance");
const totalExpense = document.getElementById("totalExpense");
const totalPayable = document.getElementById("totalPayable");

// Pagination
const pageLimitSelect = document.getElementById("pageLimitSelect");
const prevBtn = document.getElementById("prevPage");
const nextBtn = document.getElementById("nextPage");
const showAllBtn = document.getElementById("showAll");
const pageInfo = document.getElementById("pageInfo");

const tfootAdvance = document.getElementById("tfootAdvance");
const tfootExpense = document.getElementById("tfootExpense");
const tfootBricks = document.getElementById("tfootBricks");
const tfootProduction = document.getElementById("tfootProduction");
const tfootBalance = document.getElementById("tfootBalance");


/* ================= STATE ================= */
let employees = [];
let currentPage = 1;
let pageLimit = 10;
let totalEmployees = 0;

/* ================= TOAST ================= */
function notify(msg, type = "info") {
  const box = document.createElement("div");
  box.className = `toast ${type}`;
  box.innerText = msg;
  document.getElementById("toastContainer")?.appendChild(box);
  setTimeout(() => box.remove(), 4000);
}

/* ================= CLOCK ================= */
if (dt) {
  setInterval(() => {
    const d = new Date();
    dt.innerText = d.toLocaleString("hi-IN", {
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }, 1000);
}

/* ================= LOAD EMPLOYEES ================= */
async function loadEmployees(showAll = false) {
  const url = showAll
    ? `${API}/employees?limit=100000`
    : `${API}/employees?page=${currentPage}&limit=${pageLimit}`;

  const res = await fetch(url);
  const json = await res.json();

  employees = json.data || [];
  totalEmployees = json.totalCount || 0;

  // if (employeeTable) renderEmployees(employees);
  if (employeeTableBody) renderEmployees(employees);
  if (expenseEmployee && prodEmployee) fillSelects(employees);

  if (showAll && pageInfo) {
    pageInfo.innerText = `All ${totalEmployees} records`;
    if (prevBtn) prevBtn.disabled = true;
    if (nextBtn) nextBtn.disabled = true;
  } else {
    updatePagination(totalEmployees);
  }
}

/* ================= PAGINATION ================= */
function updatePagination(total) {
  if (!pageInfo) return;

  const totalPages = Math.ceil(total / pageLimit) || 1;
  pageInfo.innerText = `Page ${currentPage} of ${totalPages}`;

  if (prevBtn) prevBtn.disabled = currentPage <= 1;
  if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
}

/* ================= SELECT FILL ================= */
function fillSelects(list) {
  expenseEmployee.innerHTML = "";
  prodEmployee.innerHTML = "";

  list.forEach(e => {
    const option = `<option value="${e._id}">${e.empId} - ${e.name}</option>`;
    expenseEmployee.innerHTML += option;
    prodEmployee.innerHTML += option;
  });
}

/* ================= RENDER EMPLOYEES ================= */
function renderEmployees(list) {
  if (!employeeTableBody) return;

  employeeTableBody.innerHTML = "";

  let adv = 0, exp = 0, prod = 0, bal = 0, bricks = 0;

  list.forEach(e => {
    adv += e.advance || 0;
    exp += e.totalExpense || 0;
    prod += e.totalProduction || 0;
    bricks += e.totalBricks || 0;
    bal += e.balance || 0;

    employeeTableBody.innerHTML += `
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

  if (tfootAdvance) tfootAdvance.innerText = "₹" + adv;
  if (tfootExpense) tfootExpense.innerText = "₹" + exp;
  if (tfootBricks) tfootBricks.innerText = bricks;
  if (tfootProduction) tfootProduction.innerText = "₹" + prod;
  if (tfootBalance) tfootBalance.innerText = "₹" + bal;
}

/* ================= EVENTS ================= */
document.addEventListener("DOMContentLoaded", () => {

if (pageLimitSelect) {
  pageLimitSelect.onchange = e => {
    pageLimit = Number(e.target.value);
    currentPage = 1;
    loadEmployees();
  };
}


  if (prevBtn) {
    prevBtn.onclick = () => {
      if (currentPage > 1) {
        currentPage--;
        loadEmployees();
      }
    };
  }

  if (nextBtn) {
    nextBtn.onclick = () => {
      currentPage++;
      loadEmployees();
    };
  }

  if (showAllBtn) {
    showAllBtn.onclick = () => {
      currentPage = 1;
      loadEmployees(true);
    };
  }

  if (employeeSearch) {
    employeeSearch.oninput = e => {
      const v = e.target.value.trim().toLowerCase();
      if (!v) return loadEmployees();

      loadEmployees(true).then(() => {
        renderEmployees(
          employees.filter(x => x.name.toLowerCase().includes(v))
        );
      });
    };
  }

  if (expenseSearch) {
    expenseSearch.oninput = e => {
      const v = e.target.value.toLowerCase();
      fillSelects(employees.filter(x => x.name.toLowerCase().includes(v)));
    };
  }

  if (prodSearch) {
    prodSearch.oninput = e => {
      const v = e.target.value.toLowerCase();
      fillSelects(employees.filter(x => x.name.toLowerCase().includes(v)));
    };
  }

  // if (employeeTable) loadEmployees(); employeeTableBody
  if (employeeTableBody) loadEmployees(); 
  if (expenseTable) loadExpenses();
  if (productionTable) loadProduction();
});

/* ================= EXPENSES ================= */
async function loadExpenses() {
  const res = await fetch(`${API}/expenses`);
  const data = await res.json();

  const tb = expenseTable.querySelector("tbody");
  tb.innerHTML = "";

  data.forEach(e => {
    tb.innerHTML += `
      <tr>
        <td>${e.employee ? `${e.employee.empId} - ${e.employee.name}` : "Deleted Employee"}</td>
        <td>₹${e.amount}</td>
        <td>${e.note || "-"}</td>
        <td>${formatDate(e.date)}</td>
      </tr>
    `;
  });
}

/* ================= PRODUCTION ================= */
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

/* ================= DATE FORMAT ================= */
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

/* ================= OWNER LEDGER ================= */
const openOwnerLedgerBtn = document.getElementById("openOwnerLedger");
if (openOwnerLedgerBtn) {
  openOwnerLedgerBtn.onclick = () => {
    window.open("owner-ledger.html", "_blank");
  };
}
