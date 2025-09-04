/* modules/daily-logs/module.js - Daily Logs Module v1.8 */
/* PCFP Core Integration - Professional Construction Software Quality */

// Sample data for testing
const sampleLogs = [
    {
        id: 'log_20250101_001',
        project: 'Downtown Office Building',
        date: '2025-01-01',
        notes: 'Site preparation completed. Foundation forms installed. Weather was clear and sunny. Crew of 6 worked efficiently.',
        photos: [
            { id: 'photo_001', filename: 'site_prep.jpg', data: 'data:image/jpeg;base64,...' },
            { id: 'photo_002', filename: 'forms_installed.jpg', data: 'data:image/jpeg;base64,...' }
        ],
        weather: {
            temperature: 75,
            conditions: 'sunny',
            precipitation: 'none',
            windSpeed: 5,
            location: 'Toronto, ON'
        },
        createdBy: 'John Smith',
        timestamp: '2025-01-01T17:00:00Z'
    },
    {
        id: 'log_20250102_001',
        project: 'Downtown Office Building',
        date: '2025-01-02',
        notes: 'Concrete poured for foundation. Crew of 8 worked 8 hours. No issues encountered. Quality control passed.',
        photos: [
            { id: 'photo_003', filename: 'concrete_pour.jpg', data: 'data:image/jpeg;base64,...' },
            { id: 'photo_004', filename: 'foundation_complete.jpg', data: 'data:image/jpeg;base64,...' },
            { id: 'photo_005', filename: 'quality_check.jpg', data: 'data:image/jpeg;base64,...' }
        ],
        weather: {
            temperature: 68,
            conditions: 'cloudy',
            precipitation: 'light',
            windSpeed: 8,
            location: 'Toronto, ON'
        },
        createdBy: 'Mike Johnson',
        timestamp: '2025-01-02T16:30:00Z'
    },
    {
        id: 'log_20250103_001',
        project: 'Downtown Office Building',
        date: '2025-01-03',
        notes: 'Framing started on first floor. Materials delivered on time. Good progress made. Subcontractors coordinated well.',
        photos: [],
        weather: {
            temperature: 72,
            conditions: 'partly cloudy',
            precipitation: 'none',
            windSpeed: 3,
            location: 'Toronto, ON'
        },
        createdBy: 'Sarah Wilson',
        timestamp: '2025-01-03T18:00:00Z'
    }
];

// Global variables for search, filter, and undo/redo
let searchQuery = '';
let currentFilter = '';
let operationHistory = [];
let currentHistoryIndex = -1;
let filteredLogs = [];
let dateRangeStart = '';
let dateRangeEnd = '';
let isDateRangeActive = false;

// Initialize module
function initDailyLogs() {
    loadLogs();
    setupEventListeners();
    setupSearchAndFilter();
    renderCurrentView();
}

// Load logs from localStorage
function loadLogs() {
    const savedLogs = localStorage.getItem('pcfp_daily_logs');
    if (savedLogs) {
        try {
            window.dailyLogs = JSON.parse(savedLogs);
        } catch (e) {
            console.warn('Failed to load saved logs, using sample data');
            window.dailyLogs = [...sampleLogs];
        }
    } else {
        window.dailyLogs = [...sampleLogs];
    }
}

// Save logs to localStorage
function saveLogs() {
    localStorage.setItem('pcfp_daily_logs', JSON.stringify(window.dailyLogs));
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

    // Add log button
    const addLogBtn = document.getElementById('btnAddLog');
    console.log('Add log button found:', addLogBtn);
    if (addLogBtn) {
        addLogBtn.addEventListener('click', addNewLog);
    } else {
        console.error('Add log button not found!');
    }

    // Save and export buttons
    document.getElementById('btnSave').addEventListener('click', saveLogs);
    document.getElementById('btnExport').addEventListener('click', exportLogs);

    // Select all checkbox
    document.getElementById('selectAll').addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.log-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
        updateSelectedCount();
        updateCardSelection();
    });

    // Individual checkboxes
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('log-checkbox')) {
            updateSelectedCount();
            updateSelectAllState();
            updateCardSelection();
        }
    });

    // Close menus when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.action-menu')) {
            document.querySelectorAll('.action-menu-content').forEach(menu => {
                menu.classList.remove('show');
            });
        }
        
        // Close modal when clicking outside
        const modal = document.getElementById('dailyLogModal');
        if (modal && modal.style.display === 'flex' && !e.target.closest('.modal-content')) {
            closeDailyLogModal();
        }
    });
}

// Setup search and filter functionality
function setupSearchAndFilter() {
    const searchInput = document.getElementById('logSearch');
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
        if (dateRangeStart && dateRangeEnd) {
            isDateRangeActive = true;
        }
    });
    
    dateEndInput.addEventListener('change', function() {
        dateRangeEnd = this.value;
        if (dateRangeStart && dateRangeEnd) {
            isDateRangeActive = true;
        }
    });
}

