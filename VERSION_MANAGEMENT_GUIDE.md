# Version Management Guide

## 🎯 Overview
This guide explains how version management works in PCFP and how to properly update module versions.

## 📋 Current Working System

### 1. **Dual Version Architecture**
- **Main App Version**: `v8.4` (in `core/config.js` as `APP_META.build`)
- **Module Versions**: Independent per module (in `core/config.js` as `window.MODULE_VERS`)

### 2. **Version Display Locations**
- **Main App**: Shows in sidebar as "Build v8.4"
- **Module Headers**: Shows in each module's header (e.g., "Schedule v1.1")

### 3. **Version Update Process**

#### **To Update Main App Version:**
1. Update `core/config.js`:
   ```javascript
   export const APP_META = {
     build: "v8.5",  // Change this
     version: "8.5.0" // Change this
   };
   ```
2. Update `index.html` cache-busting parameters
3. Update all fallback versions in scripts

#### **To Update Module Version:**
1. Update `core/config.js`:
   ```javascript
   window.MODULE_VERS = {
     "schedule": "v1.2",  // Change this
     // ... other modules
   };
   ```
2. Update `core/kernel.standalone.js`:
   ```javascript
   const routes = {
     '#/schedule': { title: 'Schedule', version: 'v1.2', src: 'modules/schedule/index.html' },
     // ... other routes
   };
   ```
3. Update module's own files (if needed)

## 🔧 Technical Implementation

### **Script Loading Order (Critical!)**
```html
<!-- 1. Config loads first -->
<script src="core/config.js?v=20250901185010"></script>

<!-- 2. Version scripts load after -->
<script src="core/version_shim.js?v=20250901185010"></script>
<script src="core/header_version.js?v=20250901185010"></script>
<script src="core/module_header_version.js?v=20250901185010"></script>
```

### **Version Scripts Purpose**
- **`version_shim.js`**: Cache-busting and basic version display
- **`header_version.js`**: App header version management
- **`module_header_version.js`**: Module header version management
- **`kernel.standalone.js`**: Navigation and route-based version updates

## 🚨 Common Issues & Solutions

### **Issue: Version Not Updating**
**Symptoms:**
- Module shows old version
- Version stuck on previous number

**Solutions:**
1. **Check cache-busting**: Update all `?v=...` parameters
2. **Verify script order**: Ensure config loads before version scripts
3. **Check both locations**: Update both `config.js` AND `kernel.standalone.js`
4. **Clear browser cache**: Force refresh (Ctrl+F5)

### **Issue: Multiple Versions Showing**
**Symptoms:**
- Version appears in wrong location
- Duplicate version displays

**Solutions:**
1. **Check script conflicts**: Ensure only one script updates each location
2. **Verify HTML structure**: Check for duplicate version elements
3. **Review module templates**: Ensure no hardcoded versions

### **Issue: Script Conflicts**
**Symptoms:**
- Versions changing unexpectedly
- Inconsistent behavior

**Solutions:**
1. **Single source of truth**: Use `config.js` as primary version source
2. **Clear responsibilities**: Each script has one job
3. **Proper timing**: Ensure scripts run in correct order

## 📝 Best Practices

### **1. Always Update Both Locations**
When updating a module version, update BOTH:
- `core/config.js` (`window.MODULE_VERS`)
- `core/kernel.standalone.js` (routes array)

### **2. Use Cache-Busting**
Always update cache-busting parameters when changing versions:
```bash
# Update all cache-busting parameters
sed -i '' 's/old_timestamp/new_timestamp/g' index.html
```

### **3. Test Navigation**
After version updates:
1. Navigate to the module
2. Check version display
3. Navigate to other modules
4. Verify no conflicts

### **4. Document Changes**
Update this guide when making version management changes.

## 🔄 Version Update Checklist

### **For Main App Version:**
- [ ] Update `core/config.js` `APP_META.build`
- [ ] Update `core/config.js` `APP_META.version`
- [ ] Update `index.html` cache-busting parameters
- [ ] Update fallback versions in all scripts
- [ ] Test main app version display

### **For Module Version:**
- [ ] Update `core/config.js` `window.MODULE_VERS`
- [ ] Update `core/kernel.standalone.js` routes
- [ ] Update module's own files (if needed)
- [ ] Update cache-busting parameters
- [ ] Test module version display
- [ ] Test navigation between modules

## 🎯 Success Criteria

### **Version Management is Working When:**
- ✅ Main app shows correct version in sidebar
- ✅ Each module shows correct version in its header
- ✅ Navigation between modules works correctly
- ✅ No duplicate or conflicting version displays
- ✅ Versions persist after page refresh

## 📚 Related Files

### **Core Version Files:**
- `core/config.js` - Primary version definitions
- `core/kernel.standalone.js` - Navigation and route versions
- `core/version_shim.js` - Cache-busting and basic display
- `core/header_version.js` - App header management
- `core/module_header_version.js` - Module header management

### **Module Files:**
- `modules/*/index.html` - Module-specific headers
- `modules/*/module.js` - Module-specific version logic

---

**Last Updated:** January 2025  
**Version:** 1.0  
**Status:** Working and Documented
