// owner.js - manage demo login, employees, counts and expenses
document.addEventListener('DOMContentLoaded', function(){
  const loginCard = document.getElementById('loginCard');
  const dashboardCard = document.getElementById('dashboardCard');
  const sendOtpBtn = document.getElementById('sendOtpBtn');
  const useDemoBtn = document.getElementById('useDemoBtn');
  const otpArea = document.getElementById('otpArea');
  const verifyBtn = document.getElementById('verifyBtn');
  const ownerPhoneInput = document.getElementById('owner_phone_input');

  const demoOtp = '1234';

  sendOtpBtn.addEventListener('click', function(){
    const phone = ownerPhoneInput.value.trim();
    if(!phone || phone.length<10){alert('सही फोन नंबर डालें');return;}
    // demo: show otp area
    otpArea.style.display = 'block';
    alert('Demo OTP भेजा गया: 1234');
  });

  useDemoBtn.addEventListener('click', function(){
    // prefill and login
    localStorage.setItem('owner_logged', '1');
    showDashboard();
  });

  verifyBtn.addEventListener('click', function(){
    const otp = document.getElementById('otpInput').value.trim();
    if(otp===demoOtp){
      localStorage.setItem('owner_logged', '1');
      showDashboard();
    } else alert('OTP गलत है');
  });

  function showDashboard(){
    loginCard.style.display='none';
    dashboardCard.style.display='block';
    refreshStats();
    loadEmployees();
    loadCounts();
    loadExpenses();
  }

  // logout
  document.getElementById('logoutBtn').addEventListener('click', function(){
    localStorage.removeItem('owner_logged');
    location.reload();
  });

  // quick add employee
  document.getElementById('addEmpBtn').addEventListener('click', function(){
    const name = document.getElementById('newEmpName').value.trim();
    const phone = document.getElementById('newEmpPhone').value.trim();
    if(!name){alert('नाम डालें');return;}
    const emps = JSON.parse(localStorage.getItem('employees')||'[]');
    emps.push({name,phone,created:Date.now()});
    localStorage.setItem('employees', JSON.stringify(emps));
    loadEmployees(); document.getElementById('newEmpName').value=''; document.getElementById('newEmpPhone').value='';
  });

  function loadEmployees(){
    const emps = JSON.parse(localStorage.getItem('employees')||'[]');
    const empList = document.getElementById('empList');
    const empSelect = document.getElementById('empSelect');
    empList.innerHTML=''; empSelect.innerHTML='';
    emps.forEach((e,i)=>{
      const div = document.createElement('div'); div.textContent = (i+1)+'. '+e.name+' - '+(e.phone||'--');
      empList.appendChild(div);
      const opt = document.createElement('option'); opt.value = i; opt.textContent = e.name; empSelect.appendChild(opt);
    });
  }

  // add kaccha count
  document.getElementById('addCountBtn').addEventListener('click', function(){
    const idx = document.getElementById('empSelect').value;
    const cnt = Number(document.getElementById('empCount').value||0);
    if(cnt<=0){alert('काउंट डालें');return;}
    const emps = JSON.parse(localStorage.getItem('employees')||'[]');
    if(!emps[idx]){alert('कर्मचारी चुनें');return;}
    const counts = JSON.parse(localStorage.getItem('kachcha')||'[]');
    counts.push({empIndex:idx, name:emps[idx].name, count:cnt, date:new Date().toLocaleDateString('hi-IN')});
    localStorage.setItem('kachcha', JSON.stringify(counts));
    loadCounts();
    refreshStats();
  });

  function loadCounts(){
    const counts = JSON.parse(localStorage.getItem('kachcha')||'[]');
    const nodes = document.getElementById('countsList');
    nodes.innerHTML='';
    counts.slice().reverse().slice(0,20).forEach((c,i)=>{
      const div = document.createElement('div'); div.textContent = c.date + ' - ' + c.name + ' - ' + c.count + ' pcs'; nodes.appendChild(div);
    });
  }

  // expenses
  document.getElementById('addExpBtn').addEventListener('click', function(){
    const title = document.getElementById('expTitle').value.trim();
    const amt = Number(document.getElementById('expAmount').value||0);
    if(!title || amt<=0){alert('सही विवरण भरें');return;}
    const exps = JSON.parse(localStorage.getItem('expenses')||'[]');
    exps.push({title,amt,date:new Date().toLocaleDateString('hi-IN')});
    localStorage.setItem('expenses', JSON.stringify(exps));
    loadExpenses(); refreshStats();
    document.getElementById('expTitle').value=''; document.getElementById('expAmount').value='';
  });

  function loadExpenses(){
    const exps = JSON.parse(localStorage.getItem('expenses')||'[]');
    const n = document.getElementById('expList'); n.innerHTML='';
    exps.slice().reverse().slice(0,20).forEach(e=>{
      const div = document.createElement('div'); div.textContent = e.date + ' - ' + e.title + ' - ₹' + e.amt; n.appendChild(div);
    });
  }

  function refreshStats(){
    const counts = JSON.parse(localStorage.getItem('kachcha')||'[]');
    const totalKaccha = counts.reduce((s,c)=>s + Number(c.count||0),0);
    document.getElementById('totalKaccha').textContent = totalKaccha;
    const exps = JSON.parse(localStorage.getItem('expenses')||'[]');
    const totalExp = exps.reduce((s,e)=>s + Number(e.amt||0),0);
    document.getElementById('totalExpenses').textContent = '₹' + totalExp;
    const challans = JSON.parse(localStorage.getItem('challans')||'[]');
    document.getElementById('totalChallans').textContent = challans.length;
  }

  // on load auto-login demo if set
  if(localStorage.getItem('owner_logged')) showDashboard();

  // load persisted data
  loadEmployees(); loadCounts(); loadExpenses();
});