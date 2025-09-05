# PCFP List View Standard v8.8.20

## 📋 **Standard Features for All List Views**

### **🎯 Core Requirements**
Every list view module must implement these standard features:

#### **1. Pagination System**
- **Default**: 10 items per page
- **Navigation**: Previous/Next buttons with page info
- **Display**: "Page X of Y (Z items)"
- **Performance**: Automatic pagination on initial load
- **Items Per Page**: Dropdown selector (10, 25, 50) positioned on right side of pagination bar

#### **2. Horizontal Scroll Behavior (STANDARDIZED)**
- **Window Shrink**: Columns maintain fixed widths, horizontal scrollbar appears
- **No Text Wrapping**: All table cells use `white-space: nowrap`
- **Text Overflow**: Long text shows ellipsis (`text-overflow: ellipsis`)
- **Column Compression**: Prevented through fixed column widths
- **Consistent**: Both Daily Logs and Schedule modules behave identically

#### **3. Three-Dot Action Menu (COMPLETE STANDARDIZATION)**
- **Menu Options**: Edit, Insert Above, Insert Below, Duplicate, Delete
- **Keyboard Support**: Escape key closes menu
- **Click Outside**: Clicking outside closes menu
- **Dynamic Positioning**: Menu positions automatically based on button location
- **Global Functions**: All functions exposed via window object for onclick handlers

#### **4. Search & Filter System (STANDARDIZED)**
- **Search Box**: Real-time search with debounced input (300ms delay)
- **Search Fields**: Search by title, description, assignee/creator, and dates
- **Filter Dropdown**: Category-based filtering (assignee, status, priority, etc.)
- **Date Range**: Start/end date selection with Apply/Clear buttons
- **Clear Functions**: Clear search and clear date range buttons
- **Performance**: Optimized filtering with performance metrics tracking

#### **4. Mass Actions Toolbar**
- **Trigger**: Checkbox selection (individual + select all)
- **Display**: Dynamic toolbar with selected count
- **Actions**: Delete, Duplicate, Export (standardized across all modules)
- **Confirmation**: Required for destructive actions
- **Buttons**: Exactly 3 buttons - no additional buttons allowed
- **Event Listeners**: Simple, direct event listeners in setupEventListeners()

#### **3. Standard Mass Action Buttons**
**Required Buttons (3 Total):**
1. **Delete Selected** - `id="btnDeleteSelected"` - `class="mass-action-btn danger"`
2. **Duplicate Selected** - `id="btnDuplicateSelected"` - `class="mass-action-btn"`
3. **Export Selected** - `id="btnExportSelected"` - `class="mass-action-btn"`

**HTML Structure:**
```html
<div id="massActionToolbar" class="mass-action-toolbar">
  <span class="selected-count">0 selected</span>
  <div class="mass-action-buttons">
    <button id="btnDeleteSelected" class="mass-action-btn danger">Delete Selected</button>
    <button id="btnDuplicateSelected" class="mass-action-btn">Duplicate Selected</button>
    <button id="btnExportSelected" class="mass-action-btn">Export Selected</button>
  </div>
</div>
```

**JavaScript Event Listeners (SIMPLE PATTERN):**
```javascript
// Mass action buttons - Use simple, direct event listeners
document.getElementById('btnDeleteSelected')?.addEventListener('click', deleteSelectedItems);
document.getElementById('btnDuplicateSelected')?.addEventListener('click', duplicateSelectedItems);
document.getElementById('btnExportSelected')?.addEventListener('click', exportSelectedItems);
```

**⚠️ CRITICAL: Avoid Complex Event Listener Patterns**
- ❌ **Don't use**: Dynamic event listener setup, button cloning, or complex timing logic
- ✅ **Do use**: Simple, direct event listeners in setupEventListeners() function
- ❌ **Don't use**: Event delegation for mass action buttons
- ✅ **Do use**: Direct event listeners as shown above

