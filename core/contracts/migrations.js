// core/contracts/migrations.js - simple version bump/migrate
(function(g){
  g.PCFP = g.PCFP || {};
  const MIGRATIONS = [];
  // v1 -> v2: ensure payload.ui exists and computeVisible boolean
  MIGRATIONS.push(function toV2(model){
    if(!model) return model;
    if(!model.payload) model.payload = {};
    model.payload.ui = model.payload.ui || {};
    if(typeof model.payload.ui.computeVisible !== 'boolean') model.payload.ui.computeVisible = false;
    if(!model.payload.settings) model.payload.settings = { hst:13, markupPct:20, depositPct:30, holdbackPct:10 };
    return model;
  });
  g.PCFP.migrations = {
    runTo(version, profile){
      let v = (profile && profile.schemaVersion) || 1;
      while(v < version){
        const m = MIGRATIONS[v-1];
        if(m) profile = m(profile);
        v++;
      }
      profile.schemaVersion = version;
      return profile;
    }
  };
})(window);
