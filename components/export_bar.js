
// components/export_bar.js - universal exports (v7.2)
(function(){
  window.PCFP = window.PCFP || {};
  var contracts = window.PCFP.contracts;
  function toCSV(rows){
    return rows.map(r => r.map(v=>(''+(v??'')).replace(/"/g,'""')).map(v=>`"${v}"`).join(',')).join('\n');
  }
  function toOwnerHTML(state){
    var s = state.settings||{}; var cash = state.cashflow||[];
    var html = '<!doctype html><meta charset="utf-8"><title>Owner Cash Flow</title>';
    html += '<style>body{font:14px system-ui;padding:24px} h1{margin:0 0 16px} table{border-collapse:collapse;width:100%} th,td{border:1px solid #ddd;padding:8px;text-align:right} th:first-child,td:first-child{text-align:left}</style>';
    html += '<h1>Owner Cash Flow</h1>';
    html += '<div>Weeks: '+(s.projectWeeks||'')+' &nbsp; Markup: '+(s.markupPct||0)+'%</div>';
    html += '<table><thead><tr><th>Week</th><th>Pre-HST</th><th>HST</th><th>Total</th></tr></thead><tbody>';
    cash.forEach(function(w,i){
      var pre = +w.pre||0, hst = +w.hst||0, tot = pre+hst;
      html += '<tr><td>'+(i+1)+'</td><td>'+pre.toFixed(2)+'</td><td>'+hst.toFixed(2)+'</td><td>'+tot.toFixed(2)+'</td></tr>';
    });
    html += '</tbody></table>';
    return html;
  }

  window.PCFP.exportBar = {
    render: function(container, opts){
      opts = opts||{};
      var el = document.createElement('div');
      el.className = 'export-bar';
      el.innerHTML = '<button id="expOwner">Owner PDF</button> <button id="expCSV">CSV</button> <button id="expJSON">JSON</button>';
      container.appendChild(el);

      el.querySelector('#expOwner').addEventListener('click', function(){
        try {
          var state = (opts.captureState||window.captureState)();
          var html = toOwnerHTML(state);
          var blob = new Blob([html], {type:'text/html'});
          var a = document.createElement('a'); a.href = URL.createObjectURL(blob);
          a.download = 'Owner_Cash_Flow.html'; a.click();
        } catch(e){ alert('Owner export failed: '+e.message); }
      });

      el.querySelector('#expCSV').addEventListener('click', function(){
        try {
          var rows = (opts.captureCSV||window.captureCSV)();
          var csv = toCSV(rows);
          var blob = new Blob([csv], {type:'text/csv'});
          var a = document.createElement('a'); a.href = URL.createObjectURL(blob);
          a.download = 'Payment_Cash_Flow.csv'; a.click();
        } catch(e){ alert('CSV export failed: '+e.message); }
      });

      el.querySelector('#expJSON').addEventListener('click', function(){
        try {
          var state = (opts.captureState||window.captureState)();
          var blob = new Blob([JSON.stringify(state,null,2)], {type:'application/json'});
          var a = document.createElement('a'); a.href = URL.createObjectURL(blob);
          a.download = 'Payment_Cash_Flow.json'; a.click();
        } catch(e){ alert('JSON export failed: '+e.message); }
      });
    }
  };
})();
