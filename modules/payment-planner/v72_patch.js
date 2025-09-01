
// modules/payment-planner/v72_patch.js
(function(){
  var PRJ = (window.__KERNEL_CTX__ && window.__KERNEL_CTX__.project_id) || localStorage.getItem('pcfp_active_project') || 'demo-project';
  var MOD = 'payment-planner';
  var Repo = (window.PCFP && window.PCFP.ProfileRepo);

  function $(s){ return document.querySelector(s); }
  function h(str){ var d=document.createElement('div'); d.textContent=str; return d.innerHTML; }

  async function refreshProfiles_v72(){
    if(!Repo) return;
    var sel = $("#profiles"); if(!sel) return;
    var arr = await Repo.list(PRJ, MOD);
    sel.innerHTML = '<option value="">-- Select profile --</option>';
    arr.forEach(function(p){
      var opt = document.createElement('option');
      opt.value = p.id; opt.textContent = p.name;
      sel.appendChild(opt);
    });
  }

  async function saveProfile_v72(){
    if(!Repo) return (window.saveProfile && window.saveProfile());
    var name = prompt("Profile name:"); if(!name) return;
    var payload = (window.captureState && window.captureState()) || {};
    try{
      var saved = await Repo.save(PRJ, MOD, { id: payload.id || null, name: name, payload: payload });
      alert("Saved '"+saved.name+"'");
      refreshProfiles_v72();
    } catch(e){ alert("Save failed: "+e.message); }
  }

  async function loadProfile_v72(){
    if(!Repo) return (window.loadProfile && window.loadProfile());
    var sel = $("#profiles"); if(!sel || !sel.value) return;
    var arr = await Repo.list(PRJ, MOD);
    var p = arr.find(x=>x.id===sel.value);
    if(!p){ alert("Profile not found."); return; }
    if(window.applyState) window.applyState(p.payload);
  }

  // Hook up on DOM ready
  window.addEventListener('DOMContentLoaded', function(){
    // replace UI events if buttons exist
    var saveBtn = $("#btnSaveProfile");
    if(saveBtn) saveBtn.addEventListener('click', saveProfile_v72);

    var sel = $("#profiles");
    if(sel) sel.addEventListener('change', loadProfile_v72);

    refreshProfiles_v72();

    // Close menus after any action click (safety)
    document.body.addEventListener('click', function(ev){
      var b = ev.target.closest('.c-menu button');
      if(b){ setTimeout(function(){ document.querySelectorAll('.c-menu').forEach(m=>m.remove()); }, 0); }
    }, true);
  });
})();
