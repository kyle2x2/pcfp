// core/services/security.js - Security Hardening for BuilderTrend Competitor
// Prevents XSS attacks and ensures safe content rendering

import { logError } from './errors.js';

// HTML content sanitization
export function sanitizeHTML(content) {
  if (typeof content !== 'string') {
    return '';
  }
  
  try {
    // Create a temporary div to safely parse content
    const div = document.createElement('div');
    div.textContent = content;
    return div.innerHTML;
  } catch (e) {
    logError(e, 'security:sanitizeHTML');
    return '';
  }
}

// Safe innerHTML setting
export function safeSetInnerHTML(element, content) {
  if (!element || !(element instanceof Element)) {
    logError(new Error('Invalid element provided'), 'security:safeSetInnerHTML');
    return false;
  }
  
  try {
    element.innerHTML = sanitizeHTML(content);
    return true;
  } catch (e) {
    logError(e, 'security:safeSetInnerHTML');
    return false;
  }
}

// URL validation and sanitization
export function sanitizeURL(url) {
  if (typeof url !== 'string') {
    return '';
  }
  
  try {
    // Only allow http, https, and relative URLs
    const urlObj = new URL(url, window.location.origin);
    const allowedProtocols = ['http:', 'https:'];
    
    if (!allowedProtocols.includes(urlObj.protocol) && !url.startsWith('/')) {
      return '';
    }
    
    return urlObj.href;
  } catch (e) {
    logError(e, 'security:sanitizeURL');
    return '';
  }
}

// Input validation for user data
export function validateInput(input, type = 'text') {
  if (typeof input !== 'string') {
    return false;
  }
  
  const patterns = {
    text: /^[\w\s\-.,!?()]+$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    number: /^\d+(\.\d+)?$/,
    date: /^\d{4}-\d{2}-\d{2}$/
  };
  
  const pattern = patterns[type];
  if (!pattern) {
    return true; // No validation for unknown types
  }
  
  return pattern.test(input.trim());
}

// Content Security Policy helper
export function createCSPNonce() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Safe JSON parsing
export function safeJSONParse(jsonString, fallback = null) {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    logError(e, 'security:safeJSONParse');
    return fallback;
  }
}

// Safe function execution
export function safeExecute(fn, context = 'unknown') {
  try {
    return fn();
  } catch (e) {
    logError(e, `security:safeExecute:${context}`);
    return null;
  }
}
