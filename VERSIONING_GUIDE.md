# Versioning System Guide - Cursor Branch

## Overview

The application now uses a dual versioning system with two distinct version numbers:

1. **Main Application Version** - Displayed in the left sidebar, changes with every iteration
2. **Individual Module Versions** - Each module has its own version number

## Version Configuration

### Main Configuration File: `core/config.js`

This is the single source of truth for all versioning:

```javascript
// Main application version - displayed in left sidebar, changes with every iteration
window.APP_BUILD = "v8.1";

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
```

## Version Display Locations

### 1. Left Sidebar (Main Application Version)
- **Location**: Left sidebar, displayed as "Build v8.0"
- **Source**: `window.APP_BUILD`
- **Updates**: Change with every iteration of the app

### 2. Module Headers (Individual Module Versions)
- **Location**: Top bar next to module title (e.g., "Payment Planner v8.0")
- **Source**: `window.MODULE_VERS[moduleKey]`
- **Updates**: Independent for each module

## Special Rules

### All Modules (Including Payment Planner)
- **Version**: All modules are independent
- **Updates**: Only change when the specific module code is modified
- **Example**: Payment-planner is v1.0, Schedule is v1.0, main app is v8.1

## How to Update Versions

### Updating Main Application Version
1. Edit `core/config.js`
2. Update `window.APP_BUILD = "v8.2"` (or next version)
3. No need to update any module versions (they're all independent now)
4. Update `index.html` title and sidebar version display (now pulls from config.js automatically)

### Updating Individual Module Version
1. Edit `core/config.js`
2. Update the specific module version in `window.MODULE_VERS`
3. Example: `"schedule": "v1.1"`

## Files Modified

The following files were updated to implement this versioning system:

- `core/config.js` - **SINGLE SOURCE OF TRUTH** for all versioning
- `core/module_header_version.js` - Module header version display logic
- `core/version_shim.js` - Version display and cache busting
- `core/header_version.js` - Header version display
- `core/integrity_banner.js` - Integrity banner version display
- `index.html` - Sidebar version display and page title

**Removed redundant files:**
- `core/version.js` - Deleted (redundant)
- `core/module_versions.js` - Deleted (redundant)

**Fixed conflicts:**
- `core/version_shim.js` - Disabled module version display (was conflicting with module_header_version.js)

## Testing

The centralized versioning system can be tested by:

- Checking that left sidebar shows "Build v8.1"
- Verifying payment-planner shows "v1.0" in module header (independent)
- Confirming all other modules show "v1.0" in module headers
- Ensuring all version displays pull from `core/config.js` only

## Benefits

1. **Clear Separation**: Main app version vs module versions are distinct
2. **Flexible Updates**: Modules can be updated independently
3. **Consistent Display**: Version numbers appear consistently across the UI
4. **Easy Maintenance**: Single source of truth in `core/config.js`
5. **Independent Modules**: All modules have their own version numbers
6. **No Conflicts**: All display systems use the same source, eliminating version conflicts
7. **Centralized Control**: Change one file to update all version displays across the app
8. **Flexible Updates**: Update main app version without affecting module versions
