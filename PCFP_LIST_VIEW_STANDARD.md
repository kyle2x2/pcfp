# PCFP List View Standard

## 📋 **Standard Features for All List Views**

### **🎯 Core Requirements**
Every list view module must implement these standard features:

#### **1. Pagination System**
- **Default**: 10 items per page
- **Navigation**: Previous/Next buttons with page info
- **Display**: "Page X of Y (Z items)"
- **Performance**: Automatic pagination on initial load
- **Items Per Page**: Dropdown selector (10, 25, 50) positioned on right side of pagination bar

#### **2. Mass Actions Toolbar**
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

#### **4. Performance Monitoring**
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

#### **5. Standard CSS Classes**
```css
/* Grid Container */
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

/* Grid Cells */
.grid-row .grid-cell {
  display: table-cell;
  padding: 15px 10px;
  vertical-align: middle;
  overflow: hidden;
  box-sizing: border-box;
  border-right: 1px solid var(--pcfp-border) !important;
  border-bottom: 1px solid var(--pcfp-border) !important;
}

/* Checkbox Styling */
.checkbox-cell {
  text-align: center;
  width: 60px;
}

.checkbox-cell input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

/* Pagination Styles */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: var(--pcfp-white);
  border-top: 1px solid var(--pcfp-border);
  margin-top: 10px;
  border-radius: 0 0 8px 8px;
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

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 15px;
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

#### **6. Standard JavaScript Functions**
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
  
  if (totalPages <= 1) {
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
  
  // Page numbers
  const pageInfo = document.createElement('span');
  pageInfo.className = 'pagination-info';
  pageInfo.textContent = `Page ${currentPage} of ${totalPages} (${paginatedItems.length} items)`;
  paginationControls.appendChild(pageInfo);
  
  // Next button
  const nextBtn = document.createElement('button');
  nextBtn.className = 'pagination-btn';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.textContent = 'Next →';
  nextBtn.onclick = () => changePage(currentPage + 1);
  paginationControls.appendChild(nextBtn);
  
  paginationContainer.appendChild(paginationControls);
  
  // Right side - items per page dropdown
  const itemsPerPageContainer = document.createElement('div');
  itemsPerPageContainer.className = 'items-per-page-container';
  
  const label = document.createElement('label');
  label.textContent = 'Items per page:';
  label.className = 'items-per-page-label';
  itemsPerPageContainer.appendChild(label);
  
  const select = document.createElement('select');
  select.className = 'items-per-page-select';
  select.value = itemsPerPage;
  select.onchange = (e) => {
    itemsPerPage = parseInt(e.target.value);
    currentPage = 1; // Reset to first page
    applyPagination();
    populateList(); // Replace with module's render function
  };
  
  const options = [10, 25, 50];
  options.forEach(option => {
    const opt = document.createElement('option');
    opt.value = option;
    opt.textContent = option;
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

### **🔄 Implementation Checklist**
- [ ] Add pagination variables to module
- [ ] Add pagination functions (applyPagination, updatePaginationDisplay, changePage)
- [ ] Add performance monitoring variables and functions
- [ ] Add mass action functions (updateSelectedCount, updateSelectAllState)
- [ ] Add standardized mass action functions (deleteSelectedItems, duplicateSelectedItems, exportSelectedItems)
- [ ] Update render function to use paginated data
- [ ] Add performance tracking to render function
- [ ] Update initialization to call applyPagination()
- [ ] Add checkbox column to grid header and rows
- [ ] Add pagination container to HTML
- [ ] Add standardized mass action toolbar to HTML (exactly 3 buttons)
- [ ] Add event listeners for checkboxes
- [ ] Add simple event listeners for mass action buttons (btnDeleteSelected, btnDuplicateSelected, btnExportSelected)
- [ ] Add items per page dropdown to pagination
- [ ] Update cache busting parameters
- [ ] Test pagination, mass actions, and performance monitoring
- [ ] Verify consistent styling across modules
- [ ] Test items per page dropdown functionality

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
