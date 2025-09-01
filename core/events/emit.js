
(function(){
  window.PCFP = window.PCFP || {};
  var listeners = {};
  function on(event, cb){
    if(!listeners[event]) listeners[event] = [];
    listeners[event].push(cb);
    return function off(){ listeners[event] = (listeners[event]||[]).filter(fn=>fn!==cb); };
  }
  function emit(event, payload){
    (listeners[event] || []).forEach(fn => {
      try { fn(payload); } catch(e){ console.error("PCFP emit error", e); }
    });
  }
  window.PCFP.events = window.PCFP.events || {};
  window.PCFP.events.on = on;
  window.PCFP.events.emit = emit;
})();
