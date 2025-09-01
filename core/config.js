
(function(){
  window.PCFP = window.PCFP || {};
  var w = window;
  if (typeof w.PCFP_API_MODE === "undefined") {
    w.PCFP_API_MODE = "mock"; // "mock" | "live"
  }
  if (typeof w.PCFP_API_BASE === "undefined") {
    w.PCFP_API_BASE = ""; // set later when backend exists
  }
  window.PCFP.config = {
    get mode(){ return w.PCFP_API_MODE; },
    setMode: function(m){ w.PCFP_API_MODE = m; },
    get apiBase(){ return w.PCFP_API_BASE; },
    setApiBase: function(u){ w.PCFP_API_BASE = u; }
  };
})();
