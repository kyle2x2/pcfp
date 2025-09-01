// v6.4 core/adapters - LocalAdapter now; HttpAdapter placeholder
export function createLocalAdapter(){
  return {
    async saveProfile(profile){ 
      const arr = JSON.parse(localStorage.getItem('pcfp_profiles_v64')||'[]');
      const idx = arr.findIndex(p => p.id === profile.id);
      if(idx>=0) arr[idx]=profile; else arr.push(profile);
      localStorage.setItem('pcfp_profiles_v64', JSON.stringify(arr));
      return profile;
    },
    async listProfiles(){ 
      return JSON.parse(localStorage.getItem('pcfp_profiles_v64')||'[]'); 
    },
    async loadProfile(id){
      const arr = JSON.parse(localStorage.getItem('pcfp_profiles_v64')||'[]');
      return arr.find(p => p.id===id) || null;
    }
  };
}
export function createHttpAdapter(baseUrl, token){
  return {
    async saveProfile(profile){
      const res = await fetch(baseUrl+'/profiles/'+encodeURIComponent(profile.id||''), {
        method: profile.id ? 'PUT':'POST',
        headers: { 'Content-Type':'application/json', 'Authorization': 'Bearer '+token },
        body: JSON.stringify(profile)
      });
      return await res.json();
    },
    async listProfiles(){
      const res = await fetch(baseUrl+'/profiles', { headers:{ 'Authorization':'Bearer '+token } });
      return await res.json();
    },
    async loadProfile(id){
      const res = await fetch(baseUrl+'/profiles/'+encodeURIComponent(id), { headers:{ 'Authorization':'Bearer '+token } });
      return await res.json();
    }
  };
}