// Apply search and filter to logs
function applySearchAndFilter() {
    filteredLogs = window.dailyLogs.filter(log => {
        // Apply search query
        const matchesSearch = !searchQuery || 
            log.notes.toLowerCase().includes(searchQuery) ||
            log.createdBy.toLowerCase().includes(searchQuery) ||
            log.date.includes(searchQuery);
        
        // Apply filter
        let matchesFilter = true;
        switch (currentFilter) {
            case 'date':
                // Already handled by date range
                break;
            case 'creator':
                matchesFilter = log.createdBy && log.createdBy.trim() !== '';
                break;
            case 'weather':
                matchesFilter = log.weather && log.weather.conditions;
                break;
            case 'photos':
                matchesFilter = log.photos && log.photos.length > 0;
                break;
            case 'archived':
                matchesFilter = log.archived === true;
                break;
        }
        
        // Apply date range filter
        let matchesDateRange = true;
        if (isDateRangeActive && dateRangeStart && dateRangeEnd) {
            const logDate = new Date(log.date);
            const startDate = new Date(dateRangeStart);
            const endDate = new Date(dateRangeEnd);
            matchesDateRange = logDate >= startDate && logDate <= endDate;
        }
        
        return matchesSearch && matchesFilter && matchesDateRange;
    });
    
    renderCurrentView();
}

// Clear search
function clearSearch() {
    document.getElementById('logSearch').value = '';
    searchQuery = '';
    applySearchAndFilter();
}

