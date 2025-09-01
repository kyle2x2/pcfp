// core/services/state-manager.js - State Management for BuilderTrend Competitor
// Provides centralized state management and reactive data flow

import { logError } from './errors.js';
import { PERFORMANCE_CONFIG } from '../config.js';

export class StateManager {
  constructor() {
    this.state = new Map();
    this.subscribers = new Map();
    this.history = [];
    this.maxHistory = 50;
    this.isUpdating = false;
  }
  
  // Set state with history tracking
  setState(key, value, options = {}) {
    try {
      const oldValue = this.state.get(key);
      
      // Don't update if value hasn't changed
      if (JSON.stringify(oldValue) === JSON.stringify(value)) {
        return;
      }
      
      // Add to history
      this.addToHistory(key, oldValue, value);
      
      // Update state
      this.state.set(key, value);
      
      // Notify subscribers
      this.notifySubscribers(key, value, oldValue);
      
      // Emit global state change event
      this.emitStateChange(key, value, oldValue);
      
    } catch (e) {
      logError(e, `state:setState:${key}`);
    }
  }
  
  // Get state
  getState(key, defaultValue = null) {
    return this.state.has(key) ? this.state.get(key) : defaultValue;
  }
  
  // Get all state
  getAllState() {
    const allState = {};
    for (const [key, value] of this.state) {
      allState[key] = value;
    }
    return allState;
  }
  
  // Subscribe to state changes
  subscribe(key, callback, options = {}) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    
    const subscriberSet = this.subscribers.get(key);
    const subscriber = {
      callback,
      options,
      id: Date.now() + Math.random()
    };
    
    subscriberSet.add(subscriber);
    
    // Return unsubscribe function
    return () => {
      subscriberSet.delete(subscriber);
    };
  }
  
  // Subscribe to multiple keys
  subscribeMultiple(keys, callback) {
    const unsubscribers = keys.map(key => this.subscribe(key, callback));
    
    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }
  
  // Subscribe to all state changes
  subscribeAll(callback) {
    return this.subscribe('*', callback);
  }
  
  // Notify subscribers
  notifySubscribers(key, newValue, oldValue) {
    const subscriberSet = this.subscribers.get(key);
    if (subscriberSet) {
      subscriberSet.forEach(subscriber => {
        try {
          subscriber.callback(newValue, oldValue, key);
        } catch (e) {
          logError(e, `state:notify:${key}`);
        }
      });
    }
    
    // Notify global subscribers
    const globalSubscribers = this.subscribers.get('*');
    if (globalSubscribers) {
      globalSubscribers.forEach(subscriber => {
        try {
          subscriber.callback(newValue, oldValue, key);
        } catch (e) {
          logError(e, 'state:notify:global');
        }
      });
    }
  }
  
  // Add to history
  addToHistory(key, oldValue, newValue) {
    this.history.push({
      key,
      oldValue,
      newValue,
      timestamp: Date.now()
    });
    
    // Limit history size
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }
  
  // Get state history
  getHistory(key = null, limit = 10) {
    let history = this.history;
    
    if (key) {
      history = history.filter(entry => entry.key === key);
    }
    
    return history.slice(-limit);
  }
  
  // Undo last state change
  undo(key = null) {
    const history = this.getHistory(key, 1);
    if (history.length > 0) {
      const lastChange = history[0];
      this.setState(lastChange.key, lastChange.oldValue, { skipHistory: true });
      return true;
    }
    return false;
  }
  
  // Batch update multiple states
  batchUpdate(updates) {
    this.isUpdating = true;
    
    try {
      updates.forEach(({ key, value }) => {
        this.setState(key, value, { skipHistory: true });
      });
      
      // Notify all changes at once
      this.emitBatchUpdate(updates);
      
    } finally {
      this.isUpdating = false;
    }
  }
  
  // Emit state change event
  emitStateChange(key, newValue, oldValue) {
    if (typeof window !== 'undefined' && window.PCFP && window.PCFP.events) {
      window.PCFP.events.emit('state:changed', {
        key,
        newValue,
        oldValue,
        timestamp: Date.now()
      });
    }
  }
  
  // Emit batch update event
  emitBatchUpdate(updates) {
    if (typeof window !== 'undefined' && window.PCFP && window.PCFP.events) {
      window.PCFP.events.emit('state:batchUpdate', {
        updates,
        timestamp: Date.now()
      });
    }
  }
  
  // Create module-specific state manager
  createModuleState(moduleKey) {
    return {
      setState: (key, value) => {
        this.setState(`${moduleKey}:${key}`, value);
      },
      getState: (key, defaultValue) => {
        return this.getState(`${moduleKey}:${key}`, defaultValue);
      },
      subscribe: (key, callback) => {
        return this.subscribe(`${moduleKey}:${key}`, callback);
      },
      getAllState: () => {
        const allState = {};
        for (const [key, value] of this.state) {
          if (key.startsWith(`${moduleKey}:`)) {
            const moduleKey = key.replace(`${moduleKey}:`, '');
            allState[moduleKey] = value;
          }
        }
        return allState;
      }
    };
  }
  
  // Get state statistics
  getStats() {
    return {
      stateKeys: this.state.size,
      subscribers: Array.from(this.subscribers.values()).reduce((sum, set) => sum + set.size, 0),
      historySize: this.history.length,
      isUpdating: this.isUpdating
    };
  }
  
  // Clear all state
  clear() {
    this.state.clear();
    this.subscribers.clear();
    this.history = [];
  }
  
  // Export state
  export() {
    return {
      state: this.getAllState(),
      history: this.history,
      stats: this.getStats()
    };
  }
  
  // Import state
  import(data) {
    if (data.state) {
      Object.entries(data.state).forEach(([key, value]) => {
        this.setState(key, value, { skipHistory: true });
      });
    }
  }
}

// Create global state manager instance
export const stateManager = new StateManager();

// Expose to window for global access
if (typeof window !== 'undefined') {
  window.PCFP = window.PCFP || {};
  window.PCFP.stateManager = stateManager;
}
