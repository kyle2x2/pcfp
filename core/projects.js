(function(g){
  g.PCFP = g.PCFP || {};
  const key = 'pcfp_projects';
  function load(){ try{ return JSON.parse(localStorage.getItem(key))||{active:'demo', list:['demo']}; }catch(e){ return {active:'demo', list:['demo']}; } }
  function save(s){ localStorage.setItem(key, JSON.stringify(s)); }
  const api = {
    getActive(){ return load().active; },
    setActive(id){ const s=load(); if(!s.list.includes(id)) s.list.push(id); s.active=id; save(s); },
    list(){ return load().list.slice(); }
  };
  g.PCFP.projects = api;
})(window);
