import { LocalAdapter } from './store.local.js';
import { HttpAdapter } from './store.http.js';

export function createStore({ mode='local', events }){
  const adapter = mode === 'http' ? HttpAdapter() : LocalAdapter();
  return {
    async listProfiles(){ 
      try {
        return await adapter.listProfiles(); 
      } catch(e) {
        console.error('Failed to list profiles:', e);
        return [];
      }
    },
    async getProfile(id){ 
      try {
        return await adapter.getProfile(id); 
      } catch(e) {
        console.error('Failed to get profile:', e);
        return null;
      }
    },
    async saveProfile(p){
      try {
        const saved = await adapter.saveProfile(p);
        events?.emit('store:changed', { path: 'profiles', id: saved.id });
        return saved;
      } catch(e) {
        console.error('Failed to save profile:', e);
        throw e;
      }
    },
    async deleteProfile(id){
      try {
        await adapter.deleteProfile(id);
        events?.emit('store:changed', { path:'profiles', id, deleted:true });
      } catch(e) {
        console.error('Failed to delete profile:', e);
        throw e;
      }
    }
  };
}
