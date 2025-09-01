(function(g){
  g.PCFP = g.PCFP || {};
  const PREFIX = 'pcfp.profile.';
  async function list(projectId, module){
    const out=[];
    for(let i=0;i<localStorage.length;i++){
      const k=localStorage.key(i);
      if(k && k.startsWith(PREFIX+projectId+'.'+module+'.')){
        try{ out.push(JSON.parse(localStorage.getItem(k))); }catch(e){}
      }
    }
    return out.sort((a,b)=>a.name.localeCompare(b.name));
  }
  async function save(projectId, module, profile){
    const k = PREFIX+projectId+'.'+module+'.'+profile.id;
    localStorage.setItem(k, JSON.stringify(profile));
    return profile;
  }
  async function load(projectId, module, id){
    const k = PREFIX+projectId+'.'+module+'.'+id;
    const raw = localStorage.getItem(k);
    return raw ? JSON.parse(raw) : null;
  }
  async function remove(projectId, module, id){
    const k = PREFIX+projectId+'.'+module+'.'+id;
    localStorage.removeItem(k);
  }
  g.PCFP.ProfileRepo = { list, save, load, remove };
})(window);
