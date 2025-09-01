// core/components/gantt/index.js - Reusable Gantt Chart Component
// Used by Schedule, Payment Planner, and other timeline-based modules

import { safe, safeAsync, performanceMonitor } from '../../services/errors.js';

export class GanttChart {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.options = {
      width: '100%',
      height: 400,
      showToday: true,
      showWeekends: true,
      showDependencies: true,
      editable: true,
      ...options
    };
    
    this.tasks = [];
    this.dependencies = [];
    this.currentDate = new Date();
    
    this.init();
  }
  
  init() {
    safe(() => {
      this.render();
      this.bindEvents();
      this.updateTodayLine();
    }, 'gantt:init');
  }
  
  render() {
    if (!this.container) return;
    
    this.container.innerHTML = `
      <div class="gantt-container" style="width: ${this.options.width}; height: ${this.options.height}px;">
        <div class="gantt-header">
          <div class="gantt-toolbar">
            <button class="btn btn-sm" id="ganttZoomIn">+</button>
            <button class="btn btn-sm" id="ganttZoomOut">-</button>
            <button class="btn btn-sm" id="ganttToday">Today</button>
            <button class="btn btn-sm" id="ganttExport">Export</button>
          </div>
        </div>
        <div class="gantt-content">
          <div class="gantt-sidebar">
            <div class="gantt-task-list"></div>
          </div>
          <div class="gantt-timeline">
            <div class="gantt-timeline-header"></div>
            <div class="gantt-timeline-content"></div>
          </div>
        </div>
      </div>
    `;
    
    this.renderTaskList();
    this.renderTimeline();
  }
  
  renderTaskList() {
    const taskList = this.container.querySelector('.gantt-task-list');
    if (!taskList) return;
    
    taskList.innerHTML = `
      <div class="gantt-task-header">
        <div class="gantt-task-name">Task</div>
        <div class="gantt-task-duration">Duration</div>
        <div class="gantt-task-progress">Progress</div>
      </div>
      <div class="gantt-task-rows">
        ${this.tasks.map(task => this.renderTaskRow(task)).join('')}
      </div>
    `;
  }
  
  renderTaskRow(task) {
    return `
      <div class="gantt-task-row" data-task-id="${task.id}">
        <div class="gantt-task-name">${task.name}</div>
        <div class="gantt-task-duration">${task.duration} days</div>
        <div class="gantt-task-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${task.progress || 0}%"></div>
          </div>
        </div>
      </div>
    `;
  }
  
  renderTimeline() {
    const timelineHeader = this.container.querySelector('.gantt-timeline-header');
    const timelineContent = this.container.querySelector('.gantt-timeline-content');
    
    if (!timelineHeader || !timelineContent) return;
    
    // Generate timeline header (months/weeks)
    const timelineData = this.generateTimelineData();
    
    timelineHeader.innerHTML = `
      <div class="gantt-timeline-months">
        ${timelineData.months.map(month => `
          <div class="gantt-month" style="width: ${month.width}px;">
            ${month.name}
          </div>
        `).join('')}
      </div>
      <div class="gantt-timeline-weeks">
        ${timelineData.weeks.map(week => `
          <div class="gantt-week" style="width: ${week.width}px;">
            ${week.name}
          </div>
        `).join('')}
      </div>
    `;
    
    // Generate timeline content (task bars)
    timelineContent.innerHTML = `
      <div class="gantt-timeline-grid">
        ${this.tasks.map(task => this.renderTaskBar(task, timelineData)).join('')}
      </div>
      ${this.options.showToday ? '<div class="gantt-today-line"></div>' : ''}
    `;
  }
  
  generateTimelineData() {
    // Calculate timeline based on task dates
    const startDate = this.getEarliestTaskDate();
    const endDate = this.getLatestTaskDate();
    
    const months = [];
    const weeks = [];
    
    // Generate months and weeks
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      // Add month
      const monthName = currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      months.push({ name: monthName, width: 120 });
      
      // Add weeks
      for (let i = 0; i < 4; i++) {
        const weekName = `W${Math.ceil((currentDate.getDate() + i) / 7)}`;
        weeks.push({ name: weekName, width: 30 });
      }
      
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    return { months, weeks };
  }
  
  renderTaskBar(task, timelineData) {
    const startOffset = this.calculateDateOffset(task.startDate);
    const width = task.duration * 30; // 30px per day
    
    return `
      <div class="gantt-task-bar" 
           data-task-id="${task.id}"
           style="left: ${startOffset}px; width: ${width}px;">
        <div class="gantt-task-progress-fill" style="width: ${task.progress || 0}%"></div>
        <div class="gantt-task-label">${task.name}</div>
      </div>
    `;
  }
  
  calculateDateOffset(date) {
    const startDate = this.getEarliestTaskDate();
    const diffTime = new Date(date) - new Date(startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * 30; // 30px per day
  }
  
  getEarliestTaskDate() {
    if (this.tasks.length === 0) return new Date();
    return new Date(Math.min(...this.tasks.map(t => new Date(t.startDate))));
  }
  
  getLatestTaskDate() {
    if (this.tasks.length === 0) return new Date();
    return new Date(Math.max(...this.tasks.map(t => {
      const endDate = new Date(t.startDate);
      endDate.setDate(endDate.getDate() + t.duration);
      return endDate;
    })));
  }
  
  bindEvents() {
    // Zoom controls
    this.container.querySelector('#ganttZoomIn')?.addEventListener('click', () => this.zoomIn());
    this.container.querySelector('#ganttZoomOut')?.addEventListener('click', () => this.zoomOut());
    this.container.querySelector('#ganttToday')?.addEventListener('click', () => this.goToToday());
    this.container.querySelector('#ganttExport')?.addEventListener('click', () => this.exportData());
    
    // Task interactions
    this.container.addEventListener('click', (e) => {
      const taskBar = e.target.closest('.gantt-task-bar');
      if (taskBar) {
        this.selectTask(taskBar.dataset.taskId);
      }
    });
  }
  
  // Public API methods
  setTasks(tasks) {
    this.tasks = tasks;
    this.render();
  }
  
  addTask(task) {
    this.tasks.push(task);
    this.render();
  }
  
  updateTask(taskId, updates) {
    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updates };
      this.render();
    }
  }
  
  removeTask(taskId) {
    this.tasks = this.tasks.filter(t => t.id !== taskId);
    this.render();
  }
  
  selectTask(taskId) {
    // Remove previous selection
    this.container.querySelectorAll('.gantt-task-bar.selected').forEach(el => {
      el.classList.remove('selected');
    });
    
    // Add new selection
    const taskBar = this.container.querySelector(`[data-task-id="${taskId}"]`);
    if (taskBar) {
      taskBar.classList.add('selected');
    }
    
    // Emit selection event
    this.emit('task:selected', { taskId, task: this.tasks.find(t => t.id === taskId) });
  }
  
  zoomIn() {
    // Implement zoom in logic
    this.emit('gantt:zoomed', { direction: 'in' });
  }
  
  zoomOut() {
    // Implement zoom out logic
    this.emit('gantt:zoomed', { direction: 'out' });
  }
  
  goToToday() {
    // Scroll to today's line
    const todayLine = this.container.querySelector('.gantt-today-line');
    if (todayLine) {
      todayLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  
  exportData() {
    const exportData = {
      tasks: this.tasks,
      dependencies: this.dependencies,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gantt-export.json';
    a.click();
    URL.revokeObjectURL(url);
  }
  
  updateTodayLine() {
    const todayLine = this.container.querySelector('.gantt-today-line');
    if (todayLine && this.options.showToday) {
      const offset = this.calculateDateOffset(this.currentDate);
      todayLine.style.left = `${offset}px`;
    }
  }
  
  // Event system
  emit(event, data) {
    const customEvent = new CustomEvent(`gantt:${event}`, { detail: data });
    this.container.dispatchEvent(customEvent);
  }
  
  // Destroy component
  destroy() {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}

// Export for use in modules
export default GanttChart;
