
// components/gantt/index.js - thin wrapper around existing gantt renderers
(function(){
  window.PCFP = window.PCFP || {};
  function defaultRender(container, tasks, opts){
    // If module provided a renderer, use it
    if(window.renderPaymentPlannerGantt){
      return window.renderPaymentPlannerGantt(container, tasks, opts||{});
    }
    // Fallback: simple blocks
    container.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.style.display='grid';
    wrap.style.gridAutoColumns='minmax(24px,auto)';
    wrap.style.gridAutoFlow='column';
    tasks.forEach(function(t){
      var d = document.createElement('div');
      d.textContent = t.name||'';
      d.style.padding='4px 8px'; d.style.margin='2px'; d.style.border='1px solid #ddd';
      wrap.appendChild(d);
    });
    container.appendChild(wrap);
  }
  window.PCFP.Gantt = { render: defaultRender };
})();
