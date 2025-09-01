// core/header_version.js - ensure header displays PCFP.version
(function(g){
  function bindHeader(){
    var doc = document;
    var header = doc.querySelector('[data-app-header], header, .app-header, #app-header') || doc.body;
    var span = header.querySelector('[data-app-version-header]');
    if(!span){
      span = doc.createElement('span');
      span.setAttribute('data-app-version-header','');
      span.style.marginLeft = '8px';
      span.style.fontSize = '12px';
      span.style.opacity = '0.8';
      // Try to place near an h1/h2 title if present
      var title = header.querySelector('h1, .title, [data-app-title]');
      if(title){
        title.appendChild(span);
      }else{
        header.insertBefore(span, header.firstChild);
      }
    }
                const appBuild = window.APP_BUILD || 'v8.5.1';
    span.textContent = 'Build ' + appBuild;
    // Also replace any stale static "Build vX" occurrences in header
    var walker = doc.createTreeWalker(header, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    while(walker.nextNode()){ nodes.push(walker.currentNode); }
    nodes.forEach(function(n){
      var t = n.nodeValue || '';
      if(/Build\s+v\d+(\.\d+)*[a-zA-Z0-9\-]*/.test(t)){
                    n.nodeValue = t.replace(/Build\s+v\d+(\.\d+)*[a-zA-Z0-9\-]*/, 'Build ' + (window.APP_BUILD || 'v8.5.1'));
      }
    });
  }
  if(document.readyState!=='loading') bindHeader();
  else document.addEventListener('DOMContentLoaded', bindHeader);
})(window);