# Setup And Run

## Environment

Create `.env` with:

```text
VITE_MF_REMOTE_URL=http://localhost:5000
VITE_APP_API_URL=http://localhost:8000
VITE_APP_ASSETS_PATH=http://localhost:8000
```

`VITE_MF_REMOTE_URL` must point to `The ODC-Mf-UI`.

## Commands

```bash
npm install
npm start
npm run build
npm run lint
npm run preview
```

Default dev server:

```text
http://localhost:4000
```

## Local Startup Order

1. Start `The ODC-BE` on port `8000`.
2. Start or preview `The ODC-Mf-UI` on port `5000`.
3. Start this admin host on port `4000`.
4. Sign in with a backend-provisioned admin.

## Verification

For admin changes, run:

```bash
npm run lint
npm run build
```

Then manually verify the affected admin route against a running BE and MF remote.
