(function(g){
  g.PCFP = g.PCFP || {};
  let enabled = false;
  g.PCFP.log = {
    enable(v){ enabled = !!v; },
    debug(){ if(enabled) console.debug('[PCFP]', ...arguments); },
    info(){ if(enabled) console.info('[PCFP]', ...arguments); },
    warn(){ console.warn('[PCFP]', ...arguments); },
    error(){ console.error('[PCFP]', ...arguments); }
  };
})(window);
