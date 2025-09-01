(function(g){
  const bus = g.PCFP && g.PCFP.bus;
  const router = g.PCFP && g.PCFP.router;
  if(!bus || !router) return;
  bus.on('route:enter', ({module, params})=>{
    // Broadcast lifecycle for modules to listen
    bus.emit('module:enter:'+module, {params});
  });
  bus.on('route:leave', ({module})=>{
    bus.emit('module:leave:'+module, {});
  });
  router.start();
})(window);
