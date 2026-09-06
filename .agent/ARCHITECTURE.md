# Admin FE Architecture

## Runtime Shape

```text
src/main.jsx
  Provider(Store)
    StrictMode
      ErrorBoundary from OdBitesMfUI/helpers
        ThemeProviderWrapper from OdBitesMfUI/theme
          BrowserRouter
            App
            ToastContainer
```

## Module Federation

`vite.config.js` consumes the shared remote:

```text
OdBitesMfUI = VITE_MF_REMOTE_URL + /assets/remoteEntry.js
```

The admin app imports from the remote:

```text
OdBitesMfUI/layouts
OdBitesMfUI/theme
OdBitesMfUI/sharedComp
OdBitesMfUI/helpers
OdBitesMfUI/hooks
OdBitesMfUI/hoc
OdBitesMfUI/utility
```

If the remote is down, the admin app cannot fully render.

## Routing Flow

`src/App.jsx` maps `userRoutes` inside the authenticated layout and `guestRoutes`
outside it.

`src/layouts/index.jsx`:

1. Reads `admin_auth_token` and `admin_id` cookies.
2. Fetches profile details with `useGetProfileDetailsQuery(userId)`.
3. Renders remote `AdminLayout`.
4. Renders nested content through `Outlet`.
5. Renders local `SignIn` when unauthenticated.

## Ownership

- This repo owns admin pages, admin-specific tables, feature hooks, constants,
  RTK Query services, and local utilities.
- `The ODC-Mf-UI` owns shared visual primitives, layouts, theme, cookies,
  shared hooks, and generic helpers.
- `The ODC-BE` owns data, auth, uploads, and admin/customer security.

## Admin Identity Rule

This UI must not add admin account creation screens. Admin accounts are
backend-provisioned with `bun create-admin` in `The ODC-BE`.
