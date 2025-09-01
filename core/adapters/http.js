
(function(){
  window.PCFP = window.PCFP || {};
  var cfg = window.PCFP.config;
  function lsGet(key, fallback){
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch(e){ return fallback; }
  }
  function lsSet(key, obj){
    localStorage.setItem(key, JSON.stringify(obj||null));
  }
  function uid(){ return (Date.now().toString(36)+Math.random().toString(36).slice(2,8)); }

  var adapter = {
    get mode(){ return cfg ? cfg.mode : (window.PCFP_API_MODE || "mock"); },
    setMode: function(m){ cfg ? cfg.setMode(m) : (window.PCFP_API_MODE = m); },

    // Auth (mock)
    async signIn(email, password){
      // mock user & tenant
      var user = { id:"u_"+uid(), email: email, name: "Demo User", role: "owner", tenant_id: "t_demo" };
      var token = "mock."+uid();
      localStorage.setItem("pcfp_auth", JSON.stringify({token, user}));
      return { token, user };
    },

    // Projects
    async listProjects(){
      var arr = lsGet("pcfp_projects", []);
      return arr;
    },
    async createProject(p){
      var arr = lsGet("pcfp_projects", []);
      var id = p.id || "prj_"+uid();
      var rec = Object.assign({ id: id, created_at: new Date().toISOString() }, p);
      arr.push(rec); lsSet("pcfp_projects", arr);
      return rec;
    },

    // Profiles (module-scoped blobs)
    async listProfiles(projectId, moduleName){
      var arr = lsGet("pcfp_profiles", []);
      return arr.filter(x => x.project_id === projectId && x.module === moduleName);
    },
    async saveProfile(projectId, moduleName, name, payload, id){
      var arr = lsGet("pcfp_profiles", []);
      var now = new Date().toISOString();
      if(!id){
        id = "pro_"+uid();
        arr.push({ id, project_id: projectId, module: moduleName, name, payload, updated_at: now });
      } else {
        arr = arr.map(x => x.id===id ? Object.assign({}, x, { name, payload, updated_at: now }) : x);
      }
      lsSet("pcfp_profiles", arr);
      return arr.find(x => x.id===id);
    },

    // Events (audit trail lite)
    async listEvents(projectId){
      var arr = lsGet("pcfp_events", []);
      return arr.filter(e => e.project_id === projectId);
    },
    async appendEvent(projectId, type, payload){
      var arr = lsGet("pcfp_events", []);
      var rec = { id:"ev_"+uid(), project_id: projectId, type, payload, occurred_at: new Date().toISOString() };
      arr.push(rec); lsSet("pcfp_events", arr);
      return rec;
    }
  };

  window.PCFP.adapter = adapter;
})();
