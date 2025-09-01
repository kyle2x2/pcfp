// modules/payment-planner/gantt-integration.js - Payment Planner using Core Gantt Component
// Demonstrates how the same core Gantt component is reused across different modules

import { GanttChart } from '../../core/components/gantt/index.js';
import { safe } from '../../core/services/errors.js';

// Payment Planner Gantt Integration
// Uses the same core Gantt component but with payment-specific data and features

export function initializePaymentGantt() {
  let paymentGantt;
  
  safe(() => {
    // Initialize Gantt chart for payment timeline
    paymentGantt = new GanttChart('#paymentGantt', {
      height: 400,
      showToday: true,
      showDependencies: false, // Payments don't have dependencies
      editable: true,
      showWeekends: false // Payments are typically business days only
    });
    
    // Convert payment data to Gantt format
    const paymentTasks = convertPaymentsToTasks(window.scope || []);
    
    // Set tasks in Gantt component
    paymentGantt.setTasks(paymentTasks);
    
    // Listen for Gantt events specific to payments
    paymentGantt.container.addEventListener('gantt:task:selected', (e) => {
      handlePaymentSelection(e.detail);
    });
    
    // Custom payment-specific event handling
    paymentGantt.container.addEventListener('gantt:zoomed', (e) => {
      updatePaymentTimelineScale(e.detail);
    });
    
    console.log('[PCFP] Payment Gantt initialized with', paymentTasks.length, 'payment items');
    
  }, 'payment-planner:gantt:init');
  
  return paymentGantt;
}

function convertPaymentsToTasks(paymentData) {
  // Convert payment planner data to Gantt task format
  return paymentData.map((item, index) => ({
    id: `payment-${item.code || index}`,
    name: item.name || `Payment ${index + 1}`,
    startDate: calculatePaymentStartDate(item),
    duration: item.dur || 1,
    progress: calculatePaymentProgress(item),
    status: getPaymentStatus(item),
    // Payment-specific data
    paymentData: {
      code: item.code,
      base: item.base,
      markup: item.markup,
      hst: item.hst,
      total: item.total,
      paymentSchedule: item.paymentSchedule
    }
  }));
}

function calculatePaymentStartDate(paymentItem) {
  // Calculate start date based on payment item data
  if (paymentItem.startwk && window.months) {
    // Convert week number to date
    const startWeek = paymentItem.startwk;
    const projectStart = window.projectStart || new Date();
    const startDate = new Date(projectStart);
    startDate.setDate(startDate.getDate() + (startWeek - 1) * 7);
    return startDate.toISOString().split('T')[0];
  }
  
  // Fallback to current date
  return new Date().toISOString().split('T')[0];
}

function calculatePaymentProgress(paymentItem) {
  // Calculate progress based on payment completion
  if (paymentItem.paymentSchedule && paymentItem.paymentSchedule.length > 0) {
    const completedPayments = paymentItem.paymentSchedule.filter(p => p.status === 'paid').length;
    const totalPayments = paymentItem.paymentSchedule.length;
    return totalPayments > 0 ? (completedPayments / totalPayments) * 100 : 0;
  }
  
  return 0;
}

function getPaymentStatus(paymentItem) {
  // Determine payment status
  if (paymentItem.paymentSchedule && paymentItem.paymentSchedule.length > 0) {
    const hasPaidPayments = paymentItem.paymentSchedule.some(p => p.status === 'paid');
    const allPaid = paymentItem.paymentSchedule.every(p => p.status === 'paid');
    
    if (allPaid) return 'completed';
    if (hasPaidPayments) return 'in-progress';
  }
  
  return 'pending';
}

function handlePaymentSelection(detail) {
  // Handle payment selection from Gantt
  const { taskId, task } = detail;
  
  // Update payment details panel
  updatePaymentDetails(task);
  
  // Highlight selected payment in scope table
  highlightPaymentInScope(taskId);
  
  // Update payment calculations
  updatePaymentCalculations(task);
}

function updatePaymentDetails(task) {
  // Update payment details panel
  const detailsPanel = document.getElementById('paymentDetails');
  if (detailsPanel && task && task.paymentData) {
    const payment = task.paymentData;
    
    detailsPanel.innerHTML = `
      <h3>${task.name}</h3>
      <div class="payment-info">
        <p><strong>Code:</strong> ${payment.code}</p>
        <p><strong>Base Amount:</strong> $${payment.base?.toLocaleString() || '0'}</p>
        <p><strong>Markup:</strong> ${payment.markup || 0}%</p>
        <p><strong>HST:</strong> ${payment.hst || 0}%</p>
        <p><strong>Total:</strong> $${payment.total?.toLocaleString() || '0'}</p>
      </div>
      <div class="payment-actions">
        <button class="btn" onclick="editPayment('${task.id}')">Edit Payment</button>
        <button class="btn" onclick="viewPaymentSchedule('${task.id}')">View Schedule</button>
      </div>
    `;
  }
}

function highlightPaymentInScope(taskId) {
  // Highlight selected payment in scope table
  const scopeTable = document.getElementById('scopeTable');
  if (scopeTable) {
    // Remove previous highlights
    scopeTable.querySelectorAll('tr').forEach(row => {
      row.classList.remove('selected');
    });
    
    // Add highlight to selected row
    const selectedRow = scopeTable.querySelector(`[data-payment-id="${taskId}"]`);
    if (selectedRow) {
      selectedRow.classList.add('selected');
    }
  }
}

function updatePaymentCalculations(task) {
  // Update payment calculations when payment is selected
  if (task && task.paymentData) {
    // Trigger recalculation of totals
    if (window.compute) {
      window.compute();
    }
  }
}

function updatePaymentTimelineScale(detail) {
  // Update payment timeline scale based on zoom
  console.log('Payment timeline zoomed:', detail.direction);
  
  // Update payment summary based on visible timeline
  updatePaymentSummary();
}

function updatePaymentSummary() {
  // Update payment summary based on current view
  const visiblePayments = getVisiblePayments();
  
  const summaryElement = document.getElementById('paymentSummary');
  if (summaryElement) {
    const totalAmount = visiblePayments.reduce((sum, p) => sum + (p.paymentData?.total || 0), 0);
    const completedAmount = visiblePayments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + (p.paymentData?.total || 0), 0);
    
    summaryElement.innerHTML = `
      <div class="summary-item">
        <span class="label">Visible Payments:</span>
        <span class="value">${visiblePayments.length}</span>
      </div>
      <div class="summary-item">
        <span class="label">Total Amount:</span>
        <span class="value">$${totalAmount.toLocaleString()}</span>
      </div>
      <div class="summary-item">
        <span class="label">Completed:</span>
        <span class="value">$${completedAmount.toLocaleString()}</span>
      </div>
    `;
  }
}

function getVisiblePayments() {
  // Get payments currently visible in the Gantt view
  // This would be implemented based on the Gantt component's viewport
  return [];
}

// Expose functions for global access
window.editPayment = function(taskId) {
  // Edit payment functionality
  console.log('Edit payment:', taskId);
  // Implementation would open edit modal
};

window.viewPaymentSchedule = function(taskId) {
  // View payment schedule functionality
  console.log('View payment schedule:', taskId);
  // Implementation would show payment schedule modal
};

// Export for use in main payment planner module
export { initializePaymentGantt };
