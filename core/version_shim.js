// Version Hardening Shim
// - Adds cache-busting param to all <script src> and <link rel="stylesheet"> without an existing query
// - Updates sidebar "Build v..." and module header version chip based on window.APP_BUILD / window.MODULE_VERS
(function(){
  try {
    const build = window.APP_BUILD || 'v8.8.16';
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
      // expose helper
      window.dumpVersions = function(){
        const hash = (location.hash||'').replace(/^#\//,'').split(/[/?#]/)[0] || 'payments';
        const version = vers[hash] || 'v1.1';
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