// Apply date range
function applyDateRange() {
    const startInput = document.getElementById('dateRangeStart');
    const endInput = document.getElementById('dateRangeEnd');
    
    if (startInput.value && endInput.value) {
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
    document.getElementById('dateRangeStart').value = '';
    document.getElementById('dateRangeEnd').value = '';
    dateRangeStart = '';
    dateRangeEnd = '';
    isDateRangeActive = false;
    applySearchAndFilter();
}
function switchView(viewName) {
    // Hide all views
    document.querySelectorAll('.view-content').forEach(view => {
        view.classList.remove('active');
    });
    
    // Show selected view
    document.getElementById(viewName + 'View').classList.add('active');
    
    // Update button states
    document.querySelectorAll('.view-selector .btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${viewName}"]`).classList.add('active');

    // Render the view
    renderCurrentView();
}

// Render the currently active view
function renderCurrentView() {
    const activeView = document.querySelector('.view-content.active');
    if (activeView.id === 'listView') {
        renderListView();
    } else if (activeView.id === 'cardsView') {
        renderCardsView();
    }
}

// Render list view (table-based layout)
function renderListView() {
    const gridBody = document.getElementById('logsGridBody');
    gridBody.innerHTML = '';

    const logsToRender = filteredLogs.length > 0 ? filteredLogs : window.dailyLogs;
    
    logsToRender.forEach(log => {
        const row = document.createElement('div');
        row.className = 'grid-row';
        row.setAttribute('data-log-id', log.id);

        row.innerHTML = `
            <div class="grid-cell checkbox-cell">
                <input type="checkbox" class="log-checkbox" data-log-id="${log.id}">
            </div>
            <div class="grid-cell" title="${log.project || 'No project'}">
                ${log.project || '<span style="color: var(--pcfp-text-muted);">No project</span>'}
            </div>
            <div class="grid-cell">
                <strong>${formatDate(log.date)}</strong>
            </div>
            <div class="grid-cell" title="${log.notes}">
                ${truncateText(log.notes, 50)}
            </div>
            <div class="grid-cell">
                ${renderWeather(log.weather)}
            </div>
            <div class="grid-cell">
                ${log.createdBy}
            </div>
            <div class="grid-cell">
                <div class="action-menu">
                    <button class="action-btn" onclick="toggleActionMenu('${log.id}')">⋯</button>
                    <div class="action-menu-content" id="menu-${log.id}">
                        <div class="action-menu-item" onclick="editLog('${log.id}')">Edit</div>
                        <div class="action-menu-item" onclick="duplicateLog('${log.id}')">Duplicate</div>
                        <div class="action-menu-item" onclick="deleteLog('${log.id}')">Delete</div>
                    </div>
                </div>
            </div>
        `;

        gridBody.appendChild(row);
    });
}

// Render cards view
function renderCardsView() {
    const container = document.getElementById('cardsContainer');
    container.innerHTML = '';

    const logsToRender = filteredLogs.length > 0 ? filteredLogs : window.dailyLogs;
    
    logsToRender.forEach(log => {
        const card = document.createElement('div');
        card.className = 'log-card';
        card.setAttribute('data-log-id', log.id);

        card.innerHTML = `
            <div class="card-header">
                <div class="card-date">${formatDate(log.date)}</div>
                <div class="card-checkbox">
                    <input type="checkbox" class="log-checkbox" data-log-id="${log.id}">
                </div>
            </div>
            
            <div class="card-project">
                <strong>${log.project || 'No project'}</strong>
            </div>
            
            <div class="card-notes">
                ${log.notes}
            </div>
            
            <div class="card-photos">
                ${renderPhotoGrid(log.photos)}
            </div>
            
            <div class="card-footer">
                <div class="weather-info">
                    <div class="weather-icon">🌤️</div>
                    <div class="weather-details">
                        <div class="weather-temp">${log.weather.temperature}°F</div>
                        <div class="weather-condition">${log.weather.conditions}</div>
                    </div>
                </div>
                
                <div class="card-actions">
                    <button class="card-action-btn" onclick="editLog('${log.id}')">Edit</button>
                    <button class="card-action-btn" onclick="duplicateLog('${log.id}')">Copy</button>
                    <button class="card-action-btn primary" onclick="viewLog('${log.id}')">View</button>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

// Render photos for list view
function renderPhotos(photos) {
    if (photos.length === 0) {
        return '<span style="color: var(--pcfp-text-muted);">No photos</span>';
    }
    
    if (photos.length === 1) {
        return `<img src="${photos[0].data}" alt="Photo" class="photo-preview">`;
    }
    
    return `
        <img src="${photos[0].data}" alt="Photo" class="photo-preview">
        <span class="photo-count">+${photos.length - 1}</span>
    `;
}

// Render photo grid for cards view
function renderPhotoGrid(photos) {
    if (photos.length === 0) {
        return '<div class="photo-placeholder">No photos</div>';
    }

    const maxPhotos = 4;
    const displayPhotos = photos.slice(0, maxPhotos);
    
    let html = '<div class="photo-grid">';
    
    displayPhotos.forEach(photo => {
        const photoSrc = photo.thumbnail || photo.data || photo;
        const fullSrc = photo.data || photo;
        const filename = photo.filename || 'photo.jpg';
        
        html += `
            <div class="photo-item" onclick="showFullSizePhoto('${fullSrc}', '${filename}')">
                <img src="${photoSrc}" alt="Photo" title="${filename}" style="cursor: pointer;">
            </div>
        `;
    });
    
    if (photos.length > maxPhotos) {
        html += `
            <div class="photo-placeholder">
                +${photos.length - maxPhotos}
            </div>
        `;
    }
    
    html += '</div>';
    return html;
}

// Render weather
function renderWeather(weather) {
    return `
        <div class="weather-info">
            <span class="weather-temp">${weather.temperature}°F</span>
            <span class="weather-condition">${weather.conditions}</span>
        </div>
    `;
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
    });
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Action menu functions
function toggleActionMenu(logId) {
    const menu = document.getElementById(`menu-${logId}`);
    const allMenus = document.querySelectorAll('.action-menu-content');
    
    allMenus.forEach(m => {
        if (m !== menu) m.classList.remove('show');
    });
    
    if (menu.classList.contains('show')) {
        menu.classList.remove('show');
    } else {
        // Calculate position for fixed positioning
        const button = document.querySelector(`[onclick="toggleActionMenu('${logId}')"]`);
        const buttonRect = button.getBoundingClientRect();
        
        menu.style.left = (buttonRect.right - 120) + 'px'; // 120px is min-width
        menu.style.top = (buttonRect.bottom + 5) + 'px';
        
        menu.classList.add('show');
    }
}

function editLog(logId) {
    openDailyLogModal(logId);
}

function duplicateLog(logId) {
    console.log('Duplicate log:', logId);
    const log = window.dailyLogs.find(l => l.id === logId);
    if (log) {
        const newLog = {
            ...log,
            id: 'log_' + Date.now(),
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString()
        };
        window.dailyLogs.push(newLog);
        renderCurrentView();
        saveLogs();
    }
}

function deleteLog(logId) {
    console.log('Delete log:', logId);
    if (confirm('Are you sure you want to delete this log?')) {
        window.dailyLogs = window.dailyLogs.filter(l => l.id !== logId);
        renderCurrentView();
        saveLogs();
    }
}

function viewLog(logId) {
    console.log('View log:', logId);
    alert(`View log: ${logId}`);
}

// Checkbox functionality
function updateSelectedCount() {
    const selectedCheckboxes = document.querySelectorAll('.log-checkbox:checked');
    const count = selectedCheckboxes.length;
    
    // Show/hide mass action toolbar
    const massActionToolbar = document.getElementById('massActionToolbar');
    if (massActionToolbar) {
        if (count > 0) {
            massActionToolbar.classList.add('show');
        } else {
            massActionToolbar.classList.remove('show');
        }
        
        // Update count display
        const countDisplay = massActionToolbar.querySelector('.selected-count');
        if (countDisplay) {
            countDisplay.textContent = `${count} selected`;
        }
    }
}

function updateSelectAllState() {
    const checkboxes = document.querySelectorAll('.log-checkbox');
    const checkedCheckboxes = document.querySelectorAll('.log-checkbox:checked');
    const selectAllCheckbox = document.getElementById('selectAll');
    
    selectAllCheckbox.checked = checkedCheckboxes.length === checkboxes.length;
    selectAllCheckbox.indeterminate = checkedCheckboxes.length > 0 && checkedCheckboxes.length < checkboxes.length;
}

function updateCardSelection() {
    const checkboxes = document.querySelectorAll('.log-checkbox');
    checkboxes.forEach(checkbox => {
        const card = checkbox.closest('.log-card');
        if (card) {
            if (checkbox.checked) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        }
    });
}

// Add new log
function addNewLog() {
    console.log('addNewLog called');
    openDailyLogModal();
}

// Modal functionality
let currentEditingLog = null;

function openDailyLogModal(logId = null) {
    console.log('openDailyLogModal called with logId:', logId);
    const modal = document.getElementById('dailyLogModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('dailyLogForm');
    
    console.log('Modal elements found:', { modal, modalTitle, form });
    
    if (!modal) {
        console.error('Modal element not found!');
        return;
    }
    
    // Reset form
    form.reset();
    document.getElementById('photoPreview').innerHTML = '';
    document.getElementById('weatherDisplay').innerHTML = '<span class="weather-placeholder">Weather data will be loaded for the selected date</span>';
    
    if (logId) {
        // Edit mode
        currentEditingLog = window.dailyLogs.find(log => log.id === logId);
        console.log('Edit mode - logId:', logId, 'currentEditingLog:', currentEditingLog);
        if (currentEditingLog) {
            modalTitle.textContent = 'Edit Daily Log';
            
            // Populate form fields
            document.getElementById('projectField').value = currentEditingLog.project || '';
            document.getElementById('dateField').value = currentEditingLog.date;
            document.getElementById('notesField').value = currentEditingLog.notes;
            document.getElementById('createdField').value = formatDate(currentEditingLog.timestamp);
            
            // Show existing photos
            if (currentEditingLog.photos && currentEditingLog.photos.length > 0) {
                renderPhotoPreview(currentEditingLog.photos);
            }
            
            // Show weather data
            if (currentEditingLog.weather) {
                renderWeatherDisplay(currentEditingLog.weather);
            }
        }
    } else {
        // Add mode
        currentEditingLog = null;
        console.log('Add mode - currentEditingLog set to null');
        modalTitle.textContent = 'Add Daily Log';
        
        // Set default values
        document.getElementById('dateField').value = new Date().toISOString().split('T')[0];
        document.getElementById('createdField').value = formatDate(new Date().toISOString());
    }
    
    // Show modal
    modal.style.display = 'flex';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.zIndex = '1000';
    console.log('Modal display set to flex with inline styles');
    
    // Test: Force modal to be visible
    setTimeout(() => {
        if (modal.style.display !== 'flex') {
            console.log('Modal not showing, forcing display');
            modal.style.display = 'flex';
        }
    }, 100);
    
    // Setup form submission
    form.onsubmit = function(e) {
        e.preventDefault();
        saveDailyLogFromModal();
    };
    
    // Setup photo upload
    document.getElementById('photoUpload').onchange = handlePhotoUpload;
    
    // Setup date change for weather
    document.getElementById('dateField').onchange = function() {
        loadWeatherForDate(this.value);
    };
}

function closeDailyLogModal() {
    const modal = document.getElementById('dailyLogModal');
    modal.style.display = 'none';
    currentEditingLog = null;
}

function saveDailyLogFromModal() {
    const project = document.getElementById('projectField').value.trim();
    const date = document.getElementById('dateField').value;
    const notes = document.getElementById('notesField').value.trim();
    
    if (!project || !date) {
        alert('Please fill in all required fields (Project and Date)');
        return;
    }
    
    console.log('Saving log - currentEditingLog:', currentEditingLog);
    console.log('Form data:', { project, date, notes });
    
    const logData = {
        project: project,
        date: date,
        notes: notes,
        photos: getCurrentPhotos(),
        weather: getCurrentWeather(),
        createdBy: 'Current User',
        timestamp: currentEditingLog ? currentEditingLog.timestamp : new Date().toISOString()
    };
    
    if (currentEditingLog) {
        // Update existing log
        console.log('Updating existing log:', currentEditingLog.id);
        Object.assign(currentEditingLog, logData);
        showNotification('Daily log updated successfully', 'success');
    } else {
        // Create new log
        console.log('Creating new log');
        const newLog = {
            id: 'log_' + Date.now(),
            ...logData
        };
        window.dailyLogs.unshift(newLog);
        showNotification('Daily log created successfully', 'success');
    }
    
    // Save and re-render
    saveLogs();
    renderCurrentView();
    closeDailyLogModal();
}

// Photo optimization constants
const PHOTO_CONFIG = {
    maxFileSize: 5 * 1024 * 1024, // 5MB per photo
    maxPhotosPerLog: 10,
    thumbnailWidth: 200,
    thumbnailHeight: 150,
    compressionQuality: 0.7,
    maxStorageSize: 8 * 1024 * 1024 // 8MB total localStorage limit
};

// Check storage quota before saving
function checkStorageQuota() {
    const currentData = localStorage.getItem('pcfp_daily_logs') || '';
    const currentSize = new Blob([currentData]).size;
    const availableSpace = PHOTO_CONFIG.maxStorageSize - currentSize;
    
    if (availableSpace < 1024 * 1024) { // Less than 1MB available
        showNotification('Storage space is running low. Consider exporting and clearing old logs.', 'warning');
        return false;
    }
    return true;
}

// Compress and resize image
function compressImage(file) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = function() {
            // Calculate new dimensions maintaining aspect ratio
            let { width, height } = img;
            const maxWidth = 1200; // Max width for full image
            const maxHeight = 800; // Max height for full image
            
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
            if (height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
            }
            
            // Set canvas size
            canvas.width = width;
            canvas.height = height;
            
            // Draw and compress
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', PHOTO_CONFIG.compressionQuality);
            
            // Create thumbnail
            const thumbnailCanvas = document.createElement('canvas');
            const thumbnailCtx = thumbnailCanvas.getContext('2d');
            thumbnailCanvas.width = PHOTO_CONFIG.thumbnailWidth;
            thumbnailCanvas.height = PHOTO_CONFIG.thumbnailHeight;
            
            // Calculate thumbnail dimensions
            let thumbWidth = PHOTO_CONFIG.thumbnailWidth;
            let thumbHeight = PHOTO_CONFIG.thumbnailHeight;
            
            if (width / height > thumbWidth / thumbHeight) {
                thumbHeight = (thumbWidth * height) / width;
            } else {
                thumbWidth = (thumbHeight * width) / height;
            }
            
            // Center the thumbnail
            const offsetX = (PHOTO_CONFIG.thumbnailWidth - thumbWidth) / 2;
            const offsetY = (PHOTO_CONFIG.thumbnailHeight - thumbHeight) / 2;
            
            thumbnailCtx.drawImage(img, offsetX, offsetY, thumbWidth, thumbHeight);
            const thumbnailDataUrl = thumbnailCanvas.toDataURL('image/jpeg', 0.8);
            
            resolve({
                full: compressedDataUrl,
                thumbnail: thumbnailDataUrl,
                originalSize: file.size,
                compressedSize: new Blob([compressedDataUrl.split(',')[1]], {type: 'image/jpeg'}).size
            });
        };
        
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
}

// Update photo count display
function updatePhotoCount() {
    const preview = document.getElementById('photoPreview');
    const photoCountElement = document.getElementById('photoCount');
    const currentCount = preview.querySelectorAll('.photo-container').length;
    const maxCount = PHOTO_CONFIG.maxPhotosPerLog;
    
    photoCountElement.textContent = `${currentCount} / ${maxCount} photos`;
    
    // Update color based on count
    photoCountElement.className = 'photo-count';
    if (currentCount >= maxCount) {
        photoCountElement.classList.add('error');
    } else if (currentCount >= maxCount * 0.8) {
        photoCountElement.classList.add('warning');
    }
}

// Remove photo function
function removePhoto(button) {
    button.parentElement.remove();
    updatePhotoCount();
}

function handlePhotoUpload(event) {
    const files = event.target.files;
    const preview = document.getElementById('photoPreview');
    const currentPhotoCount = preview.querySelectorAll('.photo-container').length;
    
    // Check photo count limit
    if (currentPhotoCount + files.length > PHOTO_CONFIG.maxPhotosPerLog) {
        showNotification(`Maximum ${PHOTO_CONFIG.maxPhotosPerLog} photos per log. Please remove some photos first.`, 'warning');
        return;
    }
    
    // Check storage quota
    if (!checkStorageQuota()) {
        showNotification('Storage space is limited. Please export and clear old logs first.', 'error');
        return;
    }
    
    let processedCount = 0;
    const totalFiles = files.length;
    
    for (let file of files) {
        if (file.type.startsWith('image/')) {
            // Check file size
            if (file.size > PHOTO_CONFIG.maxFileSize) {
                showNotification(`Photo "${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is ${PHOTO_CONFIG.maxFileSize / 1024 / 1024}MB.`, 'warning');
                continue;
            }
            
            // Show processing indicator
            const processingDiv = document.createElement('div');
            processingDiv.className = 'photo-processing';
            processingDiv.innerHTML = `
                <div class="processing-spinner"></div>
                <span>Processing ${file.name}...</span>
            `;
            preview.appendChild(processingDiv);
            
            // Compress and process image
            compressImage(file).then(result => {
                processingDiv.remove();
                
                const imgContainer = document.createElement('div');
                imgContainer.className = 'photo-container';
                imgContainer.innerHTML = `
                    <img src="${result.thumbnail}" alt="${file.name}" class="photo-thumbnail" data-full="${result.full}">
                    <div class="photo-info">
                        <span class="photo-name">${file.name}</span>
                        <span class="photo-size">${(result.compressedSize / 1024).toFixed(1)}KB</span>
                    </div>
                    <button class="photo-remove" onclick="removePhoto(this)">×</button>
                `;
                
                // Add click to view full size
                const thumbnail = imgContainer.querySelector('.photo-thumbnail');
                thumbnail.onclick = function() {
                    showFullSizePhoto(this.dataset.full, file.name);
                };
                
                preview.appendChild(imgContainer);
                updatePhotoCount();
                processedCount++;
                
                if (processedCount === totalFiles) {
                    showNotification(`Successfully processed ${processedCount} photo${processedCount > 1 ? 's' : ''}`, 'success');
                }
                
            }).catch(error => {
                processingDiv.remove();
                showNotification(`Failed to process ${file.name}: ${error.message}`, 'error');
            });
        } else {
            showNotification(`File "${file.name}" is not a valid image.`, 'warning');
        }
    }
}

// Show full-size photo in modal
function showFullSizePhoto(dataUrl, filename) {
    const modal = document.createElement('div');
    modal.className = 'full-photo-modal';
    modal.innerHTML = `
        <div class="full-photo-content">
            <div class="full-photo-header">
                <h3>${filename}</h3>
                <button onclick="this.closest('.full-photo-modal').remove()">×</button>
            </div>
            <img src="${dataUrl}" alt="${filename}" class="full-photo-image">
        </div>
    `;
    
    modal.onclick = function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    };
    
    document.body.appendChild(modal);
}

