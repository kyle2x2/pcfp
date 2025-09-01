// core/components/gantt/gantt.global.js (v0.1.0)
(function(){
  function create(container, opts){
    opts = opts || {}; var el = document.createElement('div'); el.className='c-gantt'; container.innerHTML=''; container.appendChild(el);
    var state = { tasks: [], opts: opts };
    function render(data){
      state.tasks = (data && data.tasks) || state.tasks || [];
      el.innerHTML = '';
      var title=document.createElement('div'); title.style.fontWeight='600'; title.style.margin='6px 0'; title.textContent='Gantt'; el.appendChild(title);
      var wrap=document.createElement('div'); wrap.style.display='grid'; wrap.style.gridTemplateColumns='220px 1fr'; wrap.style.gap='6px';
      state.tasks.forEach(function(t){
        var name=document.createElement('div'); name.textContent=t.label || t.name || 'Task';
        name.style.whiteSpace='nowrap';
        var bar=document.createElement('div'); bar.style.height='10px'; bar.style.background='#e5e7eb'; bar.style.position='relative';
        var seg=document.createElement('div'); seg.style.position='absolute'; seg.style.left=((t.start||0)*10)+'px'; seg.style.width=((t.duration||0)*10)+'px'; seg.style.height='10px'; seg.style.background='#C6A247';
        bar.appendChild(seg); wrap.appendChild(name); wrap.appendChild(bar);
      });
      el.appendChild(wrap);
    }
    return { render: render, el: el, state: state };
  }
  window.CoreGantt = { create: create };
})();