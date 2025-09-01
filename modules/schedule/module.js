// modules/schedule/module.js - Schedule Module using Core Gantt Component
// Demonstrates how modules use core components instead of building their own

import { GanttChart } from '../../core/components/gantt/index.js';
import { safe, safeAsync } from '../../core/services/errors.js';

(function() {
  let ganttChart;
  let scheduleData = [];
  
  // Register module with PCFP
  if (window.PCFP && window.PCFP.moduleManager) {
    window.PCFP.moduleManager.register('schedule', {
      name: 'Schedule',
      version: 'v1.0',
      description: 'Project scheduling and timeline management',
      icon: '📅',
      onInitialize: async (params) => {
        await initializeScheduleModule(params);
      }
    });
  }
  
  async function initializeScheduleModule(params) {
    safe(async () => {
      console.log('[PCFP] Initializing Schedule module...');
      
      // Load schedule data
      await loadScheduleData();
      
      // Initialize core Gantt component
      initializeGanttChart();
      
      // Set up event listeners
      setupScheduleEventListeners();
      
      // Initialize UI
      initializeScheduleUI();
      
      console.log('[PCFP] Schedule module ready');
    }, 'schedule:initialize');
  }
  
  async function loadScheduleData() {
    // Load schedule data from API or localStorage
    const savedData = localStorage.getItem('pcfp_schedule_data');
    if (savedData) {
      scheduleData = JSON.parse(savedData);
    } else {
      // Default schedule data
      scheduleData = [
        {
          id: 'task-1',
          name: 'Site Preparation',
          startDate: '2024-01-15',
          duration: 5,
          progress: 100,
          status: 'completed'
        },
        {
          id: 'task-2',
          name: 'Foundation Work',
          startDate: '2024-01-20',
          duration: 10,
          progress: 60,
          status: 'in-progress'
        },
        {
          id: 'task-3',
          name: 'Framing',
          startDate: '2024-01-30',
          duration: 15,
          progress: 0,
          status: 'pending'
        }
      ];
    }
  }
  
  function initializeGanttChart() {
    // Use the core Gantt component
    ganttChart = new GanttChart('#scheduleGantt', {
      height: 500,
      showToday: true,
      showDependencies: true,
      editable: true
    });
    
    // Set tasks from our schedule data
    ganttChart.setTasks(scheduleData);
    
    // Listen for Gantt events
    ganttChart.container.addEventListener('gantt:task:selected', (e) => {
      handleTaskSelection(e.detail);
    });
    
    ganttChart.container.addEventListener('gantt:zoomed', (e) => {
      handleGanttZoom(e.detail);
    });
  }
  
  function setupScheduleEventListeners() {
    // Add task button
    document.getElementById('btnAddTask')?.addEventListener('click', () => {
      showAddTaskModal();
    });
    
    // Save button
    document.getElementById('btnSave')?.addEventListener('click', () => {
      saveScheduleData();
    });
    
    // Export button
    document.getElementById('btnExport')?.addEventListener('click', () => {
      exportScheduleData();
    });
  }
  
  function initializeScheduleUI() {
    // Initialize other UI elements specific to schedule module
    updateTaskSummary();
    updateTimelineStats();
  }
  
  function handleTaskSelection(detail) {
    // Handle task selection from Gantt component
    const { taskId, task } = detail;
    
    // Update task details panel
    updateTaskDetails(task);
    
    // Highlight selected task in other UI elements
    highlightTaskInList(taskId);
  }
  
  function handleGanttZoom(detail) {
    // Handle zoom events from Gantt component
    console.log('Gantt zoomed:', detail.direction);
    
    // Update other UI elements based on zoom level
    updateTimelineScale(detail.direction);
  }
  
  function showAddTaskModal() {
    // Show modal to add new task
    const taskName = prompt('Enter task name:');
    if (taskName) {
      const newTask = {
        id: `task-${Date.now()}`,
        name: taskName,
        startDate: new Date().toISOString().split('T')[0],
        duration: 5,
        progress: 0,
        status: 'pending'
      };
      
      // Add to Gantt component
      ganttChart.addTask(newTask);
      
      // Add to our data
      scheduleData.push(newTask);
      
      // Update UI
      updateTaskSummary();
    }
  }
  
  function saveScheduleData() {
    // Save schedule data
    localStorage.setItem('pcfp_schedule_data', JSON.stringify(scheduleData));
    
    // Show success message
    showNotification('Schedule saved successfully', 'success');
  }
  
  function exportScheduleData() {
    // Export schedule data using Gantt component's export
    ganttChart.exportData();
  }
  
  function updateTaskDetails(task) {
    // Update task details panel
    const detailsPanel = document.getElementById('taskDetails');
    if (detailsPanel && task) {
      detailsPanel.innerHTML = `
        <h3>${task.name}</h3>
        <p><strong>Start Date:</strong> ${task.startDate}</p>
        <p><strong>Duration:</strong> ${task.duration} days</p>
        <p><strong>Progress:</strong> ${task.progress}%</p>
        <p><strong>Status:</strong> ${task.status}</p>
        <button class="btn" onclick="editTask('${task.id}')">Edit Task</button>
      `;
    }
  }
  
  function highlightTaskInList(taskId) {
    // Highlight selected task in task list
    document.querySelectorAll('.task-list-item').forEach(item => {
      item.classList.remove('selected');
    });
    
    const selectedItem = document.querySelector(`[data-task-id="${taskId}"]`);
    if (selectedItem) {
      selectedItem.classList.add('selected');
    }
  }
  
  function updateTaskSummary() {
    // Update task summary statistics
    const totalTasks = scheduleData.length;
    const completedTasks = scheduleData.filter(t => t.status === 'completed').length;
    const inProgressTasks = scheduleData.filter(t => t.status === 'in-progress').length;
    
    const summaryElement = document.getElementById('taskSummary');
    if (summaryElement) {
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
      `;
    }
  }
  
  function updateTimelineStats() {
    // Update timeline statistics
    const totalDuration = scheduleData.reduce((sum, task) => sum + task.duration, 0);
    const avgProgress = scheduleData.reduce((sum, task) => sum + task.progress, 0) / scheduleData.length;
    
    const statsElement = document.getElementById('timelineStats');
    if (statsElement) {
      statsElement.innerHTML = `
        <div class="stat-item">
          <span class="label">Total Duration:</span>
          <span class="value">${totalDuration} days</span>
        </div>
        <div class="stat-item">
          <span class="label">Average Progress:</span>
          <span class="value">${Math.round(avgProgress)}%</span>
        </div>
      `;
    }
  }
  
  function updateTimelineScale(direction) {
    // Update timeline scale based on zoom
    console.log('Updating timeline scale:', direction);
  }
  
  function showNotification(message, type = 'info') {
    // Show notification using core notification component
    if (window.PCFP && window.PCFP.notifications) {
      window.PCFP.notifications.show(message, type);
    } else {
      // Fallback to simple alert
      alert(message);
    }
  }
  
  // Expose functions for global access
  window.editTask = function(taskId) {
    // Edit task functionality
    const task = scheduleData.find(t => t.id === taskId);
    if (task) {
      const newName = prompt('Edit task name:', task.name);
      if (newName) {
        task.name = newName;
        ganttChart.updateTask(taskId, { name: newName });
        updateTaskSummary();
      }
    }
  };
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (window.PCFP && window.PCFP.moduleManager) {
        window.PCFP.moduleManager.initialize('schedule');
      }
    });
  } else {
    if (window.PCFP && window.PCFP.moduleManager) {
      window.PCFP.moduleManager.initialize('schedule');
    }
  }
})();
