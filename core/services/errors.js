// core/services/errors.js - Enhanced Error Handling for BuilderTrend Competitor
// Designed to prevent the performance and maintenance issues that plague legacy systems

import { PERFORMANCE_CONFIG } from '../config.js';

// Core error handling utilities
export function safe(fn, context) { 
  try { 
    return fn(); 
  } catch (e) { 
    logError(e, context);
    return null; 
  } 
}

export function assert(cond, msg) { 
  if (!cond) { 
    const error = new Error("[PCFP] " + msg);
    logError(error, 'assertion');
    throw error;
  } 
}

// Async error handling for API calls
export function safeAsync(fn, context) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (e) {
      logError(e, context);
      return null;
    }
  };
}

// Performance-aware error logging
export function logError(error, context = 'Unknown') {
  const timestamp = new Date().toISOString();
  const errorInfo = {
    timestamp,
    context,
    message: error.message,
    stack: error.stack,
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  console.error(`[PCFP] Error in ${context}:`, errorInfo);
  
  // Future: Send to error reporting service
  // sendToErrorService(errorInfo);
}

// API-specific error handling
export function handleApiError(response, context) {
  if (!response.ok) {
    const error = new Error(`API Error: ${response.status} ${response.statusText}`);
    logError(error, `API:${context}`);
    return null;
  }
  return response;
}

// Performance monitoring
export function performanceMonitor(fn, context) {
  return async (...args) => {
    const start = performance.now();
    try {
      const result = await fn(...args);
      const duration = performance.now() - start;
      
      // Log slow operations (potential BuilderTrend-like issues)
      if (duration > 1000) {
        console.warn(`[PCFP] Slow operation detected: ${context} took ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (e) {
      logError(e, context);
      throw e;
    }
  };
}

// Debounced error handling for UI operations
export function debouncedError(fn, delay = PERFORMANCE_CONFIG.debounceDelay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      safe(() => fn(...args), 'debounced');
    }, delay);
  };
}

// Error boundary for module isolation
export function createErrorBoundary(moduleName) {
  return {
    wrap: (fn) => {
      return (...args) => {
        try {
          return fn(...args);
        } catch (e) {
          logError(e, `module:${moduleName}`);
          // Graceful degradation - module continues working
          return null;
        }
      };
    }
  };
}