function getCurrentPhotos() {
    const preview = document.getElementById('photoPreview');
    const photoContainers = preview.querySelectorAll('.photo-container');
    return Array.from(photoContainers).map((container, index) => {
        const thumbnail = container.querySelector('.photo-thumbnail');
        const nameSpan = container.querySelector('.photo-name');
        const sizeSpan = container.querySelector('.photo-size');
        
        return {
            id: 'photo_' + Date.now() + '_' + index,
            filename: nameSpan ? nameSpan.textContent : `photo_${index}.jpg`,
            thumbnail: thumbnail.src,
            data: thumbnail.dataset.full,
            size: sizeSpan ? parseFloat(sizeSpan.textContent) : 0
        };
    });
}

function getCurrentWeather() {
    const weatherDisplay = document.getElementById('weatherDisplay');
    const weatherText = weatherDisplay.textContent;
    
    if (weatherText.includes('Weather data will be loaded')) {
        return {
            temperature: 70,
            conditions: 'unknown',
            precipitation: 'none',
            windSpeed: 5,
            location: 'Toronto, ON'
        };
    }
    
    // Parse weather data from display (simplified)
    return {
        temperature: 70,
        conditions: 'sunny',
        precipitation: 'none',
        windSpeed: 5,
        location: 'Toronto, ON'
    };
}

