// challan.js - generate printable challan and handle whatsapp links
document.addEventListener('DOMContentLoaded', function(){
  const form = document.getElementById('challanForm');
  const amountIn = document.getElementById('amount');
  const remainingIn = document.getElementById('remaining');
  const rateIn = document.getElementById('rate');
  const qtyIn = document.getElementById('quantity');
  const advanceIn = document.getElementById('advance');
  const previewWrap = document.getElementById('previewWrap');
  const printable = document.getElementById('challanPrintable');
  const generateBtn = document.getElementById('generateBtn');
  const printBtn = document.getElementById('printBtn');

  function computeAmount(){
    const qty = Number(qtyIn.value||0);
    const rate = Number(rateIn.value||0);
    const amount = Math.round((qty/1000)*rate*100)/100;
    amountIn.value = amount;
    const adv = Number(advanceIn.value||0);
    remainingIn.value = Math.max(0, amount - adv);
  }

  qtyIn.addEventListener('input', computeAmount);
  rateIn.addEventListener('input', computeAmount);
  advanceIn.addEventListener('input', computeAmount);

  function buildChallanHTML(data){
    return `
      <div class="challan">
        <div class="header">
          <div>
            <h2>बाला ईंट उद्योग</h2>
            <div>सिंधी पानी टैंक, अतरदाना रोड, प्रतापगढ़</div>
          </div>
          <div style="text-align:right">
            <div>चालान संख्या: ${data.challan_no}</div>
            <div>तारीख: ${data.date}</div>
          </div>
        </div>
        <table>
          <tr><th>ग्राहक</th><td>${data.buyer_name} - ${data.buyer_phone}</td></tr>
          <tr><th>पता</th><td>${data.buyer_address||''}</td></tr>
          <tr><th>ईंट की संख्या</th><td>${data.quantity} pcs</td></tr>
          <tr><th>दर ( प्रति 1000 )</th><td>₹ ${data.rate}</td></tr>
          <tr><th>कुल राशि</th><td>₹ ${data.amount}</td></tr>
          <tr><th>एडवांस</th><td>₹ ${data.advance}</td></tr>
          <tr><th>राशि बाकी</th><td>₹ ${data.remaining}</td></tr>
          <tr><th>ड्राइवर</th><td>${data.driver_name} - ${data.driver_phone}</td></tr>
          <tr><th>वाहन</th><td>${data.vehicle}</td></tr>
        </table>
        <div style="margin-top:10px;display:flex;justify-content:space-between">
          <div>हस्ताक्षर: ____________</div>
          <div>ध्यान दें: माल ले जाने पर मालिक जिम्मेदार नहीं</div>
        </div>
      </div>
    `;
  }

  generateBtn.addEventListener('click', function(){
    const data = {
      challan_no: document.getElementById('challan_no').value || '---',
      date: document.getElementById('date').value || new Date().toLocaleDateString('hi-IN'),
      buyer_name: document.getElementById('buyer_name').value || '',
      buyer_phone: document.getElementById('buyer_phone').value || '',
      buyer_address: document.getElementById('buyer_address').value || '',
      quantity: document.getElementById('quantity').value || 0,
      rate: document.getElementById('rate').value || 0,
      amount: document.getElementById('amount').value || 0,
      advance: document.getElementById('advance').value || 0,
      remaining: document.getElementById('remaining').value || 0,
      driver_name: document.getElementById('driver_name').value || '',
      driver_phone: document.getElementById('driver_phone').value || '',
      vehicle: document.getElementById('vehicle').value || '',
    };
    printable.innerHTML = buildChallanHTML(data);
    previewWrap.style.display = 'block';
    printBtn.style.display = 'inline-block';
    // save challan locally
    const challans = JSON.parse(localStorage.getItem('challans'||'[]'))||[];
    challans.unshift(data);
    localStorage.setItem('challans', JSON.stringify(challans));
    // store last generated phones for quick send
    localStorage.setItem('last_buyer', data.buyer_phone);
    localStorage.setItem('last_driver', data.driver_phone);
    localStorage.setItem('last_owner', '9654275704');
  });

  printBtn.addEventListener('click', function(){
    window.print();
  });

  // WhatsApp buttons
  document.getElementById('sendBuyer').addEventListener('click', function(){
    const no = localStorage.getItem('last_buyer') || document.getElementById('buyer_phone').value;
    if(!no){alert('कृपया ग्राहक का फोन भरें');return;}
    const msg = 'आपका ईंट चालान तैयार है। कृपया इसे चेक करें।';
    window.open('https://wa.me/91'+no+'?text='+encodeURIComponent(msg));
  });
  document.getElementById('sendDriver').addEventListener('click', function(){
    const no = localStorage.getItem('last_driver') || document.getElementById('driver_phone').value;
    if(!no){alert('कृपया ड्राइवर का फोन भरें');return;}
    const msg = 'डिलीवरी चालान संलग्न है।';
    window.open('https://wa.me/91'+no+'?text='+encodeURIComponent(msg));
  });
  document.getElementById('sendOwner').addEventListener('click', function(){
    const no = localStorage.getItem('last_owner') || '9654275704';
    const msg = 'नया चालान जनरेट हुआ है।';
    window.open('https://wa.me/91'+no+'?text='+encodeURIComponent(msg));
  });

});