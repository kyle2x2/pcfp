/* modules/test-list-view/module.js - Test List View Module */
/* PCFP Core Integration - Experimental List View Features */

// Sample data for testing
const sampleItems = [
    {
        id: 'item_001',
        title: 'Implement User Authentication',
        description: 'Create login/logout functionality with JWT tokens and password hashing',
        category: 'Development',
        status: 'in-progress',
        priority: 'high',
        assignee: 'John Smith',
        createdDate: '2025-01-01',
        updatedDate: '2025-01-15'
    },
    {
        id: 'item_002',
        title: 'Design Dashboard UI',
        description: 'Create wireframes and mockups for the main dashboard interface',
        category: 'Design',
        status: 'completed',
        priority: 'medium',
        assignee: 'Sarah Wilson',
        createdDate: '2025-01-02',
        updatedDate: '2025-01-10'
    },
    {
        id: 'item_003',
        title: 'Write API Documentation',
        description: 'Document all REST API endpoints with examples and error codes',
        category: 'Documentation',
        status: 'not-started',
        priority: 'low',
        assignee: 'Mike Johnson',
        createdDate: '2025-01-03',
        updatedDate: '2025-01-03'
    },
    {
        id: 'item_004',
        title: 'Setup CI/CD Pipeline',
        description: 'Configure automated testing and deployment workflows',
        category: 'Development',
        status: 'in-progress',
        priority: 'high',
        assignee: 'Alex Chen',
        createdDate: '2025-01-04',
        updatedDate: '2025-01-14'
    },
    {
        id: 'item_005',
        title: 'Performance Testing',
        description: 'Run load tests and optimize database queries',
        category: 'Testing',
        status: 'on-hold',
        priority: 'medium',
        assignee: 'Emma Davis',
        createdDate: '2025-01-05',
        updatedDate: '2025-01-12'
    },
    {
        id: 'item_006',
        title: 'Code Review Process',
        description: 'Establish guidelines and tools for peer code reviews',
        category: 'Maintenance',
        status: 'completed',
        priority: 'low',
        assignee: 'David Brown',
        createdDate: '2025-01-06',
        updatedDate: '2025-01-08'
    },
    {
        id: 'item_007',
        title: 'Database Migration',
        description: 'Migrate from MySQL to PostgreSQL with data integrity checks',
        category: 'Development',
        status: 'not-started',
        priority: 'urgent',
        assignee: 'Lisa Garcia',
        createdDate: '2025-01-07',
        updatedDate: '2025-01-07'
    },
    {
        id: 'item_008',
        title: 'Security Audit',
        description: 'Conduct comprehensive security review and vulnerability assessment',
        category: 'Testing',
        status: 'in-progress',
        priority: 'high',
        assignee: 'Tom Wilson',
        createdDate: '2025-01-08',
        updatedDate: '2025-01-13'
    },
    {
        id: 'item_009',
        title: 'Database Optimization',
        description: 'Optimize database queries and add proper indexing for better performance',
        category: 'Development',
        status: 'not-started',
        priority: 'medium',
        assignee: 'Lisa Garcia',
        createdDate: '2025-01-09',
        updatedDate: '2025-01-09'
    },
    {
        id: 'item_010',
        title: 'User Interface Testing',
        description: 'Test all UI components across different browsers and devices',
        category: 'Testing',
        status: 'completed',
        priority: 'low',
        assignee: 'Emma Davis',
        createdDate: '2025-01-10',
        updatedDate: '2025-01-12'
    },
    {
        id: 'item_011',
        title: 'API Rate Limiting',
        description: 'Implement rate limiting and throttling for API endpoints',
        category: 'Development',
        status: 'in-progress',
        priority: 'high',
        assignee: 'Alex Chen',
        createdDate: '2025-01-11',
        updatedDate: '2025-01-14'
    },
    {
        id: 'item_012',
        title: 'Error Monitoring Setup',
        description: 'Configure error tracking and monitoring with Sentry or similar service',
        category: 'Maintenance',
        status: 'not-started',
        priority: 'medium',
        assignee: 'David Brown',
        createdDate: '2025-01-12',
        updatedDate: '2025-01-12'
    },
    {
        id: 'item_013',
        title: 'Mobile App Development',
        description: 'Develop native mobile applications for iOS and Android',
        category: 'Development',
        status: 'on-hold',
        priority: 'low',
        assignee: 'Sarah Wilson',
        createdDate: '2025-01-13',
        updatedDate: '2025-01-15'
    },
    {
        id: 'item_014',
        title: 'Load Testing',
        description: 'Perform stress testing and load testing on the application',
        category: 'Testing',
        status: 'not-started',
        priority: 'medium',
        assignee: 'Mike Johnson',
        createdDate: '2025-01-14',
        updatedDate: '2025-01-14'
    },
    {
        id: 'item_015',
        title: 'Code Documentation',
        description: 'Write comprehensive code documentation and API references',
        category: 'Documentation',
        status: 'in-progress',
        priority: 'low',
        assignee: 'John Smith',
        createdDate: '2025-01-15',
        updatedDate: '2025-01-16'
    }
];

// Global variables for search, filter, and undo/redo
let searchQuery = '';
let currentFilter = '';
let operationHistory = [];
let currentHistoryIndex = -1;
let filteredItems = [];
let dateRangeStart = '';
let dateRangeEnd = '';
let isDateRangeActive = false;

// Export history variables
let actionHistory = [];
const maxActionHistorySize = 100;

// Pagination variables
let itemsPerPage = 10; // Default items per page
let currentPage = 1;
let totalPages = 0;
let paginatedItems = [];

// Selection persistence across page navigation
let selectedItemIds = new Set();

// Performance monitoring
let performanceMetrics = {
    renderTime: 0,
    searchTime: 0,
    memoryUsage: 0
};

// Column sorting state
let currentSort = {
    column: '',
    direction: 'asc' // 'asc' or 'desc'
};

// Bulk edit state
let isBulkEditMode = false;
let bulkEditFields = {
    status: '',
    assignee: '',
    priority: '',
    startDate: '',
    endDate: ''
};

// Undo/Redo state
let undoHistory = [];
let redoHistory = [];
let maxHistorySize = 20;
let isPerformingUndoRedo = false;

// Initialize module
function initTestModule() {
    console.log('Initializing test module...');
    loadItems();
    console.log('Loaded items:', window.testItems?.length || 0);

    // Initialize filteredItems with all items
    filteredItems = [...window.testItems];
    console.log('Initialized filteredItems:', filteredItems.length);

    setupEventListeners();
    setupSearchAndFilter();
    
    // Apply default sort (by title ascending) AFTER filteredItems is set
    applyDefaultSort();
    
    // Apply pagination on initial load
    applyPagination();
    
    // Initialize column headers
    updateColumnHeaders();
    
    // Load undo/redo history from sessionStorage
    loadUndoRedoFromStorage();
    loadActionHistoryFromStorage();
    
    // Render the view AFTER pagination is applied
    renderCurrentView();
    
    // Ensure main content area gets focus for keyboard navigation
    setTimeout(() => {
        const mainContent = document.querySelector('.test-container');
        if (mainContent) {
            mainContent.focus();
            console.log('Set focus to main content area');
        }
    }, 100);
    
    console.log('Test module initialized successfully');
}

// Load items from localStorage
function loadItems() {
    console.log('Loading items...');
    const savedItems = localStorage.getItem('pcfp_test_items');
    console.log('Saved items from localStorage:', savedItems);
    
    if (savedItems) {
        try {
            window.testItems = JSON.parse(savedItems);
            console.log('Loaded from localStorage:', window.testItems.length, 'items');
        } catch (e) {
            console.warn('Failed to load saved items, using sample data');
            window.testItems = [...sampleItems];
            console.log('Using sample data:', window.testItems.length, 'items');
        }
    } else {
        console.log('No saved items found, using sample data');
        window.testItems = [...sampleItems];
        console.log('Using sample data:', window.testItems.length, 'items');
    }
}

// Save items to localStorage
function saveItems() {
    localStorage.setItem('pcfp_test_items', JSON.stringify(window.testItems));
}