#### **4. Standard Search & Filter HTML Structure**
```html
<!-- Search and Filter Section -->
<div class="search-filter-container">
  <div class="search-box">
    <input type="text" id="itemSearch" placeholder="Search items..." class="search-input" title="Search by title, description, or assignee">
    <button class="search-btn" onclick="clearSearch()" title="Clear search">×</button>
  </div>
  <select id="filterBy" class="filter-select" title="Filter by category">
    <option value="">All Items</option>
    <option value="assignee">By Assignee</option>
    <option value="status">By Status</option>
    <option value="priority">By Priority</option>
    <option value="phase">By Phase</option>
    <option value="overdue">Overdue</option>
    <option value="completed">Completed</option>
  </select>
  <!-- Date Range Selection -->
  <div class="date-range-container">
    <input type="date" id="dateRangeStart" class="date-input" title="Start date">
    <span class="date-separator">to</span>
    <input type="date" id="dateRangeEnd" class="date-input" title="End date">
    <button class="date-range-btn" onclick="applyDateRange()" title="Apply date range">Apply</button>
    <button class="date-range-btn clear" onclick="clearDateRange()" title="Clear date range">Clear</button>
  </div>
</div>
```

#### **5. Performance Monitoring**
- **Metrics**: Render time, search time, memory usage
- **Warnings**: Console warnings for slow operations
- **Thresholds**: >500ms render, >200ms search, >6MB memory

#### **4. Standard HTML Structure**
```html
<!-- List View Container -->
<div id="listView" class="view-content active">
  <div class="grid-container">
    <div class="data-grid">
      <!-- Grid Header -->
      <div class="grid-header">
        <div class="grid-cell checkbox-cell" data-col="checkbox">
          <input type="checkbox" id="selectAll" title="Select all">
        </div>
        <!-- Module-specific columns -->
        <div class="grid-cell" data-col="column1">
          <span class="col-title">Column Title</span>
        </div>
        <!-- ... more columns ... -->
        <div class="grid-cell" data-col="actions">
          <span class="col-title">Actions</span>
        </div>
      </div>
      
      <!-- Grid Body -->
      <div class="grid-body" id="moduleGridBody">
        <!-- Items populated by JavaScript -->
      </div>
    </div>
  </div>
  
  <!-- Pagination Container (outside data-grid) -->
  <div id="paginationContainer" class="pagination-container" style="display: none;">
    <!-- Pagination controls populated by JavaScript -->
  </div>
</div>
```

#### **5. Standard CSS Classes (Based on Daily Logs - WORKING PERFECTLY)**

**Container Structure (CRITICAL - Prevents Items Being Hidden):**
```css
/* Module Container - FLEXIBLE HEIGHT */
.module-container {
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
}

/* Module Content - FLEXIBLE */
.module-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Module-specific Container - FLEXIBLE */
.module-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 20px;
  background: var(--pcfp-panel);
  gap: 20px;
}

/* Module Content Area - FLEXIBLE */
.module-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* View Content - FLEXIBLE */
.view-content {
  display: none;
  flex: 1;
  flex-direction: column;
}

.view-content.active {
  display: flex;
  flex-direction: column;
}
```

