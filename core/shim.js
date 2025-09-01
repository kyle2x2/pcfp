// v8.4 shim to expose modules as globals for file://
import { createEventBus } from './services/events.js';
import { createStore, loadPersisted } from './services/store.js';
import { createLocalAdapter } from './services/adapters.js';
import { computeMonthly } from './compute/money.js';
import { moduleManager } from './services/module-manager.js';
import { safe, safeAsync, logError, performanceMonitor, createErrorBoundary } from './services/errors.js';
import { sanitizeHTML, safeSetInnerHTML, validateInput, safeJSONParse } from './services/security.js';
import { domCache } from './services/dom.js';
import { memoryManager } from './services/memory-manager.js';
import { stateManager } from './services/state-manager.js';

window.__pcfpCore = { 
  createEventBus, 
  createStore, 
  loadPersisted, 
  createLocalAdapter,
  moduleManager,
  safe,
  safeAsync,
  logError,
  performanceMonitor,
  createErrorBoundary,
  // New v8.4 services
  sanitizeHTML,
  safeSetInnerHTML,
  validateInput,
  safeJSONParse,
  domCache,
  memoryManager,
  stateManager
};
window.__pcfpCompute = { computeMonthly };
