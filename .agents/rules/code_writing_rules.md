---
trigger: always_on
description: Comprehensive rules for component architecture, UI-hook separation, MF reuse, Redux/RTK Query, theme tokens, and import ordering.
---

# Code Writing Rules

These rules define conventions for React components, hooks, API handling, Redux, Microfrontend (MF) reuse, code splitting, imports, theme standards, and code quality.

---

## 1. Component Architecture & Code Splitting

### Separation of Concerns

- Keep JSX layout and presentation separate from complex business logic.
- Keep stateful logic, API/RTK Query logic, Redux selectors/actions, Socket.IO logic, event handlers, and lifecycle logic in custom hooks or feature logic.
- Pages should mainly act as containers that call hooks and compose presentation components.
- Do not put large amounts of business logic directly inside JSX components. Keep components focused on a single responsibility.

### Code Splitting & Index Exports

- Split complex pages and components into smaller, reusable components under the feature's `components/` folder.
- Do not create unnecessarily large component files; split code when it becomes difficult to understand, test, review, or maintain.
- Use lazy loading for appropriate routes and large features with Suspense fallback UI.
- Use clean `index.js` files for feature/module exports where useful. Avoid circular dependencies caused by barrel exports.

---

## 2. Feature Structure

Organize application code by feature. Feature-specific code should stay inside its feature directory:

```text
feature/
├── api/            # Feature-specific API endpoints
├── components/     # Feature-specific UI components & sub-views
├── hooks/          # Feature-specific custom React hooks
├── pages/          # Feature page containers
├── validation/     # Zod schema definitions
└── index.js        # Feature barrel exports
```

- Create only necessary folders. Keep genuinely shared code in shared/global folders (`src/sharedComponents/`, `src/utility/`).

---

## 3. Microfrontend (MF) & Client Shared Reuse

### Mandatory Pre-Creation Inspection Workflow

Before creating ANY new component, custom hook, utility function, helper, formatter, dialog, or service, developers MUST perform an exhaustive check in this exact priority sequence:

1. **Microfrontend Remotes (`TheOdcMfUI`)**: Check `TheOdcMfUI/sharedComp` (buttons, dialogs, forms, filterWrapper, pageHeader, statusChip, profileAvatar), `TheOdcMfUI/theme` (colors, gradients, status colors, chart palette), `TheOdcMfUI/utility` (formatters, assets, http, cookies, throttle), `TheOdcMfUI/hooks` (useStorageState, useLocalStorageState), and `TheOdcMfUI/helpers`.
2. **Client Shared Modules**: Check `src/sharedComponents/`, `src/utility/`, `src/hooks/`, `src/helpers/`, and `src/store/`.
3. **Current Feature Module**: Check existing feature components and hooks.

**Rule Hierarchy: Reuse First → Extend/Compose Second → Create New ONLY when no viable asset exists.**

### Microfrontend (MF) Elevation Rule for Cross-Client Code

- **If any component, hook, utility function, formatter, dialog, helper, or layout is required or used in BOTH client applications (`admin-ui` and `customer-ui`), it MUST NOT be duplicated in each client module.**
- Instead, it must be elevated directly to the Microfrontend remote (`OdBites-Mf-UI` under `src/sharedComp/`, `src/utility/`, `src/hooks/`, or `src/theme/`), exposed via `vite.config.js`, and consumed in both client modules from `TheOdcMfUI`.
- Do not copy MF source code into local applications. Prefer composition, props, wrappers, or supported extension points.

---

## 4. API & Redux (RTK Query) Layer

- Use the shared Axios/API layer and **Redux Toolkit / RTK Query** for shared/global client-side state and data caching.
- Keep RTK Query API mutations and queries in custom hooks or feature services.
- Do not store temporary component UI state in Redux when `useState` is sufficient.
- Do not duplicate API data in Redux slices if it can remain in the RTK Query cache.
- Always handle loading, success, error, and empty states properly.

Recommended data flow:

```text
Component  ──>  Custom Hook  ──>  RTK Query  ──>  API Endpoint  ──>  Axios  ──>  Backend
```

---

## 5. Custom Hooks

- Use custom hooks for complex or reusable logic (RTK queries/mutations, local state, event handlers, side effects, sockets).
- Keep each hook focused on a single responsibility; avoid large "god hooks" containing unrelated logic.
- Do not create hooks only to rename another hook.
- Check existing local and MF hooks before creating a new hook.

---

## 6. Socket.IO & Real-time Logic

- Keep Socket.IO logic in custom hooks or feature logic.
- Do not put complex socket logic directly inside presentation components.
- Always clean up socket listeners and connections when the component unmounts.
- Reuse existing MF socket utilities/hooks when available.

---

## 7. State Management Boundaries

Use the appropriate state solution for each category of data:

- `useState` → Local component UI state (toggle dialogs, form input values, tab selection).
- `Redux Toolkit` → Shared global client-only state (e.g., auth session, user preferences).
- `RTK Query` → Server/API state (caching, automated re-fetching, mutation triggers).
- Do not duplicate server state between RTK Query and local state slices.

---

## 8. Forms & Schema Validation

- Use **React Hook Form** for complex interactive forms.
- Use **Zod** for schema validation where applicable.
- Keep validation schemas inside the feature's `validation/` folder (e.g., `featureSchema.js`).
- Do not duplicate validation rules across components. Keep form business logic in custom hooks when forms become complex.

---

## 9. Shared Components & Utilities

- Genuinely reusable components belong in `src/sharedComponents/` (or elevated to MF). Feature-specific components stay inside their feature.
- Generic helpers belong in `src/utility/` (or elevated to MF). Do not put business logic into generic utility files.
- Check existing local and MF components/utilities before creating new ones.

---

## 10. Page Containers