// Setup event listeners
function setupEventListeners() {
    // View switching
    document.querySelectorAll('.view-selector .btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.dataset.view;
            switchView(view);
        });
    });

    // Add item button
    const addItemBtn = document.getElementById('btnAddItem');
    if (addItemBtn) {
        addItemBtn.addEventListener('click', addNewItem);
    } else {
        console.error('Add item button not found!');
    }

    // Save and export buttons
    document.getElementById('btnSave').addEventListener('click', saveItems);
    
    // Top header buttons
    document.getElementById('btnExportAll').addEventListener('click', exportAllItems);
    document.getElementById('btnExportHistory').addEventListener('click', showActionHistory);
    
    // Keyboard help button
    document.getElementById('btnKeyboardHelp').addEventListener('click', showKeyboardHelp);

    // Select all checkbox
    document.getElementById('selectAll').addEventListener('change', function() {
        console.log(`Select All checkbox changed, checked: ${this.checked}`);
        const checkboxes = document.querySelectorAll('.item-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
            const itemId = checkbox.dataset.itemId;
            if (this.checked) {
                selectedItemIds.add(itemId);
                console.log(`Added ${itemId} to selections via Select All`);
            } else {
                selectedItemIds.delete(itemId);
                console.log(`Removed ${itemId} from selections via Select All`);
            }
        });
        console.log(`Select All complete. Total selections: ${selectedItemIds.size}`);
        updateSelectedCount();
        updateCardSelection();
    });

    // Individual checkboxes
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('item-checkbox')) {
            const itemId = e.target.dataset.itemId;
            console.log(`Checkbox changed for item ${itemId}, checked: ${e.target.checked}`);
            if (e.target.checked) {
                selectedItemIds.add(itemId);
                console.log(`Added ${itemId} to selections. Total: ${selectedItemIds.size}`);
            } else {
                selectedItemIds.delete(itemId);
                console.log(`Removed ${itemId} from selections. Total: ${selectedItemIds.size}`);
            }
            updateSelectedCount();
            updateSelectAllState();
            updateCardSelection();
        }
    });

    // Mass action buttons
    document.getElementById('btnDeleteSelected')?.addEventListener('click', deleteSelectedItems);
    document.getElementById('btnDuplicateSelected')?.addEventListener('click', duplicateSelectedItems);
    document.getElementById('btnClearSelected')?.addEventListener('click', clearAllSelections);
    
    // Bulk edit buttons
    document.getElementById('btnBulkEdit')?.addEventListener('click', openBulkEdit);
    document.getElementById('btnApplyBulkEdit')?.addEventListener('click', applyBulkEdit);
    document.getElementById('btnCancelBulkEdit')?.addEventListener('click', closeBulkEdit);
    document.getElementById('btnCloseBulkEdit')?.addEventListener('click', closeBulkEdit);
    
    // Undo/Redo buttons
    document.getElementById('btnUndo')?.addEventListener('click', performUndo);
    document.getElementById('btnRedo')?.addEventListener('click', performRedo);
    
    // Export buttons
    document.getElementById('btnExportAll')?.addEventListener('click', exportAllItems);
    document.getElementById('btnExportSelected')?.addEventListener('click', exportSelectedItems);
    
    // Export menu modal
    document.getElementById('btnCloseExportMenu')?.addEventListener('click', hideExportMenu);
    document.getElementById('btnCancelExport')?.addEventListener('click', hideExportMenu);
    
    // Export format buttons
    document.querySelectorAll('.export-format-btn').forEach(btn => {
        btn.addEventListener('click', () => selectExportFormat(btn.dataset.format));
    });
    
    // Export preview modal buttons
    document.getElementById('btnCloseExportPreview')?.addEventListener('click', hideExportPreview);
    document.getElementById('btnCancelPreview')?.addEventListener('click', hideExportPreview);
    document.getElementById('btnConfirmExport')?.addEventListener('click', confirmExportFromPreview);
    
    // Export history modal buttons
    document.getElementById('btnExportHistory')?.addEventListener('click', showActionHistory);
    document.getElementById('btnCloseExportHistory')?.addEventListener('click', hideActionHistory);
    document.getElementById('btnCloseHistory')?.addEventListener('click', hideActionHistory);
    document.getElementById('btnClearHistory')?.addEventListener('click', clearActionHistory);
    
    // Bulk export modal buttons
    document.getElementById('btnCloseBulkExport')?.addEventListener('click', hideBulkExportModal);
    document.getElementById('btnCancelBulkExport')?.addEventListener('click', hideBulkExportModal);
    document.getElementById('btnStartBulkExport')?.addEventListener('click', startBulkExport);

    // Close action menus when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.action-menu-btn') && !e.target.closest('.pcfp-menu')) {
            closeMenu();
        }
        
        // Close modal when clicking outside
        const modal = document.getElementById('itemModal');
        if (modal && modal.style.display === 'flex' && !e.target.closest('.modal-content')) {
            closeItemModal();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        console.log(`Key pressed: ${e.key}, target: ${e.target.tagName}`);
        
        // Don't trigger shortcuts when typing in inputs (except arrow keys for navigation)
        if ((e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') && 
            !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            console.log('Ignoring key - typing in input field');
            return;
        }

        // Escape key - close menus/modals or clear selections
        if (e.key === 'Escape') {
            // If mass action toolbar is visible, clear selections
            const massActionToolbar = document.getElementById('massActionToolbar');
            if (massActionToolbar && massActionToolbar.classList.contains('show')) {
                e.preventDefault();
                clearAllSelections();
                console.log('Escape key: Cleared all selections');
                return;
            }
            
            // Otherwise, close menus/modals
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
    
    // Ctrl/Cmd + Z - Undo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        performUndo();
        return;
    }
    
    // Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z - Redo
    if (((e.ctrlKey || e.metaKey) && e.key === 'y') || 
        ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey)) {
        e.preventDefault();
        performRedo();
        return;
    }

        // Arrow keys for navigation
        if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
            e.preventDefault();
            handleItemNavigation(e.key);
            return;
        }
        
        // Left/Right arrows for page navigation
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            console.log('ArrowLeft pressed - attempting to go to previous page');
            if (currentPage > 1) {
                console.log(`Going from page ${currentPage} to page ${currentPage - 1}`);
                changePage(currentPage - 1, false); // Don't clear selections
                // Update selection state for new page
                updateSelectionStateForCurrentPage();
            } else {
                console.log('Already on first page');
            }
            return;
        }
        
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            console.log('ArrowRight pressed - attempting to go to next page');
            if (currentPage < totalPages) {
                console.log(`Going from page ${currentPage} to page ${currentPage + 1}`);
                changePage(currentPage + 1, false); // Don't clear selections
                // Update selection state for new page
                updateSelectionStateForCurrentPage();
            } else {
                console.log('Already on last page');
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
}

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

// Setup search and filter functionality
function setupSearchAndFilter() {
    const searchInput = document.getElementById('itemSearch');
    const filterSelect = document.getElementById('filterBy');
    const dateStartInput = document.getElementById('dateRangeStart');
    const dateEndInput = document.getElementById('dateRangeEnd');
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        searchQuery = this.value.toLowerCase();
        applySearchAndFilter();
    });
    
    // Filter functionality
    filterSelect.addEventListener('change', function() {
        currentFilter = this.value;
        applySearchAndFilter();
    });
    
    // Date range functionality
    dateStartInput.addEventListener('change', function() {
        dateRangeStart = this.value;
    });
    
    dateEndInput.addEventListener('change', function() {
        dateRangeEnd = this.value;
    });
}

// Apply search and filter
function applySearchAndFilter() {
    const startTime = performance.now();
    filteredItems = window.testItems.filter(item => {
        const matchesSearch = !searchQuery ||
            item.title.toLowerCase().includes(searchQuery) ||
            item.description.toLowerCase().includes(searchQuery) ||
            item.assignee.toLowerCase().includes(searchQuery) ||
            item.category.toLowerCase().includes(searchQuery);
        
        let matchesFilter = true;
        switch (currentFilter) {
            case 'category':
                matchesFilter = item.category && item.category !== '';
                break;
            case 'status':
                matchesFilter = item.status && item.status !== '';
                break;
            case 'priority':
                matchesFilter = item.priority && item.priority !== '';
                break;
            case 'assignee':
                matchesFilter = item.assignee && item.assignee !== '';
                break;
        }
        
        let matchesDateRange = true;
        if (isDateRangeActive && dateRangeStart && dateRangeEnd) {
            const itemDate = new Date(item.createdDate);
            const startDate = new Date(dateRangeStart);
            const endDate = new Date(dateRangeEnd);
            matchesDateRange = itemDate >= startDate && itemDate <= endDate;
        }
        
        return matchesSearch && matchesFilter && matchesDateRange;
    });
    
    performanceMetrics.searchTime = performance.now() - startTime;
    applyPagination();
    renderCurrentView();
}

