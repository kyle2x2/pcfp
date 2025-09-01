// core/version-manager.js - Automated Version Management for BuilderTrend Competitor
// Prevents forgetting to update version displays and ensures consistency

import { APP_META } from './config.js';
import { logError } from './services/errors.js';

export class VersionManager {
  constructor() {
    this.currentVersion = APP_META.build;
    this.versionElements = new Map();
    this.updateCallbacks = new Set();
    this.isInitialized = false;
  }

  // Initialize version manager
  init() {
    if (this.isInitialized) return;
    
    try {
      // Set global version
      window.APP_BUILD = this.currentVersion;
      
      // Find and track all version elements
      this.findVersionElements();
      
      // Update all displays
      this.updateAllDisplays();
      
      // Set up automatic updates
      this.setupAutoUpdates();
      
      this.isInitialized = true;
      console.log(`[PCFP] Version Manager initialized: ${this.currentVersion}`);
      
    } catch (e) {
      logError(e, 'version-manager:init');
    }
  }

  // Find all version display elements
  findVersionElements() {
    const selectors = [
      '[data-app-version]',
      '.pcfp-version-pill',
      'title',
      '.version',
      '[data-version]'
    ];

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        this.versionElements.set(element, {
          selector,
          originalText: element.textContent || element.innerHTML,
          type: this.getElementType(element)
        });
      });
    });
  }

  // Determine element type for proper updating
  getElementType(element) {
    if (element.tagName === 'TITLE') return 'title';
    if (element.hasAttribute('data-app-version')) return 'data-attribute';
    if (element.classList.contains('pcfp-version-pill')) return 'version-pill';
    if (element.classList.contains('version')) return 'version-badge';
    return 'generic';
  }

  // Update all version displays
  updateAllDisplays() {
    this.versionElements.forEach((info, element) => {
      this.updateElement(element, info);
    });

    // Update PCFP global object
    if (window.PCFP) {
      window.PCFP.version = window.PCFP.version || {};
      window.PCFP.version.app = this.currentVersion;
    }

    // Notify callbacks
    this.updateCallbacks.forEach(callback => {
      try {
        callback(this.currentVersion);
      } catch (e) {
        logError(e, 'version-manager:callback');
      }
    });
  }

  // Update individual element
  updateElement(element, info) {
    try {
      switch (info.type) {
        case 'title':
          element.textContent = element.textContent.replace(/v\d+\.\d+/, this.currentVersion);
          break;
        case 'data-attribute':
          element.textContent = this.currentVersion;
          break;
        case 'version-pill':
          element.innerHTML = element.innerHTML.replace(/v\d+\.\d+/, this.currentVersion);
          break;
        case 'version-badge':
          element.textContent = this.currentVersion;
          break;
        default:
          element.textContent = element.textContent.replace(/v\d+\.\d+/, this.currentVersion);
      }
    } catch (e) {
      logError(e, `version-manager:updateElement:${info.type}`);
    }
  }

  // Setup automatic updates
  setupAutoUpdates() {
    // Update on DOM changes
    const observer = new MutationObserver(() => {
      this.findVersionElements();
      this.updateAllDisplays();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Update on hash changes (module navigation)
    window.addEventListener('hashchange', () => {
      setTimeout(() => this.updateAllDisplays(), 100);
    });

    // Update on page load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.updateAllDisplays());
    } else {
      this.updateAllDisplays();
    }
  }

  // Register callback for version updates
  onVersionUpdate(callback) {
    this.updateCallbacks.add(callback);
    return () => this.updateCallbacks.delete(callback);
  }

  // Get current version
  getCurrentVersion() {
    return this.currentVersion;
  }

  // Get version statistics
  getStats() {
    return {
      currentVersion: this.currentVersion,
      elementCount: this.versionElements.size,
      callbackCount: this.updateCallbacks.size,
      isInitialized: this.isInitialized
    };
  }

  // Force refresh all displays
  refresh() {
    this.findVersionElements();
    this.updateAllDisplays();
  }

  // Debug version elements
  debug() {
    console.log('=== PCFP Version Manager Debug ===');
    console.log('Current Version:', this.currentVersion);
    console.log('Version Elements:', this.versionElements.size);
    console.log('Update Callbacks:', this.updateCallbacks.size);
    console.log('Is Initialized:', this.isInitialized);
    
    this.versionElements.forEach((info, element) => {
      console.log(`Element: ${info.selector} (${info.type})`, element);
    });
    console.log('================================');
  }
}

// Create global version manager instance
export const versionManager = new VersionManager();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => versionManager.init());
} else {
  versionManager.init();
}

// Expose to window for global access
if (typeof window !== 'undefined') {
  window.PCFP = window.PCFP || {};
  window.PCFP.versionManager = versionManager;
}
