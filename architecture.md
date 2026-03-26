# NewProject (OneTeam) — Architecture Document

## Overview

| Property | Value |
|---|---|
| **App Name** | OneTeam |
| **Domain** | Healthcare / Care Coordination (Zane Network) |
| **Stack** | React 19 + Vite 8 + Redux Toolkit + Redux-Saga + Tailwind CSS v4 |
| **Language** | JavaScript (JSX) — no TypeScript |
| **Package Manager** | npm |
| **Dev Server** | `vite` on port 5173 (`host: true`) |
| **Build** | `vite build` → `dist/` |
| **Lint** | ESLint 9 (flat config) + react-hooks + react-refresh |
| **Base API URL** | `VITE_API_URL` (env var, default `http://localhost:8080/api`) |

---

## Directory Structure

```
src/
├── app/                          # App-level layout
│   └── MainAppLayout.jsx         # Navbar + Outlet + GlobalLoader
├── assets/brand/                 # Brand images (logos, auth poster)
├── components/
│   ├── commonComponents/         # Reusable UI library
│   │   ├── avatar/Avatar.jsx
│   │   ├── button/Button.jsx
│   │   ├── checkbox/Checkbox.jsx
│   │   ├── input/Input.jsx
│   │   ├── navbar/Navbar.jsx
│   │   ├── pagination/Pagination.jsx
│   │   ├── selectDropdown/
│   │   │   ├── SelectDropdown.jsx       # Static options (single/multi)
│   │   │   ├── AsyncSelectDropdown.jsx  # API-driven + infinite scroll
│   │   │   └── useDropdownPosition.js   # Auto up/down positioning
│   │   ├── table/
│   │   │   ├── Table.jsx                # TanStack React Table wrapper
│   │   │   ├── tableHelpers.js          # buildColumns, sticky offsets, sort
│   │   │   └── index.js                 # Barrel export
│   │   └── toaster/
│   │       ├── ToastListener.jsx        # Redux → react-toastify bridge
│   │       └── toastStyles.css          # Toast theme overrides
│   └── icons/
│       ├── Icon.jsx              # Unified: local SVGs → lucide-react fallback
│       ├── index.js
│       └── vectors/              # Custom SVG icon components
├── constants/
│   ├── componentKeys.js          # COMPONENT_KEYS registry
│   └── loadingKeys.js            # LOADING_KEYS + owner map
├── containers/                   # Route group layouts (render <Outlet />)
│   ├── MasterData/
│   ├── Settings/
│   └── SubOrganizations/
├── core/store/                   # Redux store infrastructure
│   ├── store.js                  # configureStore + attach managers
│   ├── reducerManager.js         # Dynamic reducer injection/removal
│   ├── sagaManager.js            # Dynamic saga injection/removal
│   ├── sagaHelpers.js            # apiCall wrapper + createSagaActions
│   ├── loadingSlice.js           # Global + per-key loading state
│   ├── notificationSlice.js      # Toast notification queue
│   └── index.js                  # Barrel export
├── data/                         # Mock/static data
│   └── usersData.js
├── hooks/
│   ├── useFlexCleanup.js         # Auto-cleanup reducer + saga + loading on unmount
│   └── useLoadingKey.js          # Selector hooks for loading state
├── pages/
│   ├── Auth/
│   │   ├── AuthLayout.jsx        # Split-screen auth layout (poster + form)
│   │   ├── Login.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── SetPassword.jsx
│   │   ├── PasswordRules.jsx     # Real-time password strength checklist
│   │   └── constant.js           # Form field names + validation regex
│   └── Dashboard/
│       ├── Dashboard.jsx          # Demo: table, dropdowns, pagination
│       ├── dashboardSlice.js      # Dynamic reducer registration
│       └── dashboardSaga.js       # Dynamic saga registration + API calls
├── routes/
│   ├── routeConfig.js            # Route definitions (protected, public, shared)
│   └── AppRouter.jsx             # BrowserRouter + route guards
├── services/
│   ├── utils/dataservice/
│   │   └── DataService.js        # Axios wrapper (base class) + interceptors
│   └── appDataService/
│       ├── AppDataService.js     # Default instance (VITE_API_URL)
│       └── DashboardDataService.js
├── utils/
│   ├── formUtils/index.js        # Yup schema builder (declarative field config)
│   ├── GeneralUtils.js           # formatErrorMessage, formatDate, deepClone, etc.
│   ├── sanitizeUtils.js          # deepTrimStrings, isMultipartOrBinary
│   └── toastUtils.js             # showToast() — fire toast from anywhere
├── App.jsx                       # Root: Provider + AppRouter + ToastContainer
├── main.jsx                      # Entry: createRoot
└── index.css                     # Tailwind v4 @theme — design tokens
```

---

## Configuration Details

### Vite (`vite.config.js`)
- **Plugins**: `@vitejs/plugin-react`, `@tailwindcss/vite`
- **Path alias**: `@` → `./src`
- **Dev server**: port 5173, `host: true` (accessible on LAN)

