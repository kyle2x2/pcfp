# PCFP Development Guide v8.7.0

## 🎯 Table of Contents

1. **[Module Development](#-module-development)** - Core patterns and architecture
2. **[Feature Development SOP](#-feature-development-sop)** - Standard process for new features  
3. **[Debugging Strategy](#-debugging-strategy)** - Multi-option testing approach
4. **[Version Management](#-version-management)** - Dual versioning system
5. **[Design System & UI Patterns](#-design-system--ui-patterns)** - Consistent styling and components
6. **[Common Development Tasks](#-common-development-tasks)** - Quick reference for frequent operations
7. **[Performance Best Practices](#-performance-best-practices)** - Optimization and efficiency guidelines
8. **[Testing & Quality Assurance](#-testing--quality-assurance)** - Quality standards and validation
9. **[Code Cleanup Standards](#-code-cleanup-standards)** - Debug code removal and legacy management
10. **[Troubleshooting Guide](#-troubleshooting-guide)** - Common issues and solutions
11. **[Code Review & Maintenance Process](#-code-review--maintenance-process)** - Quality standards and maintenance
12. **[Success Metrics & Validation](#-success-metrics--validation)** - Defining completion criteria
13. **[Learning & Knowledge Base](#-learning--knowledge-base)** - What works and what doesn't
14. **[Proven Implementations](#-proven-implementations)** - Working solutions for common problems
15. **[Quick Reference Cheat Sheet](#-quick-reference-cheat-sheet)** - Daily practical reference

## ⭐ Most Frequently Used Sections

**Daily Development**: [Quick Reference Cheat Sheet](#-quick-reference-cheat-sheet) | [Common Development Tasks](#-common-development-tasks) | [Troubleshooting Guide](#-troubleshooting-guide)

**New Features**: [Feature Development SOP](#-feature-development-sop) | [Debugging Strategy](#-debugging-strategy) | [Proven Implementations](#-proven-implementations)

**Quality & Performance**: [Testing & Quality Assurance](#-testing--quality-assurance) | [Performance Best Practices](#-performance-best-practices) | [Success Metrics & Validation](#-success-metrics--validation)

## 🎯 Task-Specific Navigation

### **Creating New Module**
- [Module Development](#-module-development) - Core patterns and architecture
- [Common Development Tasks](#-common-development-tasks) - Step-by-step module creation
- [Design System & UI Patterns](#-design-system--ui-patterns) - Consistent styling
- [Quick Reference Cheat Sheet](#-quick-reference-cheat-sheet) - Common patterns

### **Adding New Feature**
- [Feature Development SOP](#-feature-development-sop) - Complete process
- [Debugging Strategy](#-debugging-strategy) - Test-first approach
- [Performance Best Practices](#-performance-best-practices) - Optimization guidelines
- [Testing & Quality Assurance](#-testing--quality-assurance) - Quality standards
- [Success Metrics & Validation](#-success-metrics--validation) - Completion criteria

### **Fixing Bug or Issue**
- [Troubleshooting Guide](#-troubleshooting-guide) - Common issues and solutions
- [Debugging Strategy](#-debugging-strategy) - Systematic approach
- [Quick Reference Cheat Sheet](#-quick-reference-cheat-sheet) - Quick fixes

### **Performance Optimization**
- [Performance Best Practices](#-performance-best-practices) - Optimization guidelines
- [Testing & Quality Assurance](#-testing--quality-assurance) - Performance testing
- [Success Metrics & Validation](#-success-metrics--validation) - Performance benchmarks

### **Code Review & Maintenance**
- [Code Review & Maintenance Process](#-code-review--maintenance-process) - Quality standards
- [Learning & Knowledge Base](#-learning--knowledge-base) - What works and what doesn't
- [Testing & Quality Assurance](#-testing--quality-assurance) - Quality checklist

---

## 🏗️ Module Development

**Quick Start**: [Module Registration](#module-registration) | [Common Tasks](#common-development-tasks) | [Quick Reference](#-quick-reference-cheat-sheet)

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

## 🔍 Debugging Strategy

**Quick Start**: [Test-First Process](#-test-first-development-process) | [Test File Template](#-test-file-template)

**Implementation**: [Knowledge Documentation](#-step-8-knowledge-documentation) | [Main Code Implementation](#-step-9-main-code-implementation)

### **🎯 Test-First Development Process**

When facing complex UI/UX issues that resist simple fixes, use this **systematic multi-option testing approach**:

#### **Step 1: Problem Identification**
- Clearly define what's not working
- Document the expected behavior
- Note any error messages or console logs
- Take screenshots of the current state

#### **Step 2: Strategy Brainstorming**
- Generate 3-4 different approaches to solve the problem
- Don't commit to any single approach initially
- Consider different technologies or methodologies
- Document pros/cons of each approach

#### **Step 3: Isolated Test File Creation**
Create isolated test files for each strategy:

```bash
# Example naming convention
test-strategy-a-grid-overhaul.html
test-strategy-b-pseudo-elements.html
test-strategy-c-custom-properties.html
test-strategy-d-hybrid.html
```

#### **Step 4: Test File Template**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Strategy X Test - [Description]</title>
    <style>
        /* Isolated CSS for this strategy */
        :root {
            --pcfp-white: #ffffff;
            --pcfp-panel: #f8fafc;
            --pcfp-border: #e5e7eb;
            --pcfp-text: #0f172a;
            --pcfp-text-muted: #64748b;
        }
        
        /* Strategy-specific CSS here */
    </style>
</head>
<body>
    <h1>Strategy X Test - [Description]</h1>
    <p>This test implements [specific approach] to solve [problem].</p>
    
    <div class="test-controls">
        <button onclick="toggleHover()">Toggle Hover Effect</button>
        <button onclick="toggleDebug()">Toggle Debug Mode</button>
        <button onclick="resetTest()">Reset Test</button>
    </div>

    <!-- Test content here -->
    
    <script>
        // Test functions for debugging
        function toggleHover() { /* ... */ }
        function toggleDebug() { /* ... */ }
        function resetTest() { /* ... */ }
    </script>
</body>
</html>
```

#### **Step 5: Thorough Testing Process**
1. **Open each test file** in browser
2. **Test all functionality** thoroughly
3. **Use debug controls** to test edge cases
4. **Document observations** for each approach
5. **Get user feedback** on each approach

#### **Step 6: Results Documentation**
For each strategy, document:

| Field | Description |
|-------|-------------|
| **Approach** | What strategy was tested |
| **Works** | ✅ or ❌ |
| **Pros** | What worked well |
| **Cons** | What didn't work |
| **Performance** | Impact on performance |
| **Maintainability** | How easy to maintain |
| **Complexity** | Level of implementation complexity |
| **Recommendation** | Whether to use this approach |

#### **Step 7: Decision Matrix**
Create a decision matrix to compare approaches:

| Strategy | Works | Maintainable | Performance | Complexity | Recommendation |
|----------|-------|--------------|-------------|------------|----------------|
| Strategy A | ❌ | N/A | N/A | High | ❌ Don't use |
| Strategy B | ✅ | Medium | Medium | Medium | ⚠️ Consider |
| Strategy C | ✅ | High | High | Low | ✅ Recommended |
| Strategy D | ✅ | High | High | Medium | ✅ Alternative |

#### **Step 8: Knowledge Documentation**
- Document what works in "What Works" section
- Document what fails in "What Doesn't Work" section
- Explain why each approach succeeds or fails
- Provide alternatives for failed approaches

#### **Step 9: Main Code Implementation**
- Choose the best approach based on evidence
- Implement the proven solution in main code
- Test thoroughly in the main application
- Update documentation with final implementation

### **🎯 Benefits of Test-First Approach**

1. **Non-Biased Testing** - Tests multiple approaches without commitment
2. **Proven Solutions** - Only implement what actually works
3. **Documentation** - Creates knowledge base for future issues
4. **User Validation** - User can see and test each approach
5. **Systematic Process** - Prevents trial-and-error in production code
6. **Knowledge Building** - Team learns what works and what doesn't
7. **Clean Main Code** - No experimental code in production
8. **Risk Reduction** - No breaking changes to main code

### **📋 Debugging Checklist**

- [ ] Clearly define the problem
- [ ] Brainstorm 3-4 different strategies
- [ ] Create isolated test files for each strategy
- [ ] Test each approach thoroughly in browser
- [ ] Document pros/cons of each approach
- [ ] Get user feedback on each approach
- [ ] Create decision matrix comparing approaches
- [ ] Choose best solution based on evidence
- [ ] Document learnings in knowledge base
- [ ] Implement proven solution in main code
- [ ] Test thoroughly in main application
- [ ] Update documentation with lessons learned

---

## 🔢 Version Management

### **Overview**

The application uses a dual versioning system with two distinct version numbers:

1. **Main Application Version** - Displayed in the left sidebar, changes with every iteration
2. **Individual Module Versions** - Each module has its own version number

### **Version Configuration**

#### **Main Configuration File: `core/config.js`**

This is the single source of truth for all versioning:

```javascript
// Main application version - displayed in left sidebar, changes with every iteration
window.APP_BUILD = "v8.4";

// Individual module versions - each module has its own version
// All modules are independent, including payment-planner
window.MODULE_VERS = {
  "payments": "v7.5",        // Payment-planner is v7.5
  "schedule": "v1.2",        // Schedule is v1.2
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

### **Version Display Locations**

#### **1. Left Sidebar (Main Application Version)**
- **Location**: Left sidebar, displayed as "2x2 Modules Build v8.4"
- **Source**: `window.APP_BUILD`
- **Updates**: Change with every iteration of the app

#### **2. Module Headers (Individual Module Versions)**
- **Location**: Top bar next to module title (e.g., "Payment Planner v7.5", "Schedule v1.2")
- **Source**: `core/kernel.standalone.js` routes object
- **Updates**: Independent for each module

### **Special Rules**

#### **Payment Planner Module**
- **Version**: v7.5 (special legacy version)
- **Updates**: Only change when payment-planner code is modified

#### **Schedule Module**
- **Version**: v1.2 (current active development)
- **Updates**: Increment when schedule module code is modified

#### **All Other Modules**
- **Version**: v1.0 (baseline)
- **Updates**: Only change when the specific module code is modified

### **How to Update Versions**

#### **Updating Main Application Version**
1. Edit `core/config.js`
2. Update `window.APP_BUILD = "v8.7.0"` (or next version)
3. Update `index.html` title and cache-busting parameters
4. No need to update any module versions (they're all independent)

#### **Updating Individual Module Version**
1. Edit `core/config.js` - Update the specific module version in `window.MODULE_VERS`
2. Edit `core/kernel.standalone.js` - Update the title in the routes object
3. Example: 
   ```javascript
   // In config.js
   "schedule": "v1.3"
   
   // In kernel.standalone.js
   '#/schedule': { title: 'Schedule v1.4', src: 'modules/schedule/index.html' }
   ```

### **CRITICAL: Preventing Version Display Issues**

#### **✅ DO:**
- Always update BOTH `core/config.js` AND `core/kernel.standalone.js`
- Update cache-busting parameters after any version change
- Test by refreshing browser completely (Ctrl+F5)
- Keep module versions independent of main app version
- **NEW**: Check for hardcoded fallback values in version-related files
- **NEW**: Ensure proper script loading order (config.js must load before version scripts)

#### **❌ DON'T:**
- Don't hardcode versions in individual module files
- Don't use `module_header_version.js` (it's disabled)
- Don't forget to update cache-busting parameters
- Don't let module versions get out of sync between config.js and kernel.standalone.js
- **NEW**: Don't rely on fallback values in version scripts
- **NEW**: Don't assume scripts load in the correct order

### **🔍 Version Update Troubleshooting**

#### **Common Issues & Solutions**

**Issue**: Left sidebar shows old version despite updating config.js
**Root Cause**: Hardcoded fallback values in version scripts
**Solution**: Update fallback values in these files:
- `core/integrity_banner.js` - line 20: `'v8.6.0'` → `'v8.7.0'`
- `core/version_shim.js` - line 5: `'v8.6.0'` → `'v8.7.0'`
- `core/header_version.js` - lines 20, 29: `'v8.6.0'` → `'v8.7.0'`

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
<script src="core/config.js?v=20250101130000"></script>
```

#### **Complete Version Update Checklist**

1. ✅ Update `core/config.js` - `window.APP_BUILD` and `window.MODULE_VERS`
2. ✅ Update `core/kernel.standalone.js` - route titles
3. ✅ Update `index.html` - title and cache-busting parameters
4. ✅ Update fallback values in version scripts (if any)
5. ✅ Test with hard refresh (Ctrl+F5)
6. ✅ Verify all version displays are correct

---

## 🎨 Design System & UI Patterns

### **PCFP Color Scheme**
- **Primary**: White (#ffffff) and Gold (#fbbf24)
- **Background**: Light gray (#f8fafc)
- **Borders**: Subtle gray (#e5e7eb)
- **Text**: Dark gray (#0f172a)
- **Muted Text**: Medium gray (#64748b)

### **CSS Custom Properties**
```css
:root {
  --pcfp-white: #ffffff;
  --pcfp-gold: #fbbf24;
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

#### **Version Display Management**
```css
/* Single version display in sidebar header */
header h1 {
  font-size: 14px;
  margin: 0;
  font-weight: 700;
}

/* Remove any duplicate version pills */
.pcfp-version-pill {
  display: none; /* If outside main app structure */
}
```

#### **Common Layout Issues & Solutions**

**Issue**: Duplicate scrollbars (outer + inner)
**Solution**: 
```css
html, body { overflow: hidden; height: 100vh; }
.app { height: 100vh; overflow: hidden; }
```

**Issue**: Version displays in multiple locations
**Solution**: Keep only one version display in sidebar header, remove others

**Issue**: Content extending beyond viewport
**Solution**: Use `height: 100vh` and `overflow: hidden` on containers
```

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

#### **✅ Remove After Feature Completion**
- **Debug functions**: Performance monitoring and debugging helpers
- **Temporary variables**: Variables used only for debugging
- **Commented code**: Large blocks of commented-out code
- **Legacy fallbacks**: Old fallback values and deprecated features

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

### **Module Status Tracking**

#### **Status Categories**
```javascript
window.MODULE_STATUS = {
  "payments": "active",      // Fully functional
  "schedule": "active",      // Fully functional
  "budget": "placeholder",   // Coming soon
  "bills": "placeholder",    // Coming soon
  "documents": "placeholder" // Coming soon
};
```

#### **Status Definitions**
- **`active`**: Fully functional module with complete features
- **`placeholder`**: Module exists but shows "Coming Soon" page
- **`development`**: Module in active development
- **`deprecated`**: Module marked for removal
- **`archived`**: Module removed but code preserved

#### **Status Management**
- **Update status** when module development state changes
- **Document progress** in module-specific README files
- **Track dependencies** between modules
- **Plan roadmap** for placeholder module development

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

### **Debug Functions & Development Tools**

#### **Available Debug Functions**
```javascript
// Version debugging
window.dumpVersions(); // Shows current version info

// Module debugging
window.PCFP.moduleManager.debug(); // Shows module states

// Event debugging  
window.PCFP.eventBus.debug(); // Shows event performance

// Version debugging
window.PCFP.versionManager.debug(); // Shows version elements

// Logging system (disabled by default)
window.PCFP.log.enable(true); // Enable debug logging
window.PCFP.log.debug('Debug message');
window.PCFP.log.info('Info message');
window.PCFP.log.warn('Warning message');
window.PCFP.log.error('Error message');
```

#### **When to Use Debug Functions**
- ✅ **During development** - Enable logging for troubleshooting
- ✅ **Performance analysis** - Use debug() functions to identify bottlenecks
- ✅ **Version troubleshooting** - Use dumpVersions() to check version state
- ✅ **Module debugging** - Use moduleManager.debug() to check module states

#### **Production Guidelines**
- ❌ **Never enable logging** in production code
- ❌ **Never call debug functions** in production
- ❌ **Remove debug calls** before committing
- ✅ **Keep debug functions available** for development use

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

## 🧠 Learning & Knowledge Base

## 🧠 Learning & Knowledge Base

### **✅ What Works**

#### **CSS Grid Systems**
- **Direct Border Application**: `border-right: 1px solid var(--pcfp-border) !important;` works with CSS Grid + `display: contents`
- **Why it works**: Simple, direct rules override grid interference
- **When to use**: Any CSS Grid with `display: contents` layout
- **Example**:
  ```css
  .grid-cell {
    border-right: 1px solid var(--pcfp-border) !important;
    border-bottom: 1px solid var(--pcfp-border) !important;
  }
  .grid-cell:last-child {
    border-right: none !important;
  }
  ```

#### **JavaScript Patterns**
- **Dynamic Menu Creation**: `document.createElement()` + `document.body.appendChild()` for dropdowns
- **Why it works**: Avoids CSS conflicts and positioning issues
- **When to use**: Any dropdown menu in grid layouts
- **Example**:
  ```javascript
  const menu = document.createElement('div');
  menu.className = 'pcfp-menu';
  document.body.appendChild(menu);
  ```

#### **UI/UX Patterns**
- **Hover Tooltips**: HTML `title` attributes + CSS `overflow: hidden` for text truncation
- **Why it works**: Native browser support, no JavaScript required
- **When to use**: Long text in fixed-width columns
- **Example**:
  ```html
  <div class="task-title" title="Full task description">Truncated text...</div>
  ```

#### **Progress Sliders**
- **Range Input**: `input type="range"` for intuitive percentage adjustment
- **Why it works**: Native browser slider with real-time value display
- **When to use**: Any percentage-based input in modals
- **Example**:
  ```html
  <div class="progress-slider-container">
    <input type="range" id="taskProgress" min="0" max="100" value="0">
    <span class="progress-value">0%</span>
  </div>
  ```

#### **Table Layout Systems**
- **Table-Based Grids**: `display: table`, `table-row`, `table-cell` for reliable data alignment
- **Why it works**: Native table behavior ensures perfect column alignment
- **When to use**: Data tables with multiple columns that must align perfectly
- **Example**:
  ```css
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
  ```

#### **Column Width Management**
- **Fixed Widths**: Explicit width definitions prevent text wrapping
- **Why it works**: Prevents layout shifts and ensures consistent appearance
- **When to use**: Any data table with varying content lengths
- **Example**:
  ```css
  .grid-cell[data-col="assignee"] { width: 180px; }
  .grid-cell[data-col="phase"] { width: 140px; }
  .grid-cell[data-col="assignee"],
  .grid-cell[data-col="phase"] {
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
  ```

#### **Duration Field Synchronization**
- **Bidirectional Calculation**: Start date + duration = end date, or end date - start date = duration
- **Why it works**: Provides flexibility for users while maintaining data consistency
- **When to use**: Any date range input where duration matters
- **Example**:
  ```javascript
  function calculateEndDate(startDate, duration) {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + duration - 1);
    return endDate.toISOString().split('T')[0];
  }
  
  function calculateDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }
  ```

#### **Calendar Task Merging**
- **Hybrid Approach**: Individual task items for month view, absolute positioning for week/day views
- **Why it works**: Month view needs simple list items, week/day views need spanning blocks
- **When to use**: Calendar views with tasks that span multiple days
- **Example**:
  ```javascript
  // Month view: Individual task items
  const taskElements = dayTasks.map(task => 
    `<div class="task-item ${task.status}">${task.title}</div>`
  ).join('');
  
  // Week view: Merged blocks with absolute positioning
  const taskBlock = document.createElement('div');
  taskBlock.style.cssText = `
    position: absolute;
    left: ${left}%;
    top: ${top}px;
    width: ${width}%;
    height: ${height}px;
  `;
  ```

#### **JavaScript Scope Management**
- **IIFE Pattern**: Keep all related functions inside the same IIFE scope
- **Why it works**: Prevents scope issues where functions can't access variables
- **When to use**: Complex modules with multiple interdependent functions
- **Example**:
  ```javascript
  (function() {
    let tasks = [];
    let currentView = 'list';
    
    // All functions can access tasks and currentView
    function renderCalendar() {
      // Can access tasks array
    }
    
    function setupCalendarView() {
      // Can access currentView
    }
    
    // Expose only what's needed globally
    window.showTaskDetails = showTaskDetails;
  })();
  ```

#### **Calendar Implementation Strategy**
- **Simple First**: Start with basic task display before complex merging
- **Why it works**: Easier to debug, more reliable, consistent user experience
- **When to use**: Calendar views, task scheduling, any multi-view feature
- **Example**:
  ```javascript
  // Simple approach: Tasks appear in each time slot they span
  const dayTasks = getTasksForDate(currentDate);
  const taskElements = dayTasks.map(task => 
    `<div class="task-block ${task.status}">${task.title}</div>`
  ).join('');
  
  // Complex approach: Merged blocks with precise positioning
  // (Avoid until simple approach is working perfectly)
  ```

#### **Test-First Development**
- **Isolated Test Files**: Create separate HTML files for testing different approaches
- **Why it works**: Prevents breaking existing code and allows comparison of solutions
- **When to use**: Complex features, multiple implementation options, debugging
- **Example**:
  ```bash
  # Create test files for different approaches
  test-calendar-option-a-css-grid.html
  test-calendar-option-b-absolute-positioning.html
  test-calendar-option-c-canvas.html
  ```

### **❌ What Doesn't Work**

#### **CSS Grid Systems**
- **Complex Border Systems**: CSS custom properties with systematic rules conflict with CSS Grid
- **Why it fails**: Grid layout interferes with complex border calculations
- **Alternative**: Use direct border application instead
- **Example of what doesn't work**:
  ```css
  /* This approach fails */
  .grid-cell {
    border: none !important;
  }
  .grid-cell::after {
    content: '';
    border-right: 1px solid var(--pcfp-border);
  }
  ```

#### **CSS Grid with Display: Contents**
- **Grid Alignment Issues**: `display: contents` breaks CSS Grid column alignment
- **Why it fails**: Contents display removes elements from grid flow, causing misalignment
- **Alternative**: Use table-based layout for reliable data alignment
- **Example of what doesn't work**:
  ```css
  /* This approach fails - causes column misalignment */
  .grid-header {
    display: contents;
  }
  .grid-row {
    display: contents;
  }
  .grid-cell {
    display: grid;
    grid-template-columns: 400px 150px 120px;
  }
  ```

#### **External Library Dependencies**
- **CDN Libraries in Iframes**: FullCalendar.js and other external libraries fail in iframe environments
- **Why it fails**: Cross-origin restrictions and iframe security policies
- **Alternative**: Build custom implementations or use iframe-compatible solutions
- **Example of what doesn't work**:
  ```html
  <!-- This approach fails in iframe environments -->
  <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.js"></script>
  ```

#### **Complex Calendar Merging**
- **CSS Grid Spanning**: `grid-column: span X` and `grid-row: span Y` are overcomplicated for simple task merging
- **Canvas Rendering**: HTML5 Canvas is unnecessary complexity for basic calendar task display
- **Absolute Positioning with Complex Math**: Precise pixel calculations with `getBoundingClientRect()` are fragile
- **Why they fail**: Over-engineering simple problems, browser compatibility issues, maintenance complexity
- **Alternative**: Use simple hybrid approach - individual items for month view, basic absolute positioning for week/day
- **Example of what doesn't work**:
  ```javascript
  // Overcomplicated CSS Grid approach
  taskBlock.style.cssText = `
    grid-row: ${startRow} / ${endRow + 1};
    grid-column: ${startCol} / ${endCol + 1};
  `;
  
  // Overcomplicated Canvas approach
  ctx.fillRect(position.x, position.y, position.width, position.height);
  ```

#### **JavaScript Patterns**
- **Pre-existing HTML Menus**: Show/hide with `display: none/block` gets overridden
- **Why it fails**: CSS conflicts and specificity wars
- **Alternative**: Dynamic creation and document.body appending
- **Example of what doesn't work**:
  ```html
  <!-- This approach fails -->
  <div class="action-menu" style="display: none;">
    <button>Edit</button>
  </div>
  ```

#### **UI/UX Patterns**
- **CSS `content: attr(data-full-text)`**: Unreliable for tooltips
- **Why it fails**: Browser support issues and attribute conflicts
- **Alternative**: Standard HTML `title` attributes
- **Example of what doesn't work**:
  ```css
  /* This approach fails */
  .task-title::after {
    content: attr(data-full-text);
  }
  ```

#### **Column Resizing**
- **Flexbox-based Resizing**: Prone to drift and misalignment
- **Why it fails**: Flex values calculated independently for headers and data columns
- **Alternative**: Fixed-width columns with hover tooltips

#### **Application Layout**
- **Default Body Overflow**: `body { margin: 0 }` without `overflow: hidden` creates outer scrollbars
- **Why it fails**: Content extends beyond viewport, creating page-level scrolling
- **Alternative**: Use `html, body { height: 100vh; overflow: hidden }`
- **Example of what doesn't work**:
  ```css
  /* This approach fails */
  body { margin: 0; }
  .app { min-height: 100vh; }
  ```

#### **Version Display**
- **Multiple Version Locations**: Version displays in sidebar header AND bottom of sidebar
- **Why it fails**: Creates confusion and duplicate information
- **Alternative**: Single version display in sidebar header only
- **Example of what doesn't work**:
  ```html
  <!-- This approach fails -->
  <header><h1>2x2 Modules Build v8.6.0</h1></header>
  <nav>...</nav>
  <div class="pcfp-version-pill">Build v8.6.0</div> <!-- Duplicate! -->
  ```

#### **Version Management**
- **Hardcoded Fallback Values**: Version scripts with `|| 'v8.4'` prevent updates
- **Why it fails**: Fallback values override actual config values
- **Alternative**: Remove fallbacks or update them with each version change
- **Example of what doesn't work**:
  ```javascript
  // This approach fails
  const appBuild = window.APP_BUILD || 'v8.4';
  ```
- **Script Loading Race Conditions**: Inline scripts run before config.js loads
- **Why it fails**: `window.APP_BUILD` undefined when script first runs
- **Alternative**: Add wait logic for config to load
- **Example of what doesn't work**:
  ```javascript
  // This approach fails
  g.PCFP.version = { app: window.APP_BUILD || 'v8.6.0' };
  ```
- **Example of what doesn't work**:
  ```javascript
  // This approach fails
  function setupColumnResizing() {
    // Complex flex calculations that drift
  }
  ```

### **🔄 Continuous Learning Process**

#### **When Testing New Approaches:**
1. **Create isolated test files** before touching main code
2. **Test thoroughly** in browser environment
3. **Document results** immediately (success or failure)
4. **Get user validation** on working approaches
5. **Update knowledge base** with learnings
6. **Only then implement** proven solutions in main code

#### **When Writing New Code:**
1. **Check knowledge base first** for proven solutions
2. **Avoid documented anti-patterns**
3. **Use documented working patterns**
4. **Create test files** for any new approaches
5. **Test before implementing** in main code

#### **When Encountering New Problems:**
1. **Test multiple approaches** (as per our debugging strategy)
2. **Document what works** in the "What Works" section
3. **Document what fails** in the "What Doesn't Work" section
4. **Explain why** each approach succeeds or fails
5. **Provide alternatives** for failed approaches

### **📅 Calendar Integration - Schedule v1.3**

#### **✅ What Works**

##### **Mockup-First Development Approach**
- **Visual Mockup Creation**: Create detailed HTML mockups showing integration before implementation
- **Why it works**: User can see exactly how the feature will look and function before any code changes
- **When to use**: Complex UI integrations, major feature additions, interface changes
- **Example**: `calendar-integration-preview.html` showing calendar integration into existing Schedule module

##### **Mockup Requirements:**
- **Visual Integration**: Show how feature integrates with existing UI structure
- **Element Changes**: Clearly mark what's being removed/added/modified
- **Data Flow**: Demonstrate how existing data will be used in new feature
- **Implementation Plan**: Include step-by-step implementation details
- **PCFP Styling**: Use consistent white/gold color scheme throughout
- **Responsive Design**: Show how it works within module frame constraints

##### **Calendar Integration Strategy**
- **Remove Redundant Elements**: Delete non-functional navigation buttons
- **Replace Placeholder Content**: Replace "coming soon" messages with actual functionality
- **Maintain Existing Structure**: Keep module header, view selector, and task summary intact
- **Add Calendar Navigation**: Integrate Month/Week/Day toggle within calendar header
- **Data Transfer**: Use all existing task data from list view to populate calendar

##### **Calendar View Implementation**
- **Month View**: Grid layout with individual task items per day
- **Week View**: Hourly breakdown with merged task blocks using absolute positioning
- **Day View**: Detailed hourly view with task positioning
- **Task Merging**: Use `processedTasks` Set to prevent duplicate rendering
- **Responsive Design**: Works within existing module frame without external dependencies

#### **❌ What Doesn't Work**

##### **External Library Dependencies**
- **FullCalendar.js in Iframes**: Fails due to cross-origin restrictions
- **Why it fails**: Iframe security policies prevent external library loading
- **Alternative**: Build custom calendar implementation using vanilla JavaScript

##### **Complex Calendar Merging**
- **CSS Grid Spanning**: `grid-column: span X` overcomplicated for simple task merging
- **Canvas Rendering**: Unnecessary complexity for basic calendar task display
- **Why they fail**: Over-engineering simple problems, maintenance complexity
- **Alternative**: Simple hybrid approach - individual items for month, basic absolute positioning for week/day

#### **🎯 Implementation Plan**

1. **Remove Redundant Elements**
   - Delete `time-scale-selector` div and its buttons (Day, Week, Month, Quarter, Year)
   - Remove placeholder content: "Calendar View - FullCalendar.js integration coming in v1.2"

2. **Replace Placeholder Content**
   - Replace `calendar-placeholder` with actual calendar views
   - Add calendar header with Month/Week/Day navigation
   - Implement calendar container with proper PCFP styling

3. **Add Calendar Navigation**
   - Integrate Month/Week/Day toggle buttons in calendar header
   - Add navigation arrows (‹ ›) for date navigation
   - Display current month/year title

4. **Data Integration**
   - Connect existing task data from `localStorage` to calendar rendering
   - Transfer all task properties: title, dates, status, priority, assignee, phase
   - Maintain task summary functionality

5. **Styling Integration**
   - Apply PCFP design system (white/gold color scheme)
   - Ensure responsive design within module frame
   - Maintain consistency with existing UI elements

6. **Testing & Validation**
   - Verify all calendar views work with existing task data
   - Test navigation between Month/Week/Day views
   - Ensure task data displays correctly in all views

#### **📋 Success Criteria**

- [ ] Calendar views appear when "Calendar" is clicked in main navigation
- [ ] Redundant time-scale buttons are completely removed
- [ ] All existing task data populates calendar views correctly
- [ ] Month/Week/Day navigation works seamlessly
- [ ] PCFP styling is consistent throughout
- [ ] No external dependencies required
- [ ] Responsive design works within module frame
- [ ] Task summary remains functional

---

## 🎯 Proven Implementations

### **Grid System - Direct Border Application**

The **only approach that works reliably** with CSS Grid + `display: contents` is direct border application:

```css
.grid-cell {
  /* DIRECT BORDER APPLICATION - THIS WORKS */
  border-right: 1px solid var(--pcfp-border) !important;
  border-bottom: 1px solid var(--pcfp-border) !important;
}

.grid-header .grid-cell {
  border-bottom: 2px solid var(--pcfp-border) !important;
}

.grid-cell:last-child {
  border-right: none !important;
}
```

#### **❌ What Doesn't Work**

1. **CSS Custom Properties with Systematic Rules** - Conflicts with CSS Grid
2. **Pseudo-elements for All Borders** - Overkill and performance impact
3. **Complex Border Reset + Reapplication** - CSS Grid interferes
4. **Removing `display: contents`** - Breaks existing layout
5. **Conditional Border Application** - CSS specificity conflicts

#### **🎯 Key Lessons Learned**

- **CSS Grid + `display: contents`** requires **direct, simple border rules**
- **No complex systematic approaches** - they conflict with grid layout
- **`!important` declarations** are necessary to override grid interference
- **Last-child border removal** is essential for clean edges
- **Header bottom border** should be thicker (2px) for visual separation

#### **📋 Implementation Checklist**

- [ ] Use direct `border-right` and `border-bottom` on `.grid-cell`
- [ ] Apply `border-bottom: 2px` to header cells
- [ ] Remove `border-right` from `.grid-cell:last-child`
- [ ] Use `!important` to override grid conflicts
- [ ] Keep border rules simple and direct
- [ ] Test hover states to ensure borders persist

### **Three-Dot Action Menu - Dynamic Creation**

The three-dot action menu implementation that **actually works** uses dynamic creation and document body appending:

#### **1. JavaScript Implementation**
```javascript
// Global menu state
let menuEl = null;

// Close any existing menu
function closeMenu() { 
  if (menuEl) { 
    menuEl.remove(); 
    menuEl = null; 
    document.removeEventListener('click', onDoc); 
  } 
}

// Click outside to close
function onDoc(e) { 
  if (menuEl && !menuEl.contains(e.target)) closeMenu(); 
}

// Main toggle function
function toggleActionMenu(taskId) {
  // Close any existing menu
  closeMenu();
  
  // Find the button that was clicked
  const button = document.querySelector(`button[onclick*="toggleActionMenu('${taskId}')"]`);
  if (!button) return;
  
  // Get button position
  const rect = button.getBoundingClientRect();
  
  // Create menu dynamically
  const menu = document.createElement('div');
  menu.className = 'pcfp-menu';
  menu.innerHTML = [
    `<button type="button" onclick="editTask('${taskId}');">✏️ Edit</button>`,
    `<button type="button" onclick="deleteTask('${taskId}');">🗑️ Delete</button>`,
    `<button type="button" onclick="insertTaskAbove('${taskId}');">⬆️ Insert Above</button>`,
    `<button type="button" onclick="insertTaskBelow('${taskId}');">⬇️ Insert Below</button>`,
    `<button type="button" onclick="duplicateTask('${taskId}');">📋 Duplicate</button>`
  ].join('');
  
  // Append to document body (CRITICAL)
  document.body.appendChild(menu);
  menuEl = menu;
  
  // Position menu
  menu.style.top = (rect.bottom + window.scrollY + 6) + 'px';
  menu.style.left = Math.max(12, rect.right + window.scrollX - 180) + 'px';
  
  // Add click outside listener
  setTimeout(() => document.addEventListener('click', onDoc));
}
```

#### **2. CSS Implementation**
```css
/* Menu container */
.pcfp-menu {
  position: absolute;
  z-index: 1000;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,.08);
  min-width: 170px;
  padding: 6px;
}

/* Menu buttons */
.pcfp-menu button {
  width: 100%;
  display: block;
  background: #fff;
  border: 0;
  color: #0f172a;
  padding: 8px 10px;
  text-align: left;
  border-radius: 8px;
  cursor: pointer;
}

.pcfp-menu button:hover {
  background: #f8fafc;
}

/* Three-dot button */
.pcfp-menu-btn {
  border: 1px solid #e5e7eb;
  background: #fff;
  border-radius: 8px;
  padding: 6px 10px;
  cursor: pointer;
}
```

#### **3. HTML Structure**
```html
<!-- Simple button only - menu created dynamically -->
<div class="grid-cell" data-col="actions">
  <button class="action-menu-btn" onclick="toggleActionMenu('${task.id}')">
    <span class="three-dots">⋯</span>
  </button>
</div>
```

#### **🚨 Why This Approach Works**

1. **✅ Dynamic Creation** - Menu created fresh each time, no stale state
2. **✅ Document Body** - Avoids grid positioning conflicts
3. **✅ No CSS Conflicts** - No display/visibility override issues
4. **✅ Proven Implementation** - Exact same code as working payment planner
5. **✅ Clean State Management** - Single global menu element

#### **❌ What Doesn't Work**

- **Pre-existing HTML menus** with show/hide
- **Display property toggling** (gets overridden)
- **Visibility property toggling** (gets overridden)
- **ClassList-based visibility** (conflicts with other CSS)
- **Grid-contained menus** (positioning issues)

#### **🎯 Implementation Checklist**

- [ ] Use dynamic `document.createElement()` for menu
- [ ] Append to `document.body` (not grid container)
- [ ] Use `getBoundingClientRect()` for positioning
- [ ] Include `window.scrollY` and `window.scrollX` in positioning
- [ ] Add click-outside listener with `setTimeout()`
- [ ] Use `menuEl.remove()` for cleanup
- [ ] Copy exact CSS from payment planner

This approach has been **proven to work** across multiple modules and environments! 🚀

---

## 🚀 Best Practices

1. **Always test multiple approaches** - Don't commit to one solution
2. **Isolate test environments** - Keep test files separate from main code
3. **Document everything** - Create knowledge base for future reference
4. **Get user feedback** - User perspective is invaluable
5. **Choose based on evidence** - Don't implement unproven solutions
6. **Update documentation** - Share lessons learned with team
7. **Test before implementing** - Never put experimental code in main code
8. **Use proven patterns** - Check knowledge base before writing new code

This approach ensures we **never implement unproven solutions** and always have a **systematic way to solve complex problems**! 🚀

---

## 🚀 Quick Reference Cheat Sheet

### **Essential Commands**
```bash
# Start development server
python3 -m http.server 8000

# Hard refresh browser (clear cache)
Ctrl+F5 (Windows) / Cmd+Shift+R (Mac)

# Check console for errors
F12 → Console tab
```

### **File Locations**
- **Main Config**: `core/config.js`
- **Router**: `core/kernel.standalone.js`
- **Module Template**: `core/templates/module-template.html`
- **Cache Busting**: Update `?v=YYYYMMDDHHMMSS` in HTML files

### **Common Patterns**
- **Error Handling**: `safe(() => {}, 'context:function')`
- **Async Operations**: `safeAsync(async () => {}, 'context:function')`
- **Module Registration**: `window.PCFP.moduleManager.register()`
- **Event Handling**: `window.PCFP.moduleManager.on()`

### **Testing Checklist**
- [ ] Create test files for new approaches
- [ ] Test in multiple browsers
- [ ] Test responsive behavior
- [ ] Test error scenarios
- [ ] Get user validation
- [ ] Update knowledge base

### **Common CSS Patterns**
```css
/* Grid Layout */
.data-grid {
  display: grid;
  grid-template-columns: 400px 120px 120px 120px 120px 120px 120px 120px;
}

/* Direct Border Application */
.grid-cell {
  border-right: 1px solid var(--pcfp-border) !important;
  border-bottom: 1px solid var(--pcfp-border) !important;
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
```

### **Common JavaScript Patterns**
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

// Dynamic Menu Creation
const menu = document.createElement('div');
menu.className = 'pcfp-menu';
document.body.appendChild(menu);
```

### **Version Management**
```javascript
// In core/config.js
window.MODULE_VERS = {
  "moduleName": "v1.0"
};

// In core/kernel.standalone.js
'#/moduleName': { 
  title: 'Module Name v1.0', 
  src: 'modules/moduleName/index.html' 
}
```

### **Cache Busting Format**
```html
<link rel="stylesheet" href="../../core/theme.css?v=20250101120000">
<link rel="stylesheet" href="module.css?v=20250101120000">
<script src="module.js?v=20250101120000"></script>
```

### **Code Cleanup Checklist**
- [ ] **Remove console logs** from production code
- [ ] **Remove TODO/FIXME** comments or add timeline
- [ ] **Remove commented code** blocks larger than 5 lines
- [ ] **Update module status** in `core/config.js`
- [ ] **Update version numbers** consistently across files
- [ ] **Update cache-busting** parameters after changes
- [ ] **Document any legacy code** with removal timeline

### **Module Status Management**
```javascript
// Check module status
const status = window.MODULE_STATUS['moduleName'];

// Update status when module changes
window.MODULE_STATUS['moduleName'] = 'active'; // or 'placeholder', 'development'
```

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

### **Common Issues & Quick Fixes**
- **Module not loading**: Check route in `core/kernel.standalone.js`
- **Styles not updating**: Update cache-busting parameters
- **JavaScript errors**: Use `safe()` wrapper
- **Version mismatches**: Update both `config.js` and `kernel.standalone.js`
- **Grid issues**: Use direct border application
- **Menu not opening**: Use dynamic creation + `document.body`
- **Outer scrollbar**: Add `html, body { overflow: hidden }`
- **Duplicate versions**: Remove `.pcfp-version-pill` outside main structure
- **Version not updating**: Check fallback values in version scripts
- **Script loading issues**: Add wait logic for `window.APP_BUILD`

### **Quality Gates**
- [ ] All functionality tested
- [ ] Error handling implemented
- [ ] Performance acceptable
- [ ] User validation completed
- [ ] Documentation updated
- [ ] Knowledge base updated

This comprehensive guide ensures **consistent, high-quality development** across all PCFP modules! 🚀

---

## 🔮 Future Recommendations & Guide Evolution

### **Continuous Improvement Process**

This guide is a **living document** that evolves with our development experience. As we encounter new challenges, patterns, and solutions, we will continuously update and enhance this guide.

### **Recommendation Process**

#### **When New Recommendations Arise**
1. **Identify the Need**: During development, identify gaps in current guidance
2. **Propose Solution**: Suggest specific additions or improvements
3. **User Review**: Present recommendations to you for approval
4. **Implementation**: Add approved recommendations to the guide
5. **Validation**: Test new guidance in practice

#### **Types of Recommendations**
- **New Patterns**: Proven solutions for common problems
- **Process Improvements**: Better ways to approach development
- **Tool Integration**: New tools or utilities that improve workflow
- **Best Practices**: Lessons learned from real development experience
- **Performance Optimizations**: New techniques for better performance
- **Quality Enhancements**: Improved testing or validation approaches

### **Current Areas for Future Enhancement**

#### **Potential Future Sections**
- **API Integration Patterns**: When we add backend integration
- **Mobile Development**: If we expand to mobile applications
- **Advanced Testing**: Automated testing and CI/CD processes
- **Security Guidelines**: Security best practices and patterns
- **Deployment Procedures**: Production deployment and monitoring
- **Team Collaboration**: Multi-developer workflows and processes

#### **Potential Enhancements**
- **Interactive Examples**: Code snippets that can be tested
- **Video Tutorials**: Screen recordings of common tasks
- **Automated Tools**: Scripts to automate common development tasks
- **Integration Guides**: How to integrate with external services
- **Migration Guides**: How to upgrade or migrate existing code

### **My Commitment**

I will:
- **Always identify opportunities** for guide improvement during development
- **Propose specific recommendations** with clear rationale and examples
- **Present recommendations** to you for review and approval
- **Implement approved enhancements** promptly and thoroughly
- **Validate new guidance** in practice before considering it complete
- **Maintain guide quality** and consistency as it grows
- **Proactively update changelog** and version numbers with each significant change
- **Document all changes** in CHANGELOG.md with clear descriptions and impact
- **Maintain version consistency** across all files during updates

### **Feedback Loop**

- **During Development**: Identify gaps and propose solutions
- **After Implementation**: Document what worked and what didn't
- **Regular Review**: Periodically assess guide completeness and usefulness
- **User Feedback**: Incorporate your feedback and suggestions
- **Continuous Learning**: Update guide based on new experiences

This ensures our guide remains **comprehensive, practical, and valuable** as our project and team grow! 🚀
