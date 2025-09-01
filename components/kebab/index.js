(function(g){
  g.PCFP = g.PCFP || {};
  function attach(root){
    if(!root) return;
    root.addEventListener('click', function(e){
      const btn = e.target.closest('[data-kebab]');
      if(btn){
        const menu = btn.parentElement.querySelector('[data-kebab-menu]');
        if(menu){
          const open = menu.getAttribute('data-open')==='true';
          document.querySelectorAll('[data-kebab-menu][data-open="true"]').forEach(m=>m.setAttribute('data-open','false'));
          menu.setAttribute('data-open', open?'false':'true');
        }
      }
      const item = e.target.closest('[data-kebab-action]');
      if(item){
        const menu = item.closest('[data-kebab-menu]');
        if(menu){ menu.setAttribute('data-open','false'); }
      }
    });
    document.addEventListener('click', function(e){
      if(!e.target.closest('[data-kebab], [data-kebab-menu]')){
        document.querySelectorAll('[data-kebab-menu][data-open="true"]').forEach(m=>m.setAttribute('data-open','false'));
      }
    });
  }
  g.PCFP.kebab = { attach };
})(window);
