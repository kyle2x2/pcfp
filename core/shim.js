// v6.4 shim to expose modules as globals for file://
import { createEventBus } from './services/events.js';
import { createStore, loadPersisted } from './services/store.js';
import { createLocalAdapter } from './services/adapters.js';
import { computeMonthly } from './compute/money.js';

window.__pcfpCore = { createEventBus, createStore, loadPersisted, createLocalAdapter };
window.__pcfpCompute = { computeMonthly };
