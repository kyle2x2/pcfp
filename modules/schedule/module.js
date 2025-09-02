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
    
    // Load data
    loadScheduleData();
    
    // Set up UI
    populateTaskList();
    updateTaskSummary();
    
    // Set up event listeners
    setupEventListeners();
    
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
      <div class="grid-row" data-task-id="${task.id}">
        <div class="grid-cell" data-col="title">
          <div style="display: flex; flex-direction: column; width: 100%;">
            <div class="task-title" data-full-text="${task.title}" title="${task.title}">${task.title}</div>
            <div class="task-description" data-full-text="${task.description}" title="${task.description}">${task.description}</div>
          </div>
        </div>
        <div class="grid-cell" data-col="assignee">${task.assignee}</div>
        <div class="grid-cell" data-col="startDate">${formatDate(task.startDate)}</div>
        <div class="grid-cell" data-col="endDate">${formatDate(task.endDate)}</div>
        <div class="grid-cell" data-col="status">
          <span class="status-badge status-${task.status}">${task.status}</span>
        </div>
        <div class="grid-cell" data-col="progress">
          <div style="display: flex; flex-direction: column; width: 100%;">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${task.progress}%"></div>
            </div>
            <span class="progress-text">${task.progress}%</span>
          </div>
        </div>
        <div class="grid-cell" data-col="priority">
          <span style="color: ${getPriorityColor(task.priority)}; font-weight: 600;">${task.priority}</span>
        </div>
        <div class="grid-cell" data-col="phase">${task.phase}</div>
        <div class="grid-cell" data-col="actions">
          <button class="action-menu-btn" onclick="toggleActionMenu('${task.id}')">
            <span class="three-dots">⋯</span>
          </button>
        </div>
      </div>
    `).join('');
    
    // Auto-size columns based on content
    setTimeout(() => {
      autoSizeColumns();
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
    
    // Close action menus when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.action-menu-btn') && !e.target.closest('.action-menu')) {
        closeAllActionMenus();
      }
    });
    
    // Close action menus on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllActionMenus();
      }
    });
    
    // Progress slider functionality
    const progressSlider = document.getElementById('taskProgress');
    const progressValue = document.querySelector('.progress-value');
    
    if (progressSlider && progressValue) {
      progressSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        progressValue.textContent = `${value}%`;
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
  }
  
  function switchTimeScale(scale) {
    currentTimeScale = scale;
    
    // Update active states
    document.querySelectorAll('[data-scale]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.scale === scale);
    });
  }
  
  function showAddTaskModal(startDate = '', endDate = '') {
    const newTask = {
      ...defaultTask,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || (() => {
        const defaultEndDate = new Date();
        defaultEndDate.setDate(defaultEndDate.getDate() + 7);
        return defaultEndDate.toISOString().split('T')[0];
      })()
    };
    
    openTaskModal(newTask, 'add', null);
  }
  
  function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // Open modal with task data for editing
    openTaskModal(task, 'edit', null);
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
    window.currentModalAction = null;
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
  
  function autoSizeColumns() {
    // Calculate optimal widths for content-based columns
    const columnWidths = calculateColumnWidths();
    
    // Update grid template with calculated widths
    const grid = document.querySelector('.data-grid');
    const columns = [
      300, // Task (resizable, keep default)
      columnWidths.assignee,
      120, // Start Date (fixed)
      120, // End Date (fixed)
      columnWidths.status,
      100, // Progress (fixed)
      120, // Priority (fixed - wider for full text)
      columnWidths.phase,
      140  // Actions (fixed - wider for buttons)
    ];
    
    grid.style.gridTemplateColumns = columns.map(w => `${w}px`).join(' ');
  }
  
  function calculateColumnWidths() {
    // Calculate widths based on content
    const assigneeWidth = Math.max(120, getLongestStringWidth(tasks.map(t => t.assignee)));
    const statusWidth = Math.max(80, getLongestStatusWidth());
    const priorityWidth = Math.max(80, getLongestPriorityWidth());
    const phaseWidth = Math.max(80, getLongestPhaseWidth());
    
    return {
      assignee: assigneeWidth,
      status: statusWidth,
      priority: priorityWidth,
      phase: phaseWidth
    };
  }
  
  function getLongestStringWidth(strings) {
    // Create temporary element to measure text width
    const temp = document.createElement('span');
    temp.style.visibility = 'hidden';
    temp.style.position = 'absolute';
    temp.style.whiteSpace = 'nowrap';
    temp.style.fontSize = '14px';
    temp.style.fontFamily = 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial';
    document.body.appendChild(temp);
    
    let maxWidth = 0;
    strings.forEach(str => {
      temp.textContent = str;
      maxWidth = Math.max(maxWidth, temp.offsetWidth);
    });
    
    document.body.removeChild(temp);
    return maxWidth + 20; // Add padding
  }
  
  function getLongestStatusWidth() {
    const statuses = ['not-started', 'in-progress', 'completed'];
    return getLongestStringWidth(statuses) + 20; // Add badge padding
  }
  
  function getLongestPriorityWidth() {
    const priorities = ['low', 'medium', 'high', 'critical'];
    return getLongestStringWidth(priorities);
  }
  
  function getLongestPhaseWidth() {
    const phases = ['Pre-Construction', 'Foundation', 'Framing', 'Mechanical', 'Electrical', 'Plumbing', 'Interior', 'Exterior', 'Finishing', 'Punch List'];
    return getLongestStringWidth(phases);
  }
  
  // Global functions for task actions
  window.editTask = editTask;
  window.deleteTask = deleteTask;
  window.toggleActionMenu = toggleActionMenu;
  window.insertTaskAbove = insertTaskAbove;
  window.insertTaskBelow = insertTaskBelow;
  window.duplicateTask = duplicateTask;
  
  // Action Menu Functions - Replicated from working payment planner approach
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
  
  function toggleActionMenu(taskId) {
    
    // Close any existing menu
    closeMenu();
    
    // Find the button that was clicked
    const button = document.querySelector(`button[onclick*="toggleActionMenu('${taskId}')"]`);
    if (!button) {
      return;
    }
    
    // Get button position
    const rect = button.getBoundingClientRect();
    
    // Create menu dynamically (like payment planner)
    const menu = document.createElement('div');
    menu.className = 'pcfp-menu';
    menu.innerHTML = [
      `<button type="button" onclick="editTask('${taskId}');">✏️ Edit</button>`,
      `<button type="button" onclick="deleteTask('${taskId}');">🗑️ Delete</button>`,
      `<button type="button" onclick="insertTaskAbove('${taskId}');">⬆️ Insert Above</button>`,
      `<button type="button" onclick="insertTaskBelow('${taskId}');">⬇️ Insert Below</button>`,
      `<button type="button" onclick="duplicateTask('${taskId}');">📋 Duplicate</button>`
    ].join('');
    
    // Append to document body (like payment planner)
    document.body.appendChild(menu);
    menuEl = menu;
    
    // Position menu (like payment planner)
    menu.style.top = (rect.bottom + window.scrollY + 6) + 'px';
    menu.style.left = Math.max(12, rect.right + window.scrollX - 180) + 'px';
    
    // Add click outside listener (like payment planner)
    setTimeout(() => document.addEventListener('click', onDoc));
  }
  
  function closeAllActionMenus() {
    closeMenu();
  }
  
  function positionMenu(menu, taskId) {
    // Find the button that triggered this menu
    const button = menu.previousElementSibling;
    if (!button) {
      return;
    }
    
    const buttonRect = button.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Check if there's enough space below
    const spaceBelow = viewportHeight - buttonRect.bottom;
    const menuHeight = 200; // Approximate menu height
    
    if (spaceBelow < menuHeight && buttonRect.top > menuHeight) {
      // Position above
      menu.classList.add('menu-above');
    } else {
      // Position below (default)
      menu.classList.remove('menu-above');
    }
  }
  
  // New Action Functions
  function insertTaskAbove(taskId) {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === 0) {
      showInsertError('Cannot insert above the first task');
      return;
    }
    
    const currentTask = tasks[taskIndex];
    const newTask = createTaskFromTemplate(currentTask, 'above');
    
    // Open modal with new task data
    openTaskModal(newTask, 'insert-above', taskIndex);
  }
  
  function insertTaskBelow(taskId) {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === tasks.length - 1) {
      showInsertError('Cannot insert below the last task');
      return;
    }
    
    const currentTask = tasks[taskIndex];
    const newTask = createTaskFromTemplate(currentTask, 'below');
    
    // Open modal with new task data
    openTaskModal(newTask, 'insert-below', taskIndex);
  }
  
  function duplicateTask(taskId) {
    const currentTask = tasks.find(t => t.id === taskId);
    if (!currentTask) return;
    
    const newTask = createTaskFromTemplate(currentTask, 'duplicate');
    
    // Open modal with duplicated task data
    openTaskModal(newTask, 'duplicate', null);
  }
  
  function createTaskFromTemplate(sourceTask, type) {
    const newTask = {
      ...sourceTask,
      id: generateTaskId(),
      title: type === 'duplicate' ? `${sourceTask.title} (Copy)` : sourceTask.title,
      status: 'not-started',
      progress: 0
    };
    
    return newTask;
  }
  
  function openTaskModal(taskData, action, taskIndex) {
    // Store action context for when modal is saved
    window.currentModalAction = { action, taskIndex, taskData };
    
    // Populate modal with task data
    document.getElementById('taskTitle').value = taskData.title;
    document.getElementById('taskDescription').value = taskData.description;
    document.getElementById('taskAssignee').value = taskData.assignee;
    document.getElementById('taskStartDate').value = taskData.startDate;
    document.getElementById('taskEndDate').value = taskData.endDate;
    document.getElementById('taskStatus').value = taskData.status;
    document.getElementById('taskPriority').value = taskData.priority;
    
    // Set progress slider and value
    const progressSlider = document.getElementById('taskProgress');
    const progressValue = document.querySelector('.progress-value');
    if (progressSlider && progressValue) {
      progressSlider.value = taskData.progress || 0;
      progressValue.textContent = `${taskData.progress || 0}%`;
    }
    
    // Update modal title
    const modalTitle = document.getElementById('modalTitle');
    if (action === 'insert-above') {
      modalTitle.textContent = 'Insert Task Above';
    } else if (action === 'insert-below') {
      modalTitle.textContent = 'Insert Task Below';
    } else if (action === 'duplicate') {
      modalTitle.textContent = 'Duplicate Task';
    } else if (action === 'edit') {
      modalTitle.textContent = 'Edit Task';
    } else {
      modalTitle.textContent = 'Add New Task';
    }
    
    // Show modal
    document.getElementById('taskModal').style.display = 'block';
    
    // Close action menu
    closeAllActionMenus();
  }
  
  function showInsertError(message) {
    alert(message);
    closeAllActionMenus();
  }
  
  function generateTaskId() {
    return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  // Override saveTaskFromModal to handle new actions
  function saveTaskFromModal() {
    const taskData = {
      id: window.currentModalAction?.taskData?.id || generateTaskId(),
      title: document.getElementById('taskTitle').value,
      description: document.getElementById('taskDescription').value,
      assignee: document.getElementById('taskAssignee').value,
      startDate: document.getElementById('taskStartDate').value,
      endDate: document.getElementById('taskEndDate').value,
      status: document.getElementById('taskStatus').value,
      priority: document.getElementById('taskPriority').value,
      progress: parseInt(document.getElementById('taskProgress').value) || 0,
      phase: window.currentModalAction?.taskData?.phase || 'Pre-Construction',
      color: window.currentModalAction?.taskData?.color || '#C6A247',
      reminder: window.currentModalAction?.taskData?.reminder || 'none',
      predecessors: window.currentModalAction?.taskData?.predecessors || [],
      tags: window.currentModalAction?.taskData?.tags || [],
      notes: window.currentModalAction?.taskData?.notes || '',
      files: window.currentModalAction?.taskData?.files || []
    };
    
    const action = window.currentModalAction?.action;
    const taskIndex = window.currentModalAction?.taskIndex;
    
    if (action === 'insert-above' && taskIndex !== null) {
      // Insert above current task
      tasks.splice(taskIndex, 0, taskData);
    } else if (action === 'insert-below' && taskIndex !== null) {
      // Insert below current task
      tasks.splice(taskIndex + 1, 0, taskData);
    } else if (action === 'duplicate') {
      // Add to end of list
      tasks.push(taskData);
    } else {
      // Regular add/edit
      const existingIndex = tasks.findIndex(t => t.id === taskData.id);
      if (existingIndex >= 0) {
        tasks[existingIndex] = taskData;
      } else {
        tasks.push(taskData);
      }
    }
    
    // Save to localStorage
    localStorage.setItem('pcfp_schedule_tasks', JSON.stringify(tasks));
    
    // Close modal
    document.getElementById('taskModal').style.display = 'none';
    
    // Clear action context
    window.currentModalAction = null;
    
    // Refresh the display
    populateTaskList();
    updateTaskSummary();
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Global functions for task actions - Expose after all functions are defined
  window.editTask = editTask;
  window.deleteTask = deleteTask;
  window.toggleActionMenu = toggleActionMenu;
  window.insertTaskAbove = insertTaskAbove;
  window.insertTaskBelow = insertTaskBelow;
  window.duplicateTask = duplicateTask;
})();
