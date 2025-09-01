// core/services/dom.js - DOM Performance Optimization for BuilderTrend Competitor
// Caches DOM queries and provides optimized DOM manipulation

import { logError } from './errors.js';
import { PERFORMANCE_CONFIG } from '../config.js';

export class DOMCache {
  constructor() {
    this.cache = new Map();
    this.observers = new Map();
    this.cleanupInterval = null;
    
    // Auto-cleanup cache periodically
    if (PERFORMANCE_CONFIG.domCacheEnabled) {
      this.startCleanupInterval();
    }
  }
  
  // Query with caching
  query(selector, context = document) {
    const key = `${selector}:${context === document ? 'doc' : 'ctx'}`;
    
    if (!this.cache.has(key)) {
      try {
        const element = context.querySelector(selector);
        this.cache.set(key, element);
      } catch (e) {
        logError(e, `dom:query:${selector}`);
        return null;
      }
    }
    
    return this.cache.get(key);
  }
  
  // Query all with caching
  queryAll(selector, context = document) {
    const key = `all:${selector}:${context === document ? 'doc' : 'ctx'}`;
    
    if (!this.cache.has(key)) {
      try {
        const elements = context.querySelectorAll(selector);
        this.cache.set(key, Array.from(elements));
      } catch (e) {
        logError(e, `dom:queryAll:${selector}`);
        return [];
      }
    }
    
    return this.cache.get(key);
  }
  
  // Get element by ID with caching
  getById(id) {
    return this.query(`#${id}`);
  }
  
  // Get elements by class with caching
  getByClass(className) {
    return this.queryAll(`.${className}`);
  }
  
  // Clear specific cache entry
  clearCache(selector, context = document) {
    const key = `${selector}:${context === document ? 'doc' : 'ctx'}`;
    this.cache.delete(key);
  }
  
  // Clear all cache
  clear() {
    this.cache.clear();
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
  
  // Cleanup invalid cache entries
  cleanup() {
    for (const [key, element] of this.cache) {
      // Check if element still exists in DOM
      if (element && !document.contains(element)) {
        this.cache.delete(key);
      }
    }
  }
  
  // Observe DOM changes
  observe(selector, callback, options = {}) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const element = this.query(selector);
          if (element) {
            callback(element);
          }
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      ...options
    });
    
    this.observers.set(selector, observer);
    return observer;
  }
  
  // Disconnect observer
  disconnectObserver(selector) {
    const observer = this.observers.get(selector);
    if (observer) {
      observer.disconnect();
      this.observers.delete(selector);
    }
  }
  
  // Disconnect all observers
  disconnectAll() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
  
  // Get cache statistics
  getStats() {
    return {
      cacheSize: this.cache.size,
      observerCount: this.observers.size,
      cleanupInterval: this.cleanupInterval ? 'active' : 'inactive'
    };
  }
}

// Create global DOM cache instance
export const domCache = new DOMCache();

// Expose to window for global access
if (typeof window !== 'undefined') {
  window.PCFP = window.PCFP || {};
  window.PCFP.domCache = domCache;
}