- Pages should primarily compose components and hooks.
- Keep API calls, complex state, business logic, and socket logic outside page components.
- Pages should remain easy to read and understand, acting as top-level layout orchestrators.

---

## 11. Import Statement Ordering

All JavaScript/React imports must follow this strict 4-group order with exactly one blank line between groups:

### Group 1 — React, Frameworks & External Libraries

React core, router, state libraries, third-party libraries, validation, sockets, UI (MUI), and icons.

### Group 2 — Microfrontend Remotes

`TheOdcMfUI` remote imports (`TheOdcMfUI/sharedComp`, `TheOdcMfUI/theme`, `TheOdcMfUI/utility`, `TheOdcMfUI/hooks`).

### Group 3 — Local/Shared Components

Local shared components, feature components, and dialogs.

### Group 4 — Logic, Utilities & Hooks

API functions, Redux actions/RTK queries, utility helpers, configuration, and custom hooks.

```javascript
import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Box, Card, Typography, alpha } from "@mui/material";
import { ShoppingBag, Done } from "@mui/icons-material";

import { Button, StatusChip } from "TheOdcMfUI/sharedComp";
import { COLORS } from "TheOdcMfUI/theme";
import { formatCurrency, formatDateTime } from "TheOdcMfUI/utility";

import { PageHeader } from "../../../sharedComponents";
import { OrderSummaryCard } from "../components";

import { useOrderDetails } from "../hooks";
```

- Remove all unused imports. Do not import the same module multiple times. Keep imports sorted and consistent.

---

## 12. Remove Unused & Dead Code

Always actively remove:

- Unused imports, variables, functions, components, hooks, and API functions.
- Unused files, dependencies, and duplicate code blocks.
- Commented-out legacy code and dead code.
- Temporary debugging code (`console.log()`, `debugger`, temporary test values).

---

## 13. Code Quality & Best Practices

- Reuse existing code before creating new code. Check MF remotes before implementing common features.
- Avoid duplicated logic, unnecessary abstractions, and circular dependencies.
- Keep functions simple, focused, and readable.
- Do not add a new library when the existing stack can solve the problem.
- Code must pass ESLint and Prettier checks cleanly with 0 errors.

---

## 14. Naming Conventions

- Components → `PascalCase.jsx` (e.g., `ProductCard.jsx`, `OrderDetails.jsx`)
- Hooks → `useSomething.js` (e.g., `useOrderDetails.js`, `usePaymentDetails.js`)
- Functions & Variables → `camelCase` (e.g., `calculateTotal`, `isSubmitting`)
- Constants → `UPPER_SNAKE_CASE` (e.g., `API_TIMEOUT`, `DEFAULT_PAGE_SIZE`)
- Utility files → descriptive `camelCase.js` (e.g., `formatPrice.js`, `validation.js`)

---

## 15. Error, Loading & Empty State Handling

Every API-driven feature must handle:

- **Loading**: Show skeleton loaders, spinners, or progress indicators.
- **Success**: Display data cleanly with appropriate UI hierarchy.
- **Empty state**: Provide clear empty illustrations or helpful feedback when no records exist.
- **Error**: Show user-friendly error messages/toasts and provide retry/refetch options. Do not silently ignore errors.

---

## 16. Routing & Lazy Loading

- Keep routing configuration centralized inside `src/routes/`.
- Keep route definitions separate from page implementations.
- Use `React.lazy()` and `Suspense` for large features and route-level code splitting.
- Provide a proper loading fallback UI for lazy-loaded routes. Keep protected-route logic inside auth guards.

---

## 17. Structured Multi-line Section Comments

Enforce clear, multi-line comment banners to separate concerns in custom hooks, pages, and components:

### In Custom Hooks:

```javascript
/*
  Hooks & Theme Configuration
 */

/*
  Redux API Queries & Mutations (RTK Query)
 */

/*
  Computed Values & Memos (State Aggregates)
 */

/*
  Event Handler Callbacks / Actions
 */
```

### In Page Containers & Components:

```javascript
/*
  Hook Configuration & Destructuring
 */
/*
  Theme & Layout
 */
/*
  RTK Query API State Indicators
 */
/*
  Computed API Data & Memos
 */
/*
  Event Handler Callbacks
 */
/*
  Presentation Helpers
 */
```

- Always preserve and maintain these structured banners across features.

---

## 18. Theme & Design System Standards

- **Consume Colors Strictly from MF**: Never hardcode raw HEX or RGBA strings (e.g., `#FA8C16`, `rgba(...)`). Consume colors and brand tokens strictly from `TheOdcMfUI/theme` (`COLORS`, `BRAND_GRADIENTS`, `STATUS_COLORS`, `CHART_PALETTE`) or MUI `theme.palette` using `alpha(theme.palette.primary.main, ...)`.
- **Dynamic Dark & Light Mode Responsiveness**: All UI components (dialogs, cards, forms, tables, headers, chips, buttons) must reactively adapt to dark and light modes, adhering to surface tokens (`theme.palette.background.paper`, `theme.palette.background.default`, `theme.palette.divider`, `theme.palette.text.primary`).
- **Consistent Typography & Spacing**: Use theme typography variants (`h5`, `h6`, `subtitle2`, `body2`, `caption`) and MUI spacing multipliers instead of hardcoded font sizes or pixel paddings.
- **Micro-interactions & Borders**: Use theme borders (`1px solid`, `borderColor: "divider"`) and themed alpha overlays on hover/focus states.

---

## 19. General Core Principles

Prefer: **Reuse → Extend → Create**

Prefer code that is: **Simple → Reusable → Maintainable → Testable**

Avoid: **Duplicate → Over-engineered → Unused → Unnecessary**

Always follow the existing project architecture and technology stack before introducing new patterns or dependencies.
