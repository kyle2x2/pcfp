(function(){
  function wire(){
    var btn = document.getElementById('computeToggleBtn');
    if(!btn) return;
    btn.addEventListener('click', function(){
      document.body.classList.toggle('show-compute');
      // Announce so tables that render formulas can react if needed
      document.dispatchEvent(new CustomEvent('pcfp:computeToggle', { detail: { on: document.body.classList.contains('show-compute') } }));
    });
  }
  window.addEventListener('load', wire);
})();