**Grid Structure (EXACT Daily Logs Implementation):**
```css
/* Grid Container - HORIZONTAL SCROLL ONLY */
.grid-container {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  border-radius: 8px;
  position: relative;
}

/* Data Grid */
.data-grid {
  display: table;
  width: 100%;
  border-collapse: collapse;
  background: var(--pcfp-white);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Grid Header */
.grid-header {
  display: table-row;
}

.grid-header .grid-cell {
  display: table-cell;
  background: var(--pcfp-panel);
  padding: 15px 10px;
  border-right: 1px solid var(--pcfp-border) !important;
  border-bottom: 2px solid var(--pcfp-border) !important;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  color: var(--pcfp-text-muted);
  vertical-align: middle;
  white-space: nowrap;
}

.grid-header .grid-cell:last-child {
  border-right: none !important;
}

/* Grid Body */
.grid-body {
  display: table-row-group;
}

/* Grid Rows */
.grid-row {
  display: table-row;
  transition: background-color 0.2s ease;
}

.grid-row:hover {
  background: var(--pcfp-panel);
}

.grid-row:hover .grid-cell {
  background: var(--pcfp-panel);
}

/* Grid Cells - HORIZONTAL SCROLL STANDARD */
.grid-row .grid-cell {
  display: table-cell;
  padding: 15px 10px;
  vertical-align: middle;
  overflow: hidden;
  box-sizing: border-box;
  border-right: 1px solid var(--pcfp-border) !important;
  border-bottom: 1px solid var(--pcfp-border) !important;
  white-space: nowrap; /* CRITICAL: Prevents text wrapping */
}

.grid-row .grid-cell:last-child {
  border-right: none !important;
}

/* Checkbox Styling */
.checkbox-cell {
  text-align: center;
}

.checkbox-cell input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

/* Column Widths - Fixed widths to prevent compression */
.grid-cell[data-col="checkbox"] { width: 60px; }
.grid-cell[data-col="project"] { width: 200px; }
.grid-cell[data-col="date"] { width: 150px; }
.grid-cell[data-col="notes"] { width: 400px; }
.grid-cell[data-col="weather"] { width: 120px; }
.grid-cell[data-col="createdBy"] { width: 150px; }
.grid-cell[data-col="actions"] { width: 120px; }

/* Prevent text wrapping in all columns */
.grid-cell[data-col="project"],
.grid-cell[data-col="date"],
.grid-cell[data-col="notes"],
.grid-cell[data-col="weather"],
.grid-cell[data-col="createdBy"] {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
```

**Pagination Styles (EXACT Daily Logs Implementation):**
```css
/* Pagination Container */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: var(--pcfp-white);
  border-top: 1px solid var(--pcfp-border);
  margin-top: 10px;
  border-radius: 0 0 8px 8px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.pagination-btn {
  padding: 8px 16px;
  border: 1px solid var(--pcfp-border);
  background: var(--pcfp-white);
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  color: var(--pcfp-text);
}

.pagination-btn:hover:not(:disabled) {
  background: var(--pcfp-gold-light);
  border-color: var(--pcfp-gold);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 14px;
  color: var(--pcfp-text-muted);
  font-weight: 500;
}

.items-per-page-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.items-per-page-label {
  font-size: 14px;
  color: var(--pcfp-text-muted);
  font-weight: 500;
}

.items-per-page-select {
  padding: 6px 12px;
  border: 1px solid var(--pcfp-border);
  background: var(--pcfp-white);
  border-radius: 4px;
  font-size: 14px;
  color: var(--pcfp-text);
  cursor: pointer;
  transition: all 0.2s;
}

.items-per-page-select:hover {
  border-color: var(--pcfp-gold);
}

.items-per-page-select:focus {
  outline: none;
  border-color: var(--pcfp-gold);
  box-shadow: 0 0 0 2px rgba(198, 162, 71, 0.1);
}
```

#### **6. Standard Search & Filter CSS**
```css
/* ===== SEARCH AND FILTER STYLES ===== */

.search-filter-container {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
  margin: 0 20px;
  max-width: 600px;
}

.search-box {
  position: relative;
  flex: 0 0 200px;
  min-width: 200px;
}

.search-input {
  width: 100%;
  padding: 8px 32px 8px 12px;
  border: 1px solid var(--pcfp-border);
  border-radius: 6px;
  font-size: 14px;
  background: var(--pcfp-white);
  color: var(--pcfp-text);
  transition: all 0.2s;
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  border-color: var(--pcfp-gold);
  box-shadow: 0 0 0 2px rgba(198, 162, 71, 0.1);
}

.search-input::placeholder {
  color: var(--pcfp-text-muted);
}

.search-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--pcfp-text-muted);
  cursor: pointer;
  font-size: 16px;
  padding: 2px;
  border-radius: 4px;
  transition: all 0.2s;
}

.search-btn:hover {
  color: var(--pcfp-text);
  background: var(--pcfp-panel);
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid var(--pcfp-border);
  border-radius: 6px;
  background: var(--pcfp-white);
  color: var(--pcfp-text);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 120px;
}

.filter-select:focus {
  outline: none;
  border-color: var(--pcfp-gold);
}

/* ===== DATE RANGE STYLES ===== */

.date-range-container {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--pcfp-panel);
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid var(--pcfp-border);
}

.date-input {
  padding: 6px 8px;
  border: 1px solid var(--pcfp-border);
  border-radius: 4px;
  background: var(--pcfp-white);
  color: var(--pcfp-text);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.date-input:focus {
  outline: none;
  border-color: var(--pcfp-gold);
}

.date-separator {
  font-size: 12px;
  color: var(--pcfp-text-muted);
  font-weight: 500;
}

.date-range-btn {
  padding: 6px 12px;
  border: 1px solid var(--pcfp-border);
  border-radius: 4px;
  background: var(--pcfp-white);
  color: var(--pcfp-text);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.date-range-btn:hover {
  background: var(--pcfp-gold-light);
  border-color: var(--pcfp-gold);
}

.date-range-btn.clear {
  background: var(--pcfp-panel);
  color: var(--pcfp-text-muted);
}

.date-range-btn.clear:hover {
  background: var(--pcfp-border);
  color: var(--pcfp-text);
}
```

