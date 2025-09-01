// v8.2 core/store - unified data access layer with persistence
export function createStore(initial){
  let state = structuredClone(initial || {});
  const subs = new Set();
  function notify(){ subs.forEach(fn => { try { fn(state); } catch(e){ console.error(e); } }); }
  return {
    get(){ return state; },
    set(patch){
      state = { ...state, ...patch };
      try{ localStorage.setItem('pcfp_store_v81', JSON.stringify(state)); }catch(_){}
      notify();
    },
    subscribe(fn){ subs.add(fn); return () => subs.delete(fn); }
  };
}

export function loadPersisted(defaults){
  try{
    const raw = localStorage.getItem('pcfp_store_v64');
    if(raw){ return { ...defaults, ...(JSON.parse(raw)||{}) }; }
  }catch(_){}
  return defaults;
}
