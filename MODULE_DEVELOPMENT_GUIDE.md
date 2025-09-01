# PCFP Module Development Guide v8.4

## 🚀 Building Modules for Your BuilderTrend Competitor

This guide covers how to develop modules using the enhanced PCFP v8.4 architecture with standardized patterns, performance monitoring, and API-ready design.

**✅ Versioning System**: Stable and centralized as of v8.4 - follow VERSIONING_GUIDE.md for all version updates.

## 📋 Module Development Checklist

### **Before Starting**
- [ ] Choose module key (e.g., `schedule`, `bids`, `invoices`)
- [ ] Define module purpose and features
- [ ] Plan data structure and API endpoints
- [ ] Design UI/UX following PCFP standards

### **Development Process**
- [ ] Use module template (`core/templates/module-template.html`)
- [ ] Follow standardized CSS framework (`core/templates/module.css`)
- [ ] Implement error handling with `safe()` and `safeAsync()`
- [ ] Add performance monitoring
- [ ] Test module communication
- [ ] Validate responsive design

### **Before Deployment**
- [ ] Update module version in `core/config.js`
- [ ] Test module lifecycle events
- [ ] Verify error boundaries work
- [ ] Check performance metrics
- [ ] Update documentation

## 🏗️ Module Architecture

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

## 🔧 Module Development Patterns

### **1. Module Registration**
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

### **2. Error Handling**
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

### **3. Module Communication**
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

### **4. Shared Data**
```javascript
// Share data with other modules
window.PCFP.moduleManager.setSharedData('project_timeline', timelineData, 'schedule');

// Get shared data from other modules
const projectData = window.PCFP.moduleManager.getSharedData('project_data');
```

### **5. Performance Monitoring**
```javascript
// Monitor performance of operations
const { performanceMonitor } = window.__pcfpCore || {};

const loadScheduleData = performanceMonitor(async () => {
  // Your data loading logic
  const data = await fetch('/api/schedule').then(r => r.json());
  return data;
}, 'schedule:loadData');
```

## 🎨 UI/UX Standards

### **Layout Structure**
```html
<header class="module-header">
  <div class="module-brand">
    <div class="module-badge">📅 Schedule</div>
    <h1>Project Timeline</h1>
  </div>
  <div class="module-toolbar">
    <button class="btn" id="btnSave">Save</button>
    <button class="btn" id="btnExport">Export</button>
  </div>
</header>

<div class="module-container">
  <div class="module-content">
    <!-- Your module content here -->
  </div>
</div>
```

### **Standard Components**
```html
<!-- Cards for content sections -->
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Timeline</h3>
  </div>
  <div class="card-content">
    <!-- Card content -->
  </div>
</div>

<!-- Forms -->
<div class="form-group">
  <label class="form-label">Project Name</label>
  <input class="form-input" type="text" id="projectName">
</div>

<!-- Tables -->
<table class="table">
  <thead>
    <tr>
      <th>Task</th>
      <th>Duration</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <!-- Table rows -->
  </tbody>
</table>

<!-- Alerts -->
<div class="alert alert-info">
  Timeline updated successfully
</div>
```

## 📊 Data Management

### **Module Data Structure**
```javascript
// Define your module's data structure
const moduleData = {
  id: 'schedule_123',
  name: 'Project Schedule',
  version: 'v1.0',
  data: {
    tasks: [],
    milestones: [],
    dependencies: []
  },
  metadata: {
    created: Date.now(),
    updated: Date.now(),
    createdBy: 'user_id'
  }
};
```

### **API Integration**
```javascript
// Future API integration pattern
const apiConfig = {
  baseUrl: '/api/v1',
  endpoints: {
    schedule: '/schedule',
    tasks: '/tasks',
    milestones: '/milestones'
  }
};

// API calls
const loadSchedule = async (projectId) => {
  const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.schedule}/${projectId}`);
  return await response.json();
};
```

## 🔄 Module Lifecycle

### **Lifecycle Events**
```javascript
// Module lifecycle events
window.PCFP.moduleManager.on('module:initializing', (data) => {
  console.log(`Module ${data.moduleKey} is initializing...`);
});

window.PCFP.moduleManager.on('module:initialized', (data) => {
  console.log(`Module ${data.moduleKey} is ready`);
});

window.PCFP.moduleManager.on('module:cleanup', (data) => {
  console.log(`Module ${data.moduleKey} is cleaning up`);
  // Clean up resources
});
```

### **State Management**
```javascript
// Get module state
const state = window.PCFP.moduleManager.getModuleState('schedule');
console.log('Module state:', state);

// Get all module states
const allStates = window.PCFP.moduleManager.getAllModuleStates();
console.log('All module states:', allStates);
```

## 🧪 Testing & Debugging

### **Debug Tools**
```javascript
// Debug module manager
window.PCFP.moduleManager.debug();

// Debug module performance
const metrics = window.PCFP.moduleManager.getModuleMetrics();
console.log('Module metrics:', metrics);

