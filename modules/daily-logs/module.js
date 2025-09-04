/* modules/daily-logs/module.js - Daily Logs Module v1.0 */
/* PCFP Core Integration - Professional Construction Software Quality */

// Sample data for testing
const sampleLogs = [
    {
        id: 'log_20250101_001',
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

// Initialize module
function initDailyLogs() {
    loadLogs();
    setupEventListeners();
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
    document.getElementById('btnAddLog').addEventListener('click', addNewLog);

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
    });
}

// Switch between list and card views
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

    window.dailyLogs.forEach(log => {
        const row = document.createElement('div');
        row.className = 'grid-row';
        row.setAttribute('data-log-id', log.id);

        row.innerHTML = `
            <div class="grid-cell checkbox-cell">
                <input type="checkbox" class="log-checkbox" data-log-id="${log.id}">
            </div>
            <div class="grid-cell">
                <strong>${formatDate(log.date)}</strong>
            </div>
            <div class="grid-cell" title="${log.notes}">
                ${truncateText(log.notes, 50)}
            </div>
            <div class="grid-cell">
                ${renderPhotos(log.photos)}
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

    window.dailyLogs.forEach(log => {
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
        html += `
            <div class="photo-item">
                <img src="${photo.data}" alt="Photo" title="${photo.filename}">
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
    console.log('Edit log:', logId);
    alert(`Edit log: ${logId}`);
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
    // Could add a selected count display element
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
    const newLog = {
        id: 'log_' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        notes: 'New daily log entry...',
        photos: [],
        weather: {
            temperature: 70,
            conditions: 'sunny',
            precipitation: 'none',
            windSpeed: 5,
            location: 'Toronto, ON'
        },
        createdBy: 'Current User',
        timestamp: new Date().toISOString()
    };
    
    window.dailyLogs.unshift(newLog);
    renderCurrentView();
    saveLogs();
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

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initDailyLogs);
