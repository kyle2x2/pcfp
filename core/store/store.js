import { LocalAdapter } from './store.local.js';
import { HttpAdapter } from './store.http.js';
import { performanceMonitor, logError } from '../services/errors.js';
import { PERFORMANCE_CONFIG } from '../config.js';

export function createStore({ mode='local', events }){
  const adapter = mode === 'http' ? HttpAdapter() : LocalAdapter();
  const cache = new Map();
  
  // Performance monitoring wrapper
  const monitoredAdapter = {
    listProfiles: performanceMonitor(adapter.listProfiles, 'store:listProfiles'),
    getProfile: performanceMonitor(adapter.getProfile, 'store:getProfile'),
    saveProfile: performanceMonitor(adapter.saveProfile, 'store:saveProfile'),
    deleteProfile: performanceMonitor(adapter.deleteProfile, 'store:deleteProfile')
  };
  
  return {
    async listProfiles(){ 
      try {
        // Check cache first for performance
        if (PERFORMANCE_CONFIG.cacheEnabled && cache.has('profiles')) {
          return cache.get('profiles');
        }
        
        const profiles = await monitoredAdapter.listProfiles();
        
        // Cache results for performance
        if (PERFORMANCE_CONFIG.cacheEnabled) {
          cache.set('profiles', profiles);
        }
        
        return profiles;
      } catch(e) {
        logError(e, 'store:listProfiles');
        return [];
      }
    },
    
    async getProfile(id){ 
      try {
        // Check cache first
        const cacheKey = `profile:${id}`;
        if (PERFORMANCE_CONFIG.cacheEnabled && cache.has(cacheKey)) {
          return cache.get(cacheKey);
        }
        
        const profile = await monitoredAdapter.getProfile(id);
        
        // Cache result
        if (PERFORMANCE_CONFIG.cacheEnabled && profile) {
          cache.set(cacheKey, profile);
        }
        
        return profile;
      } catch(e) {
        logError(e, 'store:getProfile');
        return null;
      }
    },
    
    async saveProfile(p){
      try {
        const saved = await monitoredAdapter.saveProfile(p);
        
        // Update cache
        if (PERFORMANCE_CONFIG.cacheEnabled) {
          cache.set(`profile:${saved.id}`, saved);
          cache.delete('profiles'); // Invalidate list cache
        }
        
        // Emit event with performance data
        events?.emit('store:changed', { 
          path: 'profiles', 
          id: saved.id,
          action: 'save',
          timestamp: Date.now()
        });
        
        return saved;
      } catch(e) {
        logError(e, 'store:saveProfile');
        throw e;
      }
    },
    
    async deleteProfile(id){
      try {
        await monitoredAdapter.deleteProfile(id);
        
        // Update cache
        if (PERFORMANCE_CONFIG.cacheEnabled) {
          cache.delete(`profile:${id}`);
          cache.delete('profiles'); // Invalidate list cache
        }
        
        events?.emit('store:changed', { 
          path:'profiles', 
          id, 
          deleted:true,
          timestamp: Date.now()
        });
      } catch(e) {
        logError(e, 'store:deleteProfile');
        throw e;
      }
    },
    
    // Cache management for performance
    clearCache() {
      cache.clear();
    },
    
    getCacheStats() {
      return {
        size: cache.size,
        keys: Array.from(cache.keys())
      };
    },
    
    // API-ready methods for future backend integration
    async apiCall(endpoint, options = {}) {
      try {
        const response = await fetch(endpoint, {
          timeout: PERFORMANCE_CONFIG.timeout,
          ...options
        });
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        
        return await response.json();
      } catch(e) {
        logError(e, `api:${endpoint}`);
        return null;
      }
    }
  };
}
