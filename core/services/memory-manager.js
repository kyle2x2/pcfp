// core/services/memory-manager.js - Memory Management for BuilderTrend Competitor
// Prevents memory leaks and manages resource cleanup

import { logError } from './errors.js';
import { PERFORMANCE_CONFIG } from '../config.js';

export class MemoryManager {
  constructor() {
    this.listeners = new Map();
    this.intervals = new Map();
    this.timeouts = new Map();
    this.observers = new Map();
    this.cleanupInterval = null;
    
    // Start automatic cleanup
    this.startCleanupInterval();
    
    // Track memory usage
    this.memoryStats = {
      startTime: Date.now(),
      cleanupCount: 0,
      lastCleanup: Date.now()
    };
  }
  
  // Register event listener with automatic cleanup
  addEventListener(element, event, handler, options = {}) {
    const key = `${element.id || 'unknown'}:${event}`;
    
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    
    const listenerSet = this.listeners.get(key);
    listenerSet.add({ element, event, handler, options });
    
    element.addEventListener(event, handler, options);
    
    return () => {
      this.removeEventListener(element, event, handler);
    };
  }
  
  // Remove specific event listener
  removeEventListener(element, event, handler) {
    const key = `${element.id || 'unknown'}:${event}`;
    const listenerSet = this.listeners.get(key);
    
    if (listenerSet) {
      const listener = Array.from(listenerSet).find(l => 
        l.element === element && l.handler === handler
      );
      
      if (listener) {
        listenerSet.delete(listener);
        element.removeEventListener(event, handler, listener.options);
      }
    }
  }
  
  // Set interval with automatic cleanup
  setInterval(callback, delay, context = 'unknown') {
    const intervalId = setInterval(callback, delay);
    const key = `${context}:${intervalId}`;
    
    this.intervals.set(key, {
      id: intervalId,
      callback,
      delay,
      context,
      createdAt: Date.now()
    });
    
    return intervalId;
  }
  
  // Clear interval
  clearInterval(intervalId, context = 'unknown') {
    const key = `${context}:${intervalId}`;
    const interval = this.intervals.get(key);
    
    if (interval) {
      clearInterval(intervalId);
      this.intervals.delete(key);
    }
  }
  
  // Set timeout with automatic cleanup
  setTimeout(callback, delay, context = 'unknown') {
    const timeoutId = setTimeout(callback, delay);
    const key = `${context}:${timeoutId}`;
    
    this.timeouts.set(key, {
      id: timeoutId,
      callback,
      delay,
      context,
      createdAt: Date.now()
    });
    
    return timeoutId;
  }
  
  // Clear timeout
  clearTimeout(timeoutId, context = 'unknown') {
    const key = `${context}:${timeoutId}`;
    const timeout = this.timeouts.get(key);
    
    if (timeout) {
      clearTimeout(timeoutId);
      this.timeouts.delete(key);
    }
  }
  
  // Register observer with automatic cleanup
  addObserver(observer, context = 'unknown') {
    const key = `${context}:${Date.now()}`;
    this.observers.set(key, {
      observer,
      context,
      createdAt: Date.now()
    });
    
    return key;
  }
  
  // Disconnect observer
  disconnectObserver(key) {
    const observerData = this.observers.get(key);
    if (observerData) {
      observerData.observer.disconnect();
      this.observers.delete(key);
    }
  }
  
  // Start automatic cleanup interval
  startCleanupInterval() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, PERFORMANCE_CONFIG.memoryCleanupInterval);
  }
  
  // Stop cleanup interval
  stopCleanupInterval() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
  
  // Cleanup expired resources
  cleanup() {
    const now = Date.now();
    const maxAge = PERFORMANCE_CONFIG.memoryCleanupInterval * 2;
    
    // Cleanup old intervals
    for (const [key, interval] of this.intervals) {
      if (now - interval.createdAt > maxAge) {
        this.clearInterval(interval.id, interval.context);
      }
    }
    
    // Cleanup old timeouts
    for (const [key, timeout] of this.timeouts) {
      if (now - timeout.createdAt > maxAge) {
        this.clearTimeout(timeout.id, timeout.context);
      }
    }
    
    // Cleanup old observers
    for (const [key, observerData] of this.observers) {
      if (now - observerData.createdAt > maxAge) {
        this.disconnectObserver(key);
      }
    }
    
    // Update stats
    this.memoryStats.cleanupCount++;
    this.memoryStats.lastCleanup = now;
  }
  
  // Force cleanup all resources
  forceCleanup() {
    // Clear all intervals
    this.intervals.forEach((interval, key) => {
      clearInterval(interval.id);
    });
    this.intervals.clear();
    
    // Clear all timeouts
    this.timeouts.forEach((timeout, key) => {
      clearTimeout(timeout.id);
    });
    this.timeouts.clear();
    
    // Disconnect all observers
    this.observers.forEach((observerData, key) => {
      observerData.observer.disconnect();
    });
    this.observers.clear();
    
    // Clear all listeners
    this.listeners.forEach((listenerSet, key) => {
      listenerSet.forEach(listener => {
        listener.element.removeEventListener(listener.event, listener.handler);
      });
    });
    this.listeners.clear();
  }
  
  // Get memory statistics
  getStats() {
    return {
      ...this.memoryStats,
      listeners: this.listeners.size,
      intervals: this.intervals.size,
      timeouts: this.timeouts.size,
      observers: this.observers.size,
      uptime: Date.now() - this.memoryStats.startTime
    };
  }
  
  // Create module lifecycle manager
  createModuleLifecycle(moduleKey) {
    return {
      addListener: (element, event, handler, options) => {
        return this.addEventListener(element, event, handler, options);
      },
      setInterval: (callback, delay) => {
        return this.setInterval(callback, delay, moduleKey);
      },
      setTimeout: (callback, delay) => {
        return this.setTimeout(callback, delay, moduleKey);
      },
      addObserver: (observer) => {
        return this.addObserver(observer, moduleKey);
      },
      cleanup: () => {
        // Cleanup all resources for this module
        this.intervals.forEach((interval, key) => {
          if (interval.context === moduleKey) {
            this.clearInterval(interval.id, moduleKey);
          }
        });
        
        this.timeouts.forEach((timeout, key) => {
          if (timeout.context === moduleKey) {
            this.clearTimeout(timeout.id, moduleKey);
          }
        });
        
        this.observers.forEach((observerData, key) => {
          if (observerData.context === moduleKey) {
            this.disconnectObserver(key);
          }
        });
      }
    };
  }
}

// Create global memory manager instance
export const memoryManager = new MemoryManager();

// Expose to window for global access
if (typeof window !== 'undefined') {
  window.PCFP = window.PCFP || {};
  window.PCFP.memoryManager = memoryManager;
}
