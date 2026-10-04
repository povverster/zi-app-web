# ZiApp Web

A multilingual investment workspace built with React and TypeScript. The frontend
foundation is runnable: responsive overview, English/Ukrainian/Russian selection,
navigation and an explicit read-only API/database connection check.

**Next stage: login, session restoration, logout and super-admin account creation.**
There is no login or investment-data UI yet. Planned portfolios, trades and reports
are clearly labeled; no invented balances or returns are displayed.

## Start locally

Use Node **22.23.2** (see [.nvmrc](.nvmrc)) and npm **10.9.8**.
The engine check intentionally rejects other major versions. With nvm-windows,
install/select that Node version and check `node --version` / `npm --version`;
do not change a shared machine's global runtime without coordinating first.

Run from `zi-app-web`:

```powershell
npm ci
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).
The UI runs without Docker or the API. **Connection** checks stay “Not checked”
until requested; an unavailable backend produces an honest error state.

For a real connection check:

1. Start PostgreSQL using the [infra guide](../zi-app-infra/README.md).
2. Follow the [API setup](../zi-app-api/README.md), confirming the database target
   before applying pending migrations. From `zi-app-api` run
   `dotnet run --project src/ZiApp.Api --launch-profile http` (port **5050**).
3. Leave both running, open the web UI and select **Connection → Check connection**.

Readiness does **not** establish that migrations are current or that login works.
This frontend stage never applies migrations or changes investment records.

## Environment and API boundary

The default development/preview proxy sends only `/api` and `/health` paths to
`http://localhost:5050`, preserving paths and cookie flags. Browser requests remain
same-origin. No cross-origin permission changes are required.

An environment file is optional. To customize the origin without overwriting one:

```powershell
if (-not (Test-Path .env.local)) { Copy-Item .env.example .env.local }
```

Edit `API_PROXY_TARGET` in that ignored file and restart Vite. It must be an HTTP(S)
origin without credentials, path, query or fragment. Keep certificate validation
enabled when using HTTPS. All `VITE_*` values would be public in a browser bundle:
never put secrets there. No production reverse proxy or deployment is included.

The JSON read helper preserves decimal strings and machine-readable errors.
Authenticated mutations and CSRF token management are deliberately left to the
next stage; do not use the health check as proof of authentication.

## Commands and verification

| Command                                   | Purpose                                       |
| ----------------------------------------- | --------------------------------------------- |
| `npm ci`                                  | Reproduce dependencies from package-lock.json |
| `npm run dev`                             | Local Vite development server, port 5173      |
| `npm run typecheck`                       | Strict TypeScript checks                      |
| `npm run lint`                            | ESLint, React hooks and refresh rules         |
| `npm run format` / `npm run format:check` | Apply/check Prettier formatting               |
| `npm test` / `npm run test:watch`         | Vitest unit and component tests               |
| `npm run build`                           | Typecheck and build static assets in dist     |
| `npm run check`                           | Typecheck, lint, formatting, tests and build  |
| `npm run preview`                         | Locally serve the built assets on port 4173   |
| `npm run test:e2e`                        | Desktop/mobile Chromium browser tests         |

Install the test browser once, then run checks:

```powershell
npm run check
npx playwright install chromium
npm run test:e2e
```

Linux CI uses `npx playwright install --with-deps chromium`. Browser tests start
their own loopback-only API stub on **5510** and Vite on **4173**. These ports must
be free; existing servers are never reused. No Docker, credentials, real API,
personal spreadsheet, database or live financial service is used.

To verify the built bundle with the same browser suite after `npm run build`:

```powershell
$env:PLAYWRIGHT_PREVIEW = "1"
npm run test:e2e
Remove-Item Env:PLAYWRIGHT_PREVIEW
```

The suite covers all locales and persistence, route reloads, keyboard navigation,
320px layout overflow, read-only connection states/retry, automated accessibility,
and real Vite proxy forwarding to the isolated stub. Cookie/header forwarding
does not prove the real API's Identity/CSRF flow; that is the next stage's test gate.
Screenshots/traces are ignored under `test-results` and `playwright-report`.
CI runs checks and browser tests; no deployment or database migration occurs.

## Structure and dependencies

- `src/app`: routes, shell and error boundary.
- `src/pages`: overview, connection and unknown-route screens.
- `src/components/ui`: local reusable UI primitives.
- `src/i18n`: translation resources, language persistence and explicit API mapping.
- `src/api`: bounded health checks and same-origin read helper.
- `src/config`: validated server-side proxy configuration.
- `tests/e2e`: browser acceptance tests and isolated test API.

The component foundation uses Tailwind CSS 4, Radix Slot, class-variance-authority,
clsx and tailwind-merge; icons are Lucide. This is not a generated shadcn app.
Tables and charts will be added when their screens exist. React Router owns
navigation; i18next/react-i18next owns translations. No paid UI dependency or
remote font service is required.

Direct packages use free/open-source licenses (principally MIT; TypeScript,
Playwright and CVA use Apache-2.0, Lucide uses ISC, axe uses MPL-2.0).
Retain upstream notices when distributing. Exact versions are pinned in
[package.json](package.json) and the lock file. TypeScript 6.0.3 is chosen for
typescript-eslint 8.71 compatibility (<6.1), not upgraded to incompatible 7.x.

## Handoff

Read [AGENTS.md](AGENTS.md) for the ordered roadmap and backend contract links, and
[frontend-foundation.md](docs/frontend-foundation.md) for decisions and acceptance
evidence. Current reporting APIs support explicit yearly tax settings and signed
losses with zero taxes; [their contract](../zi-app-api/docs/reports/configured-tax-reports.md)
must be preserved when report screens are added. The older official-filing review
does not block user-configured reporting. Dividends remain deferred.
