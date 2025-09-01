// core/bus.js - tiny pub/sub event bus
(function(global){
  const subs = {};
  function on(evt, fn){ (subs[evt] = subs[evt] || []).push(fn); return () => off(evt, fn); }
  function off(evt, fn){ const arr=subs[evt]||[]; const i=arr.indexOf(fn); if(i>=0) arr.splice(i,1); }
  function emit(evt, payload){ (subs[evt]||[]).slice().forEach(fn=>{ try{ fn(payload);}catch(e){ console.error('bus handler',evt,e);} }); }
  global.PCFP = global.PCFP || {};
  global.PCFP.bus = { on, off, emit };
})(window);