function loadWeatherForDate(date) {
    const weatherDisplay = document.getElementById('weatherDisplay');
    weatherDisplay.innerHTML = '<span class="weather-placeholder">Loading weather data...</span>';
    
    // Simulate weather API call
    setTimeout(() => {
        const weather = {
            temperature: Math.floor(Math.random() * 30) + 10,
            conditions: ['sunny', 'cloudy', 'rainy', 'partly cloudy'][Math.floor(Math.random() * 4)],
            precipitation: Math.random() > 0.7 ? 'light' : 'none',
            windSpeed: Math.floor(Math.random() * 15) + 1,
            location: 'Toronto, ON'
        };
        
        renderWeatherDisplay(weather);
    }, 1000);
}

function renderPhotoPreview(photos) {
    const preview = document.getElementById('photoPreview');
    preview.innerHTML = '';
    
    photos.forEach(photo => {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'photo-container';
        
        // Handle both old and new photo formats
        const thumbnailSrc = photo.thumbnail || photo.data || photo;
        const fullSrc = photo.data || photo;
        const filename = photo.filename || 'photo.jpg';
        const size = photo.size || 0;
        
        imgContainer.innerHTML = `
            <img src="${thumbnailSrc}" alt="${filename}" class="photo-thumbnail" data-full="${fullSrc}">
            <div class="photo-info">
                <span class="photo-name">${filename}</span>
                ${size > 0 ? `<span class="photo-size">${size}KB</span>` : ''}
            </div>
            <button class="photo-remove" onclick="removePhoto(this)">×</button>
        `;
        
        // Add click to view full size
        const thumbnail = imgContainer.querySelector('.photo-thumbnail');
        thumbnail.onclick = function() {
            showFullSizePhoto(this.dataset.full, filename);
        };
        
        preview.appendChild(imgContainer);
    });
    
    updatePhotoCount();
}

