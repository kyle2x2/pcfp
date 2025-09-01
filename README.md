# PCFP - Project Construction Financial Planner

A modular web application for construction project management with independent module versioning.

## Quick Start

```bash
# Start development server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

## Architecture

### Core Systems
- **Router**: `core/kernel.standalone.js` - Navigation and routing
- **Events**: `core/services/events.js` - Pub/sub event system  
- **Store**: `core/services/store.js` - Data persistence and management
- **Versioning**: `core/config.js` - Centralized version management

### Module System
Each module is independent with its own version and functionality:
- 💸 **Payment Planner** - Financial planning and payment tracking
- 📅 **Schedule** - Project scheduling and timeline management
- 📝 **Daily Logs** - Daily activity logging and reporting
- ✅ **To-Dos** - Task management and completion tracking
- 🔁 **Change Orders** - Change order management and approval
- 🎯 **Selections** - Material and vendor selection tracking
- 📐 **Specifications** - Technical specifications and requirements
- 📄 **Documents** - Document management and storage
- 💼 **Bids** - Bid management and comparison
- 🧾 **Purchase Orders** - Purchase order creation and tracking
- 🧮 **Bills** - Bill management and payment tracking
- 📊 **Budget** - Budget planning and monitoring
- 🧾 **Invoices** - Invoice creation and management

## Versioning System

### Dual-Versioning Policy
PCFP uses a dual-versioning system to track changes independently:

1. **Build Version** (`v8.1-gpt`)
   - Shows in the left sidebar as "Build v8.1-gpt"
   - Changes with every application iteration
   - Reflects core system changes
   - Defined in `core/config.js` as `APP_META.build`

2. **Module Versions** (`v1.0`)
   - Shows in each module header
   - Only changes when that specific module's code changes
   - Independent of other modules and core system
   - Defined in `core/config.js` as `window.MODULE_VERS[moduleKey]`

### Version Management
- **Centralized**: All versioning is managed in `core/config.js`
- **No Hardcoding**: UI elements pull versions from centralized source
- **Independent**: Module versions are independent of each other
- **Clear Separation**: Build version ≠ Module versions

### Example
```
Sidebar: "Build v8.1-gpt"          ← Core system version
Payment Planner: "Payment Planner • v1.0"  ← Module version
Daily Logs: "Daily Logs • v1.0"    ← Module version
```

## Development

### Prerequisites
- Python 3 (for local server)
- Modern web browser

### Code Quality
```bash
# Check for code issues (if ESLint is installed)
npm run lint

# Auto-fix code issues
npm run lint:fix
```

### Error Handling
The application includes comprehensive error handling:
- `core/services/errors.js` - Error handling helpers
- Graceful degradation for failed operations
- User-friendly error messages
- Developer logging for debugging

## Module Development

See `MODULE_AUTHOR_README.txt` for detailed module integration guide.

### Key Integration Points
- **Events**: Use `window.PCFP.events` for module communication
- **Store**: Use `window.PCFP.store` for data persistence
- **Router**: Use `window.PCFP.router` for navigation
- **Versioning**: Use `window.MODULE_VERS[moduleKey]` for module version

## File Structure

```
pcfp/
├── core/                    # Core application systems
│   ├── config.js           # Centralized configuration
│   ├── kernel.standalone.js # Main router
│   ├── services/           # Service layer
│   │   ├── events.js       # Event system
│   │   ├── store.js        # Data store
│   │   └── errors.js       # Error handling
│   └── ...
├── modules/                # Individual modules
│   ├── payment-planner/    # Payment planning module
│   ├── schedule/          # Scheduling module
│   └── ...
├── components/            # Shared UI components
├── _archive/             # Archived files
└── index.html            # Main application entry
```

## License

© 2x2 Construction
