
// Auto-updates module header with per-module version. Robust against hard-coded spans.
(function() {
  try {
    const appVer = (window.PCFP_VERSION && window.PCFP_VERSION.app) || 'v7.4f';
    const MV = window.PCFP_MODULE_VERSIONS || {};
    // Find active module key
    let key = document.body.getAttribute('data-active-module');
    if (!key) {
      const hash = (location.hash || '').replace(/^#\/?/, '');
      if (hash) key = hash.split(/[?#]/)[0];
    }
    if (!key) key = 'payment-planner';

    // Sidebar global badge
    const gEl = document.getElementById('global-build-version');
    if (gEl) gEl.textContent = appVer;

    // Ensure we have a module title & badge
    const header = document.querySelector('.module-header, .topbar, header.module-topbar') || document;
    let title = document.getElementById('module-title');
    if (!title) {
      title = header.querySelector('#module-title, .module-title, h1');
      if (title && !title.id) title.id = 'module-title';
    }

    let badge = document.getElementById('module-version-badge');
    if (!badge && header) {
      badge = header.querySelector('#module-version-badge');
    }
    if (!badge && title && title.parentElement) {
      badge = document.createElement('span');
      badge.id = 'module-version-badge';
      badge.className = 'version-badge';
      badge.style.marginLeft = '8px';
      title.insertAdjacentElement('afterend', badge);
    }

    // Remove any old hard-coded version spans right after title (to avoid conflicts)
    if (title) {
      let sib = title.nextElementSibling;
      while (sib && sib !== badge) {
        if (sib.classList && sib.classList.contains('version')) {
          const toRemove = sib;
          sib = sib.nextElementSibling;
          toRemove.remove();
        } else {
          sib = sib.nextElementSibling;
        }
      }
    }

    // Set module version text
    const modVer = MV[key] || 'v1.0';
    if (badge) badge.textContent = modVer;
  } catch(e) {
    console.warn('module_header_version hotfix error', e);
  }
})();
