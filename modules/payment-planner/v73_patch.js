
// modules/payment-planner/v73_patch.js  (stabilize UI & componentize hooks)
(function(){
  function onReady(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  function $(sel,ctx){ return (ctx||document).querySelector(sel); }
  function $all(sel,ctx){ return Array.prototype.slice.call((ctx||document).querySelectorAll(sel)); }

  // 1) Hide legacy inline duplicate/remove buttons (we'll use kebab menu only)
  function hideLegacyRowButtons(){
    $all('.btn-duplicate, .btn-remove, .row-actions-inline').forEach(el=>{ el.style.display='none'; });
  }

  // 2) Kebab close after action
  function closeKebabsAfterAction(){
    document.body.addEventListener('click', function(ev){
      const btn = ev.target.closest('.c-menu button, .c-menu a');
      if(!btn) return;
      // Close any open menus on next tick
      setTimeout(()=>{ $all('.c-menu').forEach(m=>m.remove()); }, 0);
    }, true);
  }

  // 3) Compute toggle persist per profile (via window.PCFP.ProfileRepo if available)
  async function persistComputeToggle(){
    const toggle = $('#btnToggleCompute, #btnComputeToggle'); // support both ids
    if(!toggle) return;
    const Repo = window.PCFP && window.PCFP.ProfileRepo;
    const PRJ = (window.__KERNEL_CTX__ && window.__KERNEL_CTX__.project_id) || localStorage.getItem('pcfp_active_project') || 'demo-project';
    const MOD = 'payment-planner';

    // Load current profile id from selector if possible
    const sel = $('#profiles');
    async function save(flag){
      try{
        if(!Repo) { localStorage.setItem('pcfp.computeVisible', String(!!flag)); return; }
        const profId = sel && sel.value;
        if(!profId) { localStorage.setItem('pcfp.computeVisible', String(!!flag)); return; }
        const arr = await Repo.list(PRJ, MOD);
        const p = arr.find(x=>x.id===profId);
        if(!p) return;
        p.payload = p.payload || {};
        p.payload.ui = p.payload.ui || {};
        p.payload.ui.computeVisible = !!flag;
        await Repo.save(PRJ, MOD, p);
      }catch(e){ console.warn('Persist compute toggle failed', e); }
    }

    // Initialize from profile/localStorage
    try{
      let initial = null;
      const arr = (Repo && await Repo.list(PRJ, MOD)) || [];
      const profId = sel && sel.value;
      if(Repo && profId){
        const p = arr.find(x=>x.id===profId);
        if(p && p.payload && p.payload.ui) initial = !!p.payload.ui.computeVisible;
      }
      if(initial==null){
        const ls = localStorage.getItem('pcfp.computeVisible');
        if(ls!=null) initial = (ls==='true');
      }
      if(initial!=null){
        document.body.classList.toggle('compute-visible', initial);
      }
    }catch(e){}

    toggle.addEventListener('click', function(){
      const now = !document.body.classList.contains('compute-visible');
      document.body.classList.toggle('compute-visible', now);
      save(now);
    });
  }

  // 4) Make Scope table horizontally scrollable (like cash-flow grid) without sticky columns
  function scopeGridify(){
    const wrap = $('#scopeTableWrap') || $('#scope-wrap') || $('#scopeContainer');
    const table = wrap && wrap.querySelector('table');
    if(!table || !wrap) return;
    wrap.classList.add('grid-scroll-wrap');
    // ensure table min-width for many columns
    table.style.minWidth = '1200px';
  }

  // 5) Align summary row horizontally & deposit/export row under it (expect container ids)
  function fixSummaryLayout(){
    const sum = $('#summary-row');
    if(!sum) return;
    sum.classList.add('summary-inline');
    const row2 = $('#summary-row-2');
    if(row2){ row2.classList.add('summary-inline-row2'); }
  }

  // 6) Ensure cash-flow header/body stay aligned by enforcing equal column template via CSS var
  function enforceCashflowGrid(){
    const grid = $('#cashflowGrid');
    const header = $('#cashflowHeader');
    if(!grid || !header) return;
    // Read header column count and set a CSS var to both sections
    const cols = header.querySelectorAll('.col').length || 0;
    if(cols>0){
      document.documentElement.style.setProperty('--cf-col-count', cols);
    }
  }

  onReady(function(){
    hideLegacyRowButtons();
    closeKebabsAfterAction();
    persistComputeToggle();
    scopeGridify();
    fixSummaryLayout();
    enforceCashflowGrid();
  });
})();
