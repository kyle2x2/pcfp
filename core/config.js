// PCFP v8.2 - BuilderTrend Competitor Foundation
// API-First Architecture with Enhanced Performance & Flexibility

// Single source of truth for app metadata - API-ready structure
export const APP_META = {
  build: "v8.2",
  appName: "PCFP - Project Construction Financial Planner",
  copyright: "© 2x2 Construction",
  version: "8.2.0",
  apiVersion: "v1",
  description: "Modern construction project management platform - BuilderTrend alternative",
  features: {
    apiReady: true,
    modular: true,
    scalable: true,
    performanceOptimized: true
  }
};

// Legacy support - will be removed in future versions
window.APP_BUILD = APP_META.build;

// Individual module versions - each module has its own version
// All modules are independent, including payment-planner
window.MODULE_VERS = {
  "payments": "v1.0",        // Payment-planner is now independent
  "schedule": "v1.0",        // All other modules are v1.0
  "logs": "v1.0",            // All other modules are v1.0
  "todos": "v1.0",           // All other modules are v1.0
  "changes": "v1.0",         // All other modules are v1.0
  "selections": "v1.0",      // All other modules are v1.0
  "specs": "v1.0",           // All other modules are v1.0
  "docs": "v1.0",            // All other modules are v1.0
  "bids": "v1.0",            // All other modules are v1.0
  "pos": "v1.0",             // All other modules are v1.0
  "bills": "v1.0",           // All other modules are v1.0
  "budget": "v1.0",          // All other modules are v1.0
  "invoices": "v1.0"         // All other modules are v1.0
};

// API Configuration - Future-ready for Python backend
export const API_CONFIG = {
  baseUrl: '/api/v1',
  timeout: 30000,
  retryAttempts: 3,
  endpoints: {
    projects: '/projects',
    profiles: '/profiles',
    modules: '/modules',
    auth: '/auth'
  }
};

// Performance Configuration
export const PERFORMANCE_CONFIG = {
  cacheEnabled: true,
  lazyLoading: true,
  debounceDelay: 300,
  maxConcurrentRequests: 5
};
