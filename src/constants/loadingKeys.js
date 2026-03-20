// Granular loading keys — each API call can have its own loading flag

import { COMPONENT_KEYS } from "./componentKeys";

// Naming: COMPONENT_ACTION (matches the component it belongs to)
export const LOADING_KEYS = {
  // Global
  GLOBAL: "GLOBAL",

  // Dashboard
  DASHBOARD_GET_STATS: "DASHBOARD_GET_STATS",
  DASHBOARD_GET_CHART: "DASHBOARD_GET_CHART",

  // Add more per feature:
  // USERS_FETCH_LIST: "USERS_FETCH_LIST",
  // USERS_CREATE: "USERS_CREATE",
};

// Map loading keys to their owning component (for cleanup)
export const LOADING_KEY_OWNER = {
  [LOADING_KEYS.DASHBOARD_GET_STATS]: COMPONENT_KEYS.DASHBOARD,
  [LOADING_KEYS.DASHBOARD_GET_CHART]: COMPONENT_KEYS.DASHBOARD,
};
