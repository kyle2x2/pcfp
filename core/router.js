// core/router.js - hash router with named modules & query params
(function(g){
  const bus = (g.PCFP = g.PCFP || {}, g.PCFP.bus);
  const Router = {
    current: { module: null, params: {} },
    parse(){
      const h = g.location.hash.replace(/^#\/?/, '');
      const [path, q] = h.split('?');
      const segs = (path||'').split('/').filter(Boolean);
      const module = segs[1] || segs[0] || 'payment-planner';
      const params = {};
      if(q){ q.split('&').forEach(p=>{ const [k,v]=p.split('='); params[decodeURIComponent(k)]=decodeURIComponent(v||''); }); }
      return { module, params };
    },
    go(module, params={}){
      const q = Object.keys(params).map(k=>`${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&');
      g.location.hash = `#/module/${module}` + (q ? ('?'+q) : '');
    },
    start(){
      function apply(){
        const next = Router.parse();
        const prev = Router.current;
        if(prev.module !== next.module){
          bus && bus.emit('route:leave', prev);
          Router.current = next;
          bus && bus.emit('route:enter', next);
        }else{
          Router.current = next;
          bus && bus.emit('route:params', next);
        }
      }
      g.addEventListener('hashchange', apply);
      apply();
    }
  };
  g.PCFP.router = Router;
})(window);
