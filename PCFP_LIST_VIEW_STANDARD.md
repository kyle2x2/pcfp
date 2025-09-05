# PCFP List View Standard v8.8.23

## 📋 **Standard Features for All List Views**

### **🎯 Core Requirements**
Every list view module must implement these standard features:

#### **1. Enhanced Pagination System**
- **Default**: 10 items per page
- **Navigation**: First, Previous, Next, Last buttons with smart page numbers
- **Smart Display**: Shows ellipsis (...) for large page counts (e.g., "1 2 3 4 ... 10")
- **Page Numbers**: Dynamic page number display with current page highlighting
- **Performance**: Automatic pagination on initial load
- **Items Per Page**: Dropdown selector (10, 25, 50) positioned on right side of pagination bar
- **Always Visible**: Pagination container always visible, page navigation buttons conditional

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

#### **5. Column Sorting System (NEW STANDARD)**
- **Clickable Headers**: All data columns (except checkbox and actions) are sortable
- **3-Click Cycle**: First click (asc), second click (desc), third click (clear)
- **Default Sort**: Items load sorted by primary field (usually title) ascending
- **Data Type Handling**: Automatic detection and proper sorting for strings, dates, priorities, statuses
- **Visual Indicators**: Single arrows (↑/↓) show current sort direction, subtle ↕ for sortable columns
- **Sort State**: Tracks current column and direction, clears on third click
- **Performance**: Sorting resets to page 1 and maintains pagination

#### **4. Enhanced Mass Actions Toolbar (CROSS-PAGE SELECTION)**
- **Trigger**: Checkbox selection (individual + select all)
- **Display**: Dynamic toolbar with selected count and gold-themed styling
- **Cross-Page Selection**: Selections persist across page navigation
- **Cumulative Counter**: Shows total selected items across ALL pages
- **Clear Button**: Left-side "Clear" button to deselect all items
- **Escape Key**: Press Escape to clear all selections when toolbar is visible
- **Smart Select All**: "Select All" checkbox resets on page navigation
- **Mass Actions**: Delete, Duplicate, Export operate on ALL selected items
- **Auto-Clear**: Toolbar automatically clears selections when disengaged
- **Animation**: Smooth slideDown animation on show/hide
- **Layout**: `[Clear] [X selected] ................ [Delete] [Duplicate] [Export]`
- **Confirmation**: Required for destructive actions
- **Buttons**: Exactly 3 action buttons + 1 clear button
- **Event Listeners**: Simple, direct event listeners in setupEventListeners()

#### **3. Standard Mass Action Buttons**
**Required Buttons (3 Total):**
1. **Delete Selected** - `id="btnDeleteSelected"` - `class="mass-action-btn danger"`
2. **Duplicate Selected** - `id="btnDuplicateSelected"` - `class="mass-action-btn"`
3. **Export Selected** - `id="btnExportSelected"` - `class="mass-action-btn"`

**HTML Structure:**
```html
<div id="massActionToolbar" class="mass-action-toolbar">
  <div class="mass-action-left">
    <button id="btnClearSelected" class="mass-action-btn clear-btn">Clear</button>
  <span class="selected-count">0 selected</span>
  </div>
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
document.getElementById('btnClearSelected')?.addEventListener('click', clearAllSelections);
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

#### **5. Cross-Page Selection System (NEW)**
- **Selection Persistence**: Selections maintained across page navigation
- **Global Tracking**: `selectedItemIds = new Set()` tracks all selected items
- **Page Navigation**: Arrow keys preserve selections, click navigation clears selections
- **Select All Reset**: "Select All" checkbox resets to unchecked on page navigation
- **Cumulative Counter**: Mass action toolbar shows total selections across all pages
- **Mass Action Scope**: All mass actions operate on ALL selected items, not just current page
- **Clear Functionality**: Both Clear button and Escape key clear ALL selections
- **Restoration**: Checkbox states restored when rendering pages
- **Performance**: Efficient Set-based tracking with O(1) operations

#### **6. Keyboard Shortcuts**
- **Navigation**: Arrow keys (↑↓←→) for item/page navigation
- **Selection**: Ctrl+A (Select All), Space (Toggle focused item checkbox)
- **Actions**: Ctrl+N (New), Enter (Edit), Delete (Delete), Ctrl+D (Duplicate), Ctrl+E (Export)
- **Pagination**: Number keys (1-9) for quick page jumping
- **General**: Escape (Clear selections when mass toolbar visible, otherwise close menus/modals)
- **Help**: Keyboard shortcuts help modal with visual guide

#### **6. Performance Monitoring**
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
        <!-- Module-specific columns (sortable) -->
        <div class="grid-cell sortable" data-col="column1" onclick="handleColumnClick('column1')">
          <span class="col-title">Column Title</span>
        </div>
        <!-- ... more sortable columns ... -->
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

#### **6. Column Sorting CSS (NEW STANDARD)**
```css
/* Column sorting styles */
.grid-header .grid-cell.sortable {
  cursor: pointer;
  user-select: none;
  position: relative;
  transition: background-color 0.2s ease;
}

