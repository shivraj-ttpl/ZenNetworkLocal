# Frontend Engineering Rules (Strict Mode)

> React 19 + Redux Toolkit + Redux-Saga + Tailwind CSS v4 | Production-grade, 100k+ users

---

## 1. Global Principles (Non-Negotiable)

- No shortcuts, no temporary hacks
- No `console.log`, `debugger`, or debug leftovers
- No dead code, no commented-out code, no unused imports
- No circular dependencies
- No breaking changes without explicit confirmation
- No feature + refactor in the same task
- DRY enforced at all times — extract to `/hooks`, `/utils`, `/services`
- Prefer clarity over cleverness
- Code must be clean, readable, and self-documenting

---

## 2. Component Architecture

- Functional components only — no classes
- Single responsibility per component
- No API calls inside components — all side effects go through sagas
- No business logic inside components — keep in slices/sagas/utils
- Hooks over HOCs

### Shared Component Rule

- **Do NOT modify common/shared components** unless explicitly instructed with component name + specific requirement
- Always reuse existing components before creating new ones
- No duplicate UI implementations

### Skeleton Loading (Mandatory)

- Every component/page that fetches data **must have a skeleton loader**
- Display skeleton when the API for that specific component is loading
- Use `useLoadingKey(LOADING_KEYS.XX)` to determine loading state per component

### Lazy Loading

- **Page-level components**: always lazy load via `React.lazy` + `Suspense`
- **Heavy components** (tables, charts, large lists): lazy load
- Regular child components: do NOT lazy load — direct imports

---

## 3. State Management (Redux Toolkit + Saga)

### Redux Toolkit

- One slice per feature/page
- Minimal, normalized state — no redundant data
- No direct state mutation outside Immer (RTK handles this)
- Prefer local state (`useState`) when global state is unnecessary

### Redux Saga

- All side effects go through sagas
- Handle: API calls, retries, cancellation, error handling
- Use `takeLatest` by default
- No API calls in components or hooks — ever

### Dynamic Store Pattern (Mandatory)

1. Define `COMPONENT_KEYS.MY_PAGE` in `src/constants/componentKeys.js`
2. Create `myPageSlice.js` → calls `store.reducerManager.add()`
3. Create `myPageSaga.js` → calls `store.sagaManager.addSaga()`
4. In page component → call `useFlexCleanup(COMPONENT_KEYS.MY_PAGE)`
5. Always analyze existing saga structure before creating new ones — follow same patterns

### Saga Actions

```js
export const myPageActions = createSagaActions('MY_PAGE', ['fetchList', 'createItem']);
```

### API Call Pattern

```js
yield* apiCall({
  loadingKey: LOADING_KEYS.MY_PAGE_FETCH_LIST,
  apiFunc: () => MyPageDataService.getList(payload),
  onSuccess: function* (response) {
    yield put(setList(response.data));
  },
});
```

- Every API call **must** use `apiCall` wrapper
- Every API call **must** have a unique `loadingKey`
- Define loading keys in `src/constants/loadingKeys.js`
- Loading key **must** belong to its respective `componentKey`
- Loading key naming: `COMPONENT_ACTION` (e.g., `DASHBOARD_GET_STATS`)

---

## 4. Service Layer

### One Service File Per Base URL

- Services are separated by base URL — one file per base URL
- Each service extends `DataService` (Axios wrapper)
- Static methods per endpoint

```
services/
├── utils/dataservice/DataService.js    # Base class — never modify
├── appDataService/
│   ├── AppDataService.js               # VITE_API_URL base
│   └── DashboardDataService.js         # Endpoints for dashboard
├── externalService/                    # If another base URL exists
│   ├── ExternalDataService.js          # VITE_EXTERNAL_URL base
│   └── ReportDataService.js
```

- No direct API calls outside services/sagas
- No `axios.get/post` anywhere except in `DataService` base class

---

## 5. Forms (Strict)

- Every form **must** use Formik
- Field names defined in page `constant.js` as `FORM_FIELDS_NAMES`
- Validation via `getValidationSchema()` from `formUtils` — declarative config
- Dropdown/select options **must** be defined in page constants — no hardcoding inside components
- Reusable form logic goes in `/hooks` or `/utils/formUtils`

---

## 6. Folder Structure & Hierarchy

```
src/
├── app/                    # App-level layout
├── assets/                 # Static assets (images, fonts)
├── components/
│   ├── commonComponents/   # Reusable UI library (DO NOT MODIFY without permission)
│   └── icons/              # Icon system
├── constants/              # componentKeys, loadingKeys, app-wide constants
├── containers/             # Route group layouts (render <Outlet />)
├── core/store/             # Redux store infrastructure (DO NOT MODIFY without permission)
├── hooks/                  # Reusable custom hooks
├── pages/                  # Feature pages (slice + saga + components)
├── routes/                 # Route config + AppRouter
├── services/               # API service layer (grouped by base URL)
├── utils/                  # Utility functions
└── styles/                 # Global styles if needed
```

### Hierarchy: `containers → pages → components`

- Containers render `<Outlet />`
- Pages own their slice, saga, and constants
- Components are dumb — receive props, no direct store access unless necessary

---

## 7. Routing

- New pages **must** be added to `routeConfig.js`
- Use `nav: true` + `icon` for navbar visibility
- Three categories: protected, public-only, shared
- All page components are lazy-loaded in route config

