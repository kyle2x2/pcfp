// ARCHIVED: This file has been moved to _archive/core/kernel.esm.js
// The application now uses core/kernel.standalone.js for file:// compatibility
// This file is kept for reference but should not be imported or used

// core/kernel.js (v6.1.5 core-proof router fix)
import { createStore } from './store/store.js';
import { createEvents } from './store/events.js';

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

function navigate(hash){
  const r = routes[hash] || routes['#/payments'];
  if (!r) return;
  if (titleEl) titleEl.textContent = r.title;
  if (frame) frame.setAttribute('src', r.src);
  updateActive();
  frame?.contentWindow?.postMessage({ type:'kernel:route', hash }, '*');
}

function updateActive(){
  const navItems = Array.from(document.querySelectorAll('[data-route]'));
  const h = location.hash || '#/payments';
  navItems.forEach(a=> a.classList.toggle('active', (a.getAttribute('href') || a.dataset.route) === h));
}

window.addEventListener('hashchange', ()=> navigate(location.hash || '#/payments'));
window.addEventListener('load', ()=> {
  updateActive();
  navigate(location.hash || '#/payments');
});
