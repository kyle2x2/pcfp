// Single source of truth for versions
// Main application version - displayed in left sidebar, changes with every iteration
window.APP_BUILD = "v8.1-cursor";

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
