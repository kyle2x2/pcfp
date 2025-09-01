# Versioning System Guide - BuilderTrend Competitor (v8.4)

## Overview

The application now uses a dual versioning system with two distinct version numbers:

1. **Main Application Version** - Displayed in the left sidebar, changes with every iteration
2. **Individual Module Versions** - Each module has its own version number

## Version Configuration

### Main Configuration File: `core/config.js`

This is the single source of truth for all versioning:

```javascript
// Main application version - displayed in left sidebar, changes with every iteration
window.APP_BUILD = "v8.4";

// Individual module versions - each module has its own version
// All modules are independent, including payment-planner
window.MODULE_VERS = {
  "payments": "v7.5",        // Payment-planner is v7.5
  "schedule": "v1.1",        // Schedule is v1.1
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
```

## Version Display Locations

### 1. Left Sidebar (Main Application Version)
- **Location**: Left sidebar, displayed as "2x2 Modules Build v8.4"
- **Source**: `window.APP_BUILD`
- **Updates**: Change with every iteration of the app

### 2. Module Headers (Individual Module Versions)
- **Location**: Top bar next to module title (e.g., "Payment Planner v7.5", "Schedule v1.1")
- **Source**: `core/kernel.standalone.js` routes object
- **Updates**: Independent for each module

## Special Rules

### Payment Planner Module
- **Version**: v7.5 (special legacy version)
- **Updates**: Only change when payment-planner code is modified

### Schedule Module
- **Version**: v1.1 (current active development)
- **Updates**: Increment when schedule module code is modified

### All Other Modules
- **Version**: v1.0 (baseline)
- **Updates**: Only change when the specific module code is modified

## How to Update Versions

### Updating Main Application Version
1. Edit `core/config.js`
2. Update `window.APP_BUILD = "v8.5"` (or next version)
3. Update `index.html` title and cache-busting parameters
4. No need to update any module versions (they're all independent)

### Updating Individual Module Version
1. Edit `core/config.js` - Update the specific module version in `window.MODULE_VERS`
2. Edit `core/kernel.standalone.js` - Update the title in the routes object
3. Example: 
   ```javascript
   // In config.js
   "schedule": "v1.2"
   
   // In kernel.standalone.js
   '#/schedule': { title: 'Schedule v1.2', src: 'modules/schedule/index.html' }
   ```

## CRITICAL: Preventing Version Display Issues

### ✅ DO:
- Always update BOTH `core/config.js` AND `core/kernel.standalone.js`
- Update cache-busting parameters after any version change
- Test by refreshing browser completely (Ctrl+F5)
- Keep module versions independent of main app version

### ❌ DON'T:
- Don't hardcode versions in individual module files
- Don't use `module_header_version.js` (it's disabled)
- Don't forget to update cache-busting parameters
- Don't let module versions get out of sync between config.js and kernel.standalone.js

## Files Modified

The following files were updated to implement this versioning system:

- `core/config.js` - **SINGLE SOURCE OF TRUTH** for all versioning
- `core/kernel.standalone.js` - **MODULE TITLE DISPLAY** (must match config.js)
- `core/version_shim.js` - Version display and cache busting (sidebar disabled)
- `index.html` - Sidebar version display and page title

**Removed:**
- `core/module_header_version.js` - **COMPLETELY REMOVED** from index.html (was causing conflicts)
- `core/version.js` - Deleted (redundant)
- `core/module_versions.js` - Deleted (redundant)

## Testing

The centralized versioning system can be tested by:

- Checking that left sidebar shows "2x2 Modules Build v8.4"
- Verifying payment-planner shows "Payment Planner v7.5" in main header
- Confirming schedule shows "Schedule v1.1" in main header
- Ensuring all other modules show "v1.0" in main headers
- Confirming no version badges appear in module internal headers

## Benefits

1. **Clear Separation**: Main app version vs module versions are distinct
2. **Flexible Updates**: Modules can be updated independently
3. **Consistent Display**: Version numbers appear consistently in main app header
4. **Easy Maintenance**: Single source of truth in `core/config.js`
5. **Independent Modules**: All modules have their own version numbers
6. **No Conflicts**: All display systems use the same source, eliminating version conflicts
7. **Centralized Control**: Change one file to update all version displays across the app
8. **Flexible Updates**: Update main app version without affecting module versions
