(function(g){
  // Updated to use new event system instead of old bus
  const events = g.PCFP && g.PCFP.events;
  const router = g.PCFP && g.PCFP.router;
  if(!events || !router) return;
  
  events.on('route:enter', ({module, params})=>{
    // Broadcast lifecycle for modules to listen
    events.emit('module:enter:'+module, {params});
  });
  events.on('route:leave', ({module})=>{
    events.emit('module:leave:'+module, {});
  });
  router.start();
})(window);
