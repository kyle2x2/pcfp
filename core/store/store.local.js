const KEY='pcfp_profiles_v1';
function load(){ try{ return JSON.parse(localStorage.getItem(KEY)||'[]'); } catch{ return []; } }
function save(arr){ localStorage.setItem(KEY, JSON.stringify(arr)); }
export function LocalAdapter(){
  return {
    async listProfiles(){ return load(); },
    async getProfile(id){ return load().find(p=>p.id===id) || null; },
    async saveProfile(p){
      const arr = load();
      const i = arr.findIndex(x=>x.id===p.id);
      if(i>=0) arr[i]=p; else arr.push(p);
      save(arr);
      return p;
    },
    async deleteProfile(id){
      const arr = load().filter(p=>p.id!==id);
      save(arr);
    }
  };
}
