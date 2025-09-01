// modules/schedule/module.js - Schedule Module v1.1 (Simplified)
// Construction project scheduling and timeline management

(function() {
  let currentView = 'list';
  let currentTimeScale = 'month';
  let tasks = [];
  
  // Initialize when DOM is ready
  function init() {
    console.log('[PCFP] Schedule module v1.1 initializing...');
    
    // Load data
    loadScheduleData();
    
    // Set up UI
    populateTaskList();
    updateTaskSummary();
    
    // Set up event listeners
    setupEventListeners();
    
    console.log('[PCFP] Schedule module v1.1 ready');
  }
  
  function loadScheduleData() {
    const savedTasks = localStorage.getItem('pcfp_schedule_tasks');
    if (savedTasks) {
      tasks = JSON.parse(savedTasks);
    } else {
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
    
    // Add task button
    document.getElementById('btnAddTask')?.addEventListener('click', showAddTaskModal);
    
    // Save button
    document.getElementById('btnSave')?.addEventListener('click', saveScheduleData);
    
    // Export button
    document.getElementById('btnExport')?.addEventListener('click', exportScheduleData);
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
  }
  
  function switchTimeScale(scale) {
    currentTimeScale = scale;
    
    // Update active states
    document.querySelectorAll('[data-scale]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.scale === scale);
    });
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
      populateTaskList();
      saveScheduleData();
    }
  };
  
  window.deleteTask = function(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
      tasks = tasks.filter(t => t.id !== taskId);
      populateTaskList();
      updateTaskSummary();
      saveScheduleData();
    }
  };
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  console.log('[PCFP] Schedule module.js loaded successfully');
})();
