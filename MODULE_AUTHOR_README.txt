PCFP Module Integration (V7.4)
-------------------------------
Hooks you can use:
  - window.PCFP.bus.on('module:enter:<your-module>', ({params}) => { ... })
  - window.PCFP.bus.on('module:leave:<your-module>', () => { ... })
  - window.PCFP.router.go('your-module', { profile: 'id' })

Persistence:
  - await PCFP.ProfileRepo.list(projectId, moduleId)
  - await PCFP.ProfileRepo.save(projectId, moduleId, profileObj)
  - Use PCFP.migrations.runTo(2, profileObj) to upgrade payloads to v2.

Versioning:
  - Global version in core/version.js (use document.querySelector('[data-app-version]').textContent)
