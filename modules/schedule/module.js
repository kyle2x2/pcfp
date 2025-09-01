// modules/schedule/module.js - Schedule Module v1.2 (Simplified for iframe compatibility)
// Construction project scheduling and timeline management

(function() {
  let currentView = 'list';
  let currentTimeScale = 'month';
  let tasks = [];
  let editingTaskId = null;
  
  // Enhanced task data model for v1.2
  const defaultTask = {
    id: '',
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'not-started',
    priority: 'medium',
    assignee: '',
    progress: 0,
    budget: 0,
    actualCost: 0,
    phase: 'Pre-Construction',
    color: '#C6A247',
    reminder: 'none',
    predecessors: [],
    tags: [],
    notes: '',
    files: []
  };
  
  // Initialize when DOM is ready
  function init() {
    console.log('[PCFP] Schedule module v1.2 initializing...');
    
    // Load data
    loadScheduleData();
    
    // Set up UI
    populateTaskList();
    updateTaskSummary();
    
    // Set up event listeners
    setupEventListeners();
    
    console.log('[PCFP] Schedule module v1.2 ready');
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
          actualCost: 4800,
          phase: 'Pre-Construction',
          color: '#C6A247',
          reminder: 'none',
          predecessors: [],
          tags: ['site-work'],
          notes: 'Site cleared and leveled successfully',
          files: []
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
          actualCost: 12000,
          phase: 'Foundation',
          color: '#C6A247',
          reminder: '1day',
          predecessors: ['task_001'],
          tags: ['concrete', 'foundation'],
          notes: 'Rebar installation complete, ready for concrete pour',
          files: []
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
          actualCost: 0,
          phase: 'Framing',
          color: '#C6A247',
          reminder: '1week',
          predecessors: ['task_002'],
          tags: ['framing', 'structural'],
          notes: 'Materials ordered and delivered',
          files: []
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
    const criticalTasks = tasks.filter(t => t.priority === 'critical').length;
    
    const totalBudget = tasks.reduce((sum, t) => sum + (t.budget || 0), 0);
    const totalActual = tasks.reduce((sum, t) => sum + (t.actualCost || 0), 0);
    
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
      <div class="summary-item">
        <span class="label">Critical:</span>
        <span class="value">${criticalTasks}</span>
      </div>
      <div class="summary-item">
        <span class="label">Total Budget:</span>
        <span class="value">$${totalBudget.toLocaleString()}</span>
      </div>
      <div class="summary-item">
        <span class="label">Actual Cost:</span>
        <span class="value">$${totalActual.toLocaleString()}</span>
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
    document.getElementById('btnAddTask')?.addEventListener('click', () => showAddTaskModal());
    
    // Save button
    document.getElementById('btnSave')?.addEventListener('click', saveScheduleData);
    
    // Export button
    document.getElementById('btnExport')?.addEventListener('click', exportScheduleData);
    
    // Modal event listeners
    setupModalEventListeners();
  }
  
  function setupModalEventListeners() {
    const modal = document.getElementById('taskModal');
    const closeBtn = modal.querySelector('.close');
    const cancelBtn = document.getElementById('btnCancel');
    const saveBtn = document.getElementById('btnSaveTask');
    
    closeBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);
    saveBtn?.addEventListener('click', saveTaskFromModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
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
  
  function showAddTaskModal(startDate = '', endDate = '') {
    editingTaskId = null;
    const modal = document.getElementById('taskModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('taskForm');
    
    modalTitle.textContent = 'Add New Task';
    form.reset();
    
    // Set default dates if provided
    if (startDate) {
      document.getElementById('taskStartDate').value = startDate;
    } else {
      document.getElementById('taskStartDate').value = new Date().toISOString().split('T')[0];
    }
    
    if (endDate) {
      document.getElementById('taskEndDate').value = endDate;
    } else {
      const defaultEndDate = new Date();
      defaultEndDate.setDate(defaultEndDate.getDate() + 7);
      document.getElementById('taskEndDate').value = defaultEndDate.toISOString().split('T')[0];
    }
    
    modal.style.display = 'block';
  }
  
  function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    editingTaskId = taskId;
    const modal = document.getElementById('taskModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('taskForm');
    
    modalTitle.textContent = 'Edit Task';
    
    // Populate form with task data
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description;
    document.getElementById('taskAssignee').value = task.assignee;
    document.getElementById('taskStartDate').value = task.startDate;
    document.getElementById('taskEndDate').value = task.endDate;
    document.getElementById('taskStatus').value = task.status;
    document.getElementById('taskPriority').value = task.priority;
    document.getElementById('taskProgress').value = task.progress;
    document.getElementById('taskBudget').value = task.budget;
    document.getElementById('taskPhase').value = task.phase;
    
    modal.style.display = 'block';
  }
  
  function saveTaskFromModal() {
    const form = document.getElementById('taskForm');
    const formData = new FormData(form);
    
    const taskData = {
      title: formData.get('title'),
      description: formData.get('description'),
      assignee: formData.get('assignee'),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
      status: formData.get('status'),
      priority: formData.get('priority'),
      progress: parseInt(formData.get('progress')) || 0,
      budget: parseFloat(formData.get('budget')) || 0,
      phase: formData.get('phase')
    };
    
    if (editingTaskId) {
      // Update existing task
      const taskIndex = tasks.findIndex(t => t.id === editingTaskId);
      if (taskIndex !== -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...taskData };
      }
    } else {
      // Create new task
      const newTask = {
        ...defaultTask,
        ...taskData,
        id: `task_${Date.now()}`,
        actualCost: 0,
        color: '#C6A247',
        reminder: 'none',
        predecessors: [],
        tags: [],
        notes: '',
        files: []
      };
      tasks.push(newTask);
    }
    
    closeModal();
    populateTaskList();
    updateTaskSummary();
    saveScheduleData();
    showNotification('Task saved successfully', 'success');
  }
  
  function closeModal() {
    const modal = document.getElementById('taskModal');
    modal.style.display = 'none';
    editingTaskId = null;
  }
  
  function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
      tasks = tasks.filter(t => t.id !== taskId);
      populateTaskList();
      updateTaskSummary();
      saveScheduleData();
      showNotification('Task deleted successfully', 'success');
    }
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
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }
  
  // Global functions for task actions
  window.editTask = editTask;
  window.deleteTask = deleteTask;
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  console.log('[PCFP] Schedule module.js v1.2 loaded successfully');
})();
