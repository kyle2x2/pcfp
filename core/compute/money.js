
(function(){
  window.PCFP = window.PCFP || {};
  var Money = {
    // simple helpers; planner still uses its own today; we'll migrate in v7.1
    pct(amount, pct){ return (amount||0) * (pct||0) / 100; },
    round2(n){ return Math.round((n + Number.EPSILON) * 100) / 100; }
  };
  window.PCFP.compute = window.PCFP.compute || {};
  window.PCFP.compute.money = Money;
})();
