// PCFP v8.8.20 - BuilderTrend Competitor Foundation
// API-First Architecture with Enhanced Performance & Flexibility

// Single source of truth for app metadata - API-ready structure
export const APP_META = {
      build: "v8.8.20",
      appName: "PCFP - Project Construction Financial Planner",
      copyright: "© 2x2 Construction",
      version: "8.8.20",
  apiVersion: "v1",
  description: "Modern construction project management platform - BuilderTrend alternative",
  features: {
    apiReady: true,
    modular: true,
    scalable: true,
    performanceOptimized: true,
    memoryManaged: true,
    securityHardened: true
  }
};

// Legacy support - will be removed in future versions
window.APP_BUILD = APP_META.build;

        // Individual module versions - each module has its own version
        // All modules are independent, including payment-planner
        window.MODULE_VERS = {
          "payments": "v7.5",        // Payment-planner is now v7.5
          "schedule": "v1.5.3",        // Schedule is v1.5.3 (Fixed List View Data Loading)
          "daily-logs": "v1.10",      // Daily Logs is v1.10 (Perfect Template Standard)
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

// Module Development Status - Track which modules are active vs placeholder
window.MODULE_STATUS = {
  "payments": "active",      // Fully functional - Payment Planner
  "schedule": "active",      // Fully functional - Schedule Management
  "daily-logs": "active",    // Fully functional - Daily Log Management
  "budget": "placeholder",   // Coming soon - Budget Management
  "bills": "placeholder",    // Coming soon - Bill Management
  "documents": "placeholder", // Coming soon - Document Management
  "bids": "placeholder",     // Coming soon - Bid Management
  "change-orders": "placeholder", // Coming soon - Change Order Management
  "to-dos": "placeholder",   // Coming soon - To-Do Management
  "selections": "placeholder", // Coming soon - Selection Management
  "specifications": "placeholder", // Coming soon - Specification Management
  "purchase-orders": "placeholder", // Coming soon - Purchase Order Management
  "invoices": "placeholder"  // Coming soon - Invoice Management
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
  maxConcurrentRequests: 5,
  domCacheEnabled: true,
  memoryCleanupInterval: 30000
};
