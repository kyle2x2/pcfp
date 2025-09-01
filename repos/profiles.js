
(function(){
  window.PCFP = window.PCFP || {};
  var adapter = window.PCFP.adapter;
  var emit = (window.PCFP.events && window.PCFP.events.emit) || function(){};
  window.PCFP.ProfileRepo = {
    async list(projectId, moduleName){ return adapter.listProfiles(projectId, moduleName); },
    async save(projectId, moduleName, profile){
      var saved = await adapter.saveProfile(projectId, moduleName, profile.name, profile.payload, profile.id);
      emit("profile.saved", { project_id: projectId, module: moduleName, profile: saved });
      return saved;
    }
  };
})();
