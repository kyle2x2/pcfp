
(function(){
  window.PCFP = window.PCFP || {};
  var adapter = window.PCFP.adapter;
  window.PCFP.EventRepo = {
    async list(projectId){ return adapter.listEvents(projectId); },
    async append(projectId, type, payload){ return adapter.appendEvent(projectId, type, payload); }
  };
})();
