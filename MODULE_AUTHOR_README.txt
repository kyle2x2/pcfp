PCFP Module Integration (V8.4 - BuilderTrend Competitor)
-------------------------------------------------------
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
  - Main app version: APP_META.build or window.APP_BUILD
  - Module versions: window.MODULE_VERS[moduleKey]
  - See VERSIONING_GUIDE.md for complete documentation

Performance & Error Handling:
  - Use safe() and safeAsync() from core/services/errors.js
  - Performance monitoring built-in for all operations
  - Cache management available via PCFP.store.getCacheStats()
  - Error boundaries for module isolation

API-Ready Development:
  - All services designed for future Python backend integration
  - Use PCFP.store.apiCall() for future API integration
  - Event system supports async handlers with performance tracking
  - Modular architecture ready for microservices
