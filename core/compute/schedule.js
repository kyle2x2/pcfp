
(function(){
  window.PCFP = window.PCFP || {};
  var Schedule = {
    // placeholder; real planner logic will move here in v7.1
    totalWeeks(months){ return (months||[]).reduce((a,m)=>a+(m.weeks||0),0); }
  };
  window.PCFP.compute = window.PCFP.compute || {};
  window.PCFP.compute.schedule = Schedule;
})();
