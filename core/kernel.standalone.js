// core/kernel.standalone.js (v6.1.6 file:// safe)
(function(){
  const routes = {
    '#/payments':        { title: 'Payment Planner',  src: 'modules/payment-planner/index.html' },
    '#/schedule':        { title: 'Schedule',         src: 'modules/schedule/index.html' },
    '#/daily-logs':      { title: 'Daily Logs',       src: 'modules/daily-logs/index.html' },
    '#/to-dos':          { title: 'To‑Dos',           src: 'modules/to-dos/index.html' },
    '#/change-orders':   { title: 'Change Orders',    src: 'modules/change-orders/index.html' },
    '#/selections':      { title: 'Selections',       src: 'modules/selections/index.html' },
    '#/specifications':  { title: 'Specifications',   src: 'modules/specifications/index.html' },
    '#/documents':       { title: 'Documents',        src: 'modules/documents/index.html' },
    '#/bids':            { title: 'Bids',             src: 'modules/bids/index.html' },
    '#/purchase-orders': { title: 'Purchase Orders',  src: 'modules/purchase-orders/index.html' },
    '#/bills':           { title: 'Bills',            src: 'modules/bills/index.html' },
    '#/budget':          { title: 'Budget',           src: 'modules/budget/index.html' },
    '#/invoices':        { title: 'Invoices',         src: 'modules/invoices/index.html' },
  };

  const frame = document.getElementById('module-frame');
  const titleEl = document.getElementById('module-title');

  function updateActive(){
    var items = Array.prototype.slice.call(document.querySelectorAll('[data-route]'));
    var h = location.hash || '#/payments';
    items.forEach(function(a){
      var isActive = (a.getAttribute('href') || a.getAttribute('data-route')) === h;
      if(isActive) a.classList.add('active'); else a.classList.remove('active');
    });
  }

  function navigate(hash){
    var r = routes[hash] || routes['#/payments'];
    if(!r) return;
    if(titleEl) titleEl.textContent = r.title;
    if(frame) frame.setAttribute('src', r.src);
    updateActive();
  }

  window.addEventListener('hashchange', function(){
    navigate(location.hash || '#/payments');
  });

  window.addEventListener('load', function(){
    if(!location.hash) location.replace('#/payments');
    updateActive();
    navigate(location.hash || '#/payments');
  });
})();