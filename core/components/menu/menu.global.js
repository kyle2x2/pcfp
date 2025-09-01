// core/components/menu/menu.global.js (v0.1.0)
(function(){
  function open(anchorEl, items, opts){
    opts = opts || {}; var autoClose = opts.autoClose !== false;
    var menu = document.createElement('div');
    menu.className='c-menu';
    items.forEach(function(it){
      var b=document.createElement('button');
      b.textContent = (it.icon?it.icon+' ':'') + it.label;
      b.addEventListener('click', function(ev){
        ev.stopPropagation(); try{ it.onClick && it.onClick(); } finally { if(autoClose) close(); }
      });
      menu.appendChild(b);
    });
    function close(){ if(menu.parentNode){ menu.remove(); document.removeEventListener('click', onDoc, true);} }
    function onDoc(e){ if(!menu.contains(e.target)) close(); }
    document.addEventListener('click', onDoc, true);
    document.body.appendChild(menu);
    var r = anchorEl.getBoundingClientRect();
    menu.style.cssText='position:absolute;z-index:1000;background:#fff;border:1px solid #e5e7eb;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.08);min-width:180px;padding:6px;';
    menu.style.top=(r.bottom+window.scrollY+6)+'px';
    menu.style.left=(r.right+window.scrollX-200)+'px';
    return { close: close, el: menu };
  }
  window.CoreMenu = { open: open };
})();