function renderWeatherDisplay(weather) {
    const weatherDisplay = document.getElementById('weatherDisplay');
    weatherDisplay.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-weight: 600;">${weather.temperature}°C</span>
            <span style="text-transform: capitalize;">${weather.conditions}</span>
            <span style="color: var(--pcfp-text-muted);">${weather.location}</span>
        </div>
    `;
}

function showNotification(message, type = 'info') {
    // Simple notification (can be enhanced later)
    console.log(`${type.toUpperCase()}: ${message}`);
}

// Export logs
function exportLogs() {
    const selectedCheckboxes = document.querySelectorAll('.log-checkbox:checked');
    const logsToExport = selectedCheckboxes.length > 0 ? 
        Array.from(selectedCheckboxes).map(cb => window.dailyLogs.find(log => log.id === cb.dataset.logId)) :
        window.dailyLogs;
    
    const dataStr = JSON.stringify(logsToExport, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `daily-logs-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
}

// ===== UNDO/REDO FUNCTIONS =====

// Save operation to history
function saveToHistory(operation) {
    // Remove any operations after current index (if we're in the middle of history)
    operationHistory = operationHistory.slice(0, currentHistoryIndex + 1);
    
    // Add new operation
    operationHistory.push({
        ...operation,
        timestamp: new Date().toISOString(),
        dataSnapshot: JSON.parse(JSON.stringify(window.dailyLogs)) // Deep copy
    });
    
    currentHistoryIndex = operationHistory.length - 1;
    
    // Limit history to 20 operations
    if (operationHistory.length > 20) {
        operationHistory.shift();
        currentHistoryIndex--;
    }
    
    updateUndoRedoButtons();
}

