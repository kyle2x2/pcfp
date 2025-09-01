# Changelog

## v8.1-gpt (core only)
- Consolidated router/events/store systems
- Introduced APP_META.build for global version
- Added error helpers and editor hygiene
- No module code changes; module versions unchanged

### Technical Changes
- **Router**: Archived `core/kernel.js` to `_archive/core/kernel.esm.js`
- **Events**: Removed `core/bus.js`, using `core/services/events.js`
- **Store**: Removed `core/profile_repo.js`, using `core/services/store.js`
- **Error Handling**: Added `core/services/errors.js` with safe() and assert() helpers
- **Editor Config**: Added `.editorconfig` and `.eslintrc.cjs`

### Versioning
- **Build Version**: `v8.1-gpt` (shows in sidebar)
- **Module Versions**: All remain at `v1.0` (no code changes)
- **Centralized**: All versioning now in `core/config.js`

## v8.1 (previous)
- Initial dual-versioning system implementation
- Centralized version management
- Independent module versioning

## v7.4 (legacy)
- Original module system
- Basic routing and events
- Initial payment planner implementation
