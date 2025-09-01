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
    
    // Set up column resizing
    setupColumnResizing();
    
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
    const taskGridBody = document.getElementById('taskGridBody');
    if (!taskGridBody) return;
    
    taskGridBody.innerHTML = tasks.map(task => `
      <div class="task-grid-row" data-task-id="${task.id}">
        <div class="task-col" data-col="title">
          <div style="display: flex; flex-direction: column; width: 100%;">
            <div class="task-title">${task.title}</div>
            <div class="task-description">${task.description}</div>
          </div>
        </div>
        <div class="task-col" data-col="assignee">${task.assignee}</div>
        <div class="task-col" data-col="startDate">${formatDate(task.startDate)}</div>
        <div class="task-col" data-col="endDate">${formatDate(task.endDate)}</div>
        <div class="task-col" data-col="status">
          <span class="status-badge status-${task.status}">${task.status}</span>
        </div>
        <div class="task-col" data-col="progress">
          <div style="display: flex; flex-direction: column; width: 100%;">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${task.progress}%"></div>
            </div>
            <span class="progress-text">${task.progress}%</span>
          </div>
        </div>
        <div class="task-col" data-col="priority">
          <span style="color: ${getPriorityColor(task.priority)}; font-weight: 600;">${task.priority}</span>
        </div>
        <div class="task-col" data-col="phase">${task.phase}</div>
        <div class="task-col" data-col="actions">
          <button class="btn btn-small" onclick="editTask('${task.id}')">Edit</button>
          <button class="btn btn-small" onclick="deleteTask('${task.id}')">Delete</button>
        </div>
      </div>
    `).join('');
    
    // Force alignment after rendering
    setTimeout(() => {
      alignColumns();
    }, 0);
  }
  
  function getPriorityColor(priority) {
    const priorityColors = {
      'low': '#10b981',
      'medium': '#3b82f6',
      'high': '#f59e0b',
      'critical': '#ef4444'
    };
    return priorityColors[priority] || '#64748b';
  }
  
  function updateTaskSummary() {
    const summaryElement = document.getElementById('taskSummary');
    if (!summaryElement) return;
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
    const pendingTasks = tasks.filter(t => t.status === 'not-started').length;
    const criticalTasks = tasks.filter(t => t.priority === 'critical').length;
    const highPriorityTasks = tasks.filter(t => t.priority === 'high').length;
    
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
        <span class="label">Critical Priority:</span>
        <span class="value">${criticalTasks}</span>
      </div>
      <div class="summary-item">
        <span class="label">High Priority:</span>
        <span class="value">${highPriorityTasks}</span>
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
  
  function alignColumns() {
    // Get all header columns
    const headerColumns = document.querySelectorAll('.task-grid-header .task-col');
    
    headerColumns.forEach(headerCol => {
      const columnType = headerCol.getAttribute('data-col');
      const headerWidth = headerCol.offsetWidth;
      
      // Update all corresponding data columns to match header width
      const dataColumns = document.querySelectorAll(`.task-grid-row .task-col[data-col="${columnType}"]`);
      dataColumns.forEach(col => {
        col.style.flex = `0 0 ${headerWidth}px`;
        col.style.minWidth = `${headerWidth}px`;
      });
    });
  }
  
  function setupColumnResizing() {
    const resizers = document.querySelectorAll('.col-resizer');
    
    resizers.forEach(resizer => {
      resizer.addEventListener('mousedown', function(e) {
        e.preventDefault();
        
        const headerColumn = this.parentElement;
        const columnType = headerColumn.getAttribute('data-col');
        const startX = e.clientX;
        const startWidth = headerColumn.offsetWidth;
        
        function onMouseMove(e) {
          const newWidth = startWidth + (e.clientX - startX);
          if (newWidth > 80) { // Minimum width
            // Update header column
            headerColumn.style.flex = `0 0 ${newWidth}px`;
            headerColumn.style.minWidth = `${newWidth}px`;
            
            // Update all corresponding data columns
            const dataColumns = document.querySelectorAll(`.task-grid-row .task-col[data-col="${columnType}"]`);
            dataColumns.forEach(col => {
              col.style.flex = `0 0 ${newWidth}px`;
              col.style.minWidth = `${newWidth}px`;
            });
            
            // Add visual feedback
            document.body.style.cursor = 'col-resize';
            headerColumn.style.backgroundColor = 'var(--pcfp-gold-light)';
          }
        }
        
        function onMouseUp() {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
          
          // Remove visual feedback
          document.body.style.cursor = '';
          headerColumn.style.backgroundColor = '';
        }
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });
    });
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
