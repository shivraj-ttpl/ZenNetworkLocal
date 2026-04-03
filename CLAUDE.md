# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
- **App**: OneTeam — Healthcare / Care Coordination (Zane Network)
- **Stack**: React 19 + Vite 8 + Redux Toolkit + Redux-Saga + Tailwind CSS v4
- **Language**: JavaScript (JSX) — no TypeScript
- **Package Manager**: npm

## Commands
- **Dev server**: `npm run dev` (port 5173, LAN-accessible)
- **Build**: `npm run build` → `dist/`
- **Lint**: `npm run lint` (ESLint 9 flat config — must pass with zero warnings/errors)
- **Storybook**: `npm run storybook` (port 6006)
- **Preview prod build**: `npm run preview`
- **Base API URL**: `VITE_API_URL` env var (default `http://localhost:8080/api`)

## Architecture

### Hierarchy
```
containers → pages → components
```
- **Containers** render `<Outlet />` for route groups
- **Pages** own their slice, saga, and constants
- **Components** are dumb — receive props, no direct store access

### Dynamic Store (Reducer + Saga Injection)
Reducers and sagas are injected at runtime and cleaned up on unmount. Static reducers (always present): `loading`, `notification`.

**Adding a new page:**
1. Add `COMPONENT_KEYS.MY_PAGE` in `src/constants/componentKeys.js`
2. Create `myPageSlice.js` → call `store.reducerManager.add({ key, addedReducers, initialReducerState })`
3. Create `myPageSaga.js` → call `store.sagaManager.addSaga(key, rootSaga)`
4. In page component → call `useFlexCleanup(COMPONENT_KEYS.MY_PAGE)` for auto-cleanup
5. Define loading keys in `src/constants/loadingKeys.js` with `LOADING_KEY_OWNER` mapping

### API Call Pattern
Every API call goes through the `apiCall` generator in `src/core/store/sagaHelpers.js`:
```js
yield* apiCall({
  loadingKey: LOADING_KEYS.MY_PAGE_FETCH_LIST,
  apiFunc: () => MyPageDataService.getList(payload),
  onSuccess: function* (response) { yield put(setList(response.data)); },
  // optional: onError, showErrorToast (default true)
});
```
Saga actions use `createSagaActions`:
```js
export const myPageActions = createSagaActions('MY_PAGE', ['fetchList', 'createItem']);
```

### Service Layer
- One service file per base URL, extends `DataService` (`src/services/utils/dataservice/DataService.js`)
- Static methods per endpoint — no direct `axios.get/post` anywhere except `DataService`
- Axios interceptors handle: auto-trim strings, global loader, token injection (`Bearer`), 401 → redirect to `/login`

### Loading State System
- **Global loading** (`loading.global`): toggled by Axios interceptors, full-screen overlay
- **Per-key loading** (`loading.keys[key]`): set by `apiCall`, for granular UI
- Hooks: `useLoadingKey(LOADING_KEYS.XX)` → boolean, `useAnyLoading("PREFIX")` → boolean
- Loading key naming: `COMPONENT_ACTION` (e.g., `DASHBOARD_GET_STATS`)

### GET API Data Refresh Pattern
For GET APIs that need refresh after mutations:
- Add `refreshFlag: 0` in slice initial state
- Update with `Date.now()` when refresh is needed
- Use in `useEffect` dependency to trigger saga dispatch

### Filters & Sorting
Store all filters and sorting parameters in the Redux slice — never in component-level state. Always use slice state when calling APIs.

## Key Rules

### Component Rules
- Functional components only, single responsibility
- **NEVER modify common/shared components** (`src/components/commonComponents/`) unless explicitly asked with component name + specific requirement
- No API calls inside components — all side effects go through sagas
- No business logic in components — keep in slices/sagas/utils
- Every component/page that fetches data **must have a skeleton loader** using `useLoadingKey`

### Forms (Strict)
- **All forms must use Formik**
- Field names in page `constant.js` as `FORM_FIELDS_NAMES`
- Validation via `getValidationSchema()` from `src/utils/formUtils/index.js` (declarative config supporting: required, email, password, regex, min/max length, dropdown, multi-select, conditional `when`, custom validation)
- Dropdown/select options must be in page constants — no hardcoding in components

### Styling
- Tailwind utility-first only, no inline styles unless unavoidable
- Use design tokens from `index.css` `@theme` (primary blue, secondary purple, neutral, semantic colors)
- Match designs 100% pixel-perfect when provided

### Toast Messages
- Never hardcode toast messages — always use constants from `src/constants/toastMessages`
- Redux-driven: `dispatch(addNotification({ message, variant }))` or `showToast()` utility

### Import Rules
- Use `@/` alias for absolute imports (mapped to `./src` in vite.config.js)
- No deep relative paths (`../../../`) — use relative only for nearby files within same feature
- Order enforced by `simple-import-sort`: external libs → internal modules → styles

### Routing
- New pages must be added to `src/routes/routeConfig.js`
- All page components are lazy-loaded (`React.lazy`)
- Three categories: protected (`routeConfig`), public-only (`publicRouteConfig`), shared (`sharedRouteConfig`)
- `nav: true` + `icon` for Navbar visibility

### Code Quality
- No `console.log`, `debugger`, or debug leftovers (`no-console` and `no-debugger` are ESLint errors)
- No dead code, commented-out code, unused imports (`unused-imports` plugin enforced)
- No circular dependencies (`import-x/no-cycle` enforced)
- ESLint limits: max cyclomatic complexity 10, max nesting depth 4, max 80 lines per function
- `react-hooks/exhaustive-deps` is an error (not a warning)

### Naming Conventions
| Type | Convention | Example |
|---|---|---|
| Components | PascalCase | `UserProfile.jsx` |
| Functions/hooks | camelCase | `useLoadingKey` |
| Constants | UPPER_SNAKE_CASE | `COMPONENT_KEYS` |
| Slices | camelCase + `Slice` | `dashboardSlice.js` |
| Sagas | camelCase + `Saga` | `dashboardSaga.js` |
| Services | PascalCase + `DataService` | `DashboardDataService.js` |

## Common Components Available
- `Button` — variants: primary, secondary, outline, ghost, link, primaryBlue, outlineBlue
- `Input` — with label, error/touched, required, password toggle
- `TextArea` — with Formik ErrorMessage built-in, label, isRequired
- `Checkbox` — variants: primary, secondary, blue
- `SelectDropdown` — static single/multi select
- `AsyncSelectDropdown` — API-driven with infinite scroll
- `Table` — TanStack React Table wrapper with buildColumns helper
- `Pagination` — with page/limit controls
- `Drawer` — slide-in panel with header, body, footer
- `ActionDropdown` — portal-based dropdown with nested support
- `ToggleSwitch` — toggle with active/inactive labels
- `Avatar` — with initials fallback
- `Icon` — unified: local SVGs → lucide-react fallback