### Tailwind CSS v4 (`index.css`)
- Uses `@theme` directive (Tailwind v4 native — no `tailwind.config.js`)
- **Font**: Inter (Google Fonts, preconnected in `index.html`)
- **Design tokens**:
  - Primary (Blue): `--color-primary-50` to `--color-primary-900` — buttons, active states
  - Secondary (Purple): `--color-secondary-50` to `--color-secondary-900` — auth buttons, accents, form focus
  - Neutral: 50–900 — backgrounds, borders, text
  - Semantic: success (green), error (red), warning (amber), info (blue)
  - Surface/Layout: `--color-surface` (#FFF), `--color-page-bg` (#FBFBFB)
  - Text: `--color-text-primary` (#2B2B2B), secondary, placeholder, disabled, inverse, link, error
- **Custom animation**: `loader-pulse` (dot loader for loading states)

### ESLint (`eslint.config.js`)
- Flat config (ESLint 9)
- Extends: `js.configs.recommended`, `react-hooks`, `react-refresh`
- Ignores `dist/`
- `no-unused-vars`: error, but ignores vars starting with uppercase or underscore (`^[A-Z_]`)

### Environment (`.env.example`)
- `VITE_API_URL=http://localhost:8080/api`

### VS Code Settings
- Suppresses unknown CSS at-rules warning (for Tailwind)

---

## Core Architecture Patterns

### 1. Dynamic Store (Reducer + Saga Injection)

The store uses **runtime injection** — reducers and sagas are registered when a page mounts and cleaned up on unmount.

**Flow for adding a new page:**
1. Define `COMPONENT_KEYS.MY_PAGE` in `src/constants/componentKeys.js`
2. Create `myPageSlice.js` — calls `store.reducerManager.add({ key, addedReducers, initialReducerState })`
3. Create `myPageSaga.js` — defines sagas + calls `store.sagaManager.addSaga(key, rootSaga)`
4. In the page component, call `useFlexCleanup(COMPONENT_KEYS.MY_PAGE)` for auto-cleanup

**Static reducers** (always present): `loading`, `notification`

### 2. API Call Pattern

Every API call goes through the `apiCall` generator in `sagaHelpers.js`:

```js
yield* apiCall({
  loadingKey: LOADING_KEYS.DASHBOARD_GET_STATS,
  apiFunc: () => DashboardDataService.getStats(payload),
  onSuccess: function* (response) {
    yield put(setStats(response.data));
  },
  // optional: onError, showErrorToast (default true)
});
```

This automatically:
- Sets/clears the loading key in Redux
- Shows error toast on failure (via `formatErrorMessage`)
- Calls `onError` callback if provided

### 3. Saga Action Creators

```js
export const dashboardActions = createSagaActions("DASHBOARD", ["fetchStats", "fetchChart"]);
// dashboardActions.fetchStats(payload) => { type: "DASHBOARD/FETCH_STATS", payload }
```

### 4. Loading State System

**Two tiers:**
- **Global loading** (`loading.global`): toggled by Axios interceptors, shows full-screen overlay
- **Per-key loading** (`loading.keys[key]`): set by `apiCall` wrapper, for granular UI indicators

**Hooks:**
- `useLoadingKey(LOADING_KEYS.DASHBOARD_GET_STATS)` → boolean
- `useAnyLoading("DASHBOARD")` → boolean (any key with prefix)

**Loading key naming**: `COMPONENT_ACTION` (e.g., `DASHBOARD_GET_STATS`)

### 5. Service Layer

```
DataService (base class — Axios wrapper)
  └── AppDataService (singleton, uses VITE_API_URL)
       └── DashboardDataService (static methods per endpoint)
```

**Axios interceptors** (global, in DataService.js):
- Request: auto-trim strings, global loader toggle, skip `NO_LOADER_ENDPOINTS`
- Response: global loader decrement, **401 → auto-redirect to `/login`** (clears token/user)
- Token injection via `Authorization: Bearer <token>` from `localStorage`

### 6. Routing Architecture

**Three route categories:**
| Category | Guard | Layout | Example |
|---|---|---|---|
| Protected (`routeConfig`) | `ProtectedRoute` — requires `localStorage.token` | `MainAppLayout` (Navbar + Outlet) | `/dashboard`, `/master-data`, `/settings` |
| Public-only (`publicRouteConfig`) | `PublicOnlyRoute` — redirects to `/dashboard` if logged in | None (Auth pages use `AuthLayout`) | `/login`, `/forgot-password`, `/reset-password`, `/set-password` |
| Shared (`sharedRouteConfig`) | `SharedRoute` — optional layout | Conditional `MainAppLayout` | (empty, reserved) |

**Route config structure:**
- `nav: true` → shown in Navbar tab bar
- `icon` → lucide icon name
- `children` → nested routes (container renders `<Outlet />`)
- All pages are **lazy-loaded** (`React.lazy`)

**Catch-all**: `*` → redirects to `/dashboard`

### 7. Auth Pattern
- Token stored in `localStorage` as `token`
- No auth Redux slice yet — Login currently uses `setTimeout` mock
- Auth guard checks `localStorage.getItem("token")`
- 401 interceptor handles session expiry globally

### 8. Form Pattern
- **All forms use Formik**
- Field names defined in page `constant.js` as `FORM_FIELDS_NAMES`
- Validation via `getValidationSchema()` from `formUtils` — declarative config:
  ```js
  const fields = [
    { fieldName: "email", isRequired: true, isEmail: true },
    { fieldName: "password", isRequired: true, isPassword: true, regexPattern: REGEX },
  ];
  ```
- Supports: required, email, password, regex, min/max length, dropdown (object), multi-select (array), conditional (`when`), custom validation
- Dropdown options go in the page's constants file

### 9. Notification/Toast System
- Redux-driven: `dispatch(addNotification({ message, variant }))`
- `ToastListener` component bridges Redux → `react-toastify`
- `showToast()` utility for non-React contexts
- Variants: SUCCESS, ERROR, WARNING, INFO
- Styled via `toastStyles.css` using design tokens

### 10. Icon System
- `<Icon name="..." />` — unified component
- **Priority**: local SVG registry (`components/icons/vectors/`) → dynamic lucide-react import
- Lucide icons are **lazy-loaded and cached** (code-split per icon)
- Local icons: `CloseIcon`, `SearchIcon`

---

## Common Components Reference

| Component | Props (key) | Notes |
|---|---|---|
| **Button** | variant (primary/secondary/outline/ghost/link), size (sm/md/lg), loading, fullWidth | Primary = secondary purple color |
| **Input** | label, name, type, error, touched, required | Auto password toggle, autocomplete map |
| **Checkbox** | checked, indeterminate, variant (primary/secondary/blue), size | Custom visual, supports forms |
| **Avatar** | src, name, size (xs/sm/md/lg), online | Initials fallback |
| **SelectDropdown** | options, value, onChange, isMulti, isSearchable, selectAll, renderOption | Static options |
| **AsyncSelectDropdown** | url OR fetchOptions, value, onChange, isMulti, labelKey, valueKey, limit, debounceMs | Infinite scroll, server search |
| **Table** | columns (via buildColumns), data, sortKey, sortOrder, onSortChange, selectable, selectedRows, maxHeight, loading | Manual sorting, sticky columns |
| **Pagination** | totalRecords, totalPages, currentPage, currentLimit, onPageChange, onLimitChange | Ellipsis page numbers |
| **Navbar** | (reads routeConfig) | Logo bar + tab navigation |

---

## Key Dependencies

| Package | Version | Purpose |
|---|---|---|
| react | 19.2 | UI framework |
| @reduxjs/toolkit | 2.11 | State management |
| redux-saga | 1.4 | Side effects (API calls) |
| react-router-dom | 7.13 | Routing |
| axios | 1.13 | HTTP client |
| formik | 2.4 | Form management |
| yup | 1.7 | Validation schemas |
| @tanstack/react-table | 8.21 | Table engine |
| tailwindcss | 4.2 | CSS framework (v4, @theme) |
| lucide-react | 0.577 | Icon library |
| react-toastify | 11.0 | Toast notifications |
| dayjs | 1.11 | Date formatting |
| downshift | 9.3 | Accessible combobox (available, not yet used) |

---

## Development Rules (from `rules.md`)

1. **Never modify common components** unless explicitly asked with component name + specific requirement
2. Component keys go in `src/constants/componentKeys.js`
3. Sagas must follow existing patterns — analyze before creating
4. Every API call uses `apiCall` wrapper with a **unique loading key** in `src/constants/loadingKeys.js`
5. Forms: field arrays in constants, validation via `formUtils`, **always Formik**
6. Dropdown options arrays go in page constants
7. New pages must be added to `routeConfig.js`
8. Always analyze existing structure before implementing
9. Every page must use `useFlexCleanup(COMPONENT_KEYS.XX)`
10. Reusable functions go in `GeneralUtils.js`
11. Match designs 100% when provided
12. Follow container → page → component hierarchy
13. Ask questions when unclear
14. Verify build + linting after changes
15. Clean code, check for side effects
16. Use prebuilt components first

---

## Current State

- **Auth**: Login, ForgotPassword, ResetPassword, SetPassword — all functional with mock API
- **Dashboard**: Demo page with table (mock users data), dropdowns, pagination
- **Containers**: MasterData, SubOrganizations, Settings — shells only (`<Outlet />`)
- **No real API integration yet** — login uses `setTimeout` mock, dashboard uses static data
- **No auth slice** — token management is `localStorage` only
- **No sidebar** — navigation is horizontal tab bar in Navbar
