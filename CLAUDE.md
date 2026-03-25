# CLAUDE.md — ZenNetwork (OneTeam)

## Project Overview
- **App**: OneTeam — Healthcare / Care Coordination (Zane Network)
- **Stack**: React 19 + Vite 8 + Redux Toolkit + Redux-Saga + Tailwind CSS v4
- **Language**: JavaScript (JSX) — no TypeScript
- **Package Manager**: npm
- **Dev Server**: `npm run dev` → port 5173
- **Build**: `npm run build` → `dist/`
- **Base API URL**: `VITE_API_URL` (default `http://localhost:8080/api`)

## Key Architecture Rules

### Component Rules
- Functional components only, single responsibility
- **NEVER modify common/shared components** (`src/components/commonComponents/`) unless explicitly asked with component name + specific requirement
- Always reuse existing common components (Button, Input, TextArea, Checkbox, SelectDropdown, Table, Pagination, Drawer, ActionDropdown, ToggleSwitch, Avatar, etc.)
- No API calls inside components — all side effects go through sagas
- No business logic in components — keep in slices/sagas/utils

### State Management
- Dynamic store: reducers and sagas are injected at runtime and cleaned up on unmount
- Every new page needs: `COMPONENT_KEYS` entry → slice → saga → `useFlexCleanup()`
- Every API call must use `apiCall` wrapper with a unique `loadingKey`
- Loading keys defined in `src/constants/loadingKeys.js`
- Prefer `useState` when global state is unnecessary

### Forms (Strict)
- **All forms must use Formik**
- Field names in page `constant.js` as `FORM_FIELDS_NAMES`
- Validation via `getValidationSchema()` from `formUtils` (declarative config)
- Dropdown/select options must be in page constants — no hardcoding in components

### Styling
- Tailwind utility-first only, no inline styles unless unavoidable
- Use design tokens from `index.css` `@theme`
- Match designs 100% pixel-perfect when provided

### Folder Structure
```
containers → pages → components (hierarchy)
```
- Containers render `<Outlet />`
- Pages own their slice, saga, constants
- Components are dumb — receive props

### Import Rules
- Use `@/` alias for absolute imports (e.g., `@/components/commonComponents/button/Button`)
- No deep relative paths (`../../../`) — use relative only for nearby files within same feature
- Order: external libs → internal modules → styles

### Code Quality (Zero Tolerance)
- No `console.log`, `debugger`, or debug leftovers
- No dead code, commented-out code, unused imports
- No circular dependencies
- ESLint must pass with zero warnings/errors
- DRY enforced — extract to `/hooks`, `/utils`, `/services`

### Service Layer
- One service file per base URL, extends `DataService`
- Static methods per endpoint
- No direct `axios.get/post` anywhere except `DataService` base class

### Routing
- New pages must be added to `routeConfig.js`
- All page components are lazy-loaded (`React.lazy`)
- Three categories: protected, public-only, shared

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
- `Button` — variants: primary, secondary, outline, ghost, link, primaryTeal, outlineTeal
- `Input` — with label, error/touched, required, password toggle
- `TextArea` — with Formik ErrorMessage built-in, label, isRequired
- `Checkbox` — variants: primary, secondary, teal
- `SelectDropdown` — static single/multi select
- `AsyncSelectDropdown` — API-driven with infinite scroll
- `Table` — TanStack React Table wrapper with buildColumns helper
- `Pagination` — with page/limit controls
- `Drawer` — slide-in panel with header, body, footer
- `ActionDropdown` — portal-based dropdown with nested support
- `ToggleSwitch` — toggle with active/inactive labels
- `Avatar` — with initials fallback
- `Icon` — unified: local SVGs → lucide-react fallback
