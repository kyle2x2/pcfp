export function create(container, opts={}){
  const state = { opts, tasks:[] };
  const el = document.createElement('div');
  el.className='c-gantt';
  container.innerHTML=''; container.appendChild(el);
  function render(data){
    state.tasks = data.tasks||[];
    el.innerHTML = '<div style="font-weight:600;margin-bottom:6px">Gantt (shared component stub)</div>';
    const wrap=document.createElement('div'); wrap.style.display='grid'; wrap.style.gridTemplateColumns='220px 1fr'; wrap.style.gap='6px';
    state.tasks.forEach(t=>{
      const name=document.createElement('div'); name.textContent=t.label; name.style.whiteSpace='nowrap';
      const bar=document.createElement('div'); bar.style.height='10px'; bar.style.background='#e5e7eb'; bar.style.position='relative';
      const seg=document.createElement('div'); seg.style.position='absolute'; seg.style.left=(t.start*10)+'px'; seg.style.width=(t.duration*10)+'px'; seg.style.height='10px'; seg.style.background='#C6A247';
      bar.appendChild(seg); wrap.appendChild(name); wrap.appendChild(bar);
    });
    el.appendChild(wrap);
  }
  return { render };
}