.grid-header .grid-cell.sortable:hover {
  background: var(--pcfp-gold-light);
}

.grid-header .grid-cell.sorted {
  background: var(--pcfp-gold-light);
  color: var(--pcfp-gold);
}

.grid-header .grid-cell.sorted .col-title {
  font-weight: 700;
}

/* Sort indicators */
.grid-header .grid-cell.sorted.asc .col-title::after {
  content: ' ↑';
  color: var(--pcfp-gold);
  font-weight: bold;
}

.grid-header .grid-cell.sorted.desc .col-title::after {
  content: ' ↓';
  color: var(--pcfp-gold);
  font-weight: bold;
}

/* Show subtle indicator when no column is sorted */
.grid-header .grid-cell.sortable:not(.sorted) .col-title::after {
  content: ' ↕';
  color: var(--pcfp-text-muted);
  font-weight: normal;
  opacity: 0.5;
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

.pagination-btn.active {
  background: var(--pcfp-gold);
  color: var(--pcfp-white);
  border-color: var(--pcfp-gold);
}

.pagination-ellipsis {
  padding: 8px 4px;
  color: var(--pcfp-text-muted);
  font-weight: bold;
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

#### **6. Enhanced Mass Action Toolbar CSS**
```css
/* ===== MASS ACTION TOOLBAR ===== */
.mass-action-toolbar {
  display: none;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  background: var(--pcfp-white);
  border: 1px solid var(--pcfp-gold);
  border-radius: 8px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(198, 162, 71, 0.15);
  animation: slideDown 0.3s ease-out;
}

.mass-action-toolbar.show {
  display: flex;
}

.selected-count {
  font-weight: 600;
  color: var(--pcfp-gold);
  font-size: 14px;
}

.mass-action-buttons {
  display: flex;
  gap: 10px;
}

.mass-action-btn {
  padding: 8px 16px;
  border: 1px solid var(--pcfp-border);
  background: var(--pcfp-white);
  color: var(--pcfp-text);
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
  white-space: nowrap;
}

.mass-action-btn:hover {
  background: var(--pcfp-gold-light);
  border-color: var(--pcfp-gold);
}

.mass-action-btn.danger {
  color: var(--pcfp-error);
  border-color: var(--pcfp-error);
}

.mass-action-btn.danger:hover {
  background: var(--pcfp-error);
  color: var(--pcfp-white);
}

.mass-action-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.mass-action-btn.clear-btn {
  background: var(--pcfp-gold-light);
  border-color: var(--pcfp-gold);
  color: var(--pcfp-gold-dark);
  font-weight: 600;
}

.mass-action-btn.clear-btn:hover {
  background: var(--pcfp-gold);
  color: var(--pcfp-white);
}

.mass-action-btn.primary {
  background: var(--pcfp-gold);
  color: var(--pcfp-white);
  border-color: var(--pcfp-gold);
}

.mass-action-btn.primary:hover {
  background: var(--pcfp-gold-dark);
  border-color: var(--pcfp-gold-dark);
}

/* Animation for mass action toolbar */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### **7. Keyboard Shortcuts CSS**
```css
/* Keyboard navigation focus */
.grid-row.focused {
  background: var(--pcfp-gold-light);
  outline: 2px solid var(--pcfp-gold);
  outline-offset: -2px;
}

.grid-row.focused .grid-cell {
  background: var(--pcfp-gold-light);
}

/* Keyboard shortcuts help modal */
.shortcuts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.shortcut-category h4 {
  margin: 0 0 15px 0;
  color: var(--pcfp-gold);
  font-size: 16px;
  font-weight: 600;
  border-bottom: 2px solid var(--pcfp-gold-light);
  padding-bottom: 8px;
}

.shortcut-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding: 8px 0;
}

.shortcut-item kbd {
  background: var(--pcfp-panel);
  border: 1px solid var(--pcfp-border);
  border-radius: 4px;
  padding: 4px 8px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  font-weight: bold;
  color: var(--pcfp-text);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  min-width: 20px;
  text-align: center;
}

.shortcut-item span {
  color: var(--pcfp-text-muted);
  font-size: 14px;
}
```

#### **8. Standard Search & Filter CSS**
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

// Column Sorting Variables (NEW STANDARD)
let currentSort = {
  column: '',
  direction: 'asc' // 'asc' or 'desc'
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
    const container = document.getElementById('paginationContainer');
    if (!container) return;

    // Always show pagination container for items per page dropdown
    container.style.display = 'flex';

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredItems.length);

    container.innerHTML = `
        <div class="pagination-info">
            Showing ${startItem}-${endItem} of ${filteredItems.length} items
        </div>
        <div class="pagination-controls">
            ${totalPages > 1 ? `
                <button class="pagination-btn" onclick="changePage(1)" ${currentPage === 1 ? 'disabled' : ''}>First</button>
                <button class="pagination-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
                <span class="page-numbers">
                    ${generatePageNumbers()}
                </span>
                <button class="pagination-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
                <button class="pagination-btn" onclick="changePage(${totalPages})" ${currentPage === totalPages ? 'disabled' : ''}>Last</button>
            ` : ''}
        </div>
        <div class="items-per-page">
            <label>Items per page:</label>
            <select onchange="changeItemsPerPage(this.value)">
                <option value="10" ${itemsPerPage === 10 ? 'selected' : ''}>10</option>
                <option value="25" ${itemsPerPage === 25 ? 'selected' : ''}>25</option>
                <option value="50" ${itemsPerPage === 50 ? 'selected' : ''}>50</option>
            </select>
        </div>
    `;
}

// Enhanced pagination with ellipsis indicators
function generatePageNumbers() {
    const maxVisible = 5;
    let html = '';

    if (totalPages <= maxVisible) {
        // Show all pages if total is 5 or less
        for (let i = 1; i <= totalPages; i++) {
            html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
        }
    } else {
        // Complex pagination with ellipsis
        if (currentPage <= 3) {
            // Show pages 1-4, ellipsis, last page
            for (let i = 1; i <= 4; i++) {
                html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
            }
            html += `<span class="pagination-ellipsis">...</span>`;
            html += `<button class="pagination-btn" onclick="changePage(${totalPages})">${totalPages}</button>`;
        } else if (currentPage >= totalPages - 2) {
            // Show first page, ellipsis, last 4 pages
            html += `<button class="pagination-btn" onclick="changePage(1)">1</button>`;
            html += `<span class="pagination-ellipsis">...</span>`;
            for (let i = totalPages - 3; i <= totalPages; i++) {
                html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
            }
        } else {
            // Show first page, ellipsis, current-1, current, current+1, ellipsis, last page
            html += `<button class="pagination-btn" onclick="changePage(1)">1</button>`;
            html += `<span class="pagination-ellipsis">...</span>`;
            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
            }
            html += `<span class="pagination-ellipsis">...</span>`;
            html += `<button class="pagination-btn" onclick="changePage(${totalPages})">${totalPages}</button>`;
        }
    }

    return html;
}

function changeItemsPerPage(newItemsPerPage) {
  itemsPerPage = parseInt(newItemsPerPage);
  currentPage = 1;
  
  // Clear all selections when changing items per page
  clearAllSelections();
  
  applyPagination();
  renderCurrentView(); // Replace with module's render function
}

function changePage(page, clearSelections = true) {
  if (page < 1 || page > totalPages) return;
  
  // Clear all selections when changing pages (unless explicitly disabled)
  if (clearSelections) {
    clearAllSelections();
  }
  
  currentPage = page;
    applyPagination();
    populateList(); // Replace with module's render function
}

// Cross-Page Selection System Functions
let selectedItemIds = new Set(); // Global selection tracking

function updateSelectedCount() {
  // Count selected items across ALL pages (not just current page)
  const totalSelectedCount = selectedItemIds.size;
  const toolbar = document.getElementById('massActionToolbar');
  const countSpan = toolbar.querySelector('.selected-count');
  
  if (totalSelectedCount > 0) {
    toolbar.classList.add('show');
    countSpan.textContent = `${totalSelectedCount} selected`;
  } else {
    toolbar.classList.remove('show');
    // When toolbar is disengaged, clear all selections
    clearAllSelections();
  }
}

function clearAllSelections() {
  // Clear individual checkboxes
  document.querySelectorAll('.item-checkbox').forEach(checkbox => {
    checkbox.checked = false;
  });
  
  // Clear the selection tracking set
  selectedItemIds.clear();
  
  // Clear select all checkbox
  const selectAllCheckbox = document.getElementById('selectAll');
  if (selectAllCheckbox) {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
  }
  
  // Update selection count (without clearing again to avoid infinite loop)
  updateSelectedCountOnly();
}

function updateSelectedCountOnly() {
  // Count selected items across ALL pages (not just current page)
  const totalSelectedCount = selectedItemIds.size;
  const toolbar = document.getElementById('massActionToolbar');
  const countSpan = toolbar.querySelector('.selected-count');
  
  if (totalSelectedCount > 0) {
    toolbar.classList.add('show');
    countSpan.textContent = `${totalSelectedCount} selected`;
    } else {
    toolbar.classList.remove('show');
  }
}

// Enhanced Mass Action Functions (Cross-Page)
function deleteSelectedItems() {
  if (selectedItemIds.size === 0) {
    alert('Please select items to delete');
    return;
  }
  
  if (confirm(`Are you sure you want to delete ${selectedItemIds.size} selected items?`)) {
    const selectedIds = Array.from(selectedItemIds);
    // Replace with module's data array and filter logic
    window.moduleItems = window.moduleItems.filter(item => !selectedIds.includes(item.id));
    
    saveItems(); // Replace with module's save function
    applySearchAndFilter(); // Replace with module's filter function
    clearAllSelections();
    showNotification(`${selectedIds.length} items deleted successfully`, 'success');
  }
}

function duplicateSelectedItems() {
  if (selectedItemIds.size === 0) {
    alert('Please select items to duplicate');
    return;
  }
  
  const selectedIds = Array.from(selectedItemIds);
  const itemsToDuplicate = window.moduleItems.filter(item => selectedIds.includes(item.id));
  
  itemsToDuplicate.forEach(item => {
    const newItem = {
      ...item,
      id: generateItemId(), // Replace with module's ID generation
      title: item.title + ' (Copy)',
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0]
    };
    window.moduleItems.push(newItem);
  });
  
  saveItems(); // Replace with module's save function
  applySearchAndFilter(); // Replace with module's filter function
  clearAllSelections();
  showNotification(`${itemsToDuplicate.length} items duplicated successfully`, 'success');
}

function exportSelectedItems() {
  if (selectedItemIds.size === 0) {
    alert('Please select items to export');
    return;
  }
  
  const selectedIds = Array.from(selectedItemIds);
  const itemsToExport = window.moduleItems.filter(item => selectedIds.includes(item.id));
  
  exportToCSV(itemsToExport, 'selected_items.csv'); // Replace with module's export function
  clearAllSelections();
  showNotification(`${itemsToExport.length} items exported successfully`, 'success');
}

// Checkbox Event Listeners (Cross-Page Selection)
document.addEventListener('change', function(e) {
  if (e.target.classList.contains('item-checkbox')) {
    const itemId = e.target.dataset.itemId;
    if (e.target.checked) {
      selectedItemIds.add(itemId);
    } else {
      selectedItemIds.delete(itemId);
    }
    updateSelectedCount();
    updateSelectAllState();
  }
});

// Select All checkbox
document.getElementById('selectAll').addEventListener('change', function() {
  const checkboxes = document.querySelectorAll('.item-checkbox');
  checkboxes.forEach(checkbox => {
    checkbox.checked = this.checked;
    const itemId = checkbox.dataset.itemId;
    if (this.checked) {
      selectedItemIds.add(itemId);
    } else {
      selectedItemIds.delete(itemId);
    }
  });
  updateSelectedCount();
});

// Page Navigation with Select All Reset
function changePage(page, clearSelections = true) {
  if (page >= 1 && page <= totalPages) {
    if (clearSelections) {
      clearAllSelections();
    } else {
      // Reset Select All checkbox when navigating with arrow keys
      const selectAllCheckbox = document.getElementById('selectAll');
      if (selectAllCheckbox) {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
      }
    }
    
    currentPage = page;
    applyPagination();
    renderCurrentView(); // Replace with module's render function
  }
}

// Selection Restoration on Render
function renderListView() {
  // ... existing render logic ...
  
  // Restore selection state if this item was previously selected
  const checkbox = row.querySelector('.item-checkbox');
  if (selectedItemIds.has(item.id)) {
    checkbox.checked = true;
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

// Enhanced Mass Action Buttons
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
    
    // Clear all checkboxes after action
    clearAllSelections();
    
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
  
  // Clear all checkboxes after action
  clearAllSelections();
  
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
  
  // Clear all checkboxes after action
  clearAllSelections();
  
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

// Column Sorting Functions (NEW STANDARD)
function sortColumn(columnName, direction = 'asc') {
  // Update current sort state
  currentSort.column = columnName;
  currentSort.direction = direction;
  
  // Sort the filtered items
  filteredItems.sort((a, b) => {
    let aVal = a[columnName] || '';
    let bVal = b[columnName] || '';
    
    // Handle different data types
    if (columnName.includes('Date') || columnName === 'createdDate' || columnName === 'updatedDate') {
      // Date sorting
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    } else if (columnName === 'priority') {
      // Priority sorting (custom order)
      const priorityOrder = { 'urgent': 4, 'high': 3, 'medium': 2, 'low': 1 };
      aVal = priorityOrder[aVal] || 0;
      bVal = priorityOrder[bVal] || 0;
    } else if (columnName === 'status') {
      // Status sorting (custom order)
      const statusOrder = { 'not-started': 1, 'in-progress': 2, 'completed': 3, 'on-hold': 4 };
      aVal = statusOrder[aVal] || 0;
      bVal = statusOrder[bVal] || 0;
    } else if (typeof aVal === 'string') {
      // String sorting (case insensitive)
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    
    // Compare values
    let comparison = 0;
    if (aVal > bVal) {
      comparison = 1;
    } else if (aVal < bVal) {
      comparison = -1;
    }
    
    // Reverse if descending
    return direction === 'desc' ? -comparison : comparison;
  });
  
  // Reset to first page after sorting
  currentPage = 1;
  
  // Re-apply pagination and render
  applyPagination();
  renderCurrentView(); // Replace with module's render function
  
  // Update column headers to show sort indicators
  updateColumnHeaders();
}

function updateColumnHeaders() {
  // Remove sort indicators from all headers
  document.querySelectorAll('.grid-header .grid-cell').forEach(cell => {
    cell.classList.remove('sorted', 'asc', 'desc');
  });
  
  // Add sort indicator to current sort column
  if (currentSort.column) {
    const sortCell = document.querySelector(`[data-col="${currentSort.column}"]`);
    if (sortCell) {
      sortCell.classList.add('sorted', currentSort.direction);
    }
  }
}

function handleColumnClick(columnName) {
  // If clicking the same column that's already sorted
  if (currentSort.column === columnName) {
    if (currentSort.direction === 'asc') {
      // First click: asc, second click: desc, third click: clear
      currentSort.direction = 'desc';
    } else if (currentSort.direction === 'desc') {
      // Third click: clear sorting
      clearSorting();
      return;
    }
  } else {
    // Clicking a different column: start with ascending
    currentSort.direction = 'asc';
  }
  
  // Sort the column
  sortColumn(columnName, currentSort.direction);
}

function clearSorting() {
  // Reset sort state
  currentSort.column = '';
  currentSort.direction = 'asc';
  
  // Reset to original order (by creation order or ID)
  filteredItems.sort((a, b) => {
    // Sort by ID to maintain original order
    return a.id.localeCompare(b.id);
  });
  
  // Reset to first page
  currentPage = 1;
  
  // Re-apply pagination and render
  applyPagination();
  renderCurrentView(); // Replace with module's render function
  
  // Update column headers to remove sort indicators
  updateColumnHeaders();
}

function applyDefaultSort() {
  // Set default sort (usually by title ascending)
  currentSort.column = 'title'; // Replace with module's primary field
  currentSort.direction = 'asc';
  
  // Sort by primary field ascending
  filteredItems.sort((a, b) => {
    const aVal = (a.title || '').toLowerCase(); // Replace with module's primary field
    const bVal = (b.title || '').toLowerCase(); // Replace with module's primary field
    return aVal.localeCompare(bVal);
  });
}

// Make functions globally accessible for onclick handlers
window.handleColumnClick = handleColumnClick;
window.clearSorting = clearSorting;
```

#### **8. Keyboard Shortcuts JavaScript Functions**
```javascript
// Keyboard shortcuts event listener (add to setupEventListeners function)
document.addEventListener('keydown', (e) => {
    // Don't trigger shortcuts when typing in inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return;
    }

    // Escape key - close menus/modals
    if (e.key === 'Escape') {
        closeMenu();
        closeItemModal();
        return;
    }

    // Ctrl/Cmd + A - Select all items
    if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        const selectAllCheckbox = document.getElementById('selectAll');
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = true;
            selectAllCheckbox.dispatchEvent(new Event('change'));
        }
        return;
    }

    // Ctrl/Cmd + D - Duplicate selected items
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        const selectedCount = document.querySelectorAll('.item-checkbox:checked').length;
        if (selectedCount > 0) {
            duplicateSelectedItems();
        }
        return;
    }

    // Delete key - Delete selected items
    if (e.key === 'Delete') {
        e.preventDefault();
        const selectedCount = document.querySelectorAll('.item-checkbox:checked').length;
        if (selectedCount > 0) {
            deleteSelectedItems();
        }
        return;
    }

    // Ctrl/Cmd + E - Export selected items
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        const selectedCount = document.querySelectorAll('.item-checkbox:checked').length;
        if (selectedCount > 0) {
            exportSelectedItems();
        }
        return;
    }

    // Ctrl/Cmd + N - Add new item
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        addNewItem();
        return;
    }

    // Arrow keys for item navigation
    if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        handleItemNavigation(e.key);
        return;
    }
    
    // Left/Right arrows for page navigation
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentPage > 1) {
            changePage(currentPage - 1, false); // Don't clear selections
        }
        return;
    }
    
    if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentPage < totalPages) {
            changePage(currentPage + 1, false); // Don't clear selections
        }
        return;
    }

    // Enter key - Edit first selected item
    if (e.key === 'Enter') {
        e.preventDefault();
        const firstSelected = document.querySelector('.item-checkbox:checked');
        if (firstSelected) {
            const itemId = firstSelected.dataset.itemId;
            editItem(itemId);
        }
        return;
    }

    // Number keys for quick pagination
    if (e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        const pageNumber = parseInt(e.key);
        if (pageNumber <= totalPages) {
            changePage(pageNumber);
        }
        return;
    }

    // Space key - Toggle checkbox of currently focused item
    if (e.key === ' ') {
        e.preventDefault();
        const focusedItem = document.querySelector('.grid-row.focused');
        if (focusedItem) {
            const checkbox = focusedItem.querySelector('.item-checkbox');
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change'));
            }
        } else {
            // If no item is focused, focus the first item and toggle its checkbox
            const firstItem = document.querySelector('.grid-row');
            if (firstItem) {
                firstItem.classList.add('focused');
                const checkbox = firstItem.querySelector('.item-checkbox');
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change'));
                }
            }
        }
        return;
    }
});

// Handle up/down arrow key navigation for items
function handleItemNavigation(direction) {
    const visibleItems = document.querySelectorAll('.grid-row');
    if (visibleItems.length === 0) return;

    // Find currently focused item
    let currentIndex = -1;
    const focusedItem = document.querySelector('.grid-row.focused');
    if (focusedItem) {
        currentIndex = Array.from(visibleItems).indexOf(focusedItem);
    }

    let newIndex = currentIndex;

    switch (direction) {
        case 'ArrowUp':
            newIndex = Math.max(0, currentIndex - 1);
            break;
        case 'ArrowDown':
            newIndex = Math.min(visibleItems.length - 1, currentIndex + 1);
            break;
    }

    // Remove focus from all items
    visibleItems.forEach(item => item.classList.remove('focused'));

    // Add focus to new item
    if (newIndex >= 0 && newIndex < visibleItems.length) {
        visibleItems[newIndex].classList.add('focused');
        visibleItems[newIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}
```

#### **9. Standard Search & Filter JavaScript Functions**
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
- [ ] Add enhanced pagination functions (applyPagination, updatePaginationDisplay, changePage, generatePageNumbers, changeItemsPerPage)
- [ ] Add performance monitoring variables and functions
- [ ] **Add cross-page selection system** (`selectedItemIds = new Set()`)
- [ ] **Add cross-page selection functions** (updateSelectedCount, clearAllSelections, updateSelectedCountOnly)
- [ ] **Add checkbox event listeners** for cross-page selection tracking
- [ ] **Add Select All checkbox event listener** with cross-page tracking
- [ ] **Add page navigation with Select All reset** (changePage with clearSelections parameter)
- [ ] **Add selection restoration on render** (checkbox state restoration)
- [ ] Add enhanced mass action functions (deleteSelectedItems, duplicateSelectedItems, exportSelectedItems) **using selectedItemIds**
- [ ] Add search and filter variables (searchQuery, currentFilter, dateRangeStart, dateRangeEnd, isDateRangeActive, filteredItems)
- [ ] Add search and filter functions (applySearchAndFilter, clearSearch, applyDateRange, clearDateRange)
- [ ] Add search and filter event listeners to setupEventListeners function
- [ ] Add column sorting variables (currentSort object with column and direction)
- [ ] Add column sorting functions (sortColumn, updateColumnHeaders, handleColumnClick, clearSorting, applyDefaultSort)
- [ ] Make column sorting functions globally accessible (window.handleColumnClick, window.clearSorting)
- [ ] Update render function to use paginated data
- [ ] Update applyPagination to use filteredItems instead of items
- [ ] Add performance tracking to render function
- [ ] Update initialization to call applyPagination()
- [ ] Add checkbox column to grid header and rows
- [ ] Add pagination container to HTML (always visible)
- [ ] **Add enhanced mass action toolbar to HTML** (Clear button + 3 action buttons)
- [ ] Add search and filter HTML structure to module header
- [ ] Add sortable class and onclick handlers to column headers (except checkbox and actions)
- [ ] Add column sorting CSS styles (sortable, sorted, hover effects, arrow indicators)
- [ ] Add event listeners for checkboxes
- [ ] Add simple event listeners for mass action buttons (btnDeleteSelected, btnDuplicateSelected, btnExportSelected)
- [ ] Add items per page dropdown to pagination
- [ ] Update cache busting parameters
- [ ] Test enhanced pagination with ellipsis indicators
- [ ] Test mass actions with auto-clear functionality
- [ ] Test search, filter, and performance monitoring
- [ ] Verify consistent gold-themed styling across modules
- [ ] Test items per page dropdown functionality
- [ ] Test search functionality with different data types
- [ ] Test filter dropdown with all options
- [ ] Test date range filtering
- [ ] Test clear search and clear date range functions
- [ ] Test column sorting functionality (asc, desc, clear) with different data types
- [ ] Test 3-click cycle behavior (asc → desc → clear → asc)
- [ ] Test default sort on page load
- [ ] Test sort indicators (arrows) display correctly
- [ ] Test sorting resets to page 1
- [ ] CRITICAL: Make search functions globally accessible (window.clearSearch, window.applyDateRange, window.clearDateRange)
- [ ] CRITICAL: Use neutral styling for clear buttons (no red/danger colors)
- [ ] CRITICAL: Implement complete three-dot action menu with all 5 options
- [ ] CRITICAL: Add escape key support for closing action menus
- [ ] CRITICAL: Implement insertAbove and insertBelow functions
- [ ] CRITICAL: Expose all action menu functions globally (window.toggleActionMenu, window.insertItemAbove, etc.)
- [ ] CRITICAL: Add clearAllSelections() call to all mass action functions
- [ ] CRITICAL: Implement enhanced pagination with First/Last buttons and ellipsis
- [ ] CRITICAL: Add gold-themed mass action toolbar styling with slideDown animation
- [ ] CRITICAL: Implement comprehensive keyboard shortcuts (navigation, selection, actions)
- [ ] CRITICAL: Add keyboard shortcuts help modal with visual guide
- [ ] CRITICAL: Add keyboard navigation focus styling (.grid-row.focused)
- [ ] CRITICAL: Add handleArrowNavigation() function for arrow key navigation

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
