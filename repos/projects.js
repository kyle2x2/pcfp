
(function(){
  window.PCFP = window.PCFP || {};
  var adapter = window.PCFP.adapter;
  window.PCFP.ProjectRepo = {
    async list(){ return adapter.listProjects(); },
    async create(p){ return adapter.createProject(p); }
  };
})();