// Update undo/redo button states
function updateUndoRedoButtons() {
    const btnUndo = document.getElementById('btnUndo');
    const btnRedo = document.getElementById('btnRedo');
    
    btnUndo.disabled = currentHistoryIndex < 0;
    btnRedo.disabled = currentHistoryIndex >= operationHistory.length - 1;
}

// Undo last operation
function undoLastOperation() {
    if (currentHistoryIndex >= 0) {
        const operation = operationHistory[currentHistoryIndex];
        
        // Restore data from previous state
        if (currentHistoryIndex > 0) {
            const previousOperation = operationHistory[currentHistoryIndex - 1];
            window.dailyLogs = JSON.parse(JSON.stringify(previousOperation.dataSnapshot));
        } else {
            // If this is the first operation, restore to empty state
            window.dailyLogs = [];
        }
        
        currentHistoryIndex--;
        updateUndoRedoButtons();
        
        // Re-render and save
        renderCurrentView();
        saveLogs();
        
        // Show notification
        showNotification(`Undone: ${operation.type}`, 'success');
    }
}

// Redo last operation
function redoLastOperation() {
    if (currentHistoryIndex < operationHistory.length - 1) {
        currentHistoryIndex++;
        const operation = operationHistory[currentHistoryIndex];
        
        // Restore data from this operation
        window.dailyLogs = JSON.parse(JSON.stringify(operation.dataSnapshot));
        
        updateUndoRedoButtons();
        
        // Re-render and save
        renderCurrentView();
        saveLogs();
        
        // Show notification
        showNotification(`Redone: ${operation.type}`, 'success');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function deleteSelectedLogs() {
    const selectedCheckboxes = document.querySelectorAll('.log-checkbox:checked');
    const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.dataset.logId);
    
    if (selectedIds.length === 0) {
        showNotification('No logs selected', 'warning');
        return;
    }
    
    const confirmMessage = `Are you sure you want to delete ${selectedIds.length} selected log${selectedIds.length > 1 ? 's' : ''}?`;
    if (confirm(confirmMessage)) {
        // Save to history before operation
        saveToHistory({
            type: `Delete ${selectedIds.length} logs`,
            action: 'delete',
            affectedIds: selectedIds
        });
        
        window.dailyLogs = window.dailyLogs.filter(log => !selectedIds.includes(log.id));
        renderCurrentView();
        saveLogs();
        updateSelectedCount();
        
        showNotification(`Deleted ${selectedIds.length} log${selectedIds.length > 1 ? 's' : ''}`, 'success');
    }
}

function duplicateSelectedLogs() {
    const selectedCheckboxes = document.querySelectorAll('.log-checkbox:checked');
    const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.dataset.logId);
    
    if (selectedIds.length === 0) {
        alert('No logs selected');
        return;
    }
    
    selectedIds.forEach(logId => {
        const log = window.dailyLogs.find(l => l.id === logId);
        if (log) {
            const newLog = {
                ...log,
                id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                date: new Date().toISOString().split('T')[0],
                timestamp: new Date().toISOString()
            };
            window.dailyLogs.push(newLog);
        }
    });
    
    renderCurrentView();
    saveLogs();
    updateSelectedCount();
}

