# PCFP Quick Reference Guide v8.8.16

## 🎯 Table of Contents

1. **[Mandatory Process](#-mandatory-process-for-all-tasks)** - Required workflow for all tasks
2. **[Essential Commands](#-essential-commands)** - Daily development commands
3. **[File Locations](#-file-locations)** - Key files and their purposes
4. **[Common Patterns](#-common-patterns)** - JavaScript and CSS patterns
5. **[Testing Checklist](#-testing-checklist)** - Quality assurance steps
6. **[Version Management](#-version-management)** - Version update procedures
7. **[Version Display Prevention](#-version-display-prevention)** - Critical configurations
8. **[Cache Busting](#-cache-busting-format)** - Asset refresh procedures
9. **[Common Issues & Quick Fixes](#-common-issues--quick-fixes)** - Troubleshooting guide
10. **[Quality Gates](#-quality-gates)** - Success criteria

---

## 🧠 Mandatory Process for All Tasks

### **Required Workflow**
1. **🔍 CHECK**: Always reference relevant PCFP guide FIRST
   - `PCFP_VERSION_MANAGEMENT_GUIDE.md` for version updates
   - `PCFP_DEBUGGING_STRATEGY.md` for complex issues
   - `PCFP_KNOWLEDGE_BASE.md` for proven solutions
   - `PCFP_LIST_VIEW_STANDARD.md` for list views

2. **📋 IDENTIFY**: Find relevant section(s) for the task

3. **📖 FOLLOW**: Execute exactly as documented

4. **📝 DOCUMENT**: Update changelog and any new learnings

---

## 🔧 Essential Commands

### **Development Server**
```bash
# Start development server
python3 -m http.server 8000

# Alternative (if Python 3 not available)
python -m SimpleHTTPServer 8000
```

### **Browser Commands**
```bash
# Hard refresh browser (clear cache)
Ctrl+F5 (Windows) / Cmd+Shift+R (Mac)

# Check console for errors
F12 → Console tab

# Open developer tools
Ctrl+Shift+I (Windows) / Cmd+Option+I (Mac)
```

### **File Operations**
```bash
# Create new module directory
mkdir modules/new-module-name

# Copy template files
cp core/templates/module-template.html modules/new-module/index.html
cp core/templates/module.css modules/new-module/module.css
cp core/templates/module.js modules/new-module/module.js
```

---

## 📁 File Locations

### **Core Files**
- **Main Config**: `core/config.js` - App metadata and module versions
- **Router**: `core/kernel.standalone.js` - Navigation routes and titles
- **Theme**: `core/theme.css` - Global PCFP styling
- **Module Template**: `core/templates/module-template.html`

### **Version Scripts**
- **Header Version**: `core/header_version.js` - Sidebar version display
- **Version Shim**: `core/version_shim.js` - Version compatibility
- **Integrity Banner**: `core/integrity_banner.js` - Version pill updates
- **Version Manager**: `core/version-manager.js` - Automatic version updates

### **Module Files**
- **Module Entry**: `modules/[module]/index.html`
- **Module Styles**: `modules/[module]/module.css`
- **Module Logic**: `modules/[module]/module.js`

### **Documentation**
- **Development Guide**: `PCFP_DEVELOPMENT_GUIDE.md` (now chunked)
- **Version Management**: `PCFP_VERSION_MANAGEMENT_GUIDE.md`
- **Debugging Strategy**: `PCFP_DEBUGGING_STRATEGY.md`
- **Knowledge Base**: `PCFP_KNOWLEDGE_BASE.md`
- **List View Standard**: `PCFP_LIST_VIEW_STANDARD.md`
- **Changelog**: `CHANGELOG.md`

---

## 🔄 Common Patterns

### **JavaScript Patterns**
```javascript
// Module Registration
window.PCFP.moduleManager.register('moduleName', {
  name: 'Module Name',
  version: 'v1.0',
  onInitialize: async (params) => {
    // Initialization logic
  }
});

// Error Handling
safe(() => {
  // Your code here
}, 'module:function');

// Async Error Handling
const loadData = safeAsync(async () => {
  const response = await fetch('/api/data');
  return await response.json();
}, 'module:loadData');

// Dynamic Menu Creation
const menu = document.createElement('div');
menu.className = 'pcfp-menu';
document.body.appendChild(menu);

// Event Delegation
document.addEventListener('click', (e) => {
  if (e.target.matches('.btn-edit')) {
    editItem(e.target.dataset.id);
  }
});
```

### **CSS Patterns**
```css
/* PCFP Color Variables */
:root {
  --pcfp-white: #ffffff;
  --pcfp-gold: #C6A247;
  --pcfp-panel: #f8fafc;
  --pcfp-border: #e5e7eb;
  --pcfp-text: #0f172a;
  --pcfp-text-muted: #64748b;
}

/* Table-Based Grid Layout */
.data-grid {
  display: table;
  width: 100%;
  border-collapse: collapse;
}
.grid-header {
  display: table-row;
}
.grid-cell {
  display: table-cell;
  padding: 15px 10px;
  border-right: 1px solid var(--pcfp-border);
}

/* Direct Border Application */
.grid-cell {
  border-right: 1px solid var(--pcfp-border) !important;
  border-bottom: 1px solid var(--pcfp-border) !important;
}
.grid-cell:last-child {
  border-right: none !important;
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

/* Modal Content */
.modal-content {
  width: 95vw;
  max-width: 1400px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

/* Button Styles */
.btn {
  background: var(--pcfp-white);
  border: 1px solid var(--pcfp-border);
  border-radius: 8px;
  padding: 8px 16px;
  color: var(--pcfp-text);
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn:hover {
  background: var(--pcfp-panel);
  border-color: var(--pcfp-gold);
}
```

---

## 🧪 Testing Checklist

### **Pre-Implementation Testing**
- [ ] Create test files for new approaches
- [ ] Test in multiple browsers (Chrome, Firefox, Safari)
- [ ] Test responsive behavior (desktop, tablet, mobile)
- [ ] Test error scenarios and edge cases
- [ ] Get user validation on working approaches
- [ ] Update knowledge base with learnings

### **Post-Implementation Testing**
- [ ] All functionality works as specified
- [ ] Edge cases handled properly
- [ ] Error scenarios managed correctly
- [ ] Data persistence works
- [ ] User interactions are smooth
- [ ] Performance is acceptable

### **Quality Checklist**
- [ ] Follows established patterns
- [ ] Uses proper error handling
- [ ] Includes appropriate comments
- [ ] Variable names are clear
- [ ] Functions are focused and small
- [ ] No memory leaks
- [ ] Efficient algorithms
- [ ] Optimized DOM operations

---

## 🔢 Version Management

### **Version Update Process**
```javascript
// 1. Update main app version in core/config.js
window.APP_BUILD = "v8.8.11";
window.APP_META = {
  build: "v8.8.11",
  version: "8.8.11"
};

// 2. Update module version in core/config.js
window.MODULE_VERS = {
  "daily-logs": "v1.10"
};

// 3. Update navigation title in core/kernel.standalone.js
'#/daily-logs': { 
  title: 'Daily Logs v1.10', 
  src: 'modules/daily-logs/index.html' 
}
```

### **Version Update Checklist**
**CRITICAL**: Always update ALL version references!

1. **package.json** - Main app version
2. **core/config.js** - APP_META.build, APP_META.version, MODULE_VERS
3. **core/kernel.standalone.js** - Navigation title
4. **core/header_version.js** - Fallback version (lines 25, 34)
5. **core/version_shim.js** - Fallback version (line 6)
6. **core/integrity_banner.js** - Fallback version (line 21)
7. **modules/[module]/module.js** - Header comment
8. **modules/[module]/module.css** - Header comment
9. **modules/[module]/index.html** - Cache busting parameter

### **Common Oversights**
- ❌ **kernel.standalone.js** - Navigation titles often forgotten
- ❌ **Fallback versions** - Script fallbacks not updated
- ❌ **Cache busting** - HTML cache parameters not updated
- ❌ **Module comments** - File header comments not updated

---

## 🛡️ Version Display Prevention

### **Critical Script Configurations**
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

### **❌ NEVER DO**
- Use generic `header` selector in version scripts
- Target `.version` class without specific context
- Update version elements without checking iframe context
- Allow scripts to run in both main app and module contexts

### **✅ ALWAYS DO**
- Target `aside header` specifically for main app version
- Check for `iframe.module-frame` before updating version elements
- Use specific selectors like `[data-app-version]`
- Test version display in both sidebar and module headers

---

## 🔄 Cache Busting Format

### **HTML Cache Busting**
```html
<!-- Update version parameters after any changes -->
<link rel="stylesheet" href="../../core/theme.css?v=20250101133300">
<link rel="stylesheet" href="module.css?v=20250101133300">
<script src="module.js?v=20250101133300"></script>
```

### **When to Update Cache Busting**
- After any CSS changes
- After any JavaScript changes
- After version updates
- When styles aren't updating
- After hard refresh doesn't show changes

### **Cache Busting Format**
- **Format**: `?v=YYYYMMDDHHMMSS`
- **Example**: `?v=20250101133300`
- **Generate**: Current timestamp in YYYYMMDDHHMMSS format

---

## 🚨 Common Issues & Quick Fixes

### **Module Issues**
- **Module not loading**: Check route in `core/kernel.standalone.js`
- **Styles not updating**: Update cache-busting parameters
- **JavaScript errors**: Use `safe()` wrapper
- **Version mismatches**: Update both `config.js` and `kernel.standalone.js`

### **Layout Issues**
- **Grid issues**: Use direct border application
- **Menu not opening**: Use dynamic creation + `document.body`
- **Outer scrollbar**: Add `html, body { overflow: hidden }`
- **Dropdown menu cut off**: Use `position: fixed` instead of `position: absolute`

### **Version Issues**
- **Version not updating**: Check fallback values in version scripts
- **Script loading issues**: Add wait logic for `window.APP_BUILD`
- **Sidebar version stuck**: Update hardcoded fallbacks in version scripts
- **Duplicate version display**: Check script targeting configurations

### **Performance Issues**
- **Slow rendering**: Use performance monitoring
- **Memory leaks**: Check event listener cleanup
- **Large data sets**: Implement pagination
- **Slow searches**: Optimize search algorithms

### **Quick Debugging**
```javascript
// Console logging
console.log('[DEBUG]', 'Variable:', variable);

// Performance measurement
const start = performance.now();
// ... your code ...
const end = performance.now();
console.log('Function took:', end - start, 'ms');

// Element inspection
console.log('Element:', element);
console.log('Element bounds:', element.getBoundingClientRect());
```

---

## 🎯 Quality Gates

### **Pre-Implementation Gate**
- [ ] Test files created and validated
- [ ] Approach documented in knowledge base
- [ ] User requirements clearly understood
- [ ] Technical approach proven and tested

### **Post-Implementation Gate**
- [ ] All functionality tested and working
- [ ] Error handling comprehensive and tested
- [ ] Performance impact assessed and acceptable
- [ ] User validation completed and approved

### **Documentation Gate**
- [ ] Knowledge base updated with learnings
- [ ] Code comments added where needed
- [ ] User documentation updated if required
- [ ] Process documentation reflects current state

### **Deployment Gate**
- [ ] All tests passing and validated
- [ ] Performance benchmarks met
- [ ] User acceptance confirmed
- [ ] Rollback plan prepared and tested

---

## 📚 Quick Reference Links

### **Guide Navigation**
- **Version Updates**: `PCFP_VERSION_MANAGEMENT_GUIDE.md`
- **Complex Issues**: `PCFP_DEBUGGING_STRATEGY.md`
- **Proven Solutions**: `PCFP_KNOWLEDGE_BASE.md`
- **List Views**: `PCFP_LIST_VIEW_STANDARD.md`
- **Project Roadmap**: `PCFP_COMPREHENSIVE_ROADMAP.md`

### **Essential Files**
- **Main Config**: `core/config.js`
- **Router**: `core/kernel.standalone.js`
- **Changelog**: `CHANGELOG.md`
- **Package Info**: `package.json`

### **Development Tools**
- **Browser DevTools**: F12
- **Hard Refresh**: Ctrl+F5 / Cmd+Shift+R
- **Local Server**: `python3 -m http.server 8000`
- **Console**: F12 → Console tab

This quick reference ensures **efficient, consistent development** across all PCFP modules! 🚀