---

## 8. Styling (Tailwind CSS v4)

- Tailwind utility-first only
- No inline styles unless absolutely unavoidable
- Reuse style patterns — maintain design consistency
- Use design tokens from `index.css` `@theme`
- Match Figma/designs 100% pixel-perfect when provided

---

## 9. Performance

- Prevent unnecessary re-renders: `React.memo`, `useMemo`, `useCallback`
- Lazy load page-level and heavy components
- Code splitting required
- Optimize large lists (virtualization if needed)
- No redundant state — derive computed values instead of storing them

---

## 10. Naming Conventions

| Type | Convention | Example |
|---|---|---|
| Components | PascalCase | `UserProfile.jsx` |
| Functions/hooks | camelCase | `useLoadingKey`, `formatDate` |
| Constants | UPPER_SNAKE_CASE | `COMPONENT_KEYS`, `LOADING_KEYS` |
| Slices | camelCase + `Slice` suffix | `dashboardSlice.js` |
| Sagas | camelCase + `Saga` suffix | `dashboardSaga.js` |
| Services | PascalCase + `DataService` suffix | `DashboardDataService.js` |
| Loading keys | COMPONENT_ACTION | `DASHBOARD_GET_STATS` |

---

## 11. Import Rules

- Absolute imports preferred (use `@/` alias)
- No deep relative paths (`../../../`)
- Import order (enforced by `simple-import-sort`):
  1. External libraries
  2. Internal modules
  3. Styles

---

## 12. Linting & Formatting (Zero Tolerance)

- All code **must** pass ESLint with **zero warnings, zero errors**
- Prettier **must** be integrated — auto-format on save
- No manual formatting inconsistencies
- Always verify lint + build after changes

### Pre-Commit Hooks (Required)

- `husky` + `lint-staged`
- Enforce before every commit: ESLint (no warnings), Prettier format, no unused files

---

## 13. Dead Code Rules (Zero Tolerance)

- No unused: variables, functions, components, slices, actions, sagas, imports
- No commented-out code
- Remove deprecated logic immediately or document with `@deprecated` + removal date
- Fix DRY violations immediately

---

## 14. Bug Fixing

- Fix root cause only — no patch fixes
- Prevent recurrence
- No side effects introduced

---

## 15. Refactoring

- Only when explicitly requested
- No behavior changes
- Never mix with feature work

---

## 16. Build Failure Conditions

Code **must not** be merged if:

- ESLint errors or warnings exist
- Dead code exists
- Duplicate logic exists
- Circular dependency detected
- Console logs found
- Unused imports exist

---

## 17. Implementation Checklist

### Before Coding

- [ ] Analyze existing structure and patterns
- [ ] Check for reusable components
- [ ] Verify folder hierarchy
- [ ] Confirm API + saga patterns
- [ ] Confirm constants placement (componentKey, loadingKey, form fields)

### After Coding

- [ ] Clean code, consistent with existing patterns
- [ ] No side effects introduced
- [ ] No unnecessary re-renders
- [ ] Skeleton loader implemented for data-fetching components
- [ ] Build passes
- [ ] Lint passes with zero warnings
- [ ] Proper formatting (Prettier)

---

## 18. Final Rule

If anything touches shared logic, affects multiple modules, or modifies common components → **ask before implementing. Never assume.**


## 19. Steps for API Inegrations 

API Integration Guidelines

1. Project Structure
Always analyze the existing folder and file structure first.
Do not introduce new patterns — strictly follow the current project structure.
Maintain consistency with existing modules (e.g., auth).

2. Constants Usage

All component keys must be imported from:

src/constants/componentKey

Loading keys must be defined in:

src/constants/loadingKeys

Toast messages must be defined in:

src/constants/toastMessages

3. API Calls
Every API call must be wrapped using the apiCall wrapper.
Each API call must have a unique loadingKey.
Never hardcode loading states — always use the centralized loadingKeys.

4. Service Layer
Create service files based on base URLs (e.g., auth, user, etc.).
Example:
If base URL = auth → use/create authDataService.js
Add all related API methods inside the corresponding service file.
Do NOT create a new service file if one already exists for the same base URL.

5. Saga Implementation
Follow the same saga structure used in the auth module.
Ensure:
Proper separation of concerns
Reusable and consistent saga patterns

6. Slice & State Management
Follow existing slice structure strictly.
Keep state management consistent with other modules.
Avoid introducing new patterns unless explicitly required.

7. GET API Handling (Data Refresh Pattern)
For every GET API  (if needed):
Add a refresh flag in the slice.

Initial value should be:

refreshFlag: 0
Update this flag with Date.now() when refresh is needed.

Use this flag in useEffect dependency to trigger saga dispatch:

useEffect(() => {
  dispatch(fetchData());
}, [refreshFlag]);

8. Filters & Sorting
Store all filters and sorting parameters in the slice.
Do NOT manage filters in component-level state.
Always use slice state when calling APIs.

9. Toast Messages
Do not hardcode toast messages.

Always use messages from:

toastMessages constants

10. Consistency (Most Important Rule)
Follow existing conventions strictly.
Ensure:
Consistent naming
Predictable structure
Reusable patterns
Avoid unnecessary deviations or custom implementations.

