// v8.1 core/events - enhanced pub/sub with error handling
export function createEventBus(){
  const handlers = {};
  return {
    on(type, fn){
      (handlers[type] ||= new Set()).add(fn);
      return () => handlers[type]?.delete(fn);
    },
    off(type, fn){
      handlers[type]?.delete(fn);
    },
    emit(type, payload){
      try {
        (handlers[type]||[]).forEach(fn => { 
          try { 
            fn(payload); 
          } catch(e){ 
            console.error(`Event handler error for ${type}:`, e); 
          } 
        });
      } catch(e) {
        console.error(`Event emission error for ${type}:`, e);
      }
    },
    // Debug helper
    debug(){
      const types = Object.keys(handlers);
      console.log('Active event types:', types);
      types.forEach(type => {
        console.log(`  ${type}: ${handlers[type].size} handlers`);
      });
    }
  };
}
