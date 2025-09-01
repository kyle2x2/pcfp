// v6.4 core/events - tiny pub/sub
export function createEventBus(){
  const handlers = {};
  return {
    on(type, fn){
      (handlers[type] ||= new Set()).add(fn);
      return () => handlers[type]?.delete(fn);
    },
    emit(type, payload){
      (handlers[type]||[]).forEach(fn => { try { fn(payload); } catch(e){ console.error(e); } });
    }
  };
}
