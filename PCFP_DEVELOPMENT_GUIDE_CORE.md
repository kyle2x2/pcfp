# PCFP Development Guide Core v8.8.16

## 🎯 Table of Contents

1. **[Module Development](#-module-development)** - Core patterns and architecture
2. **[Feature Development SOP](#-feature-development-sop)** - Standard process for new features  
3. **[Design System & UI Patterns](#-design-system--ui-patterns)** - Consistent styling and components
4. **[Common Development Tasks](#-common-development-tasks)** - Quick reference for frequent operations
5. **[Performance Best Practices](#-performance-best-practices)** - Optimization and efficiency guidelines
6. **[Testing & Quality Assurance](#-testing--quality-assurance)** - Quality standards and validation
7. **[Code Cleanup Standards](#-code-cleanup-standards)** - Debug code removal and legacy management
8. **[Troubleshooting Guide](#-troubleshooting-guide)** - Common issues and solutions
9. **[Code Review & Maintenance Process](#-code-review--maintenance-process)** - Quality standards and maintenance
10. **[Success Metrics & Validation](#-success-metrics--validation)** - Defining completion criteria
11. **[Specialized Guides](#-specialized-guides)** - Links to focused documentation

## ⭐ Most Frequently Used Sections

**Daily Development**: [Common Development Tasks](#-common-development-tasks) | [Troubleshooting Guide](#-troubleshooting-guide) | [Quick Reference Guide](PCFP_QUICK_REFERENCE.md)

**New Features**: [Feature Development SOP](#-feature-development-sop) | [Debugging Strategy Guide](PCFP_DEBUGGING_STRATEGY.md) | [Knowledge Base](PCFP_KNOWLEDGE_BASE.md)

**Quality & Performance**: [Testing & Quality Assurance](#-testing--quality-assurance) | [Performance Best Practices](#-performance-best-practices) | [Success Metrics & Validation](#-success-metrics--validation)

## 🎯 Task-Specific Navigation

### **Creating New Module**
- [Module Development](#-module-development) - Core patterns and architecture
- [Common Development Tasks](#-common-development-tasks) - Step-by-step module creation
- [Design System & UI Patterns](#-design-system--ui-patterns) - Consistent styling
- [List View Standard](PCFP_LIST_VIEW_STANDARD.md) - Standardized list views

### **Adding New Feature**
- [Feature Development SOP](#-feature-development-sop) - Complete process
- [Debugging Strategy Guide](PCFP_DEBUGGING_STRATEGY.md) - Test-first approach
- [Performance Best Practices](#-performance-best-practices) - Optimization guidelines
- [Testing & Quality Assurance](#-testing--quality-assurance) - Quality standards

### **Fixing Bug or Issue**
- [Troubleshooting Guide](#-troubleshooting-guide) - Common issues and solutions
- [Debugging Strategy Guide](PCFP_DEBUGGING_STRATEGY.md) - Systematic approach
- [Knowledge Base](PCFP_KNOWLEDGE_BASE.md) - Proven solutions

### **Version Management**
- [Version Management Guide](PCFP_VERSION_MANAGEMENT_GUIDE.md) - Complete version procedures
- [Quick Reference Guide](PCFP_QUICK_REFERENCE.md) - Version update checklist

---

## 🏗️ Module Development

**Quick Start**: [Module Registration](#module-registration) | [Common Tasks](#common-development-tasks) | [Quick Reference Guide](PCFP_QUICK_REFERENCE.md)

**Troubleshooting**: [Common Issues](#debugging-common-issues) | [Troubleshooting Guide](#-troubleshooting-guide)

### **File Structure**
```
modules/your-module/
├── index.html          # Main module entry point
├── module.css          # Module-specific styles
├── module.js           # Module logic
├── module-config.js    # Module configuration
└── README.md           # Module documentation
```

### **Module Template Usage**
```html
<!-- Use the template with these placeholders -->
{{MODULE_NAME}}        # Display name (e.g., "Schedule")
{{MODULE_KEY}}         # Module key (e.g., "schedule")
{{MODULE_VERSION}}     # Version (e.g., "v1.0")
{{MODULE_DESCRIPTION}} # Description
{{MODULE_ICON}}        # Emoji icon (e.g., "📅")
{{MODULE_TITLE}}       # Page title
{{CACHE_BUST}}         # Cache busting parameter
```

### **Module Registration**
```javascript
// In module.js
(function() {
  // Register module with PCFP
  if (window.PCFP && window.PCFP.moduleManager) {
    window.PCFP.moduleManager.register('schedule', {
      name: 'Schedule',
      version: 'v1.0',
      description: 'Project scheduling and timeline management',
      icon: '📅',
      onInitialize: async (params) => {
        // Module initialization logic
        console.log('[PCFP] Schedule module initializing...');
        
        // Load initial data
        await loadScheduleData();
        
        // Set up event listeners
        setupEventListeners();
        
        // Initialize UI
        initializeUI();
      }
    });
  }
})();
```

### **Error Handling**
```javascript
// Always use safe() for error handling
const { safe, safeAsync } = window.__pcfpCore || {};

// Synchronous operations
safe(() => {
  // Your code here
  updateUI();
}, 'schedule:updateUI');

// Asynchronous operations
const loadData = safeAsync(async () => {
  const response = await fetch('/api/schedule');
  return await response.json();
}, 'schedule:loadData');
```

### **Module Communication**
```javascript
// Send messages to other modules
window.PCFP.moduleManager.sendMessage('schedule', 'payments', {
  type: 'schedule_updated',
  data: { projectId: '123', timeline: updatedTimeline }
});

// Listen for messages from other modules
window.PCFP.moduleManager.on('module:message', (message) => {
  if (message.to === 'schedule') {
    handleMessage(message);
  }
});
```

### **Shared Data**
```javascript
// Share data with other modules
window.PCFP.moduleManager.setSharedData('project_timeline', timelineData, 'schedule');

// Get shared data from other modules
const projectData = window.PCFP.moduleManager.getSharedData('project_data');
```

---

## 📋 Feature Development SOP

**Quick Start**: [Phase 1: Initial Request](#-phase-1-initial-request--understanding) | [Phase 2: Detailed Clarification](#-phase-2-detailed-clarification-critical)

**Implementation**: [Phase 4: Implementation](#-phase-4-implementation) | [Testing & Validation](#testing--quality-assurance)

### **🎯 Standard Operating Procedure for New Features**

This document outlines our collaborative process for developing new features in PCFP, ensuring we get it right the first time through thorough planning and clarification.

### **📋 Phase 1: Initial Request & Understanding**

#### **Step 1: Feature Request**
- User describes the desired feature
- Assistant acknowledges and confirms understanding
- Assistant asks initial clarifying questions if needed

#### **Step 2: High-Level Plan**
- Assistant creates a conceptual plan
- Outlines the general approach
- Identifies potential challenges
- Proposes implementation strategy

#### **Step 3: User Confirmation**
- User confirms the plan direction
- User may suggest modifications
- Both parties agree on general approach

### **🤔 Phase 2: Detailed Clarification (CRITICAL)**

#### **Step 4: Comprehensive Questioning**
Assistant must ask detailed clarifying questions about:

##### **Functional Behavior:**
- What exactly should happen when user performs each action?
- What are the edge cases and error scenarios?
- How should the system handle invalid inputs?
- What should happen if operations fail?

##### **User Experience:**
- How should the interface look and feel?
- What animations or transitions are desired?
- How should the feature integrate with existing UI?
- What feedback should users receive?

##### **Data Management:**
- How should data be stored and retrieved?
- What relationships exist with other data?
- How should data be validated?
- What happens during data conflicts?

##### **Technical Implementation:**
- Should we use existing patterns or create new ones?
- What performance considerations are important?
- How should the feature scale?
- What browser/device compatibility is required?

#### **Step 5: User Response & Refinement**
- User provides detailed answers to all questions
- Assistant asks follow-up questions for clarity
- Both parties refine the plan based on answers
- No implementation begins until all questions are resolved

### **📝 Phase 3: Final Plan Documentation**

#### **Step 6: Complete Implementation Plan**
Assistant creates a comprehensive plan including:

##### **Technical Specifications:**
- Exact HTML structure changes
- CSS styling requirements
- JavaScript function specifications
- Data flow and state management

##### **User Experience Details:**
- Exact user interaction flows
- Error handling and messaging
- Animation specifications
- Responsive behavior

##### **Implementation Steps:**
- Ordered list of implementation tasks
- Dependencies between steps
- Testing criteria for each step
- Success metrics

##### **Edge Cases & Error Handling:**
- All identified edge cases
- Error messages and user feedback
- Fallback behaviors
- Recovery mechanisms

#### **Step 7: Final User Review**
- User reviews the complete plan
- User confirms all details are correct
- User may request final adjustments
- Both parties agree on exact implementation

#### **Step 8: Mockup Creation (NEW STANDARD)**
- Assistant creates a visual mockup showing the integration
- Mockup demonstrates how the feature will look in existing UI
- Shows elements being removed and added
- Includes implementation plan and data flow
- User reviews and approves the mockup before implementation

##### **Mockup Requirements:**
- **Visual Integration**: Show how feature integrates with existing UI
- **Element Changes**: Clearly mark what's being removed/added
- **Data Flow**: Demonstrate how existing data will be used
- **Implementation Plan**: Include step-by-step implementation details
- **PCFP Styling**: Use consistent white/gold color scheme
- **Responsive Design**: Show how it works in the module frame

##### **Example Mockup Structure:**
```html
<!-- Mockup showing calendar integration -->
<div class="schedule-module">
  <!-- Existing structure -->
  <div class="module-header">...</div>
  <div class="schedule-header">
    <!-- REMOVED: redundant buttons -->
    <!-- ADDED: calendar navigation -->
  </div>
  <div class="schedule-content">
    <!-- NEW: calendar views replacing placeholder -->
  </div>
</div>
```

---

## 📋 List View Standards

### **🎯 PCFP List View Standard**
All list views must follow the comprehensive standard defined in `PCFP_LIST_VIEW_STANDARD.md`. This ensures consistency across all modules.

**Key Requirements:**
- **Pagination**: 10 items per page with Previous/Next navigation + Items per page dropdown (10, 25, 50)
- **Mass Actions**: Checkbox selection with dynamic toolbar (exactly 3 buttons: Delete, Duplicate, Export)
- **Performance Monitoring**: Render time, search time, memory usage tracking
- **Standard Structure**: Consistent HTML, CSS, and JavaScript patterns
- **Event Listeners**: Simple, direct event listeners (avoid complex dynamic setup)

**Implementation:**
1. Reference `PCFP_LIST_VIEW_STANDARD.md` for complete specifications
2. Follow the implementation checklist for each new module
3. Customize only module-specific data and actions
4. Maintain design consistency with PCFP white/gold theme
5. Use simple event listeners: `document.getElementById('btnDeleteSelected')?.addEventListener('click', deleteSelectedItems)`

**Current Status:**
- ✅ **Daily Logs**: Fully compliant with standard (v1.9)
- ✅ **Schedule**: Fully compliant with standard (v1.5.2)
- ⏳ **All Other Modules**: To be implemented when developed

**Quick Reference:**
- **HTML Structure**: Standard grid container with checkbox column
- **CSS Classes**: Consistent grid, pagination, and mass action styles
- **JavaScript Functions**: applyPagination(), updateSelectedCount(), updatePerformanceMetrics()
- **Performance Thresholds**: >500ms render, >200ms search, >6MB memory
- **Button Styling**: Danger buttons are red text/border, solid red only on hover

**⚠️ Critical Implementation Notes:**
- **Event Listeners**: Use simple, direct event listeners in setupEventListeners()
- **Button Styling**: Danger buttons should NOT be solid red by default
- **Pagination**: Include items per page dropdown on right side
- **Mass Actions**: Exactly 3 buttons, no additional buttons allowed

---

### **🚀 Phase 4: Implementation**

#### **Step 8: Development**
- Assistant implements exactly according to the plan
- No deviations without user approval
- Clear progress updates during implementation
- Testing at each major step

#### **Step 9: Testing & Validation**
- Assistant tests all functionality thoroughly
- User tests and validates the implementation
- Any issues are addressed immediately
- Final approval before deployment

---

## 🎨 Design System & UI Patterns

### **PCFP Color Scheme**
- **Primary**: White (#ffffff) and Gold (#C6A247)
- **Background**: Light gray (#f8fafc)
- **Borders**: Subtle gray (#e5e7eb)
- **Text**: Dark gray (#0f172a)
- **Muted Text**: Medium gray (#64748b)

### **CSS Custom Properties**
```css
:root {
  --pcfp-white: #ffffff;
  --pcfp-gold: #C6A247;
  --pcfp-panel: #f8fafc;
  --pcfp-border: #e5e7eb;
  --pcfp-text: #0f172a;
  --pcfp-text-muted: #64748b;
}
```

### **Common UI Components**

#### **Buttons**
```css
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

.btn-primary {
  background: var(--pcfp-gold);
  color: var(--pcfp-text);
  border-color: var(--pcfp-gold);
}
```

#### **Modals**
```css
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--pcfp-white);
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
```

#### **Forms**
```css
.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  color: var(--pcfp-text);
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--pcfp-border);
  border-radius: 6px;
  font-size: 14px;
}

.form-input:focus {
  outline: none;
  border-color: var(--pcfp-gold);
  box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.1);
}
```

### **Layout Patterns**

#### **Full-Height Application Layout**
```css
/* Prevents outer scrollbars and ensures clean layout */
html, body {
  margin: 0;
  height: 100vh;
  overflow: hidden;
}

.app {
  display: grid;
  grid-template-columns: 260px 1fr;
  height: 100vh;
  overflow: hidden;
}

/* Sidebar */
aside {
  border-right: 1px solid var(--pcfp-border);
  background: var(--pcfp-white);
  overflow-y: auto; /* Only if content exceeds height */
}

/* Main content area */
main {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.content {
  position: relative;
  min-height: 0;
  flex: 1;
  overflow: hidden; /* Let iframe handle scrolling */
}

/* Module iframe */
iframe.module-frame {
  border: 0;
  width: 100%;
  height: 100%;
  background: var(--pcfp-white);
}
```

#### **Why This Layout Works**
- **No Outer Scrollbars**: `html, body { overflow: hidden }` prevents page-level scrolling
- **Contained Layout**: `.app { height: 100vh }` ensures app fits viewport exactly
- **Independent Scrolling**: Each area (sidebar, module content) handles its own overflow
- **Clean Separation**: No duplicate scrollbars or overlapping scroll areas

#### **Common Layout Issues & Solutions**

**Issue**: Duplicate scrollbars (outer + inner)
**Solution**: 
```css
html, body { overflow: hidden; height: 100vh; }
.app { height: 100vh; overflow: hidden; }
```

**Issue**: Content extending beyond viewport
**Solution**: Use `height: 100vh` and `overflow: hidden` on containers

#### **Status Indicators**
```css
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.status-badge.completed {
  background: #dcfce7;
  color: #166534;
}

.status-badge.in-progress {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.pending {
  background: #f3f4f6;
  color: #374151;
}
```

### **Grid & Table Patterns**
```css
.data-grid {
  display: grid;
  grid-template-columns: 400px 120px 120px 120px 120px 120px 120px 120px;
  border: 1px solid var(--pcfp-border);
  border-radius: 8px;
  overflow: hidden;
}

.grid-header {
  background: var(--pcfp-panel);
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  color: var(--pcfp-text-muted);
}

.grid-cell {
  padding: 15px 10px;
  display: flex;
  align-items: center;
  border-right: 1px solid var(--pcfp-border) !important;
  border-bottom: 1px solid var(--pcfp-border) !important;
}
```

---

## 🔧 Common Development Tasks

### **Adding New Modules**

#### **Step 1: Create Module Directory**
```bash
mkdir modules/your-module-name
cd modules/your-module-name
```

#### **Step 2: Copy Template Files**
```bash
cp ../../core/templates/module-template.html index.html
cp ../../core/templates/module.css module.css
cp ../../core/templates/module.js module.js
```

#### **Step 3: Update Configuration**
1. **Edit `core/config.js`**:
   ```javascript
   window.MODULE_VERS = {
     // ... existing modules
     "your-module": "v1.0"
   };
   ```

2. **Edit `core/kernel.standalone.js`**:
   ```javascript
   const routes = {
     // ... existing routes
     '#/your-module': { 
       title: 'Your Module v1.0', 
       src: 'modules/your-module/index.html' 
     }
   };
   ```

#### **Step 4: Test Module Loading**
- Start development server: `python3 -m http.server 8000`
- Navigate to `http://localhost:8000/#/your-module`
- Verify module loads correctly

### **Updating Cache-Busting Parameters**

#### **When to Update**
- After any CSS changes
- After any JavaScript changes
- After version updates
- When styles aren't updating

#### **How to Update**
1. **Generate timestamp**: `YYYYMMDDHHMMSS` format
2. **Update HTML files**:
   ```html
   <link rel="stylesheet" href="../../core/theme.css?v=20250101120000">
   <link rel="stylesheet" href="module.css?v=20250101120000">
   <script src="module.js?v=20250101120000"></script>
   ```
3. **Test with hard refresh**: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)

### **Debugging Common Issues**

#### **Module Not Loading**
- **Symptom**: Module doesn't appear in navigation
- **Check**: Route configuration in `core/kernel.standalone.js`
- **Solution**: Verify route exists and points to correct file

#### **Styles Not Updating**
- **Symptom**: CSS changes not visible
- **Check**: Cache-busting parameters in HTML files
- **Solution**: Update `?v=YYYYMMDDHHMMSS` and hard refresh

#### **JavaScript Errors**
- **Symptom**: Console errors or broken functionality
- **Check**: Browser console for error messages
- **Solution**: Use `safe()` wrapper and check error handling

#### **Version Mismatches**
- **Symptom**: Version numbers don't match between files
- **Check**: Both `core/config.js` and `core/kernel.standalone.js`
- **Solution**: Update both files consistently

---

## 📊 Performance Best Practices

### **Code Optimization**

#### **Error Handling**
```javascript
// ✅ Good: Use safe() for all operations
safe(() => {
  updateUI();
}, 'module:updateUI');

// ✅ Good: Use safeAsync() for async operations
const loadData = safeAsync(async () => {
  const response = await fetch('/api/data');
  return await response.json();
}, 'module:loadData');
```

#### **DOM Operations**
```javascript
// ✅ Good: Cache DOM queries
const container = document.getElementById('container');
const updateUI = () => {
  container.innerHTML = newContent;
};

// ❌ Bad: Query DOM repeatedly
const updateUI = () => {
  document.getElementById('container').innerHTML = newContent;
};
```

#### **Event Handling**
```javascript
// ✅ Good: Use event delegation
document.addEventListener('click', (e) => {
  if (e.target.matches('.btn-edit')) {
    editItem(e.target.dataset.id);
  }
});

// ❌ Bad: Add listeners to each element
document.querySelectorAll('.btn-edit').forEach(btn => {
  btn.addEventListener('click', () => editItem(btn.dataset.id));
});
```

### **Loading Optimization**

#### **Lazy Loading**
```javascript
// ✅ Good: Load modules on demand
const loadModule = async (moduleName) => {
  const module = await import(`./modules/${moduleName}/module.js`);
  return module.default;
};
```

#### **Data Caching**
```javascript
// ✅ Good: Cache frequently accessed data
const cache = new Map();

const getData = async (key) => {
  if (cache.has(key)) {
    return cache.get(key);
  }
  const data = await fetchData(key);
  cache.set(key, data);
  return data;
};
```

### **Memory Management**

#### **Event Listener Cleanup**
```javascript
// ✅ Good: Clean up event listeners
const cleanup = () => {
  document.removeEventListener('click', handleClick);
  window.removeEventListener('resize', handleResize);
};

// Call cleanup when component unmounts
window.addEventListener('beforeunload', cleanup);
```

#### **DOM Element Cleanup**
```javascript
// ✅ Good: Remove elements properly
const removeElement = (element) => {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
};
```

### **Performance Monitoring**
```javascript
// ✅ Good: Monitor performance
const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`${name} took ${end - start}ms`);
  return result;
};
```

---

## 🧪 Testing & Quality Assurance

### **Pre-Implementation Testing**

#### **Test File Creation**
```bash
# Create isolated test files for new approaches
test-strategy-a-approach.html
test-strategy-b-approach.html
test-strategy-c-approach.html
```

#### **Browser Testing**
- **Chrome**: Primary development browser
- **Firefox**: Cross-browser compatibility
- **Safari**: Mobile and desktop testing
- **Edge**: Windows compatibility

#### **Responsive Testing**
- **Desktop**: 1920x1080 and larger
- **Tablet**: 768x1024
- **Mobile**: 375x667
- **Test**: All breakpoints and orientations

### **Post-Implementation Testing**

#### **Functionality Testing**
- [ ] All features work as specified
- [ ] Edge cases handled properly
- [ ] Error scenarios managed correctly
- [ ] Data persistence works
- [ ] User interactions are smooth

#### **Integration Testing**
- [ ] Module loads correctly
- [ ] Navigation works properly
- [ ] Data flows between components
- [ ] Error handling works end-to-end
- [ ] Performance is acceptable

### **Quality Checklist**

#### **Code Quality**
- [ ] Follows established patterns
- [ ] Uses proper error handling
- [ ] Includes appropriate comments
- [ ] Variable names are clear
- [ ] Functions are focused and small

#### **Performance Quality**
- [ ] No memory leaks
- [ ] Efficient algorithms
- [ ] Optimized DOM operations
- [ ] Appropriate caching
- [ ] Fast loading times

#### **User Experience Quality**
- [ ] Intuitive interface
- [ ] Responsive design
- [ ] Accessible to all users
- [ ] Consistent styling
- [ ] Smooth interactions

### **Testing Best Practices**

#### **Test-Driven Development**
1. **Write test first** for new functionality
2. **Implement feature** to pass test
3. **Refactor** while maintaining test coverage
4. **Repeat** for all new features

#### **Regression Testing**
- **Before changes**: Document current behavior
- **After changes**: Verify behavior unchanged
- **Automated**: Use test files for quick validation
- **Manual**: User testing for complex scenarios

---

## 🧹 Code Cleanup Standards

### **When to Remove Debug Code**

#### **✅ Remove Before Production**
- **Console logs**: All `console.log()`, `console.warn()`, `console.error()` statements
- **Temporary patches**: Version-specific patch files (e.g., `v72_patch.js`)
- **Development comments**: TODO, FIXME, HACK comments
- **Test code**: Isolated test files and debugging functions
- **Test directories**: Remove entire test directories after implementation

#### **✅ Remove After Feature Completion**
- **Debug functions**: Performance monitoring and debugging helpers
- **Temporary variables**: Variables used only for debugging
- **Commented code**: Large blocks of commented-out code
- **Legacy fallbacks**: Old fallback values and deprecated features
- **Test files**: Isolated test files used for library evaluation

#### **✅ Remove When No Longer Needed**
- **Version patches**: When the main code has been updated
- **Legacy support**: When backward compatibility is no longer required
- **Deprecated features**: When new implementations are stable
- **Temporary workarounds**: When proper solutions are implemented

### **Legacy Code Management**

#### **Documentation Requirements**
```javascript
// Legacy support - will be removed in future versions
window.APP_BUILD = APP_META.build;

// DEPRECATED: This approach will be removed in v9.0
// Use new API instead: window.PCFP.moduleManager.register()
```

#### **Removal Timeline**
- **Short-term**: 1-2 versions (temporary patches)
- **Medium-term**: 3-5 versions (legacy features)
- **Long-term**: 6+ versions (major architectural changes)

#### **Migration Planning**
1. **Identify dependencies**: What code depends on the legacy feature
2. **Create migration path**: How to transition to new implementation
3. **Update documentation**: Remove references to deprecated features
4. **Test thoroughly**: Ensure migration doesn't break functionality

### **Code Quality Standards**

#### **Before Commit Checklist**
- [ ] **No console logs** in production code
- [ ] **No TODO/FIXME** comments without timeline
- [ ] **No commented code** blocks larger than 5 lines
- [ ] **No deprecated features** without migration plan
- [ ] **No temporary patches** without removal timeline
- [ ] **Documentation updated** for any changes
- [ ] **Module status updated** if applicable

#### **Code Review Standards**
- **Check for debug code** before approving
- **Verify version consistency** across files
- **Review for deprecated features** and migration plans
- **Ensure documentation** is updated
- **Validate module status** is current

---

## 🚨 Troubleshooting Guide

### **Common Issues & Solutions**

#### **Module Not Loading**
- **Symptom**: Module doesn't appear in navigation or shows error
- **Check**: 
  - Route exists in `core/kernel.standalone.js`
  - File path is correct
  - Module files exist in correct location
- **Solution**: 
  - Add missing route
  - Fix file path
  - Create missing files

#### **Styles Not Updating**
- **Symptom**: CSS changes not visible after saving
- **Check**: 
  - Cache-busting parameters in HTML files
  - Browser cache
  - File save was successful
- **Solution**: 
  - Update `?v=YYYYMMDDHHMMSS` parameters
  - Hard refresh browser (`Ctrl+F5`)
  - Check file permissions

#### **JavaScript Errors**
- **Symptom**: Console errors or broken functionality
- **Check**: 
  - Browser console for error messages
  - JavaScript syntax errors
  - Missing dependencies
- **Solution**: 
  - Fix syntax errors
  - Add missing dependencies
  - Use `safe()` wrapper for error handling

#### **Version Mismatches**
- **Symptom**: Version numbers don't match between files
- **Check**: 
  - `core/config.js` module versions
  - `core/kernel.standalone.js` route titles
  - Cache-busting parameters
- **Solution**: 
  - Update both files consistently
  - Update cache-busting parameters
  - Test with hard refresh

#### **Grid Layout Issues**
- **Symptom**: Columns misaligned or borders missing
- **Check**: 
  - CSS Grid configuration
  - Border application rules
  - `display: contents` conflicts
- **Solution**: 
  - Use direct border application
  - Check CSS specificity
  - Test with isolated files

#### **Menu Not Opening**
- **Symptom**: Dropdown menus don't appear
- **Check**: 
  - JavaScript event handlers
  - CSS display/visibility conflicts
  - DOM positioning
- **Solution**: 
  - Use dynamic creation approach
  - Append to `document.body`
  - Check z-index values

### **Diagnostic Procedures**

#### **Console Debugging**
```javascript
// Add debug logging
console.log('[DEBUG]', 'Variable value:', variable);
console.log('[DEBUG]', 'Function called:', functionName);
console.log('[DEBUG]', 'Element found:', element);
```

#### **Network Debugging**
- **Check**: Browser Network tab for failed requests
- **Look for**: 404 errors, CORS issues, timeout errors
- **Solution**: Fix file paths, check server status

#### **Performance Debugging**
```javascript
// Measure function performance
const start = performance.now();
// ... your code ...
const end = performance.now();
console.log('Function took:', end - start, 'ms');
```

### **Prevention Strategies**

#### **Proactive Testing**
- **Create test files** before implementing features
- **Test in multiple browsers** for compatibility
- **Validate user interactions** before deployment
- **Monitor performance** regularly

#### **Code Quality**
- **Use established patterns** from knowledge base
- **Follow error handling** guidelines
- **Test edge cases** thoroughly
- **Document learnings** for future reference

---

## 🔄 Code Review & Maintenance Process

### **Before Committing Code**

#### **Pre-Commit Checklist**
- [ ] All functionality tested thoroughly
- [ ] Error handling implemented
- [ ] Performance impact considered
- [ ] Documentation updated
- [ ] Knowledge base updated with learnings
- [ ] User validation completed
- [ ] Code follows established patterns
- [ ] No console errors or warnings
- [ ] Responsive design tested
- [ ] Cross-browser compatibility verified

### **Code Quality Standards**

#### **Consistency**
- **Follow established patterns** from knowledge base
- **Use consistent naming conventions**
- **Apply uniform styling** across modules
- **Maintain code structure** standards

#### **Readability**
- **Clear variable names** that describe purpose
- **Descriptive function names** that explain action
- **Appropriate comments** for complex logic
- **Consistent formatting** and indentation

#### **Maintainability**
- **Modular code** with single responsibilities
- **Reusable components** and functions
- **Clear separation** of concerns
- **Documented interfaces** and APIs

#### **Performance**
- **Efficient algorithms** and data structures
- **Optimized DOM operations** with minimal queries
- **Appropriate caching** strategies
- **Memory leak prevention** with proper cleanup

#### **Error Handling**
- **Comprehensive error management** with `safe()` and `safeAsync()`
- **Graceful degradation** for edge cases
- **User-friendly error messages**
- **Recovery mechanisms** for failed operations

### **Maintenance Schedule**

#### **Weekly Tasks**
- **Review and update** knowledge base with new learnings
- **Check for performance** regressions
- **Validate all modules** are loading correctly
- **Update documentation** as needed

#### **Monthly Tasks**
- **Performance audit** and optimization
- **Code quality review** across all modules
- **Update dependencies** and security patches
- **Backup and version** control review

#### **Quarterly Tasks**
- **Comprehensive documentation** review and updates
- **Architecture assessment** and improvements
- **User feedback** analysis and implementation
- **Future planning** and roadmap updates

#### **Before Releases**
- **Comprehensive testing** of all functionality
- **Performance validation** and optimization
- **User acceptance testing** and validation
- **Documentation finalization** and updates

### **Quality Gates**

#### **Pre-Implementation Gate**
- **Test files created** and validated
- **Approach documented** in knowledge base
- **User requirements** clearly understood
- **Technical approach** proven and tested

#### **Post-Implementation Gate**
- **All functionality** tested and working
- **Error handling** comprehensive and tested
- **Performance impact** assessed and acceptable
- **User validation** completed and approved

#### **Documentation Gate**
- **Knowledge base updated** with learnings
- **Code comments** added where needed
- **User documentation** updated if required
- **Process documentation** reflects current state

#### **Deployment Gate**
- **All tests passing** and validated
- **Performance benchmarks** met
- **User acceptance** confirmed
- **Rollback plan** prepared and tested

---

## 🎯 Success Metrics & Validation

### **Feature Success Criteria**

#### **Functionality**
- **All requirements** implemented correctly
- **Edge cases** handled properly
- **Error scenarios** managed gracefully
- **Data integrity** maintained throughout

#### **User Experience**
- **Intuitive interface** that's easy to use
- **Responsive design** that works on all devices
- **Fast loading** and smooth interactions
- **Consistent styling** across all components

#### **Performance**
- **Fast loading times** under 2 seconds
- **Smooth interactions** with no lag
- **Efficient memory usage** with no leaks
- **Scalable architecture** that handles growth

#### **Reliability**
- **No errors** or crashes during normal use
- **Graceful error handling** for edge cases
- **Data persistence** works correctly
- **Recovery mechanisms** for failed operations

#### **Maintainability**
- **Code follows** established patterns
- **Documentation** is complete and accurate
- **Knowledge base** updated with learnings
- **Future developers** can understand and extend

### **Validation Process**

#### **Technical Validation**
1. **Code Review**: All code follows established patterns
2. **Testing**: All functionality tested thoroughly
3. **Performance**: Meets performance benchmarks
4. **Security**: No security vulnerabilities introduced
5. **Compatibility**: Works across all target browsers

#### **User Validation**
1. **User Testing**: User confirms feature meets needs
2. **Usability**: Interface is intuitive and easy to use
3. **Workflow**: Fits naturally into user's workflow
4. **Feedback**: User provides positive feedback
5. **Adoption**: User actually uses the feature

#### **Quality Validation**
1. **Standards**: Meets all quality standards
2. **Documentation**: Complete and accurate documentation
3. **Knowledge Base**: Updated with new learnings
4. **Maintenance**: Easy to maintain and extend
5. **Future-Proof**: Designed for long-term success

### **Quality Gates**

#### **Development Gate**
- **Requirements**: All requirements clearly understood
- **Approach**: Technical approach proven and tested
- **Planning**: Implementation plan complete and approved
- **Resources**: All necessary resources available

#### **Implementation Gate**
- **Code Quality**: Code follows all established patterns
- **Testing**: Comprehensive testing completed
- **Performance**: Performance benchmarks met
- **Documentation**: Code documented appropriately

#### **User Acceptance Gate**
- **Functionality**: All features work as specified
- **User Experience**: Interface is intuitive and responsive
- **User Feedback**: User confirms satisfaction
- **User Adoption**: User actually uses the feature

#### **Deployment Gate**
- **Production Ready**: All tests passing and validated
- **Performance**: Performance benchmarks met in production
- **Monitoring**: Performance monitoring in place
- **Rollback Plan**: Rollback plan prepared and tested

### **Performance Benchmarks**

#### **Loading Performance**
- **Initial Load**: Under 2 seconds for main application
- **Module Load**: Under 1 second for individual modules
- **Data Load**: Under 500ms for data operations
- **Interaction Response**: Under 100ms for user interactions

#### **Memory Performance**
- **Memory Usage**: No memory leaks over time
- **Garbage Collection**: Efficient memory management
- **Resource Usage**: Minimal resource consumption
- **Scalability**: Performance maintained with increased data

#### **User Experience Performance**
- **Responsiveness**: No lag or delays in interactions
- **Smoothness**: 60fps animations and transitions
- **Reliability**: No crashes or errors during normal use
- **Accessibility**: Works for all users regardless of ability

---

## 📚 Specialized Guides

### **Focused Documentation**

For specific development tasks, reference these specialized guides:

#### **Version Management**
- **Guide**: [PCFP_VERSION_MANAGEMENT_GUIDE.md](PCFP_VERSION_MANAGEMENT_GUIDE.md)
- **Use For**: Version updates, display issues, fallback values
- **Key Topics**: Dual versioning system, script configurations, prevention strategies

#### **Debugging Strategy**
- **Guide**: [PCFP_DEBUGGING_STRATEGY.md](PCFP_DEBUGGING_STRATEGY.md)
- **Use For**: Complex issues, test-first development, multiple approaches
- **Key Topics**: Isolated testing, decision matrix, knowledge documentation

#### **Knowledge Base**
- **Guide**: [PCFP_KNOWLEDGE_BASE.md](PCFP_KNOWLEDGE_BASE.md)
- **Use For**: Proven solutions, failed approaches, implementation patterns
- **Key Topics**: What works, what doesn't work, continuous learning

#### **Quick Reference**
- **Guide**: [PCFP_QUICK_REFERENCE.md](PCFP_QUICK_REFERENCE.md)
- **Use For**: Daily commands, common patterns, troubleshooting
- **Key Topics**: Essential commands, file locations, quality gates

#### **List View Standard**
- **Guide**: [PCFP_LIST_VIEW_STANDARD.md](PCFP_LIST_VIEW_STANDARD.md)
- **Use For**: Consistent list views, pagination, mass actions
- **Key Topics**: Standard structure, performance monitoring, event listeners

### **Guide Selection**

#### **For Version Updates**
- Load: `PCFP_VERSION_MANAGEMENT_GUIDE.md` + `PCFP_QUICK_REFERENCE.md`
- Context: ~600 lines instead of 3,282

#### **For New Module Development**
- Load: `PCFP_DEVELOPMENT_GUIDE_CORE.md` + `PCFP_LIST_VIEW_STANDARD.md`
- Context: ~1,300 lines instead of 3,282

#### **For Debugging Issues**
- Load: `PCFP_DEBUGGING_STRATEGY.md` + `PCFP_KNOWLEDGE_BASE.md`
- Context: ~900 lines instead of 3,282

#### **For Daily Development**
- Load: `PCFP_QUICK_REFERENCE.md` + relevant specialized guide
- Context: ~400-600 lines instead of 3,282

### **Benefits of Chunking**

#### **Context Efficiency**
- Load only relevant sections for specific tasks
- Faster processing and more focused responses
- Better memory utilization

#### **Maintenance**
- Easier to update specific areas
- Clear ownership of different sections
- Reduced merge conflicts

#### **Usage Patterns**
- **Daily Development**: Quick Reference + Core Guide
- **New Features**: Core Guide + Debugging Strategy
- **Version Updates**: Version Management Guide
- **Troubleshooting**: Knowledge Base + Quick Reference

This streamlined core guide focuses on **essential development practices** while referencing specialized guides for detailed procedures! 🚀
