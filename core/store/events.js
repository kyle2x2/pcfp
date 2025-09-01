export function createEvents(){
  const map = new Map();
  return {
    on(name, fn){ const l = map.get(name) || []; l.push(fn); map.set(name, l); return ()=>{ const a=map.get(name)||[]; const i=a.indexOf(fn); if(i>=0){a.splice(i,1); map.set(name,a);} }; },
    emit(name, payload){ (map.get(name)||[]).forEach(fn=>{ try{ fn(payload); } catch(e){ console.error(e); } }); }
  };
}
