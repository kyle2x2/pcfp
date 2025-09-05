// core/header_version.js - ensure header displays PCFP.version
(function(g){
  function bindHeader(){
    var doc = document;
    // Only target the main app header in the sidebar, not module headers
    var header = doc.querySelector('aside header');
    if(!header) return; // Don't proceed if we can't find the sidebar header
    
    var span = header.querySelector('[data-app-version-header]');
    if(!span){
      span = doc.createElement('span');
      span.setAttribute('data-app-version-header','');
      span.style.marginLeft = '8px';
      span.style.fontSize = '12px';
      span.style.opacity = '0.8';
      // Add to the sidebar header
      header.appendChild(span);
    }
                const appBuild = window.APP_BUILD || 'v8.8.24';
    span.textContent = 'Build ' + appBuild;
  }
  if(document.readyState!=='loading') bindHeader();
  else document.addEventListener('DOMContentLoaded', bindHeader);
})(window);