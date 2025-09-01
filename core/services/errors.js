// core/services/errors.js - Error handling helpers
export function safe(fn, context) { 
  try { 
    return fn(); 
  } catch (e) { 
    console.error("[PCFP]", context, e); 
    return null; 
  } 
}

export function assert(cond, msg) { 
  if (!cond) { 
    throw new Error("[PCFP] " + msg); 
  } 
}

// Additional error helpers
export function safeAsync(fn, context) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (e) {
      console.error("[PCFP]", context, e);
      return null;
    }
  };
}

export function logError(error, context = 'Unknown') {
  console.error(`[PCFP] Error in ${context}:`, error);
  // Could add error reporting service here in the future
}