// Debug shared data
const sharedData = window.PCFP.moduleManager.getAllSharedData();
console.log('Shared data:', sharedData);
```

### **Isolated Function Testing**
When debugging complex functionality, create isolated test files to eliminate module conflicts:

#### **1. Create Isolated Test Files**
```bash
# Create standalone test files for specific functionality
test-module-debug.html      # Basic functionality tests
test-module-simplified.html # Complete module replica in isolation
```

#### **2. Diagnostic Strategy**
- **Test isolated versions** first to determine if issue is:
  - Module-specific (isolated tests work → fix main module)
  - Environment-related (isolated tests don't work → browser/environment issue)
  - Global conflicts (isolated tests work → module interference)

#### **3. System Diagnostics Template**
```javascript
function runSystemDiagnostics() {
    // Check for global conflicts
    console.log('Global Variables:', {
        '$': typeof window.$,
        'jQuery': typeof window.jQuery,
        'PCFP': typeof window.PCFP
    });
    
    // Check for CSS support
    console.log('CSS Support:', {
        'classList': typeof document.body.classList !== 'undefined',
        'getComputedStyle': typeof window.getComputedStyle !== 'undefined'
    });
    
    // Check for event handling
    console.log('Event Handling:', {
        'addEventListener': typeof document.addEventListener !== 'undefined',
        'onclick': typeof document.body.onclick !== 'undefined'
    });
}
```

#### **4. Real-time Debug Information**
```javascript
function updateDebugInfo(message) {
    const debugInfo = document.getElementById('debugInfo');
    const timestamp = new Date().toLocaleTimeString();
    debugInfo.innerHTML += `<br>[${timestamp}] ${message}`;
    debugInfo.scrollTop = debugInfo.scrollHeight;
}
```

### **Error Tracking**
```javascript
// Monitor errors
window.PCFP.moduleManager.on('module:error', (error) => {
  console.error('Module error:', error);
  // Send to error reporting service
});
```

## 📈 Performance Best Practices

### **1. Lazy Loading**
```javascript
// Load data only when needed
const loadDataOnDemand = safeAsync(async () => {
  if (!dataLoaded) {
    const data = await fetch('/api/data');
    return await data.json();
  }
  return cachedData;
}, 'module:lazyLoad');
```

### **2. Debounced Operations**
```javascript
// Debounce expensive operations
const { debouncedError } = window.__pcfpCore || {};

const debouncedSave = debouncedError(() => {
  saveData();
}, 300);
```

### **3. Caching**
```javascript
// Use module manager for caching
window.PCFP.moduleManager.setSharedData('cached_data', data, 'module_key');
const cachedData = window.PCFP.moduleManager.getSharedData('cached_data');
```

## 🚀 Deployment Checklist

### **Pre-Deployment**
- [ ] All error handling implemented
- [ ] Performance monitoring added
- [ ] Module communication tested
- [ ] Responsive design verified
- [ ] Documentation updated

### **Deployment**
- [ ] Update module version in `core/config.js`
- [ ] Test module in development environment
- [ ] Verify module loads correctly
- [ ] Check performance metrics
- [ ] Validate error boundaries

### **Post-Deployment**
- [ ] Monitor module performance
- [ ] Track error rates
- [ ] Gather user feedback
- [ ] Plan next iteration

## 📚 Example Module: Schedule

### **Complete Example**
```javascript
// modules/schedule/module.js
(function() {
  const { safe, safeAsync, performanceMonitor } = window.__pcfpCore || {};
  
  // Register module
  if (window.PCFP && window.PCFP.moduleManager) {
    window.PCFP.moduleManager.register('schedule', {
      name: 'Schedule',
      version: 'v1.0',
      description: 'Project scheduling and timeline management',
      icon: '📅',
      onInitialize: async (params) => {
        await initializeScheduleModule(params);
      }
    });
  }
  
  async function initializeScheduleModule(params) {
    safe(async () => {
      console.log('[PCFP] Initializing Schedule module...');
      
      // Load initial data
      const scheduleData = await loadScheduleData(params.projectId);
      
      // Initialize UI
      initializeScheduleUI(scheduleData);
      
      // Set up event listeners
      setupScheduleEventListeners();
      
      console.log('[PCFP] Schedule module ready');
    }, 'schedule:initialize');
  }
  
  const loadScheduleData = performanceMonitor(async (projectId) => {
    // Simulate API call
    return await fetch(`/api/schedule/${projectId}`).then(r => r.json());
  }, 'schedule:loadData');
  
  function initializeScheduleUI(data) {
    // Initialize the schedule UI
  }
  
  function setupScheduleEventListeners() {
    // Set up event listeners
  }
})();
```

## 🎯 Next Steps

1. **Choose your first module** to develop
2. **Use the template** for consistent structure
3. **Follow the patterns** for error handling and performance
4. **Test thoroughly** before deployment
5. **Monitor performance** after deployment

This architecture ensures your modules are **fast, reliable, and scalable** - perfect for your BuilderTrend competitor! 🚀

## 🎯 Three-Dot Action Menu - Proven Implementation

### **✅ Working Approach (Replicated from Payment Planner)**

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

### **🚨 Why This Approach Works**

1. **✅ Dynamic Creation** - Menu created fresh each time, no stale state
2. **✅ Document Body** - Avoids grid positioning conflicts
3. **✅ No CSS Conflicts** - No display/visibility override issues
4. **✅ Proven Implementation** - Exact same code as working payment planner
5. **✅ Clean State Management** - Single global menu element

### **❌ What Doesn't Work**

- **Pre-existing HTML menus** with show/hide
- **Display property toggling** (gets overridden)
- **Visibility property toggling** (gets overridden)
- **ClassList-based visibility** (conflicts with other CSS)
- **Grid-contained menus** (positioning issues)

### **🎯 Implementation Checklist**

- [ ] Use dynamic `document.createElement()` for menu
- [ ] Append to `document.body` (not grid container)
- [ ] Use `getBoundingClientRect()` for positioning
- [ ] Include `window.scrollY` and `window.scrollX` in positioning
- [ ] Add click-outside listener with `setTimeout()`
- [ ] Use `menuEl.remove()` for cleanup
- [ ] Copy exact CSS from payment planner

This approach has been **proven to work** across multiple modules and environments! 🚀