#### **7. Standard JavaScript Functions**
```javascript
// Pagination Variables
let currentPage = 1;
let itemsPerPage = 10;
let totalPages = 0;
let paginatedItems = [];

// Performance Monitoring
let performanceMetrics = {
  renderTime: 0,
  searchTime: 0,
  memoryUsage: 0
};

// Required Functions
function applyPagination() {
  const itemsToPaginate = items; // Replace with module's data array
  totalPages = Math.ceil(itemsToPaginate.length / itemsPerPage);
  
  if (currentPage > totalPages) {
    currentPage = totalPages || 1;
  }
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  paginatedItems = itemsToPaginate.slice(startIndex, endIndex);
  
  updatePaginationDisplay();
}

function updatePaginationDisplay() {
    const paginationContainer = document.getElementById('paginationContainer');
    if (!paginationContainer) return;

    paginationContainer.innerHTML = '';

    const itemsToPaginate = filteredItems.length > 0 ? filteredItems : window.items; // Replace with module's data array
    if (itemsToPaginate.length === 0) {
        paginationContainer.style.display = 'none';
        return;
    }

    paginationContainer.style.display = 'flex';

    // Left side - pagination controls
    const paginationControls = document.createElement('div');
    paginationControls.className = 'pagination-controls';

    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'pagination-btn';
    prevBtn.disabled = currentPage === 1;
    prevBtn.textContent = '← Previous';
    prevBtn.onclick = () => changePage(currentPage - 1);
    paginationControls.appendChild(prevBtn);

    // Page info
    const pageInfo = document.createElement('span');
    pageInfo.className = 'pagination-info';
    if (totalPages <= 1) {
        pageInfo.textContent = `${itemsToPaginate.length} items`;
    } else {
        pageInfo.textContent = `Page ${currentPage} of ${totalPages} (${paginatedItems.length} items)`;
    }
    paginationControls.appendChild(pageInfo);

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'pagination-btn';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.textContent = 'Next →';
    nextBtn.onclick = () => changePage(currentPage + 1);
    paginationControls.appendChild(nextBtn);

    paginationContainer.appendChild(paginationControls);

    // Right side - items per page selector
    const itemsPerPageContainer = document.createElement('div');
    itemsPerPageContainer.className = 'items-per-page-container';

    const label = document.createElement('span');
    label.className = 'items-per-page-label';
    label.textContent = 'Items per page:';
    itemsPerPageContainer.appendChild(label);

    const select = document.createElement('select');
    select.className = 'items-per-page-select';
    select.value = itemsPerPage;
    select.onchange = (e) => {
        itemsPerPage = parseInt(e.target.value);
        currentPage = 1;
        applyPagination();
        populateList(); // Replace with module's render function
    };

    const options = [10, 25, 50];
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        if (option === itemsPerPage) {
            opt.selected = true;
        }
        select.appendChild(opt);
    });

    itemsPerPageContainer.appendChild(select);
    paginationContainer.appendChild(itemsPerPageContainer);
}

function changePage(page) {
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  applyPagination();
  populateList(); // Replace with module's render function
}

// Mass Action Functions
function updateSelectedCount() {
  const selectedCheckboxes = document.querySelectorAll('.item-checkbox:checked'); // Replace with module's checkbox class
  const count = selectedCheckboxes.length;
  
  const massActionToolbar = document.getElementById('massActionToolbar');
  if (massActionToolbar) {
    if (count > 0) {
      massActionToolbar.classList.add('show');
    } else {
      massActionToolbar.classList.remove('show');
    }
    
    const countDisplay = massActionToolbar.querySelector('.selected-count');
    if (countDisplay) {
      countDisplay.textContent = `${count} selected`;
    }
  }
}

function updateSelectAllState() {
  const checkboxes = document.querySelectorAll('.item-checkbox'); // Replace with module's checkbox class
  const checkedCheckboxes = document.querySelectorAll('.item-checkbox:checked');
  const selectAllCheckbox = document.getElementById('selectAll');
  
  if (selectAllCheckbox) {
    selectAllCheckbox.checked = checkedCheckboxes.length === checkboxes.length;
    selectAllCheckbox.indeterminate = checkedCheckboxes.length > 0 && checkedCheckboxes.length < checkboxes.length;
  }
}

// Standard Mass Action Buttons
function deleteSelectedItems() {
  const selectedCheckboxes = document.querySelectorAll('.item-checkbox:checked'); // Replace with module's checkbox class
  if (selectedCheckboxes.length === 0) return;
  
  if (confirm(`Are you sure you want to delete ${selectedCheckboxes.length} selected item(s)?`)) {
    const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.dataset.itemId); // Replace with module's ID attribute
    items = items.filter(item => !selectedIds.includes(item.id)); // Replace with module's data array
    
    // Save and re-render
    saveModuleData(); // Replace with module's save function
    applyPagination();
    populateList(); // Replace with module's render function
    
    // Clear checkboxes and hide toolbar
    updateSelectedCount();
    updateSelectAllState();
    
    // Show notification
    showNotification(`${selectedCheckboxes.length} item(s) deleted successfully`, 'success');
  }
}

function duplicateSelectedItems() {
  const selectedCheckboxes = document.querySelectorAll('.item-checkbox:checked'); // Replace with module's checkbox class
  if (selectedCheckboxes.length === 0) return;
  
  const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.dataset.itemId); // Replace with module's ID attribute
  const itemsToDuplicate = items.filter(item => selectedIds.includes(item.id)); // Replace with module's data array
  
  itemsToDuplicate.forEach(item => {
    const newItem = {
      ...item,
      id: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9), // Replace with module's ID format
      title: item.title + ' (Copy)', // Replace with module's title field
      status: 'not-started', // Replace with module's status field
      progress: 0 // Replace with module's progress field
    };
    items.push(newItem); // Replace with module's data array
  });
  
  // Save and re-render
  saveModuleData(); // Replace with module's save function
  applyPagination();
  populateList(); // Replace with module's render function
  
  // Clear checkboxes and hide toolbar
  updateSelectedCount();
  updateSelectAllState();
  
  // Show notification
  showNotification(`${selectedCheckboxes.length} item(s) duplicated successfully`, 'success');
}

function exportSelectedItems() {
  const selectedCheckboxes = document.querySelectorAll('.item-checkbox:checked'); // Replace with module's checkbox class
  if (selectedCheckboxes.length === 0) return;
  
  const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.dataset.itemId); // Replace with module's ID attribute
  const itemsToExport = items.filter(item => selectedIds.includes(item.id)); // Replace with module's data array
  
  const dataStr = JSON.stringify(itemsToExport, null, 2);
  const dataBlob = new Blob([dataStr], {type: 'application/json'});
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `module_items_${new Date().toISOString().split('T')[0]}.json`; // Replace with module name
  link.click();
  
  URL.revokeObjectURL(url);
  showNotification(`${selectedCheckboxes.length} item(s) exported successfully`, 'success');
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

// Performance Monitoring
function updatePerformanceMetrics() {
  performanceMetrics.memoryUsage = new Blob([JSON.stringify(items)]).size; // Replace with module's data array
  
  if (performanceMetrics.renderTime > 500) {
    console.warn(`[PCFP] Slow rendering detected: ${performanceMetrics.renderTime.toFixed(2)}ms`);
  }
  if (performanceMetrics.searchTime > 200) {
    console.warn(`[PCFP] Slow search detected: ${performanceMetrics.searchTime.toFixed(2)}ms`);
  }
  if (performanceMetrics.memoryUsage > 6 * 1024 * 1024) {
    console.warn(`[PCFP] High memory usage detected: ${(performanceMetrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`);
  }
}
```

#### **8. Standard Search & Filter JavaScript Functions**
```javascript
// Search and filter variables
let searchQuery = '';
let currentFilter = '';
let dateRangeStart = '';
let dateRangeEnd = '';
let isDateRangeActive = false;
let filteredItems = [];

// Search and filter functions
function applySearchAndFilter() {
  const startTime = performance.now();
  
  filteredItems = items.filter(item => {
    // Apply search query
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery) ||
      item.description.toLowerCase().includes(searchQuery) ||
      item.assignee.toLowerCase().includes(searchQuery);
    
    // Apply filter
    let matchesFilter = true;
    switch (currentFilter) {
      case 'assignee':
        matchesFilter = item.assignee && item.assignee.trim() !== '';
        break;
      case 'status':
        matchesFilter = item.status && item.status.trim() !== '';
        break;
      case 'priority':
        matchesFilter = item.priority && item.priority.trim() !== '';
        break;
      case 'phase':
        matchesFilter = item.phase && item.phase.trim() !== '';
        break;
      case 'overdue':
        const today = new Date();
        const endDate = new Date(item.endDate);
        matchesFilter = endDate < today && item.status !== 'completed';
        break;
      case 'completed':
        matchesFilter = item.status === 'completed';
        break;
    }
    
    // Apply date range filter
    let matchesDateRange = true;
    if (isDateRangeActive && dateRangeStart && dateRangeEnd) {
      const itemStartDate = new Date(item.startDate);
      const itemEndDate = new Date(item.endDate);
      const startDate = new Date(dateRangeStart);
      const endDate = new Date(dateRangeEnd);
      matchesDateRange = (itemStartDate >= startDate && itemStartDate <= endDate) ||
                        (itemEndDate >= startDate && itemEndDate <= endDate) ||
                        (itemStartDate <= startDate && itemEndDate >= endDate);
    }
    
    return matchesSearch && matchesFilter && matchesDateRange;
  });
  
  // Update performance metrics
  performanceMetrics.searchTime = performance.now() - startTime;
  
  // Apply pagination
  applyPagination();
  
  // Re-render the current view
  renderCurrentView();
}

function clearSearch() {
  const searchInput = document.getElementById('itemSearch');
  if (searchInput) {
    searchInput.value = '';
  }
  searchQuery = '';
  applySearchAndFilter();
}

function applyDateRange() {
  const startInput = document.getElementById('dateRangeStart');
  const endInput = document.getElementById('dateRangeEnd');
  
  if (startInput && endInput && startInput.value && endInput.value) {
    dateRangeStart = startInput.value;
    dateRangeEnd = endInput.value;
    isDateRangeActive = true;
    applySearchAndFilter();
  } else {
    alert('Please select both start and end dates');
  }
}

function clearDateRange() {
  const startInput = document.getElementById('dateRangeStart');
  const endInput = document.getElementById('dateRangeEnd');
  
  if (startInput) startInput.value = '';
  if (endInput) endInput.value = '';
  
  dateRangeStart = '';
  dateRangeEnd = '';
  isDateRangeActive = false;
  applySearchAndFilter();
}

// CRITICAL: Make functions globally accessible for onclick handlers
window.clearSearch = clearSearch;
window.applyDateRange = applyDateRange;
window.clearDateRange = clearDateRange;
window.toggleActionMenu = toggleActionMenu;
window.insertItemAbove = insertItemAbove;
window.insertItemBelow = insertItemBelow;

// Search event listeners (add to setupEventListeners function)
const searchInput = document.getElementById('itemSearch');
if (searchInput) {
  searchInput.addEventListener('input', function() {
    searchQuery = this.value.toLowerCase();
    applySearchAndFilter();
  });
}

const filterSelect = document.getElementById('filterBy');
if (filterSelect) {
  filterSelect.addEventListener('change', function() {
    currentFilter = this.value;
    applySearchAndFilter();
  });
}

const dateStartInput = document.getElementById('dateRangeStart');
const dateEndInput = document.getElementById('dateRangeEnd');

if (dateStartInput) {
  dateStartInput.addEventListener('change', function() {
    dateRangeStart = this.value;
    if (dateRangeStart && dateRangeEnd) {
      isDateRangeActive = true;
      applySearchAndFilter();
    }
  });
}

if (dateEndInput) {
  dateEndInput.addEventListener('change', function() {
    dateRangeEnd = this.value;
    if (dateRangeStart && dateRangeEnd) {
      isDateRangeActive = true;
      applySearchAndFilter();
    }
  });
}
```

### **🔄 Implementation Checklist**
- [ ] Add pagination variables to module
- [ ] Add pagination functions (applyPagination, updatePaginationDisplay, changePage)
- [ ] Add performance monitoring variables and functions
- [ ] Add mass action functions (updateSelectedCount, updateSelectAllState)
- [ ] Add standardized mass action functions (deleteSelectedItems, duplicateSelectedItems, exportSelectedItems)
- [ ] Add search and filter variables (searchQuery, currentFilter, dateRangeStart, dateRangeEnd, isDateRangeActive, filteredItems)
- [ ] Add search and filter functions (applySearchAndFilter, clearSearch, applyDateRange, clearDateRange)
- [ ] Add search and filter event listeners to setupEventListeners function
- [ ] Update render function to use paginated data
- [ ] Update applyPagination to use filteredItems instead of items
- [ ] Add performance tracking to render function
- [ ] Update initialization to call applyPagination()
- [ ] Add checkbox column to grid header and rows
- [ ] Add pagination container to HTML
- [ ] Add standardized mass action toolbar to HTML (exactly 3 buttons)
- [ ] Add search and filter HTML structure to module header
- [ ] Add event listeners for checkboxes
- [ ] Add simple event listeners for mass action buttons (btnDeleteSelected, btnDuplicateSelected, btnExportSelected)
- [ ] Add items per page dropdown to pagination
- [ ] Update cache busting parameters
- [ ] Test pagination, mass actions, search, filter, and performance monitoring
- [ ] Verify consistent styling across modules
- [ ] Test items per page dropdown functionality
- [ ] Test search functionality with different data types
- [ ] Test filter dropdown with all options
- [ ] Test date range filtering
- [ ] Test clear search and clear date range functions
- [ ] CRITICAL: Make search functions globally accessible (window.clearSearch, window.applyDateRange, window.clearDateRange)
- [ ] CRITICAL: Use neutral styling for clear buttons (no red/danger colors)
- [ ] CRITICAL: Implement complete three-dot action menu with all 5 options
- [ ] CRITICAL: Add escape key support for closing action menus
- [ ] CRITICAL: Implement insertAbove and insertBelow functions
- [ ] CRITICAL: Expose all action menu functions globally (window.toggleActionMenu, window.insertItemAbove, etc.)

### **📝 Module-Specific Customizations**
- **Data Array**: Replace `items` with module's data array (e.g., `tasks`, `logs`, `bills`)
- **Checkbox Class**: Replace `item-checkbox` with module-specific class (e.g., `task-checkbox`, `log-checkbox`)
- **Render Function**: Replace `populateList()` with module's render function
- **Mass Actions**: Use standardized functions (deleteSelectedItems, duplicateSelectedItems, exportSelectedItems)
- **Column Structure**: Customize columns based on module data
- **Styling**: Add module-specific styling while maintaining standard structure
- **Button IDs**: Must use standard IDs (btnDeleteSelected, btnDuplicateSelected, btnExportSelected)

### **🎨 Design Consistency**
- **Colors**: Use PCFP white/gold color scheme
- **Typography**: Consistent font sizes and weights
- **Spacing**: Standard padding and margins
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-friendly design
- **Accessibility**: Proper ARIA labels and keyboard navigation
