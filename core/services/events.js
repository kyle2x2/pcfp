// v8.2 core/events - Enhanced Event System for BuilderTrend Competitor
// Performance-optimized with API-ready architecture

import { performanceMonitor, logError } from './errors.js';
import { PERFORMANCE_CONFIG } from '../config.js';

export function createEventBus(){
  const handlers = {};
  const performanceMetrics = {};
  
  return {
    on(type, fn){
      (handlers[type] ||= new Set()).add(fn);
      return () => handlers[type]?.delete(fn);
    },
    
    off(type, fn){
      handlers[type]?.delete(fn);
    },
    
    emit(type, payload){
      const start = performance.now();
      try {
        const handlersForType = handlers[type] || [];
        if (handlersForType.length === 0) {
          // No handlers - this is normal, not an error
          return;
        }
        
        handlersForType.forEach(fn => { 
          try { 
            fn(payload); 
          } catch(e){ 
            logError(e, `event:${type}`);
          } 
        });
        
        // Performance tracking
        const duration = performance.now() - start;
        if (duration > 100) { // Log slow event handlers
          console.warn(`[PCFP] Slow event handler: ${type} took ${duration.toFixed(2)}ms`);
        }
        
        // Track metrics for future optimization
        if (!performanceMetrics[type]) {
          performanceMetrics[type] = { count: 0, totalTime: 0 };
        }
        performanceMetrics[type].count++;
        performanceMetrics[type].totalTime += duration;
        
      } catch(e) {
        logError(e, `event-emission:${type}`);
      }
    },
    
    // Debug helper with performance insights
    debug(){
      const types = Object.keys(handlers);
      console.log('=== PCFP Event System Debug ===');
      console.log('Active event types:', types);
      types.forEach(type => {
        const count = handlers[type].size;
        const metrics = performanceMetrics[type];
        const avgTime = metrics ? (metrics.totalTime / metrics.count).toFixed(2) : 'N/A';
        console.log(`  ${type}: ${count} handlers, avg: ${avgTime}ms`);
      });
      console.log('==============================');
    },
    
    // Performance insights
    getPerformanceMetrics() {
      return performanceMetrics;
    },
    
    // API-ready event system
    async emitAsync(type, payload) {
      const asyncHandlers = [];
      const syncHandlers = [];
      
      (handlers[type] || []).forEach(fn => {
        if (fn.constructor.name === 'AsyncFunction') {
          asyncHandlers.push(fn);
        } else {
          syncHandlers.push(fn);
        }
      });
      
      // Execute sync handlers first
      syncHandlers.forEach(fn => {
        try { fn(payload); } catch(e) { logError(e, `event:${type}`); }
      });
      
      // Execute async handlers in parallel (with concurrency limit)
      if (asyncHandlers.length > 0) {
        const chunks = [];
        for (let i = 0; i < asyncHandlers.length; i += PERFORMANCE_CONFIG.maxConcurrentRequests) {
          chunks.push(asyncHandlers.slice(i, i + PERFORMANCE_CONFIG.maxConcurrentRequests));
        }
        
        for (const chunk of chunks) {
          await Promise.allSettled(
            chunk.map(fn => fn(payload).catch(e => logError(e, `event:${type}`)))
          );
        }
      }
    }
  };
}
