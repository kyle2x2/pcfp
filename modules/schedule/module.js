// modules/schedule/module.js - Schedule Module v1.1
// Construction project scheduling and timeline management

(function() {
  // Module state
  let scheduleState;
  let moduleLifecycle;
  let currentView = 'list';
  let currentTimeScale = 'month';
  let tasks = [];
  
  // Initialize module
  window.initscheduleModule = function(services) {
    console.log('[PCFP] initscheduleModule called with services:', services);
    
    const { 
      moduleLifecycle: lifecycle, 
      moduleState: state, 
      domCache, 
      sanitizeHTML, 
      safeSetInnerHTML 
    } = services;
    
    moduleLifecycle = lifecycle;
    scheduleState = state;
    
    // Initialize module
    initializeScheduleModule();
  };
  
  function initializeScheduleModule() {
    console.log('[PCFP] Initializing Schedule module v1.1');
    
    // Load initial data
    loadScheduleData();
    
    // Set up UI
    setupScheduleUI();
    
    // Set up event listeners
    setupEventListeners();
    
    // Register with module manager
    registerModule();
    
    console.log('[PCFP] Schedule module v1.1 ready');
  }
  
  function loadScheduleData() {
    // Load tasks from localStorage
    const savedTasks = localStorage.getItem('pcfp_schedule_tasks');
    if (savedTasks) {
      tasks = JSON.parse(savedTasks);
    } else {
      // Default construction tasks
      tasks = [
        {
          id: 'task_001',
          title: 'Site Preparation',
          description: 'Clear site and prepare for construction',
          startDate: '2024-01-15',
          endDate: '2024-01-20',
          status: 'completed',
          priority: 'high',
          assignee: 'John Smith',
          progress: 100,
          budget: 5000,
          actualCost: 4800
        },
        {
          id: 'task_002',
          title: 'Foundation Work',
          description: 'Pour concrete foundation',
          startDate: '2024-01-21',
          endDate: '2024-01-30',
          status: 'in-progress',
          priority: 'critical',
          assignee: 'Mike Johnson',
          progress: 60,
          budget: 15000,
          actualCost: 12000
        },
        {
          id: 'task_003',
          title: 'Framing',
          description: 'Install structural framing',
          startDate: '2024-02-01',
          endDate: '2024-02-15',
          status: 'not-started',
          priority: 'high',
          assignee: 'Tom Wilson',
          progress: 0,
          budget: 25000,
          actualCost: 0
        }
      ];
    }
    
    // Update state if available
    if (scheduleState && scheduleState.setState) {
      scheduleState.setState('tasks', tasks);
    }
  }
  
  function setupScheduleUI() {
    console.log('[PCFP] Setting up Schedule UI...');
    // Create main UI structure
    const container = document.querySelector('.module-content');
    console.log('[PCFP] Found container:', container);
    if (container) {
      // Replace the placeholder content with our schedule UI
      console.log('[PCFP] Replacing content...');
      container.innerHTML = `
        <div class="schedule-container">
          <div class="schedule-header">
            <div class="view-selector">
              <button class="btn ${currentView === 'list' ? 'active' : ''}" data-view="list">List</button>
              <button class="btn ${currentView === 'calendar' ? 'active' : ''}" data-view="calendar">Calendar</button>
              <button class="btn ${currentView === 'kanban' ? 'active' : ''}" data-view="kanban">Kanban</button>
              <button class="btn ${currentView === 'gantt' ? 'active' : ''}" data-view="gantt">Gantt</button>
            </div>
            <div class="time-scale-selector">
              <button class="btn ${currentTimeScale === 'day' ? 'active' : ''}" data-scale="day">Day</button>
              <button class="btn ${currentTimeScale === 'week' ? 'active' : ''}" data-scale="week">Week</button>
              <button class="btn ${currentTimeScale === 'month' ? 'active' : ''}" data-scale="month">Month</button>
              <button class="btn ${currentTimeScale === 'quarter' ? 'active' : ''}" data-scale="quarter">Quarter</button>
              <button class="btn ${currentTimeScale === 'year' ? 'active' : ''}" data-scale="year">Year</button>
            </div>
            <div class="schedule-actions">
              <button class="btn btn-primary" id="btnAddTask">+ Add Task</button>
              <button class="btn" id="btnSave">Save</button>
              <button class="btn" id="btnExport">Export</button>
            </div>
          </div>
          
          <div class="schedule-content">
            <div id="listView" class="view-content ${currentView === 'list' ? 'active' : ''}">
              <div class="task-list">
                <div class="task-list-header">
                  <div class="task-col">Task</div>
                  <div class="task-col">Assignee</div>
                  <div class="task-col">Start Date</div>
                  <div class="task-col">End Date</div>
                  <div class="task-col">Status</div>
                  <div class="task-col">Progress</div>
                  <div class="task-col">Actions</div>
                </div>
                <div class="task-list-body" id="taskListBody">
                  <!-- Tasks will be populated here -->
                </div>
              </div>
            </div>
            
            <div id="calendarView" class="view-content ${currentView === 'calendar' ? 'active' : ''}">
              <div class="calendar-placeholder">
                <h3>Calendar View</h3>
                <p>FullCalendar.js integration coming in v1.2</p>
              </div>
            </div>
            
            <div id="kanbanView" class="view-content ${currentView === 'kanban' ? 'active' : ''}">
              <div class="kanban-placeholder">
                <h3>Kanban View</h3>
                <p>SortableJS integration coming in v1.2</p>
              </div>
            </div>
            
            <div id="ganttView" class="view-content ${currentView === 'gantt' ? 'active' : ''}">
              <div class="gantt-placeholder">
                <h3>Gantt View</h3>
                <p>Frappe Gantt integration coming in v1.3</p>
              </div>
            </div>
          </div>
          
          <div class="schedule-sidebar">
            <div class="task-summary">
              <h3>Task Summary</h3>
              <div id="taskSummary">
                <!-- Summary will be populated here -->
              </div>
            </div>
          </div>
        </div>
      `;
    }
    
    // Populate task list
    populateTaskList();
    updateTaskSummary();
  }
  
  function setupEventListeners() {
    // View selector
    document.querySelectorAll('[data-view]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = e.target.dataset.view;
        switchView(view);
      });
    });
    
    // Time scale selector
    document.querySelectorAll('[data-scale]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const scale = e.target.dataset.scale;
        switchTimeScale(scale);
      });
    });
    
    // Action buttons
    document.getElementById('btnAddTask')?.addEventListener('click', showAddTaskModal);
    document.getElementById('btnSave')?.addEventListener('click', saveScheduleData);
    document.getElementById('btnExport')?.addEventListener('click', exportScheduleData);
  }
  
  function registerModule() {
    if (window.PCFP && window.PCFP.moduleManager) {
      window.PCFP.moduleManager.register('schedule', {
        name: 'Schedule',
        version: 'v1.1',
        description: 'Project scheduling and timeline management',
        icon: '📅',
        views: ['list', 'calendar', 'kanban', 'gantt'],
        timeScales: ['day', 'week', 'month', 'quarter', 'year'],
        onInitialize: async (params) => {
          console.log('[PCFP] Module manager calling onInitialize...');
          // Call our custom initialization function
          if (window.initscheduleModule) {
            window.initscheduleModule({
              moduleLifecycle: null, // Will be created by the module manager
              moduleState: null,     // Will be created by the module manager
              domCache: window.PCFP?.domCache,
              sanitizeHTML: window.PCFP?.sanitizeHTML,
              safeSetInnerHTML: window.PCFP?.safeSetInnerHTML
            });
          }
        }
      });
    }
  }
  
  function switchView(view) {
    currentView = view;
    
    // Update active states
    document.querySelectorAll('[data-view]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === view);
    });
    
    // Show/hide view content
    document.querySelectorAll('.view-content').forEach(content => {
      content.classList.toggle('active', content.id === view + 'View');
    });
    
    // Update state
    scheduleState.setState('currentView', view);
  }
  
  function switchTimeScale(scale) {
    currentTimeScale = scale;
    
    // Update active states
    document.querySelectorAll('[data-scale]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.scale === scale);
    });
    
    // Update state
    scheduleState.setState('currentTimeScale', scale);
  }
  
  function populateTaskList() {
    const taskListBody = document.getElementById('taskListBody');
    if (!taskListBody) return;
    
    taskListBody.innerHTML = tasks.map(task => `
      <div class="task-row" data-task-id="${task.id}">
        <div class="task-col">
          <div class="task-title">${task.title}</div>
          <div class="task-description">${task.description}</div>
        </div>
        <div class="task-col">${task.assignee}</div>
        <div class="task-col">${formatDate(task.startDate)}</div>
        <div class="task-col">${formatDate(task.endDate)}</div>
        <div class="task-col">
          <span class="status-badge status-${task.status}">${task.status}</span>
        </div>
        <div class="task-col">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${task.progress}%"></div>
          </div>
          <span class="progress-text">${task.progress}%</span>
        </div>
        <div class="task-col">
          <button class="btn btn-small" onclick="editTask('${task.id}')">Edit</button>
          <button class="btn btn-small" onclick="deleteTask('${task.id}')">Delete</button>
        </div>
      </div>
    `).join('');
  }
  
  function updateTaskSummary() {
    const summaryElement = document.getElementById('taskSummary');
    if (!summaryElement) return;
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
    const pendingTasks = tasks.filter(t => t.status === 'not-started').length;
    
    summaryElement.innerHTML = `
      <div class="summary-item">
        <span class="label">Total Tasks:</span>
        <span class="value">${totalTasks}</span>
      </div>
      <div class="summary-item">
        <span class="label">Completed:</span>
        <span class="value">${completedTasks}</span>
      </div>
      <div class="summary-item">
        <span class="label">In Progress:</span>
        <span class="value">${inProgressTasks}</span>
      </div>
      <div class="summary-item">
        <span class="label">Pending:</span>
        <span class="value">${pendingTasks}</span>
      </div>
    `;
  }
  
  function showAddTaskModal() {
    const taskName = prompt('Enter task name:');
    if (!taskName) return;
    
    const newTask = {
      id: `task_${Date.now()}`,
      title: taskName,
      description: 'New task description',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'not-started',
      priority: 'medium',
      assignee: 'Unassigned',
      progress: 0,
      budget: 0,
      actualCost: 0
    };
    
    tasks.push(newTask);
    scheduleState.setState('tasks', tasks);
    
    populateTaskList();
    updateTaskSummary();
    saveScheduleData();
  }
  
  function saveScheduleData() {
    localStorage.setItem('pcfp_schedule_tasks', JSON.stringify(tasks));
    showNotification('Schedule saved successfully', 'success');
  }
  
  function exportScheduleData() {
    const csv = convertToCSV(tasks);
    downloadCSV(csv, 'schedule_export.csv');
    showNotification('Schedule exported successfully', 'success');
  }
  
  function convertToCSV(data) {
    if (!data || !data.length) return '';
    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','));
    return [headers.join(','), ...rows].join('\n');
  }
  
  function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
  
  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
  }
  
  function showNotification(message, type = 'info') {
    // Simple notification for now
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 10px 20px;
      background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
      color: white;
      border-radius: 4px;
      z-index: 1000;
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }
  
  // Global functions for task actions
  window.editTask = function(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const newTitle = prompt('Edit task title:', task.title);
    if (newTitle) {
      task.title = newTitle;
      scheduleState.setState('tasks', tasks);
      populateTaskList();
      saveScheduleData();
    }
  };
  
  window.deleteTask = function(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
      tasks = tasks.filter(t => t.id !== taskId);
      scheduleState.setState('tasks', tasks);
      populateTaskList();
      updateTaskSummary();
      saveScheduleData();
    }
  };
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('[PCFP] DOM loaded, initializing schedule module...');
      initializeScheduleModule();
    });
  } else {
    console.log('[PCFP] DOM already ready, initializing schedule module...');
    initializeScheduleModule();
  }
  
  // Test that module.js is loaded
  console.log('[PCFP] Schedule module.js loaded successfully');
})();
