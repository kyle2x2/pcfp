// core/integrity_banner.js - tiny, auto-fading integrity banner
(function(g){
  function show(msg){
    var el = document.createElement('div');
    el.textContent = msg;
    el.style.position='fixed';
    el.style.left='12px';
    el.style.bottom='12px';
    el.style.padding='6px 10px';
    el.style.background='#111';
    el.style.color='#fff';
    el.style.borderRadius='6px';
    el.style.fontSize='12px';
    el.style.zIndex='99999';
    el.style.opacity='0.92';
    document.body.appendChild(el);
    setTimeout(function(){ try{ el.remove(); }catch(e){} }, 3500);
  }
  function onReady(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  onReady(function(){
    var v = (g.PCFP && g.PCFP.version) ? (g.PCFP.version.app+' • '+g.PCFP.version.build) : 'unknown';
    show('Integrity: Bus + Router + Contracts v2 loaded ('+ v +')');
    // Also stamp version pill if present
    var pill = document.querySelector('[data-app-version]');
    if(pill && g.PCFP && g.PCFP.version){
      pill.textContent = 'Build ' + g.PCFP.version.app;
    }
    // Dev console breadcrumb
    if(g.PCFP && g.PCFP.version){
      console.info('PCFP integrity:', g.PCFP.version);
    }
  });
})(window);