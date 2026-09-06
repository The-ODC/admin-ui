# The ODC Admin FE Agent Notes

This folder is the admin frontend repo-local context for future agents.

## Purpose

`The ODC-Admin-FE` is the admin host app. It owns admin business pages and
consumes shared layouts, theme, components, hooks, helpers, and utilities from
`The ODC-Mf-UI`.

## Stack

- React 19
- Vite 6
- MUI 7
- Redux Toolkit
- RTK Query
- Axios
- React Router 7
- React Hook Form
- Zod
- Module Federation

## File Map

- [ARCHITECTURE.md](ARCHITECTURE.md) - app boot, federation, routing, and ownership.
- [FEATURES_AND_ROUTES.md](FEATURES_AND_ROUTES.md) - screen inventory and data sources.
- [API_AND_STATE.md](API_AND_STATE.md) - Axios, RTK Query, cookies, and auth state.
- [SETUP_AND_RUN.md](SETUP_AND_RUN.md) - env and local commands.
- [KNOWN_ISSUES.md](KNOWN_ISSUES.md) - repo-specific bugs and follow-ups.

## External Dependencies

- `The ODC-Mf-UI` must serve `remoteEntry.js`.
- `The ODC-BE` must serve admin API routes.
- Admin account creation is not part of this UI. This UI manages customer users.
