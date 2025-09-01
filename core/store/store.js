import { LocalAdapter } from './store.local.js';
import { HttpAdapter } from './store.http.js';

export function createStore({ mode='local', events }){
  const adapter = mode === 'http' ? HttpAdapter() : LocalAdapter();
  return {
    async listProfiles(){ return adapter.listProfiles(); },
    async getProfile(id){ return adapter.getProfile(id); },
    async saveProfile(p){
      const saved = await adapter.saveProfile(p);
      events?.emit('store:changed', { path: 'profiles', id: saved.id });
      return saved;
    },
    async deleteProfile(id){
      await adapter.deleteProfile(id);
      events?.emit('store:changed', { path:'profiles', id, deleted:true });
    }
  };
}