function exportSelectedLogs() {
    const selectedCheckboxes = document.querySelectorAll('.log-checkbox:checked');
    const logsToExport = selectedCheckboxes.length > 0 ? 
        Array.from(selectedCheckboxes).map(cb => window.dailyLogs.find(log => log.id === cb.dataset.logId)) :
        window.dailyLogs;
    
    const dataStr = JSON.stringify(logsToExport, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `daily-logs-selected-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
}

function archiveSelectedLogs() {
    const selectedCheckboxes = document.querySelectorAll('.log-checkbox:checked');
    const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.dataset.logId);
    
    if (selectedIds.length === 0) {
        alert('No logs selected');
        return;
    }
    
    // Mark logs as archived
    selectedIds.forEach(logId => {
        const log = window.dailyLogs.find(l => l.id === logId);
        if (log) {
            log.archived = true;
            log.archivedDate = new Date().toISOString();
        }
    });
    
    renderCurrentView();
    saveLogs();
    updateSelectedCount();
    
    alert(`${selectedIds.length} log${selectedIds.length > 1 ? 's' : ''} archived successfully`);
}

function generateReport() {
    const selectedCheckboxes = document.querySelectorAll('.log-checkbox:checked');
    const logsToReport = selectedCheckboxes.length > 0 ? 
        Array.from(selectedCheckboxes).map(cb => window.dailyLogs.find(log => log.id === cb.dataset.logId)) :
        window.dailyLogs;
    
    if (logsToReport.length === 0) {
        alert('No logs to generate report from');
        return;
    }
    
    // Generate a comprehensive report
    const report = {
        generatedDate: new Date().toISOString(),
        totalLogs: logsToReport.length,
        dateRange: {
            start: logsToReport[0]?.date,
            end: logsToReport[logsToReport.length - 1]?.date
        },
        summary: {
            totalPhotos: logsToReport.reduce((sum, log) => sum + (log.photos?.length || 0), 0),
            averageTemperature: logsToReport.reduce((sum, log) => sum + (log.weather?.temperature || 0), 0) / logsToReport.length,
            uniqueCreators: [...new Set(logsToReport.map(log => log.createdBy))]
        },
        logs: logsToReport.map(log => ({
            date: log.date,
            notes: log.notes,
            photos: log.photos?.length || 0,
            weather: log.weather,
            createdBy: log.createdBy
        }))
    };
    
    const reportStr = JSON.stringify(report, null, 2);
    const reportBlob = new Blob([reportStr], {type: 'application/json'});
    const url = URL.createObjectURL(reportBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `daily-logs-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    alert(`Report generated for ${logsToReport.length} log${logsToReport.length > 1 ? 's' : ''}`);
}

// ===== DATE RANGE MASS ACTIONS =====

function exportDateRange() {
    if (!isDateRangeActive || !dateRangeStart || !dateRangeEnd) {
        showNotification('Please select a date range first', 'warning');
        return;
    }
    
    const logsInRange = window.dailyLogs.filter(log => {
        const logDate = new Date(log.date);
        const startDate = new Date(dateRangeStart);
        const endDate = new Date(dateRangeEnd);
        return logDate >= startDate && logDate <= endDate;
    });
    
    if (logsInRange.length === 0) {
        showNotification('No logs found in selected date range', 'warning');
        return;
    }
    
    const dataStr = JSON.stringify(logsInRange, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `daily-logs-${dateRangeStart}-to-${dateRangeEnd}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    showNotification(`Exported ${logsInRange.length} logs from ${dateRangeStart} to ${dateRangeEnd}`, 'success');
}

function archiveDateRange() {
    if (!isDateRangeActive || !dateRangeStart || !dateRangeEnd) {
        showNotification('Please select a date range first', 'warning');
        return;
    }
    
    const logsInRange = window.dailyLogs.filter(log => {
        const logDate = new Date(log.date);
        const startDate = new Date(dateRangeStart);
        const endDate = new Date(dateRangeEnd);
        return logDate >= startDate && logDate <= endDate;
    });
    
    if (logsInRange.length === 0) {
        showNotification('No logs found in selected date range', 'warning');
        return;
    }
    
    const confirmMessage = `Are you sure you want to archive ${logsInRange.length} logs from ${dateRangeStart} to ${dateRangeEnd}?`;
    if (confirm(confirmMessage)) {
        // Save to history before operation
        saveToHistory({
            type: `Archive ${logsInRange.length} logs (${dateRangeStart} to ${dateRangeEnd})`,
            action: 'archive',
            affectedIds: logsInRange.map(log => log.id)
        });
        
        // Mark logs as archived
        logsInRange.forEach(log => {
            log.archived = true;
            log.archivedDate = new Date().toISOString();
        });
        
        renderCurrentView();
        saveLogs();
        updateSelectedCount();
        
        showNotification(`Archived ${logsInRange.length} logs from ${dateRangeStart} to ${dateRangeEnd}`, 'success');
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initDailyLogs);
