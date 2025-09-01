// core/services/module-manager.js - Enhanced Module Management System
// Provides standardized module communication, state management, and lifecycle

import { safe, logError, createErrorBoundary } from './errors.js';
import { PERFORMANCE_CONFIG } from '../config.js';

export class ModuleManager {
  constructor() {
    this.modules = new Map();
    this.moduleStates = new Map();
    this.sharedData = new Map();
    this.eventHandlers = new Map();
  }

  // Register a module
  register(moduleKey, moduleConfig) {
    safe(() => {
      this.modules.set(moduleKey, {
        ...moduleConfig,
        registeredAt: Date.now(),
        status: 'registered'
      });
      
      console.log(`[PCFP] Module registered: ${moduleKey} v${moduleConfig.version}`);
    }, `module:register:${moduleKey}`);
  }

  // Initialize a module
  async initialize(moduleKey, params = {}) {
    return safe(async () => {
      const module = this.modules.get(moduleKey);
      if (!module) {
        throw new Error(`Module not found: ${moduleKey}`);
      }

      // Set module state
      this.moduleStates.set(moduleKey, {
        status: 'initializing',
        params,
        startedAt: Date.now(),
        lastActivity: Date.now()
      });

      // Emit module initialization event
      this.emit('module:initializing', { moduleKey, params });

      // Initialize module-specific logic
      if (module.onInitialize) {
        await module.onInitialize(params);
      }

      // Update state
      this.moduleStates.set(moduleKey, {
        ...this.moduleStates.get(moduleKey),
        status: 'active',
        initializedAt: Date.now()
      });

      this.emit('module:initialized', { moduleKey, params });
      console.log(`[PCFP] Module initialized: ${moduleKey}`);
      
      return true;
    }, `module:initialize:${moduleKey}`);
  }

  // Get module state
  getModuleState(moduleKey) {
    return this.moduleStates.get(moduleKey) || { status: 'unknown' };
  }

  // Get all module states
  getAllModuleStates() {
    const states = {};
    for (const [key, state] of this.moduleStates) {
      states[key] = state;
    }
    return states;
  }

  // Share data between modules
  setSharedData(key, data, moduleKey = 'global') {
    safe(() => {
      this.sharedData.set(key, {
        data,
        moduleKey,
        timestamp: Date.now(),
        version: 1
      });
      
      this.emit('data:shared', { key, data, moduleKey });
    }, `module:setSharedData:${key}`);
  }

  // Get shared data
  getSharedData(key) {
    const shared = this.sharedData.get(key);
    return shared ? shared.data : null;
  }

  // Get all shared data
  getAllSharedData() {
    const data = {};
    for (const [key, shared] of this.sharedData) {
      data[key] = shared.data;
    }
    return data;
  }

  // Module communication
  sendMessage(fromModule, toModule, message) {
    safe(() => {
      const messageObj = {
        from: fromModule,
        to: toModule,
        message,
        timestamp: Date.now(),
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      this.emit('module:message', messageObj);
      
      // Update module activity
      if (this.moduleStates.has(fromModule)) {
        const state = this.moduleStates.get(fromModule);
        state.lastActivity = Date.now();
        this.moduleStates.set(fromModule, state);
      }
    }, `module:sendMessage:${fromModule}:${toModule}`);
  }

  // Subscribe to module events
  on(event, handler, moduleKey = 'global') {
    const key = `${event}:${moduleKey}`;
    if (!this.eventHandlers.has(key)) {
      this.eventHandlers.set(key, new Set());
    }
    this.eventHandlers.get(key).add(handler);
    
    return () => {
      const handlers = this.eventHandlers.get(key);
      if (handlers) {
        handlers.delete(handler);
      }
    };
  }

  // Emit module events
  emit(event, data) {
    safe(() => {
      // Global handlers
      const globalKey = `${event}:global`;
      const globalHandlers = this.eventHandlers.get(globalKey);
      if (globalHandlers) {
        globalHandlers.forEach(handler => {
          try {
            handler(data);
          } catch (e) {
            logError(e, `module:event:${event}:global`);
          }
        });
      }

      // Module-specific handlers
      if (data.moduleKey) {
        const moduleKey = `${event}:${data.moduleKey}`;
        const moduleHandlers = this.eventHandlers.get(moduleKey);
        if (moduleHandlers) {
          moduleHandlers.forEach(handler => {
            try {
              handler(data);
            } catch (e) {
              logError(e, `module:event:${event}:${data.moduleKey}`);
            }
          });
        }
      }
    }, `module:emit:${event}`);
  }

  // Get module performance metrics
  getModuleMetrics() {
    const metrics = {};
    for (const [key, state] of this.moduleStates) {
      metrics[key] = {
        status: state.status,
        uptime: Date.now() - (state.startedAt || Date.now()),
        lastActivity: state.lastActivity ? Date.now() - state.lastActivity : 0
      };
    }
    return metrics;
  }

  // Cleanup module
  cleanup(moduleKey) {
    safe(() => {
      this.moduleStates.delete(moduleKey);
      this.emit('module:cleanup', { moduleKey });
      console.log(`[PCFP] Module cleaned up: ${moduleKey}`);
    }, `module:cleanup:${moduleKey}`);
  }

  // Get module info
  getModuleInfo(moduleKey) {
    const module = this.modules.get(moduleKey);
    const state = this.moduleStates.get(moduleKey);
    
    return {
      ...module,
      state,
      sharedDataCount: Array.from(this.sharedData.keys()).filter(key => 
        this.sharedData.get(key).moduleKey === moduleKey
      ).length
    };
  }

  // Debug information
  debug() {
    console.log('=== PCFP Module Manager Debug ===');
    console.log('Registered Modules:', Array.from(this.modules.keys()));
    console.log('Module States:', this.getAllModuleStates());
    console.log('Shared Data Keys:', Array.from(this.sharedData.keys()));
    console.log('Event Handlers:', Array.from(this.eventHandlers.keys()));
    console.log('Performance Metrics:', this.getModuleMetrics());
    console.log('================================');
  }
}

// Create global module manager instance
export const moduleManager = new ModuleManager();

// Expose to window for module access
if (typeof window !== 'undefined') {
  window.PCFP = window.PCFP || {};
  window.PCFP.moduleManager = moduleManager;
}
