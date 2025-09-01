// core/components/index.js - Core Component Loader
// Exports all reusable components for modules to import

// Export Gantt Chart component
export { GanttChart } from './gantt/index.js';

// Future core components (to be built)
// export { DataTable } from './data-table/index.js';
// export { FormBuilder } from './form-builder/index.js';
// export { FileUpload } from './file-upload/index.js';
// export { Modal } from './modal/index.js';
// export { Notifications } from './notifications/index.js';
// export { Calendar } from './calendar/index.js';
// export { Charts } from './charts/index.js';

// Component registry for easy access
export const componentRegistry = {
  GanttChart: 'gantt',
  // DataTable: 'data-table',
  // FormBuilder: 'form-builder',
  // FileUpload: 'file-upload',
  // Modal: 'modal',
  // Notifications: 'notifications',
  // Calendar: 'calendar',
  // Charts: 'charts'
};

// Helper function to get component by name
export function getComponent(name) {
  switch (name) {
    case 'GanttChart':
      return import('./gantt/index.js').then(m => m.GanttChart);
    // case 'DataTable':
    //   return import('./data-table/index.js').then(m => m.DataTable);
    // case 'FormBuilder':
    //   return import('./form-builder/index.js').then(m => m.FormBuilder);
    default:
      throw new Error(`Component ${name} not found`);
  }
}

// Expose to window for global access
if (typeof window !== 'undefined') {
  window.PCFP = window.PCFP || {};
  window.PCFP.components = {
    getComponent,
    componentRegistry
  };
}
