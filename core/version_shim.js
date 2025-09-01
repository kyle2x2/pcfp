// Version Hardening Shim
// - Adds cache-busting param to all <script src> and <link rel="stylesheet"> without an existing query
// - Updates sidebar "Build v..." and module header version chip based on window.APP_BUILD / window.MODULE_VERS
(function(){
  try {
    const build = window.APP_BUILD || 'v?';
    const vers = window.MODULE_VERS || {};
    // Cache-bust static assets when running from file:// to avoid stale JS
    if (location.protocol === 'file:') {
      const bust = `v=${encodeURIComponent(build)}`;
      document.querySelectorAll('script[src],link[rel="stylesheet"][href]').forEach(el => {
        const attr = el.tagName === 'SCRIPT' ? 'src' : 'href';
        const url = new URL(el.getAttribute(attr), location.href);
        if (!url.search) { url.search = bust; el.setAttribute(attr, url.href); }
      });
    }

    // After load, patch badges
    function patchBadges(){
      // Sidebar build badge – try common selectors
      const sidebar = document.querySelector('aside') || document.querySelector('.sidebar');
      if (sidebar){
        const allChips = sidebar.querySelectorAll('small, .badge, .chip, .version, .build');
        let buildNode = null;
        for (const n of allChips){
          const t = (n.textContent||'').toLowerCase();
          if (t.includes('build v')) { buildNode = n; break; }
        }
        if (buildNode){ buildNode.textContent = `Build ${build}`; }
        else {
          // create discreet build chip at the top if none exists
          const chip = document.createElement('div');
          chip.className = 'version chip build';
          chip.style.cssText = 'font-size:12px;opacity:.8;margin-left:6px;display:inline-block;';
          chip.textContent = `Build ${build}`;
          const h = sidebar.querySelector('header, .app-name, .logo, h1, h2');
          if (h && h.parentNode) h.parentNode.insertBefore(chip, h.nextSibling);
        }
      }

      // Module header version
      // Determine current route key from hash: '#/payments'
      const hash = (location.hash||'').replace(/^#\//,'').split(/[/?#]/)[0] || 'payments';
      const version = vers[hash] || 'v1.0';
      // look for <strong id="module-title">..</strong><span class="version">..</span>
      let titleNode = document.querySelector('#module-title') || document.querySelector('.module-title');
      if (titleNode){
        let chip = titleNode.nextElementSibling;
        if (!chip || !/version|chip/.test(chip.className||'')){
          chip = document.createElement('span');
          chip.className = 'version chip';
          chip.style.cssText = 'margin-left:8px;font-size:12px;opacity:.9;';
          titleNode.parentNode.insertBefore(chip, titleNode.nextSibling);
        }
        chip.textContent = version;
      }
      // expose helper
      window.dumpVersions = function(){
        console.log('APP_BUILD=', build, 'ROUTE=', hash, 'MODULE_VERSION=', version, 'MAP=', vers);
      };
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive'){
      patchBadges();
    } else {
      document.addEventListener('DOMContentLoaded', patchBadges, {once:true});
    }
    window.addEventListener('hashchange', patchBadges);
  } catch(e){
    console.warn('version_shim error', e);
  }
})();