// Column sorting function
function sortColumn(columnName, direction = 'asc') {
    console.log(`Sorting by ${columnName} in ${direction} direction`);
    
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
    renderCurrentView();
    
    // Update column headers to show sort indicators
    updateColumnHeaders();
    
    console.log(`Sorted ${filteredItems.length} items by ${columnName} ${direction}`);
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

// Handle column header clicks
function handleColumnClick(columnName) {
    console.log(`Column clicked: ${columnName}`);
    
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

// Clear sorting and return to original order
function clearSorting() {
    console.log('Clearing sorting - returning to original order');
    
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
    renderCurrentView();
    
    // Update column headers to remove sort indicators
    updateColumnHeaders();
    
    console.log('Sorting cleared - returned to original order');
}

// Apply default sort (by title ascending)
function applyDefaultSort() {
    console.log('Applying default sort by title ascending');
    currentSort.column = 'title';
    currentSort.direction = 'asc';
    
    // Sort by title ascending
    filteredItems.sort((a, b) => {
        const aTitle = (a.title || '').toLowerCase();
        const bTitle = (b.title || '').toLowerCase();
        return aTitle.localeCompare(bTitle);
    });
    
    console.log('Default sort applied');
}

// ===== BULK EDIT FUNCTIONS =====

// Open bulk edit mode
function openBulkEdit() {
    if (selectedItemIds.size === 0) {
        alert('Please select items to bulk edit');
        return;
    }
    
    console.log(`Opening bulk edit for ${selectedItemIds.size} items`);
    
    // Show bulk edit toolbar
    const toolbar = document.getElementById('bulkEditToolbar');
    toolbar.classList.add('show');
    
    // Hide mass action toolbar
    const massToolbar = document.getElementById('massActionToolbar');
    massToolbar.classList.remove('show');
    
    isBulkEditMode = true;
    
    // Clear all bulk edit fields
    clearBulkEditFields();
}

// Close bulk edit mode
function closeBulkEdit() {
    console.log('Closing bulk edit mode');
    
    // Hide bulk edit toolbar
    const toolbar = document.getElementById('bulkEditToolbar');
    toolbar.classList.remove('show');
    
    // Show mass action toolbar if items are selected
    if (selectedItemIds.size > 0) {
        const massToolbar = document.getElementById('massActionToolbar');
        massToolbar.classList.add('show');
    }
    
    isBulkEditMode = false;
    
    // Clear all bulk edit fields
    clearBulkEditFields();
}

// Clear all bulk edit fields
function clearBulkEditFields() {
    document.getElementById('bulkStatus').value = '';
    document.getElementById('bulkAssignee').value = '';
    document.getElementById('bulkPriority').value = '';
    document.getElementById('bulkStartDate').value = '';
    document.getElementById('bulkEndDate').value = '';
    
    // Reset bulk edit fields object
    bulkEditFields = {
        status: '',
        assignee: '',
        priority: '',
        startDate: '',
        endDate: ''
    };
}

// Apply bulk edit changes
function applyBulkEdit() {
    if (selectedItemIds.size === 0) {
        alert('No items selected for bulk edit');
        return;
    }
    
    // Get current field values
    const status = document.getElementById('bulkStatus').value;
    const assignee = document.getElementById('bulkAssignee').value.trim();
    const priority = document.getElementById('bulkPriority').value;
    const startDate = document.getElementById('bulkStartDate').value;
    const endDate = document.getElementById('bulkEndDate').value;
    
    // Check if any changes are made
    if (!status && !assignee && !priority && !startDate && !endDate) {
        alert('Please make at least one change before applying');
        return;
    }
    
    // Validate dates
    if (startDate && endDate && startDate > endDate) {
        alert('Start date cannot be after end date');
        return;
    }
    
    const selectedIds = Array.from(selectedItemIds);
    let changesApplied = 0;
    
    // Save to undo history BEFORE making changes (after validation)
    saveToUndoHistory('bulk_edit', `Bulk edited ${selectedIds.length} items`);
    
    // Apply changes to selected items
    selectedIds.forEach(itemId => {
        const item = window.testItems.find(item => item.id === itemId);
        if (item) {
            let itemChanged = false;
            
            // Apply status change
            if (status) {
                item.status = status;
                itemChanged = true;
            }
            
            // Apply assignee change
            if (assignee) {
                item.assignee = assignee;
                itemChanged = true;
            }
            
            // Apply priority change
            if (priority) {
                item.priority = priority;
                itemChanged = true;
            }
            
            // Apply start date change
            if (startDate) {
                item.startDate = startDate;
                itemChanged = true;
            }
            
            // Apply end date change
            if (endDate) {
                item.endDate = endDate;
                itemChanged = true;
            }
            
            // Update updated date if any changes were made
            if (itemChanged) {
                item.updatedDate = new Date().toISOString().split('T')[0];
                changesApplied++;
            }
        }
    });
    
    if (changesApplied > 0) {
        // Save changes
        saveItems();
        
        // Re-apply search and filter
        applySearchAndFilter();
        
        // Clear all selections after successful bulk edit
        clearAllSelections();
        
        // Add to action history
        addToActionHistory('bulk_edit', {
            count: changesApplied,
            description: `Bulk edited ${changesApplied} items`
        });
        
        // Close bulk edit mode
        closeBulkEdit();
        
        // Show success message
        showNotification(`${changesApplied} items updated successfully`, 'success');
        
        console.log(`Bulk edit applied to ${changesApplied} items`);
    } else {
        alert('No changes were applied');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'success' ? 'var(--pcfp-gold)' : 'var(--pcfp-text)'};
        color: var(--pcfp-white);
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        z-index: 1000;
        font-size: 14px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// ===== UNDO/REDO FUNCTIONS =====

// Save current state to undo history
function saveToUndoHistory(action, description) {
    if (isPerformingUndoRedo) return;
    
    // We need to save the state BEFORE the change was made
    // This function should be called BEFORE making changes, not after
    const previousState = {
        action: action,
        description: description,
        timestamp: new Date().toISOString(),
        data: JSON.parse(JSON.stringify(window.testItems)) // Deep copy of current state
    };
    
    // Add to undo history
    undoHistory.push(previousState);
    
    // Limit history size
    if (undoHistory.length > maxHistorySize) {
        undoHistory.shift();
    }
    
    // Clear redo history when new action is performed
    redoHistory = [];
    
    // Update button states
    updateUndoRedoButtons();
    
    // Save to sessionStorage
    saveUndoRedoToStorage();
    
    console.log(`Saved to undo history: ${action} - ${description}`);
}

// Perform undo action
function performUndo() {
    if (undoHistory.length === 0) return;
    
    const lastAction = undoHistory.pop();
    
    // Save current state to redo history
    redoHistory.push({
        action: 'undo',
        description: `Redo: ${lastAction.description}`,
        timestamp: new Date().toISOString(),
        data: JSON.parse(JSON.stringify(window.testItems))
    });
    
    // Restore previous state
    isPerformingUndoRedo = true;
    window.testItems = JSON.parse(JSON.stringify(lastAction.data));
    isPerformingUndoRedo = false;
    
    // Save and refresh
    saveItems();
    applySearchAndFilter();
    
    // Update button states
    updateUndoRedoButtons();
    
    // Save to sessionStorage
    saveUndoRedoToStorage();
    
    // Add to action history
    addToActionHistory('undo', {
        description: `Undo: ${lastAction.description}`,
        originalAction: lastAction.description
    });
    
    // Show notification
    showNotification(`Undo: ${lastAction.description}`, 'info');
    
    console.log(`Undo performed: ${lastAction.description}`);
}

// Perform redo action
function performRedo() {
    if (redoHistory.length === 0) return;
    
    const lastAction = redoHistory.pop();
    
    // Save current state to undo history
    undoHistory.push({
        action: 'redo',
        description: `Undo: ${lastAction.description.replace('Redo: ', '')}`,
        timestamp: new Date().toISOString(),
        data: JSON.parse(JSON.stringify(window.testItems))
    });
    
    // Restore previous state
    isPerformingUndoRedo = true;
    window.testItems = JSON.parse(JSON.stringify(lastAction.data));
    isPerformingUndoRedo = false;
    
    // Save and refresh
    saveItems();
    applySearchAndFilter();
    
    // Update button states
    updateUndoRedoButtons();
    
    // Save to sessionStorage
    saveUndoRedoToStorage();
    
    // Add to action history
    addToActionHistory('redo', {
        description: lastAction.description,
        originalAction: lastAction.description.replace('Redo: ', '')
    });
    
    // Show notification
    showNotification(lastAction.description, 'info');
    
    console.log(`Redo performed: ${lastAction.description}`);
}

// Update undo/redo button states
function updateUndoRedoButtons() {
    const undoBtn = document.getElementById('btnUndo');
    const redoBtn = document.getElementById('btnRedo');
    
    if (undoBtn) {
        undoBtn.disabled = undoHistory.length === 0;
        undoBtn.title = undoHistory.length > 0 ? 
            `Undo: ${undoHistory[undoHistory.length - 1].description}` : 
            'Nothing to undo';
    }
    
    if (redoBtn) {
        redoBtn.disabled = redoHistory.length === 0;
        redoBtn.title = redoHistory.length > 0 ? 
            `Redo: ${redoHistory[redoHistory.length - 1].description.replace('Redo: ', '')}` : 
            'Nothing to redo';
    }
}

// Save undo/redo history to sessionStorage
function saveUndoRedoToStorage() {
    try {
        sessionStorage.setItem('testModule_undoHistory', JSON.stringify(undoHistory));
        sessionStorage.setItem('testModule_redoHistory', JSON.stringify(redoHistory));
    } catch (error) {
        console.warn('Could not save undo/redo history to sessionStorage:', error);
    }
}

// Load undo/redo history from sessionStorage
function loadUndoRedoFromStorage() {
    try {
        const savedUndo = sessionStorage.getItem('testModule_undoHistory');
        const savedRedo = sessionStorage.getItem('testModule_redoHistory');
        
        if (savedUndo) {
            undoHistory = JSON.parse(savedUndo);
        }
        if (savedRedo) {
            redoHistory = JSON.parse(savedRedo);
        }
        
        updateUndoRedoButtons();
        console.log(`Loaded undo history: ${undoHistory.length} items, redo history: ${redoHistory.length} items`);
    } catch (error) {
        console.warn('Could not load undo/redo history from sessionStorage:', error);
        undoHistory = [];
        redoHistory = [];
    }
}

// ===== EXPORT FUNCTIONS =====

// Export state
let currentExportScope = 'selected'; // 'single', 'selected', 'all'
let currentExportItemId = null;

// Show export menu modal
function showExportMenu(scope, itemId = null) {
    currentExportScope = scope;
    currentExportItemId = itemId;
    
    const modal = document.getElementById('exportMenuModal');
    const title = document.getElementById('exportMenuTitle');
    const scopeText = document.getElementById('exportScopeText');
    
    // Update title and scope text based on export type
    switch (scope) {
        case 'single':
            title.textContent = 'Export Single Item';
            scopeText.textContent = `Exporting: ${getItemTitle(itemId)}`;
            break;
        case 'selected':
            title.textContent = 'Export Selected Items';
            scopeText.textContent = `Exporting ${selectedItemIds.size} selected items`;
            break;
        case 'all':
            title.textContent = 'Export All Items';
            scopeText.textContent = `Exporting all ${window.testItems.length} items`;
            break;
    }
    
    // Reset format selection
    document.querySelectorAll('.export-format-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Show modal
    modal.classList.add('show');
}

// Hide export menu modal
function hideExportMenu() {
    const modal = document.getElementById('exportMenuModal');
    modal.classList.remove('show');
}

// Get item title for display
function getItemTitle(itemId) {
    const item = window.testItems.find(i => i.id === itemId);
    return item ? item.title : 'Unknown Item';
}

// Handle format selection
function selectExportFormat(format) {
    // Handle bulk export separately
    if (format === 'bulk') {
        showBulkExportModal();
        return;
    }
    
    // Remove selection from all buttons
    document.querySelectorAll('.export-format-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add selection to clicked button
    const selectedBtn = document.querySelector(`[data-format="${format}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('selected');
        
        // Add export button to footer
        addExportButton(format);
    }
}

// Add export button to footer
function addExportButton(format) {
    const footer = document.querySelector('.export-menu-footer');
    
    // Remove existing export button
    const existingBtn = footer.querySelector('.export-btn.primary');
    if (existingBtn) {
        existingBtn.remove();
    }
    
    // Add new export button
    const exportBtn = document.createElement('button');
    exportBtn.className = 'export-btn primary';
    exportBtn.textContent = `Preview ${format.toUpperCase()} Export`;
    exportBtn.onclick = () => showExportPreview(format);
    
    footer.insertBefore(exportBtn, footer.firstChild);
}

// Perform the actual export
function performExport(format) {
    let itemsToExport = [];
    
    // Get items based on scope
    switch (currentExportScope) {
        case 'single':
            itemsToExport = window.testItems.filter(item => item.id === currentExportItemId);
            break;
        case 'selected':
            const selectedIds = Array.from(selectedItemIds);
            itemsToExport = window.testItems.filter(item => selectedIds.includes(item.id));
            break;
        case 'all':
            itemsToExport = [...window.testItems];
            break;
    }
    
    if (itemsToExport.length === 0) {
        alert('No items to export');
        return;
    }
    
    // Get export options
    const includeHeaders = document.getElementById('includeHeaders').checked;
    const includeTimestamps = document.getElementById('includeTimestamps').checked;
    
    // Perform export based on format
    switch (format) {
        case 'csv':
            exportToCSV(itemsToExport, includeHeaders, includeTimestamps);
            break;
        case 'excel':
            exportToExcel(itemsToExport, includeHeaders, includeTimestamps);
            break;
        case 'pdf':
            exportToPDF(itemsToExport, includeHeaders, includeTimestamps);
            break;
        case 'json':
            exportToJSON(itemsToExport, includeHeaders, includeTimestamps);
            break;
    }
    
    // Hide modal and show success message
    hideExportMenu();
    showNotification(`${itemsToExport.length} items exported as ${format.toUpperCase()}`, 'success');
}

// Show export preview modal
function showExportPreview(format) {
    let itemsToExport = [];
    
    // Get items based on scope
    switch (currentExportScope) {
        case 'single':
            itemsToExport = window.testItems.filter(item => item.id === currentExportItemId);
            break;
        case 'selected':
            const selectedIds = Array.from(selectedItemIds);
            itemsToExport = window.testItems.filter(item => selectedIds.includes(item.id));
            break;
        case 'all':
            itemsToExport = [...window.testItems];
            break;
    }
    
    if (itemsToExport.length === 0) {
        alert('No items to export');
        return;
    }
    
    // Get export options
    const includeHeaders = document.getElementById('includeHeaders').checked;
    const includeTimestamps = document.getElementById('includeTimestamps').checked;
    
    // Generate preview content
    const previewContent = generatePreviewContent(format, itemsToExport, includeHeaders, includeTimestamps);
    
    // Update preview modal
    updatePreviewModal(format, itemsToExport, previewContent, includeHeaders, includeTimestamps);
    
    // Show preview modal
    const modal = document.getElementById('exportPreviewModal');
    if (modal) {
        modal.style.display = 'flex';
    }
    
    // Hide export menu
    hideExportMenu();
}

// Generate preview content for different formats
function generatePreviewContent(format, items, includeHeaders, includeTimestamps) {
    switch (format) {
        case 'csv':
            return getCSVContent(items, includeHeaders, includeTimestamps);
        case 'excel':
            return getCSVContent(items, includeHeaders, includeTimestamps); // Excel uses CSV content
        case 'json':
            return JSON.stringify(items, null, 2);
        case 'pdf':
            return generatePDFHTML(items, includeHeaders, includeTimestamps);
        default:
            return 'Preview not available for this format';
    }
}

// Update preview modal with content
function updatePreviewModal(format, items, content, includeHeaders, includeTimestamps) {
    // Update title
    document.getElementById('exportPreviewTitle').textContent = `Export Preview - ${format.toUpperCase()}`;
    
    // Update format
    document.getElementById('previewFormat').textContent = format.toUpperCase();
    
    // Update item count
    document.getElementById('previewItemCount').textContent = `${items.length} item${items.length !== 1 ? 's' : ''}`;
    
    // Update scope
    let scopeText = '';
    switch (currentExportScope) {
        case 'single':
            scopeText = 'Single item';
            break;
        case 'selected':
            scopeText = 'Selected items';
            break;
        case 'all':
            scopeText = 'All items';
            break;
    }
    document.getElementById('previewScope').textContent = scopeText;
    
    // Update options
    const options = [];
    if (includeHeaders) options.push('Headers');
    if (includeTimestamps) options.push('Timestamps');
    document.getElementById('previewOptions').textContent = options.length > 0 ? options.join(', ') : 'None';
    
    // Update preview content
    const previewElement = document.getElementById('previewContent');
    if (previewElement) {
        // Truncate content if too long
        const maxLength = 2000;
        let displayContent = content;
        if (content.length > maxLength) {
            displayContent = content.substring(0, maxLength) + '\n\n... (content truncated, full content will be exported)';
        }
        previewElement.textContent = displayContent;
    }
    
    // Store export parameters for confirmation
    window.pendingExport = {
        format: format,
        items: items,
        includeHeaders: includeHeaders,
        includeTimestamps: includeTimestamps
    };
}

// Hide export preview modal
function hideExportPreview() {
    const modal = document.getElementById('exportPreviewModal');
    if (modal) {
        modal.style.display = 'none';
    }
    window.pendingExport = null;
}

// Confirm and perform export from preview
function confirmExportFromPreview() {
    if (!window.pendingExport) return;
    
    const { format, items, includeHeaders, includeTimestamps } = window.pendingExport;
    
    // Perform the actual export
    switch (format) {
        case 'csv':
            exportToCSV(items, includeHeaders, includeTimestamps);
            break;
        case 'excel':
            exportToExcel(items, includeHeaders, includeTimestamps);
            break;
        case 'pdf':
            exportToPDF(items, includeHeaders, includeTimestamps);
            break;
        case 'json':
            exportToJSON(items, includeHeaders, includeTimestamps);
            break;
    }
    
    // Add to action history
    addToActionHistory('export', {
        format: format.toUpperCase(),
        count: items.length,
        scope: currentExportScope,
        options: getExportOptionsText(includeHeaders, includeTimestamps)
    });
    
    // Hide preview modal
    hideExportPreview();
    
    // Show success message
    showNotification(`${items.length} items exported as ${format.toUpperCase()}`, 'success');
}

// ===== ACTION HISTORY FUNCTIONS =====

// Add action to history
function addToActionHistory(action, details) {
    const historyEntry = {
        id: Date.now(),
        timestamp: new Date(),
        action: action,
        details: details
    };
    
    // Add to beginning of array (most recent first)
    actionHistory.unshift(historyEntry);
    
    // Limit history size
    if (actionHistory.length > maxActionHistorySize) {
        actionHistory = actionHistory.slice(0, maxActionHistorySize);
    }
    
    // Save to localStorage
    saveActionHistoryToStorage();
    
    console.log(`Added action to history: ${action} - ${details.description || 'No description'}`);
}

// Save action history to localStorage
function saveActionHistoryToStorage() {
    try {
        localStorage.setItem('testModule_actionHistory', JSON.stringify(actionHistory));
    } catch (error) {
        console.warn('Could not save action history to localStorage:', error);
    }
}

// Load action history from localStorage
function loadActionHistoryFromStorage() {
    try {
        const savedHistory = localStorage.getItem('testModule_actionHistory');
        if (savedHistory) {
            actionHistory = JSON.parse(savedHistory);
            console.log(`Loaded action history: ${actionHistory.length} entries`);
        }
    } catch (error) {
        console.warn('Could not load action history from localStorage:', error);
        actionHistory = [];
    }
}

// Show action history modal
function showActionHistory() {
    const modal = document.getElementById('exportHistoryModal');
    if (modal) {
        updateActionHistoryDisplay();
        modal.style.display = 'flex';
    }
}

// Hide action history modal
function hideActionHistory() {
    const modal = document.getElementById('exportHistoryModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Update action history display
function updateActionHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    const historyCount = document.querySelector('.history-count');
    
    if (!historyList || !historyCount) return;
    
    // Update count
    historyCount.textContent = `${actionHistory.length} action${actionHistory.length !== 1 ? 's' : ''}`;
    
    // Clear existing content
    historyList.innerHTML = '';
    
    if (actionHistory.length === 0) {
        historyList.innerHTML = '<div class="history-empty">No actions yet</div>';
        return;
    }
    
    // Add history items
    actionHistory.forEach(entry => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const timeAgo = getTimeAgo(entry.timestamp);
        const actionIcon = getActionIcon(entry.action);
        const actionText = getActionText(entry.action, entry.details);
        
        historyItem.innerHTML = `
            <div class="history-item-header">
                <div class="history-item-title">
                    <span class="action-icon">${actionIcon}</span>
                    ${actionText}
                </div>
                <div class="history-item-time">${timeAgo}</div>
            </div>
            <div class="history-item-details">
                ${getActionDetails(entry.details)}
            </div>
        `;
        
        historyList.appendChild(historyItem);
    });
}

// Get action icon
function getActionIcon(action) {
    switch (action) {
        case 'add': return '➕';
        case 'edit': return '✏️';
        case 'delete': return '🗑️';
        case 'duplicate': return '📋';
        case 'bulk_edit': return '📝';
        case 'bulk_delete': return '🗑️';
        case 'bulk_duplicate': return '📋';
        case 'export': return '📤';
        case 'sort': return '🔄';
        case 'filter': return '🔍';
        case 'search': return '🔎';
        case 'undo': return '↶';
        case 'redo': return '↷';
        default: return '⚡';
    }
}

// Get action text
function getActionText(action, details) {
    switch (action) {
        case 'add':
            return `Added "${details.itemTitle || 'item'}"`;
        case 'edit':
            return `Edited "${details.itemTitle || 'item'}"`;
        case 'delete':
            return `Deleted "${details.itemTitle || 'item'}"`;
        case 'duplicate':
            return `Duplicated "${details.itemTitle || 'item'}"`;
        case 'bulk_edit':
            return `Bulk edited ${details.count} items`;
        case 'bulk_delete':
            return `Bulk deleted ${details.count} items`;
        case 'bulk_duplicate':
            return `Bulk duplicated ${details.count} items`;
        case 'export':
            return `Exported ${details.count} items as ${details.format}`;
        case 'sort':
            return `Sorted by ${details.column}`;
        case 'filter':
            return `Filtered by ${details.filterType}`;
        case 'search':
            return `Searched for "${details.query}"`;
        case 'undo':
            return `Undo: ${details.originalAction || details.description}`;
        case 'redo':
            return `Redo: ${details.originalAction || details.description}`;
        default:
            return details.description || 'Action performed';
    }
}

// Get action details HTML
function getActionDetails(details) {
    const detailItems = [];
    
    if (details.count) {
        detailItems.push(`<div class="history-detail"><span class="history-detail-label">Items:</span><span class="history-detail-value">${details.count}</span></div>`);
    }
    
    if (details.format) {
        detailItems.push(`<div class="history-detail"><span class="history-detail-label">Format:</span><span class="history-detail-value">${details.format}</span></div>`);
    }
    
    if (details.column) {
        detailItems.push(`<div class="history-detail"><span class="history-detail-label">Column:</span><span class="history-detail-value">${details.column}</span></div>`);
    }
    
    if (details.filterType) {
        detailItems.push(`<div class="history-detail"><span class="history-detail-label">Filter:</span><span class="history-detail-value">${details.filterType}</span></div>`);
    }
    
    if (details.query) {
        detailItems.push(`<div class="history-detail"><span class="history-detail-label">Query:</span><span class="history-detail-value">"${details.query}"</span></div>`);
    }
    
    if (details.scope) {
        detailItems.push(`<div class="history-detail"><span class="history-detail-label">Scope:</span><span class="history-detail-value">${details.scope}</span></div>`);
    }
    
    if (details.options) {
        detailItems.push(`<div class="history-detail"><span class="history-detail-label">Options:</span><span class="history-detail-value">${details.options}</span></div>`);
    }
    
    return detailItems.length > 0 ? `<div class="history-item-details">${detailItems.join('')}</div>` : '';
}

// Clear action history
function clearActionHistory() {
    if (confirm('Are you sure you want to clear all action history?')) {
        actionHistory = [];
        saveActionHistoryToStorage();
        updateActionHistoryDisplay();
        showNotification('Action history cleared', 'success');
    }
}

// Get time ago string
function getTimeAgo(timestamp) {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return new Date(timestamp).toLocaleDateString();
}

// Helper function to get export options text
function getExportOptionsText(includeHeaders, includeTimestamps) {
    const options = [];
    if (includeHeaders) options.push('Headers');
    if (includeTimestamps) options.push('Timestamps');
    return options.length > 0 ? options.join(', ') : 'None';
}

// Generate export filename
function generateExportFilename(format, scope, itemCount) {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const scopeText = scope === 'single' ? 'item' : scope === 'selected' ? 'selected' : 'all';
    return `${scopeText}_items_${timestamp}.${format}`;
}

// ===== BULK EXPORT FUNCTIONS =====

// Show bulk export modal
function showBulkExportModal() {
    const modal = document.getElementById('bulkExportModal');
    if (modal) {
        updateBulkExportInfo();
        modal.style.display = 'flex';
    }
    
    // Hide export menu
    hideExportMenu();
}

// Hide bulk export modal
function hideBulkExportModal() {
    const modal = document.getElementById('bulkExportModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Update bulk export info
function updateBulkExportInfo() {
    const scopeText = document.getElementById('bulkExportScopeText');
    if (!scopeText) return;
    
    let text = '';
    switch (currentExportScope) {
        case 'single':
            text = 'Exporting single item in multiple formats';
            break;
        case 'selected':
            const selectedCount = selectedItemIds.size;
            text = `Exporting ${selectedCount} selected item${selectedCount !== 1 ? 's' : ''} in multiple formats`;
            break;
        case 'all':
            text = `Exporting all ${window.testItems.length} items in multiple formats`;
            break;
    }
    scopeText.textContent = text;
}

// Start bulk export
function startBulkExport() {
    // Get selected formats
    const selectedFormats = [];
    const formatCheckboxes = document.querySelectorAll('.bulk-format-option input[type="checkbox"]:checked');
    formatCheckboxes.forEach(checkbox => {
        selectedFormats.push(checkbox.value);
    });
    
    if (selectedFormats.length === 0) {
        alert('Please select at least one export format');
        return;
    }
    
    // Get items to export
    let itemsToExport = [];
    switch (currentExportScope) {
        case 'single':
            itemsToExport = window.testItems.filter(item => item.id === currentExportItemId);
            break;
        case 'selected':
            const selectedIds = Array.from(selectedItemIds);
            itemsToExport = window.testItems.filter(item => selectedIds.includes(item.id));
            break;
        case 'all':
            itemsToExport = [...window.testItems];
            break;
    }
    
    if (itemsToExport.length === 0) {
        alert('No items to export');
        return;
    }
    
    // Get export options
    const includeHeaders = document.getElementById('bulkIncludeHeaders').checked;
    const includeTimestamps = document.getElementById('bulkIncludeTimestamps').checked;
    const compress = document.getElementById('bulkCompress').checked;
    
    // Perform bulk export
    performBulkExport(selectedFormats, itemsToExport, includeHeaders, includeTimestamps, compress);
    
    // Hide modal
    hideBulkExportModal();
}

// Perform bulk export
function performBulkExport(formats, items, includeHeaders, includeTimestamps, compress) {
    const exports = [];
    
    // Generate all exports
    formats.forEach(format => {
        try {
            const exportData = generateExportData(format, items, includeHeaders, includeTimestamps);
            const filename = generateExportFilename(format, currentExportScope, items.length);
            
            exports.push({
                format: format,
                data: exportData,
                filename: filename,
                mimeType: getMimeType(format)
            });
            
            // Add to action history
            addToActionHistory('export', {
                format: format.toUpperCase(),
                count: items.length,
                scope: currentExportScope,
                options: getExportOptionsText(includeHeaders, includeTimestamps)
            });
            
        } catch (error) {
            console.error(`Error generating ${format} export:`, error);
        }
    });
    
    if (exports.length === 0) {
        alert('No exports could be generated');
        return;
    }
    
    // Download exports
    if (compress && exports.length > 1) {
        downloadCompressedExports(exports, items.length);
    } else {
        downloadIndividualExports(exports);
    }
    
    // Show success message
    const formatText = formats.map(f => f.toUpperCase()).join(', ');
    showNotification(`Bulk export completed: ${formatText} (${items.length} items)`, 'success');
}

// Generate export data for different formats
function generateExportData(format, items, includeHeaders, includeTimestamps) {
    switch (format) {
        case 'csv':
            return getCSVContent(items, includeHeaders, includeTimestamps);
        case 'excel':
            return getCSVContent(items, includeHeaders, includeTimestamps); // Excel uses CSV content
        case 'json':
            return JSON.stringify(items, null, 2);
        case 'pdf':
            return generatePDFHTML(items, includeHeaders, includeTimestamps);
        default:
            throw new Error(`Unsupported format: ${format}`);
    }
}

// Get MIME type for format
function getMimeType(format) {
    switch (format) {
        case 'csv':
            return 'text/csv';
        case 'excel':
            return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        case 'json':
            return 'application/json';
        case 'pdf':
            return 'application/pdf';
        default:
            return 'text/plain';
    }
}

// Download individual exports
function downloadIndividualExports(exports) {
    exports.forEach(exportItem => {
        downloadFile(exportItem.data, exportItem.filename, exportItem.mimeType);
    });
}

// Download compressed exports (ZIP simulation)
function downloadCompressedExports(exports, itemCount) {
    // For now, we'll download individual files with a delay to simulate ZIP
    // In a real implementation, you'd use a library like JSZip
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const zipFilename = `bulk_export_${itemCount}_items_${timestamp}.zip`;
    
    // Show notification about ZIP simulation
    showNotification(`ZIP compression simulated - downloading ${exports.length} files`, 'info');
    
    // Download files with slight delay
    exports.forEach((exportItem, index) => {
        setTimeout(() => {
            downloadFile(exportItem.data, exportItem.filename, exportItem.mimeType);
        }, index * 500); // 500ms delay between downloads
    });
}

// Export to CSV
function exportToCSV(items, includeHeaders, includeTimestamps) {
    const headers = ['Title', 'Description', 'Category', 'Status', 'Priority', 'Assignee'];
    if (includeTimestamps) {
        headers.push('Created Date', 'Updated Date');
    }
    
    let csvContent = '';
    
    // Add headers if requested
    if (includeHeaders) {
        csvContent += headers.join(',') + '\n';
    }
    
    // Add data rows
    items.forEach(item => {
        const row = [
            `"${item.title || ''}"`,
            `"${item.description || ''}"`,
            `"${item.category || ''}"`,
            `"${item.status || ''}"`,
            `"${item.priority || ''}"`,
            `"${item.assignee || ''}"`
        ];
        
        if (includeTimestamps) {
            row.push(`"${item.createdDate || ''}"`, `"${item.updatedDate || ''}"`);
        }
        
        csvContent += row.join(',') + '\n';
    });
    
    // Download file
    downloadFile(csvContent, 'items.csv', 'text/csv');
}

// Export to Excel (using CSV format with .xlsx extension)
function exportToExcel(items, includeHeaders, includeTimestamps) {
    // For now, we'll use CSV format with .xlsx extension
    // In a real implementation, you'd use a library like SheetJS
    exportToCSV(items, includeHeaders, includeTimestamps);
    
    // Rename the downloaded file to .xlsx
    setTimeout(() => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([getCSVContent(items, includeHeaders, includeTimestamps)], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
        link.download = 'items.xlsx';
        link.click();
    }, 100);
}

// Export to PDF
function exportToPDF(items, includeHeaders, includeTimestamps) {
    // For now, we'll create a simple HTML table and use browser print
    // In a real implementation, you'd use a library like jsPDF
    const printWindow = window.open('', '_blank');
    const htmlContent = generatePDFHTML(items, includeHeaders, includeTimestamps);
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
}

// Export to JSON
function exportToJSON(items, includeHeaders, includeTimestamps) {
    const jsonData = {
        exportInfo: {
            timestamp: new Date().toISOString(),
            itemCount: items.length,
            includeHeaders: includeHeaders,
            includeTimestamps: includeTimestamps
        },
        items: items
    };
    
    const jsonContent = JSON.stringify(jsonData, null, 2);
    downloadFile(jsonContent, 'items.json', 'application/json');
}

// Helper function to get CSV content
function getCSVContent(items, includeHeaders, includeTimestamps) {
    const headers = ['Title', 'Description', 'Category', 'Status', 'Priority', 'Assignee'];
    if (includeTimestamps) {
        headers.push('Created Date', 'Updated Date');
    }
    
    let csvContent = '';
    
    if (includeHeaders) {
        csvContent += headers.join(',') + '\n';
    }
    
    items.forEach(item => {
        const row = [
            `"${item.title || ''}"`,
            `"${item.description || ''}"`,
            `"${item.category || ''}"`,
            `"${item.status || ''}"`,
            `"${item.priority || ''}"`,
            `"${item.assignee || ''}"`
        ];
        
        if (includeTimestamps) {
            row.push(`"${item.createdDate || ''}"`, `"${item.updatedDate || ''}"`);
        }
        
        csvContent += row.join(',') + '\n';
    });
    
    return csvContent;
}

// Helper function to generate PDF HTML
function generatePDFHTML(items, includeHeaders, includeTimestamps) {
    const headers = ['Title', 'Description', 'Category', 'Status', 'Priority', 'Assignee'];
    if (includeTimestamps) {
        headers.push('Created Date', 'Updated Date');
    }
    
    let tableRows = '';
    items.forEach(item => {
        const row = [
            item.title || '',
            item.description || '',
            item.category || '',
            item.status || '',
            item.priority || '',
            item.assignee || ''
        ];
        
        if (includeTimestamps) {
            row.push(item.createdDate || '', item.updatedDate || '');
        }
        
        tableRows += '<tr>' + row.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
    });
    
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Items Export</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; font-weight: bold; }
                h1 { color: #333; }
            </style>
        </head>
        <body>
            <h1>Items Export</h1>
            <p>Exported on: ${new Date().toLocaleString()}</p>
            <p>Total items: ${items.length}</p>
            <table>
                <thead>
                    <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        </body>
        </html>
    `;
}

// Helper function to download file
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Export functions for different scopes
function exportSingleItem(itemId) {
    showExportMenu('single', itemId);
}

function exportSelectedItems() {
    if (selectedItemIds.size === 0) {
        alert('Please select items to export');
        return;
    }
    showExportMenu('selected');
}

function exportAllItems() {
    if (window.testItems.length === 0) {
        alert('No items to export');
        return;
    }
    showExportMenu('all');
}

// Clear search
function clearSearch() {
    const searchInput = document.getElementById('itemSearch');
    if (searchInput) {
        searchInput.value = '';
        searchQuery = '';
        applySearchAndFilter();
    }
}

// Apply date range
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

// Clear date range
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

// Switch between list and cards view
function switchView(view) {
    // Update active button
    document.querySelectorAll('.view-selector .btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${view}"]`).classList.add('active');
    
    // Show/hide views
    document.querySelectorAll('.view-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${view}View`).classList.add('active');
    
    // Render the selected view
    renderCurrentView();
}

// Render current view
function renderCurrentView() {
    console.log('Rendering current view...');
    const activeView = document.querySelector('.view-content.active');
    console.log('Active view:', activeView?.id);
    
    if (activeView) {
        if (activeView.id === 'listView') {
            console.log('Rendering list view...');
            renderListView();
        } else if (activeView.id === 'cardsView') {
            console.log('Rendering cards view...');
            renderCardsView();
        }
    } else {
        console.error('No active view found!');
    }
}

// Render list view
function renderListView() {
    console.log('renderListView called');
    const startTime = performance.now();
    const gridBody = document.getElementById('itemsGridBody');
    console.log('Grid body element:', gridBody);
    console.log('Paginated items:', paginatedItems?.length || 0);
    
    if (!gridBody) {
        console.error('Grid body not found!');
        return;
    }
    
    gridBody.innerHTML = '';
    
    paginatedItems.forEach(item => {
        console.log('Rendering item:', item.title);
        const row = document.createElement('div');
        row.className = 'grid-row';
        row.innerHTML = `
            <div class="grid-cell checkbox-cell" data-col="checkbox">
                <input type="checkbox" class="item-checkbox" data-item-id="${item.id}">
            </div>
            <div class="grid-cell" data-col="title" title="${item.title}">
                ${truncateText(item.title, 30)}
            </div>
            <div class="grid-cell" data-col="description" title="${item.description}">
                ${truncateText(item.description, 50)}
            </div>
            <div class="grid-cell" data-col="category">
                ${item.category}
            </div>
            <div class="grid-cell" data-col="status">
                <span class="status-badge status-${item.status}">${getStatusText(item.status)}</span>
            </div>
            <div class="grid-cell" data-col="priority">
                <span style="color: ${getPriorityColor(item.priority)}; font-weight: 600;">${item.priority}</span>
            </div>
            <div class="grid-cell" data-col="assignee">
                ${item.assignee}
            </div>
            <div class="grid-cell" data-col="actions">
                <button class="action-menu-btn" onclick="toggleActionMenu('${item.id}')">
                    <span class="three-dots">⋯</span>
                </button>
            </div>
        `;
        gridBody.appendChild(row);
        
        // Restore selection state if this item was previously selected
        const checkbox = row.querySelector('.item-checkbox');
        if (selectedItemIds.has(item.id)) {
            checkbox.checked = true;
        }
    });
    
    console.log('List view rendered with', paginatedItems.length, 'items');
    performanceMetrics.renderTime = performance.now() - startTime;
    updatePerformanceMetrics();
}

// Render cards view
function renderCardsView() {
    const startTime = performance.now();
    const cardsContainer = document.getElementById('cardsContainer');
    if (!cardsContainer) return;
    
    cardsContainer.innerHTML = '';
    
    paginatedItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">${item.title}</h3>
                <span class="card-status status-${item.status}">${getStatusText(item.status)}</span>
            </div>
            <div class="card-content">
                <p class="card-description">${item.description}</p>
                <div class="card-meta">
                    <span><strong>Category:</strong> ${item.category}</span>
                    <span><strong>Priority:</strong> <span style="color: ${getPriorityColor(item.priority)};">${item.priority}</span></span>
                    <span><strong>Assignee:</strong> ${item.assignee}</span>
                    <span><strong>Created:</strong> ${item.createdDate}</span>
                </div>
            </div>
            <div class="card-footer">
                <div class="card-actions">
                    <button class="card-action-btn" onclick="editItem('${item.id}')">Edit</button>
                    <button class="card-action-btn primary" onclick="duplicateItem('${item.id}')">Duplicate</button>
                </div>
                <input type="checkbox" class="item-checkbox" data-item-id="${item.id}">
            </div>
        `;
        cardsContainer.appendChild(card);
        
        // Restore selection state if this item was previously selected
        const checkbox = card.querySelector('.item-checkbox');
        if (selectedItemIds.has(item.id)) {
            checkbox.checked = true;
        }
    });
    
    performanceMetrics.renderTime = performance.now() - startTime;
    updatePerformanceMetrics();
}

// Truncate text helper
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Get status text
function getStatusText(status) {
    const statusMap = {
        'not-started': 'Not Started',
        'in-progress': 'In Progress',
        'completed': 'Completed',
        'on-hold': 'On Hold'
    };
    return statusMap[status] || status;
}

// Get priority color
function getPriorityColor(priority) {
    const colorMap = {
        'low': '#10b981',
        'medium': '#f59e0b',
        'high': '#ef4444',
        'urgent': '#dc2626'
    };
    return colorMap[priority] || '#64748b';
}

// Action menu functions
let menuEl = null;

function closeMenu() { 
  if (menuEl) { 
    menuEl.remove(); 
    menuEl = null; 
    document.removeEventListener('click', onDoc); 
  } 
}

function onDoc(e) { 
  if (menuEl && !menuEl.contains(e.target)) closeMenu(); 
}

function toggleActionMenu(itemId) {
  // Close any existing menu
  closeMenu();
  
  // Find the button that was clicked
  const button = document.querySelector(`button[onclick*="toggleActionMenu('${itemId}')"]`);
  if (!button) {
    return;
  }
  
  // Get button position
  const rect = button.getBoundingClientRect();
  
  // Create menu dynamically (like Schedule)
  const menu = document.createElement('div');
  menu.className = 'pcfp-menu';
  menu.innerHTML = [
    `<button type="button" onclick="editItem('${itemId}');">✏️ Edit</button>`,
    `<button type="button" onclick="insertItemAbove('${itemId}');">⬆️ Insert Above</button>`,
    `<button type="button" onclick="insertItemBelow('${itemId}');">⬇️ Insert Below</button>`,
    `<button type="button" onclick="duplicateItem('${itemId}');">📋 Duplicate</button>`,
    `<button type="button" onclick="exportSingleItem('${itemId}');">📤 Export</button>`,
    `<button type="button" onclick="deleteItem('${itemId}');">🗑️ Delete</button>`
  ].join('');
  
  // Append to document body
  document.body.appendChild(menu);
  menuEl = menu;
  
  // Position menu
  menu.style.top = (rect.bottom + window.scrollY + 6) + 'px';
  menu.style.left = Math.max(12, rect.right + window.scrollX - 180) + 'px';
  
  // Add click outside listener
  setTimeout(() => document.addEventListener('click', onDoc));
}

function editItem(itemId) {
    openItemModal(itemId);
}

function insertItemAbove(itemId) {
    const itemIndex = window.testItems.findIndex(i => i.id === itemId);
    
    if (itemIndex === 0) {
        showInsertError('Cannot insert above the first item');
        return;
    }
    
    const currentItem = window.testItems[itemIndex];
    const newItem = createItemFromTemplate(currentItem, 'above');
    
    // Open modal with new item data
    openItemModal(newItem.id, 'insert-above', itemIndex);
}

function insertItemBelow(itemId) {
    const itemIndex = window.testItems.findIndex(i => i.id === itemId);
    
    if (itemIndex === window.testItems.length - 1) {
        showInsertError('Cannot insert below the last item');
        return;
    }
    
    const currentItem = window.testItems[itemIndex];
    const newItem = createItemFromTemplate(currentItem, 'below');
    
    // Open modal with new item data
    openItemModal(newItem.id, 'insert-below', itemIndex);
}

function createItemFromTemplate(sourceItem, type) {
    const newItem = {
        ...sourceItem,
        id: generateItemId(),
        title: type === 'duplicate' ? `${sourceItem.title} (Copy)` : sourceItem.title,
        createdDate: new Date().toISOString().split('T')[0],
        updatedDate: new Date().toISOString().split('T')[0]
    };
    
    return newItem;
}

function showInsertError(message) {
    alert(message);
    closeMenu();
}

function generateItemId() {
    return 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function duplicateItem(itemId) {
    const item = window.testItems.find(i => i.id === itemId);
    if (item) {
        // Save to undo history BEFORE making changes
        saveToUndoHistory('duplicate', `Duplicated item '${item.title}'`);
        
        const newItem = {
            ...item,
            id: generateItemId(),
            title: item.title + ' (Copy)',
            createdDate: new Date().toISOString().split('T')[0],
            updatedDate: new Date().toISOString().split('T')[0]
        };
        
        window.testItems.push(newItem);
        
        // Add to action history
        addToActionHistory('duplicate', {
            itemTitle: item.title,
            description: `Duplicated item: ${item.title}`
        });
        
        saveItems();
        applySearchAndFilter();
        showNotification('Item duplicated successfully', 'success');
    }
}

function deleteItem(itemId) {
    if (confirm('Are you sure you want to delete this item?')) {
        const itemToDelete = window.testItems.find(i => i.id === itemId);
        
        // Save to undo history BEFORE making changes
        if (itemToDelete) {
            saveToUndoHistory('delete', `Deleted item '${itemToDelete.title}'`);
        }
        
        window.testItems = window.testItems.filter(i => i.id !== itemId);
        
        // Add to action history
        if (itemToDelete) {
            addToActionHistory('delete', {
                itemTitle: itemToDelete.title,
                description: `Deleted item: ${itemToDelete.title}`
            });
        }
        
        saveItems();
        applySearchAndFilter();
        showNotification('Item deleted successfully', 'success');
    }
}

// Add new item
function addNewItem() {
    const newItem = {
        id: generateItemId(),
        title: '',
        description: '',
        category: '',
        status: 'not-started',
        priority: 'medium',
        assignee: '',
        createdDate: new Date().toISOString().split('T')[0],
        updatedDate: new Date().toISOString().split('T')[0]
    };
    
    openItemModal(newItem.id, 'add');
}

// Open item modal
function openItemModal(itemId, mode = 'edit', insertIndex = null) {
    const modal = document.getElementById('itemModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('itemForm');
    
    if (mode === 'add') {
        modalTitle.textContent = 'Add Item';
        form.reset();
    } else if (mode === 'edit') {
        modalTitle.textContent = 'Edit Item';
        const item = window.testItems.find(i => i.id === itemId);
        if (item) {
            document.getElementById('titleField').value = item.title;
            document.getElementById('descriptionField').value = item.description;
            document.getElementById('categoryField').value = item.category;
            document.getElementById('statusField').value = item.status;
            document.getElementById('priorityField').value = item.priority;
            document.getElementById('assigneeField').value = item.assignee;
        }
    } else if (mode.startsWith('insert-')) {
        modalTitle.textContent = 'Insert Item';
        form.reset();
    }
    
    modal.style.display = 'flex';
    
    // Handle form submission
    form.onsubmit = function(e) {
        e.preventDefault();
        saveItemFromModal(itemId, mode, insertIndex);
    };
}

// Close item modal
function closeItemModal() {
    const modal = document.getElementById('itemModal');
    modal.style.display = 'none';
}

// Save item from modal
function saveItemFromModal(itemId, mode, insertIndex) {
    const formData = {
        title: document.getElementById('titleField').value,
        description: document.getElementById('descriptionField').value,
        category: document.getElementById('categoryField').value,
        status: document.getElementById('statusField').value,
        priority: document.getElementById('priorityField').value,
        assignee: document.getElementById('assigneeField').value,
        updatedDate: new Date().toISOString().split('T')[0]
    };
    
    if (mode === 'add') {
        // Save to undo history BEFORE making changes
        saveToUndoHistory('add', `Added item '${formData.title}'`);
        
        const newItem = {
            id: itemId,
            ...formData,
            createdDate: new Date().toISOString().split('T')[0]
        };
        window.testItems.push(newItem);
        
        // Add to action history
        addToActionHistory('add', {
            itemTitle: formData.title,
            description: `Added new item: ${formData.title}`
        });
        
        showNotification('Item added successfully', 'success');
    } else if (mode === 'edit') {
        const itemIndex = window.testItems.findIndex(i => i.id === itemId);
        if (itemIndex !== -1) {
            // Save to undo history BEFORE making changes
            saveToUndoHistory('edit', `Edited item '${formData.title}'`);
            
            window.testItems[itemIndex] = { ...window.testItems[itemIndex], ...formData };
            
            // Add to action history
            addToActionHistory('edit', {
                itemTitle: formData.title,
                description: `Edited item: ${formData.title}`
            });
            
            showNotification('Item updated successfully', 'success');
        }
    } else if (mode.startsWith('insert-')) {
        const newItem = {
            id: itemId,
            ...formData,
            createdDate: new Date().toISOString().split('T')[0]
        };
        
        if (mode === 'insert-above') {
            window.testItems.splice(insertIndex, 0, newItem);
        } else if (mode === 'insert-below') {
            window.testItems.splice(insertIndex + 1, 0, newItem);
        }
        showNotification('Item inserted successfully', 'success');
    }
    
    saveItems();
    closeItemModal();
    applySearchAndFilter();
}

// Pagination functions
function applyPagination() {
    console.log('applyPagination called');
    console.log('filteredItems length:', filteredItems?.length || 0);
    console.log('currentPage:', currentPage);
    console.log('itemsPerPage:', itemsPerPage);
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    paginatedItems = filteredItems.slice(startIndex, endIndex);
    
    console.log('paginatedItems length:', paginatedItems?.length || 0);
    
    totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    
    console.log('totalPages:', totalPages);
    
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
                <option value="75" ${itemsPerPage === 75 ? 'selected' : ''}>75</option>
                <option value="100" ${itemsPerPage === 100 ? 'selected' : ''}>100</option>
                <option value="150" ${itemsPerPage === 150 ? 'selected' : ''}>150</option>
                <option value="200" ${itemsPerPage === 200 ? 'selected' : ''}>200</option>
            </select>
        </div>
    `;
}

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

function changePage(page, clearSelections = true) {
    console.log(`changePage called: page=${page}, clearSelections=${clearSelections}, currentPage=${currentPage}, totalPages=${totalPages}`);
    
    if (page >= 1 && page <= totalPages) {
        console.log(`Changing to page ${page}`);
        
        // Clear all selections when changing pages (unless explicitly disabled)
        if (clearSelections) {
            console.log('Clearing selections');
            clearAllSelections();
        } else {
            console.log('Preserving selections');
            // Reset Select All checkbox when navigating with arrow keys
            const selectAllCheckbox = document.getElementById('selectAll');
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = false;
                selectAllCheckbox.indeterminate = false;
                console.log('Reset Select All checkbox for new page');
            }
        }
        
        currentPage = page;
        console.log(`Updated currentPage to ${currentPage}`);
        applyPagination();
        renderCurrentView();
        console.log('Page change complete');
    } else {
        console.log(`Invalid page ${page} - not changing`);
    }
}

function changeItemsPerPage(newItemsPerPage) {
    itemsPerPage = parseInt(newItemsPerPage);
    currentPage = 1;
    
    // Clear all selections when changing items per page
    clearAllSelections();
    
    applyPagination();
    renderCurrentView();
}

// Selection functions
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

function updateSelectAllState() {
    const allCheckboxes = document.querySelectorAll('.item-checkbox');
    const checkedCheckboxes = document.querySelectorAll('.item-checkbox:checked');
    const selectAllCheckbox = document.getElementById('selectAll');
    
    if (checkedCheckboxes.length === 0) {
        selectAllCheckbox.indeterminate = false;
        selectAllCheckbox.checked = false;
    } else if (checkedCheckboxes.length === allCheckboxes.length) {
        selectAllCheckbox.indeterminate = false;
        selectAllCheckbox.checked = true;
    } else {
        selectAllCheckbox.indeterminate = true;
    }
}

function updateCardSelection() {
    // Update card selection state if in cards view
    const cardsView = document.getElementById('cardsView');
    if (cardsView.classList.contains('active')) {
        // Card selection logic would go here
    }
}

// Clear all selections
function clearAllSelections() {
    // Clear individual checkboxes
    document.querySelectorAll('.item-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Clear the selection tracking set
    selectedItemIds.clear();
    console.log('Cleared all selections from tracking set');
    
    // Clear select all checkbox
    const selectAllCheckbox = document.getElementById('selectAll');
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
    }
    
    // Update selection count (without clearing again to avoid infinite loop)
    updateSelectedCountOnly();
}

// Update selection count without clearing (to avoid infinite loops)
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

// Mass action functions
function deleteSelectedItems() {
    if (selectedItemIds.size === 0) {
        alert('Please select items to delete');
        return;
    }
    
    if (confirm(`Are you sure you want to delete ${selectedItemIds.size} selected items?`)) {
        const selectedIds = Array.from(selectedItemIds);
        const itemsToDelete = window.testItems.filter(item => selectedIds.includes(item.id));
        
        // Save to undo history BEFORE making changes
        saveToUndoHistory('bulk_delete', `Bulk deleted ${itemsToDelete.length} items`);
        
        window.testItems = window.testItems.filter(item => !selectedIds.includes(item.id));
        
        // Add to action history
        addToActionHistory('bulk_delete', {
            count: selectedIds.length,
            description: `Bulk deleted ${selectedIds.length} items`
        });
        
        saveItems();
        applySearchAndFilter();
        clearAllSelections(); // Clear all checkboxes after deletion
        showNotification(`${selectedIds.length} items deleted successfully`, 'success');
    }
}

function duplicateSelectedItems() {
    if (selectedItemIds.size === 0) {
        alert('Please select items to duplicate');
        return;
    }
    
    const selectedIds = Array.from(selectedItemIds);
    const itemsToDuplicate = window.testItems.filter(item => selectedIds.includes(item.id));
    
    // Save to undo history BEFORE making changes
    saveToUndoHistory('bulk_duplicate', `Bulk duplicated ${itemsToDuplicate.length} items`);
    
    itemsToDuplicate.forEach(item => {
        const newItem = {
            ...item,
            id: generateItemId(),
            title: item.title + ' (Copy)',
            createdDate: new Date().toISOString().split('T')[0],
            updatedDate: new Date().toISOString().split('T')[0]
        };
        window.testItems.push(newItem);
    });
    
    // Add to action history
    addToActionHistory('bulk_duplicate', {
        count: itemsToDuplicate.length,
        description: `Bulk duplicated ${itemsToDuplicate.length} items`
    });
    
    saveItems();
    applySearchAndFilter();
    clearAllSelections(); // Clear all checkboxes after duplication
    showNotification(`${itemsToDuplicate.length} items duplicated successfully`, 'success');
}

// This function has been replaced by the new export system above

// Export functions
function exportItems() {
    exportToCSV(window.testItems, 'all_items.csv');
    showNotification('All items exported successfully', 'success');
}

function exportToCSV(items, filename) {
    if (items.length === 0) {
        alert('No items to export');
        return;
    }
    
    const headers = ['Title', 'Description', 'Category', 'Status', 'Priority', 'Assignee', 'Created Date', 'Updated Date'];
    const rows = items.map(item => [
        item.title,
        item.description,
        item.category,
        item.status,
        item.priority,
        item.assignee,
        item.createdDate,
        item.updatedDate
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(row => row.map(field => `"${field}"`).join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Notification function
function showNotification(message, type = 'info') {
    // Simple notification implementation
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-size: 14px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Performance monitoring
function updatePerformanceMetrics() {
    performanceMetrics.memoryUsage = performance.memory ? performance.memory.usedJSHeapSize : 0;
    
    // Log performance warnings
    if (performanceMetrics.renderTime > 500) {
        console.warn(`[PCFP] Slow rendering detected: ${performanceMetrics.renderTime.toFixed(2)}ms`);
    }
    if (performanceMetrics.searchTime > 200) {
        console.warn(`[PCFP] Slow search detected: ${performanceMetrics.searchTime.toFixed(2)}ms`);
    }
    if (performanceMetrics.memoryUsage > 6 * 1024 * 1024) { // 6MB
        console.warn(`[PCFP] High memory usage detected: ${(performanceMetrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`);
    }
}

// Keyboard Help Modal Functions
function showKeyboardHelp() {
    const modal = document.getElementById('keyboardHelpModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeKeyboardHelp() {
    const modal = document.getElementById('keyboardHelpModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Make functions globally accessible for onclick handlers
window.clearSearch = clearSearch;
window.applyDateRange = applyDateRange;
window.clearDateRange = clearDateRange;
window.toggleActionMenu = toggleActionMenu;
window.insertItemAbove = insertItemAbove;
window.insertItemBelow = insertItemBelow;
window.closeKeyboardHelp = closeKeyboardHelp;
window.editItem = editItem;
window.duplicateItem = duplicateItem;
window.deleteItem = deleteItem;
window.closeItemModal = closeItemModal;
window.handleColumnClick = handleColumnClick;
window.clearSorting = clearSorting;
window.openBulkEdit = openBulkEdit;
window.closeBulkEdit = closeBulkEdit;
window.applyBulkEdit = applyBulkEdit;
window.performUndo = performUndo;
window.performRedo = performRedo;
window.exportSingleItem = exportSingleItem;
window.exportSelectedItems = exportSelectedItems;
window.exportAllItems = exportAllItems;
window.showExportMenu = showExportMenu;
window.hideExportMenu = hideExportMenu;
window.selectExportFormat = selectExportFormat;
window.showExportPreview = showExportPreview;
window.hideExportPreview = hideExportPreview;
window.confirmExportFromPreview = confirmExportFromPreview;
window.showActionHistory = showActionHistory;
window.hideActionHistory = hideActionHistory;
window.clearActionHistory = clearActionHistory;
window.showBulkExportModal = showBulkExportModal;
window.hideBulkExportModal = hideBulkExportModal;
window.startBulkExport = startBulkExport;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initTestModule);
