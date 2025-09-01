# PCFP Development Guide v8.4

## 🎯 Table of Contents

1. **[Module Development](#-module-development)** - Core patterns and architecture
2. **[Feature Development SOP](#-feature-development-sop)** - Standard process for new features  
3. **[Debugging Strategy](#-debugging-strategy)** - Multi-option testing approach
4. **[Version Management](#-version-management)** - Dual versioning system
5. **[Learning & Knowledge Base](#-learning--knowledge-base)** - What works and what doesn't
6. **[Proven Implementations](#-proven-implementations)** - Working solutions for common problems

---

## 🏗️ Module Development

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
2. Update `window.APP_BUILD = "v8.5"` (or next version)
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
   '#/schedule': { title: 'Schedule v1.3', src: 'modules/schedule/index.html' }
   ```

### **CRITICAL: Preventing Version Display Issues**

#### **✅ DO:**
- Always update BOTH `core/config.js` AND `core/kernel.standalone.js`
- Update cache-busting parameters after any version change
- Test by refreshing browser completely (Ctrl+F5)
- Keep module versions independent of main app version

#### **❌ DON'T:**
- Don't hardcode versions in individual module files
- Don't use `module_header_version.js` (it's disabled)
- Don't forget to update cache-busting parameters
- Don't let module versions get out of sync between config.js and kernel.standalone.js

---

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
