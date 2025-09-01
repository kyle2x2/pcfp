PCFP Module Integration (V8.1-gpt)
---------------------------------
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
  - Main app version: window.APP_BUILD or APP_META.build
  - Module versions: window.MODULE_VERS[moduleKey]
  - Do not hardcode version strings; use APP_META.build or module.version

Dual-Versioning System:
  - Build version (v8.1-gpt): Shows in sidebar, changes with every app iteration
  - Module version (v1.0): Shows in module header, only changes when module code changes
  - Each module has its own independent version
