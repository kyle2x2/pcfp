
// core/verify/v73_integrity.js - fixed: scope compute toggle only to Payment Planner toolbar
(function(){
  function onReady(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  function $(s,c){ return (c||document).querySelector(s); }
  function $all(s,c){ return Array.prototype.slice.call((c||document).querySelectorAll(s)); }

  function ensureComputeToggle(){
    // Expect toggle button already present in Planner toolbar
    var btn = $('#btnToggleCompute') || $('#btnComputeToggle') || $('.compute-toggle-btn');
    if(!btn){
      console.warn('Compute toggle button not found in Planner toolbar. No fallback injected.');
      return;
    }

    function updateVisibility(flag){
      document.body.classList.toggle('compute-visible', !!flag);
      var cols = $all('.compute-col,[data-compute="true"]');
      cols.forEach(function(el){ el.style.display = flag ? '' : 'none'; });
      updateBtnLabel();
    }
    function updateBtnLabel(){
      var visible = document.body.classList.contains('compute-visible');
      if(btn){
        btn.setAttribute('aria-pressed', String(visible));
        btn.textContent = visible ? 'Hide formulas' : 'Show formulas';
      }
    }

    var Repo = window.PCFP && window.PCFP.ProfileRepo;
    var PRJ  = (window.__KERNEL_CTX__ && window.__KERNEL_CTX__.project_id) || localStorage.getItem('pcfp_active_project') || 'demo-project';
    var MOD  = 'payment-planner';
    var profSel = $('#profiles');

    async function loadPref(){
      try{
        if(Repo && profSel && profSel.value){
          const arr = await Repo.list(PRJ, MOD);
          const p = arr.find(x=>x.id===profSel.value);
          if(p && p.payload && p.payload.ui && typeof p.payload.ui.computeVisible==='boolean'){
            return !!p.payload.ui.computeVisible;
          }
        }
      }catch(e){}
      var ls = localStorage.getItem('pcfp.computeVisible');
      return ls ? (ls==='true') : false;
    }
    async function savePref(flag){
      try{
        if(Repo && profSel && profSel.value){
          const arr = await Repo.list(PRJ, MOD);
          const p = arr.find(x=>x.id===profSel.value);
          if(p){ p.payload = p.payload||{}; p.payload.ui = p.payload.ui||{}; p.payload.ui.computeVisible = !!flag; await Repo.save(PRJ, MOD, p); return; }
        }
      }catch(e){}
      localStorage.setItem('pcfp.computeVisible', String(!!flag));
    }

    btn.addEventListener('click', async function(){
      var now = !document.body.classList.contains('compute-visible');
      updateVisibility(now);
      await savePref(now);
    });

    loadPref().then(function(v){ updateVisibility(!!v); });

    if(profSel){
      profSel.addEventListener('change', async function(){ 
        var v = await loadPref(); 
        updateVisibility(!!v); 
      });
    }
  }

  onReady(function(){ ensureComputeToggle(); });
})();
