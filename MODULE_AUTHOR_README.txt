PCFP Module Integration (V8.1 - Cursor Branch)
----------------------------------------------
Hooks you can use:
  - window.PCFP.events.on('module:enter:<your-module>', ({params}) => { ... })
  - window.PCFP.events.on('module:leave:<your-module>', () => { ... })
  - window.PCFP.router.go('your-module', { profile: 'id' })

Persistence:
  - await PCFP.store.listProfiles()
  - await PCFP.store.saveProfile(profileObj)
  - Use PCFP.migrations.runTo(2, profileObj) to upgrade payloads to v2.

Versioning:
  - All versioning is centralized in core/config.js
  - Main app version: window.APP_BUILD
  - Module versions: window.MODULE_VERS[moduleKey]
  - See VERSIONING_GUIDE.md for complete documentation
