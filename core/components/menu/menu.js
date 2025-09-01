export function open(anchorEl, items, { autoClose=true, align='end' }={}){
  const menu = document.createElement('div');
  menu.className='c-menu';
  items.forEach(it=>{
    const b=document.createElement('button'); b.textContent = (it.icon?it.icon+' ':'') + it.label;
    b.addEventListener('click', ()=>{ try{ it.onClick&&it.onClick(); } finally { if(autoClose) close(); } });
    menu.appendChild(b);
  });
  function close(){ menu.remove(); document.removeEventListener('click', onDoc); }
  function onDoc(e){ if(!menu.contains(e.target)) close(); }
  document.addEventListener('click', onDoc);
  document.body.appendChild(menu);
  const r=anchorEl.getBoundingClientRect();
  menu.style.cssText = `position:absolute;z-index:1000;top:${r.bottom+window.scrollY+6}px;left:${r.right+window.scrollX-180}px;background:#fff;border:1px solid #e5e7eb;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.08);min-width:180px;padding:6px`;
  return { close };
}
