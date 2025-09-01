export function HttpAdapter(base='/api'){
  async function j(method, url, body){
    const r = await fetch(base+url, { method, headers:{'Content-Type':'application/json'}, body: body?JSON.stringify(body):undefined });
    if(!r.ok) throw new Error(await r.text());
    return r.status===204 ? null : r.json();
  }
  return {
    async listProfiles(){ return j('GET','/profiles'); },
    async getProfile(id){ return j('GET', `/profiles/${id}`); },
    async saveProfile(p){ return j('PUT', `/profiles/${p.id}`, p); },
    async deleteProfile(id){ return j('DELETE', `/profiles/${id}`); }
  };
}
