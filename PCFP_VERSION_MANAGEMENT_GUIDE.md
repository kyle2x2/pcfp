# PCFP Version Management Guide v8.8.16

## 🎯 Table of Contents

1. **[Version Management Overview](#-version-management-overview)** - Dual versioning system
2. **[Version Management Discipline](#-version-management-discipline)** - Development vs production updates
3. **[Enhanced Memory System](#-enhanced-memory-system-for-guide-reference)** - Mandatory process for all tasks
4. **[Version Update Checklist](#-version-update-checklist)** - Complete update procedure
5. **[Version Display Issues & Solutions](#-version-display-issues--solutions)** - Critical display problems
6. **[Version Display Prevention](#-version-display-prevention-checklist)** - Prevention strategies
7. **[Version Configuration](#-version-configuration)** - Configuration files and settings
8. **[Version Update Troubleshooting](#-version-update-troubleshooting)** - Common issues and solutions
9. **[Lessons Learned](#-lessons-learned-from-version-management)** - Key learnings and best practices

---

## 🔢 Version Management Overview

### **Dual Versioning System**

The application uses a dual versioning system with two distinct version numbers:

1. **Main Application Version** - Displayed in the left sidebar, changes with every iteration
2. **Individual Module Versions** - Each module has its own version number

### **Version Display Locations**

#### **1. Left Sidebar (Main Application Version)**
- **Location**: Left sidebar, displayed as "2x2 Modules Build v8.8.10"
- **Source**: `window.APP_BUILD`
- **Updates**: Change with every iteration of the app

#### **2. Module Headers (Individual Module Versions)**
- **Location**: Top bar next to module title (e.g., "Daily Logs v1.9", "Schedule v1.5.2")
- **Source**: `core/kernel.standalone.js` routes object
- **Updates**: Independent for each module

---

## 📋 Version Management Discipline

### **Development Phase Version Updates**
- **Only update `CHANGELOG.md`** during active development
- **Document all changes** with clear descriptions and impact
- **Wait for explicit instruction** before updating other version files
- **User instruction**: "push the new version to GitHub" triggers full version update

### **Version Update Process**
1. **Development**: Update only `CHANGELOG.md` with changes
2. **User Approval**: Get explicit "push to GitHub" instruction
3. **Full Update**: Update all version files together:
   - `core/config.js` - `window.APP_BUILD` and `window.MODULE_VERS`
   - `core/kernel.standalone.js` - route titles
   - `core/header_version.js` - fallback values (lines 20, 29)
   - `core/version_shim.js` - fallback values (line 5)
   - `core/integrity_banner.js` - fallback values (line 20)
   - `index.html` - cache-busting parameters

### **Benefits of Disciplined Version Management**
- **Focused development**: No time wasted on premature version updates
- **User control**: User decides when to "push" versions
- **Consistency**: All version files updated together
- **Documentation**: Complete change history in changelog

---

## 🧠 Enhanced Memory System for Guide Reference

### **Mandatory Process for All Tasks:**
1. **🔍 CHECK**: Always reference `PCFP_VERSION_MANAGEMENT_GUIDE.md` FIRST
2. **📋 IDENTIFY**: Find relevant section(s) for the task
3. **📖 FOLLOW**: Execute exactly as documented
4. **📝 DOCUMENT**: Update changelog and any new learnings

### **Version Management Automation:**
- **Primary**: Structured task approach for all development work
- **Secondary**: Automated checklist for version management
- **Tertiary**: Enhanced memory system for guide reference

### **Prevention Strategy:**
- ✅ Always reference the guide first
- ✅ Follow documented procedures exactly
- ✅ Never forget the version update checklist
- ✅ Maintain consistency across all tasks

---

## 🔧 Version Update Checklist

**CRITICAL**: Always update ALL version references when making version changes!

### **Required Files to Update:**
1. **package.json** - Main application version
2. **core/config.js** - APP_META.build and APP_META.version
3. **core/config.js** - MODULE_VERS for specific module
4. **core/kernel.standalone.js** - Navigation title for module
5. **core/header_version.js** - Fallback version in script
6. **core/integrity_banner.js** - Fallback version in script  
7. **core/version_shim.js** - Fallback version in script
8. **modules/[module]/module.js** - Module header comment
9. **modules/[module]/module.css** - Module header comment
10. **modules/[module]/index.html** - Cache busting parameter

### **Version Update Process:**
```bash
# 1. Update main app version
package.json: "version": "8.8.10"
core/config.js: build: "v8.8.10", version: "8.8.10"

# 2. Update module version
core/config.js: "daily-logs": "v1.9"
core/kernel.standalone.js: 'Daily Logs v1.9'

# 3. Update fallback versions
core/header_version.js: 'v8.8.10'
core/integrity_banner.js: 'v8.8.10'
core/version_shim.js: 'v8.8.10'

# 4. Update module files
modules/daily-logs/module.js: "Daily Logs Module v1.9"
modules/daily-logs/module.css: "Daily Logs Module v1.9"
modules/daily-logs/index.html: "v=20250101133300"
```

### **Verification Steps:**
- [ ] Main app version displays correctly in sidebar
- [ ] Module version displays correctly in navigation
- [ ] Module version displays correctly in module header
- [ ] Cache busting forces fresh asset loading
- [ ] All fallback versions are consistent

### **Common Oversights:**
- ❌ **kernel.standalone.js** - Navigation titles often forgotten
- ❌ **Fallback versions** - Script fallbacks not updated
- ❌ **Cache busting** - HTML cache parameters not updated
- ❌ **Module comments** - File header comments not updated

---

## 🚨 Version Display Issues & Solutions

### **Critical Issue: Duplicate Version Display**
**Problem**: Main app version appears both in sidebar AND next to module titles
**Root Cause**: Multiple scripts targeting generic selectors that affect both main app and module headers

### **Scripts That Can Cause Version Display Issues:**
1. **`core/header_version.js`** - Adds build version to headers
2. **`core/integrity_banner.js`** - Updates `[data-app-version]` elements
3. **`core/version-manager.js`** - Automatically finds and updates version elements

### **Prevention Strategy:**
1. **`header_version.js`**: Only target `aside header` (sidebar), never module headers
2. **`integrity_banner.js`**: Check for `iframe.module-frame` before updating version elements
3. **`version-manager.js`**: Avoid generic `.version` class, use specific selectors only

### **Working Configuration:**
```javascript
// header_version.js - ONLY target sidebar
var header = doc.querySelector('aside header');

// integrity_banner.js - ONLY update if not in module iframe
if(pill && !document.querySelector('iframe.module-frame')){ 
  pill.textContent = 'Build ' + appBuild;
}

// version-manager.js - Specific selectors only
const selectors = [
  '[data-app-version]',
  '.pcfp-version-pill',
  'title',
  // '.version',  // REMOVED - too generic
  '[data-version]'
];
```

### **Version Display Rules:**
- ✅ **Main App Version**: Only in left sidebar (`aside header`)
- ✅ **Module Versions**: Only in module headers (e.g., "Daily Logs v1.9")
- ❌ **Never**: Show main app version next to module titles
- ❌ **Never**: Use generic selectors that affect both areas

### **Debugging Version Display Issues:**
1. Check `core/header_version.js` - ensure it only targets `aside header`
2. Check `core/integrity_banner.js` - ensure it checks for module iframe
3. Check `core/version-manager.js` - ensure it uses specific selectors
4. Verify no generic `.version` class targeting in any script

---

## 🛡️ Version Display Prevention Checklist

### **Before Any Version Update:**
- [ ] **Check Development Guide**: Reference version management section first
- [ ] **Review Script Targeting**: Ensure scripts only target intended areas
- [ ] **Test Both Areas**: Verify version appears only in sidebar, not module headers
- [ ] **Document Changes**: Update changelog with specific fixes

### **Critical Script Configurations:**
```javascript
// ✅ CORRECT - header_version.js
var header = doc.querySelector('aside header'); // ONLY sidebar
if(!header) return; // Safety check

// ✅ CORRECT - integrity_banner.js  
if(pill && !document.querySelector('iframe.module-frame')){ // Only main app
  pill.textContent = 'Build ' + appBuild;
}

// ✅ CORRECT - version-manager.js
const selectors = [
  '[data-app-version]',    // Specific attribute
  '.pcfp-version-pill',    // Specific class
  'title',                  // Page title only
  // '.version',           // REMOVED - too generic
  '[data-version]'          // Specific attribute
];
```

### **❌ NEVER DO:**
- Use generic `header` selector in version scripts
- Target `.version` class without specific context
- Update version elements without checking iframe context
- Allow scripts to run in both main app and module contexts

### **✅ ALWAYS DO:**
- Target `aside header` specifically for main app version
- Check for `iframe.module-frame` before updating version elements
- Use specific selectors like `[data-app-version]`
- Test version display in both sidebar and module headers

---

## ⚙️ Version Configuration

### **Main Configuration File: `core/config.js`**

This is the single source of truth for all versioning:

```javascript
// Main application version - displayed in left sidebar, changes with every iteration
window.APP_BUILD = "v8.8.10";

// Individual module versions - each module has its own version
// All modules are independent, including payment-planner
window.MODULE_VERS = {
  "payments": "v7.5",        // Payment-planner is v7.5
  "schedule": "v1.5.2",      // Schedule is v1.5.2
  "daily-logs": "v1.9",      // Daily Logs is v1.9
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

### **Special Rules**

#### **Payment Planner Module**
- **Version**: v7.5 (special legacy version)
- **Updates**: Only change when payment-planner code is modified

#### **Schedule Module**
- **Version**: v1.5.2 (current active development)
- **Updates**: Increment when schedule module code is modified

#### **Daily Logs Module**
- **Version**: v1.9 (current active development)
- **Updates**: Increment when daily logs module code is modified

#### **All Other Modules**
- **Version**: v1.0 (baseline)
- **Updates**: Only change when the specific module code is modified

### **How to Update Versions**

#### **Updating Main Application Version**
1. Edit `core/config.js`
2. Update `window.APP_BUILD = "v8.8.11"` (or next version)
3. Update `index.html` title and cache-busting parameters
4. No need to update any module versions (they're all independent)

#### **Updating Individual Module Version**
1. Edit `core/config.js` - Update the specific module version in `window.MODULE_VERS`
2. Edit `core/kernel.standalone.js` - Update the title in the routes object
3. Example: 
   ```javascript
   // In config.js
   "schedule": "v1.5.3"
   
   // In kernel.standalone.js
   '#/schedule': { title: 'Schedule v1.5.3', src: 'modules/schedule/index.html' }
   ```

---

## 🔍 Version Update Troubleshooting

### **Common Issues & Solutions**

**Issue**: Left sidebar shows old version despite updating config.js
**Root Cause**: Hardcoded fallback values in version scripts
**Solution**: Update fallback values in these files:
- `core/integrity_banner.js` - line 21: `'v8.8.10'` → `'v8.8.11'`
- `core/version_shim.js` - line 6: `'v8.8.10'` → `'v8.8.11'`
- `core/header_version.js` - lines 25, 34: `'v8.8.10'` → `'v8.8.11'`

**Issue**: Version scripts run before config.js loads
**Root Cause**: Script loading race condition
**Solution**: Add wait logic for `window.APP_BUILD`:
```javascript
function setPill(){
  // Wait for config to load
  if (!window.APP_BUILD) {
    setTimeout(setPill, 100);
    return;
  }
  // ... rest of version setting logic
}
```

**Issue**: Cache-busting parameters prevent fresh script loading
**Root Cause**: Old cache-busting parameters in index.html
**Solution**: Update ALL script references with new timestamp:
```html
<script src="core/config.js?v=20250101133300"></script>
```

### **Complete Version Update Checklist**

1. ✅ Update `core/config.js` - `window.APP_BUILD` and `window.MODULE_VERS`
2. ✅ Update `core/kernel.standalone.js` - route titles
3. ✅ Update `index.html` - title and cache-busting parameters
4. ✅ Update fallback values in version scripts:
   - `core/header_version.js` - lines 25, 34
   - `core/version_shim.js` - line 6
   - `core/integrity_banner.js` - line 21
5. ✅ Test with hard refresh (Ctrl+F5)
6. ✅ Verify all version displays are correct

---

## 🎯 Lessons Learned from Version Management

### **Version Management Discovery**
During the Schedule v1.5 and Daily Logs v1.9 implementations, we discovered that hardcoded fallback values in version scripts were preventing the main build version from updating in the UI.

### **Key Learnings:**
1. **Multiple Version Scripts**: Three files contain hardcoded fallback values that override `window.APP_BUILD`
2. **Fallback Values**: `|| 'v8.8.10'` fallbacks prevent actual config values from being used
3. **Script Loading Order**: Version scripts may run before `config.js` loads
4. **UI Display**: Left sidebar version comes from `header_version.js`, not just `config.js`
5. **Cache-Busting Critical**: Old cache-busting parameters prevent fresh script loading
6. **Multiple Fallback Locations**: Check ALL fallback values in version scripts

### **Files Requiring Updates:**
- `core/header_version.js` - Controls sidebar version display (lines 25, 34)
- `core/version_shim.js` - Version shim with fallback (line 6)
- `core/integrity_banner.js` - Integrity banner version (line 21)

### **Best Practice**: 
Always check these three files when version updates don't appear in the UI.

### **Version Display Prevention Learnings:**
1. **Script Targeting**: Generic selectors cause version display in wrong locations
2. **Context Checking**: Always check for iframe context before updating elements
3. **Specific Selectors**: Use specific attributes instead of generic classes
4. **Testing**: Always test version display in both sidebar and module headers

### **CRITICAL: Preventing Version Display Issues**

#### **✅ DO:**
- Always update BOTH `core/config.js` AND `core/kernel.standalone.js`
- Update cache-busting parameters after any version change
- Test by refreshing browser completely (Ctrl+F5)
- Keep module versions independent of main app version
- Check for hardcoded fallback values in version-related files
- Ensure proper script loading order (config.js must load before version scripts)
- Update fallback values in `header_version.js`, `version_shim.js`, and `integrity_banner.js`

#### **❌ DON'T:**
- Don't hardcode versions in individual module files
- Don't use `module_header_version.js` (it's disabled)
- Don't forget to update cache-busting parameters
- Don't let module versions get out of sync between config.js and kernel.standalone.js
- Don't rely on fallback values in version scripts
- Don't assume scripts load in the correct order
- Don't forget to update the three version script files

---

## 📚 Quick Reference

### **Essential Commands**
```bash
# Hard refresh browser (clear cache)
Ctrl+F5 (Windows) / Cmd+Shift+R (Mac)

# Check console for errors
F12 → Console tab
```

### **File Locations**
- **Main Config**: `core/config.js`
- **Router**: `core/kernel.standalone.js`
- **Version Scripts**: `core/header_version.js`, `core/version_shim.js`, `core/integrity_banner.js`

### **Cache Busting Format**
```html
<link rel="stylesheet" href="module.css?v=20250101133300">
<script src="module.js?v=20250101133300"></script>
```

### **Common Issues & Quick Fixes**
- **Version not updating**: Check fallback values in version scripts
- **Script loading issues**: Add wait logic for `window.APP_BUILD`
- **Sidebar version stuck**: Update hardcoded fallbacks in `header_version.js`, `version_shim.js`, `integrity_banner.js`
- **Duplicate version display**: Check `header_version.js` targets only `aside header`, `integrity_banner.js` checks for module iframe, `version-manager.js` uses specific selectors

This comprehensive guide ensures **consistent, reliable version management** across all PCFP modules! 🚀
