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
    
    // Apply default sort (by title ascending)
    applyDefaultSort();
    
    // Apply pagination on initial load
    applyPagination();
    
    // Initialize column headers
    updateColumnHeaders();
    
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
    document.getElementById('btnExport').addEventListener('click', exportItems);
    
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
    document.getElementById('btnExportSelected')?.addEventListener('click', exportSelectedItems);
    document.getElementById('btnClearSelected')?.addEventListener('click', clearAllSelections);

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
        const newItem = {
            ...item,
            id: generateItemId(),
            title: item.title + ' (Copy)',
            createdDate: new Date().toISOString().split('T')[0],
            updatedDate: new Date().toISOString().split('T')[0]
        };
        
        window.testItems.push(newItem);
        saveItems();
        applySearchAndFilter();
        showNotification('Item duplicated successfully', 'success');
    }
}

function deleteItem(itemId) {
    if (confirm('Are you sure you want to delete this item?')) {
        window.testItems = window.testItems.filter(i => i.id !== itemId);
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
        const newItem = {
            id: itemId,
            ...formData,
            createdDate: new Date().toISOString().split('T')[0]
        };
        window.testItems.push(newItem);
        showNotification('Item added successfully', 'success');
    } else if (mode === 'edit') {
        const itemIndex = window.testItems.findIndex(i => i.id === itemId);
        if (itemIndex !== -1) {
            window.testItems[itemIndex] = { ...window.testItems[itemIndex], ...formData };
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
    console.log('deleteSelectedItems called');
    console.log('selectedItemIds.size:', selectedItemIds.size);
    console.log('selectedItemIds contents:', Array.from(selectedItemIds));
    
    if (selectedItemIds.size === 0) {
        alert('Please select items to delete');
        return;
    }
    
    if (confirm(`Are you sure you want to delete ${selectedItemIds.size} selected items?`)) {
        const selectedIds = Array.from(selectedItemIds);
        console.log('Deleting items with IDs:', selectedIds);
        window.testItems = window.testItems.filter(item => !selectedIds.includes(item.id));
        
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
    
    saveItems();
    applySearchAndFilter();
    clearAllSelections(); // Clear all checkboxes after duplication
    showNotification(`${itemsToDuplicate.length} items duplicated successfully`, 'success');
}

function exportSelectedItems() {
    if (selectedItemIds.size === 0) {
        alert('Please select items to export');
        return;
    }
    
    const selectedIds = Array.from(selectedItemIds);
    const itemsToExport = window.testItems.filter(item => selectedIds.includes(item.id));
    
    exportToCSV(itemsToExport, 'selected_items.csv');
    clearAllSelections(); // Clear all checkboxes after export
    showNotification(`${itemsToExport.length} items exported successfully`, 'success');
}

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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initTestModule);
