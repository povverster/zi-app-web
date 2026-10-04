# Frontend foundation and continuation

Implemented 2026-10-05. This is a bounded frontend stage, not completed product UI.
Backend configured-report work already present in the working tree was preserved.
No database migration, sample-workbook edit, commit or deployment is part of this stage.

## Decisions

- Node 22.23.2 / npm 10.9.8, exact dependency versions, one npm lock file.
  React 19 / Vite 8 / TypeScript 6.0.3; TypeScript 7 does not satisfy the installed
  typescript-eslint peer range. Upgrade the compiler/linter together later.
- React Router declarative routes: `/`, `/connection` and translated not-found.
  A later production host must serve index.html for UI deep links while routing
  API/health requests to the backend, never to the SPA fallback.
- Tailwind tokens plus ordinary responsive CSS. Local Button uses Radix Slot,
  CVA and class merging. No shadcn generator, tables/charts, paid components,
  stock photos, external fonts, analytics or authentication token storage.
- Flat translation keys have compile-time parity across en/uk/ru. Native selector
  persists a local preference in `ziapp.language` and updates document language.
  Preference order: valid saved choice, supported browser locale, English.
  Disabled browser storage does not prevent rendering. Profile synchronization
  is future authentication work; this stage does not modify API user preferences.
- Native focus/keyboard behavior, skip link and main-region focus after routing.
  Reduced-motion CSS disables animation. Future navigation items are not links
  to nonexistent features. Financial preview values are deliberately absent.
- Read-only health checks run only on user request. Each pair shares a five-second
  deadline and is canceled on navigation. Only a successful plain `Healthy`
  response counts; HTML SPA fallbacks, degraded responses and failures do not.
- `API_PROXY_TARGET` is server-side only and defaults to localhost:5050.
  Proxy boundaries exclude similar paths such as /apiary and /healthy. Keep
  HTTPS validation, cookie flags and the original request path. The JSON helper
  sends same-origin credentials, disables caching/redirects and preserves decimals
  as strings. It does not implement mutation or authentication policy.

Primary setup references:
[Vite](https://vite.dev/guide/),
[Tailwind/Vite](https://tailwindcss.com/docs/installation/using-vite),
[React Router](https://reactrouter.com/start/declarative/installation),
[i18next](https://www.i18next.com/overview/configuration-options),
[Vitest](https://vitest.dev/guide/) and
[Playwright](https://playwright.dev/docs/intro).

## Verification scope

Local acceptance on 2026-10-05:

- Clean `npm ci` completed from the lock file; npm reported 0 known vulnerabilities.
- `npm run check` passed: strict types, zero-warning lint, formatting,
  all **46** unit/component tests and the production build.
- All **12** desktop/mobile Chromium browser cases passed against Vite dev;
  the same **12** passed against the built bundle with PLAYWRIGHT_PREVIEW=1.
- All three locales passed automated accessibility checks; low-contrast text found
  during the first run was fixed and the suite rerun without suppressed rules.
  Desktop/Russian and mobile/Ukrainian/connection screenshots were inspected.
- Changed-file LF, local Markdown link targets and diff whitespace were checked
  across all three repositories. Generated build/browser outputs remain ignored.
- The CI workflow is added, not remotely executed. No real API login, user database,
  backend suite rerun, Firefox/WebKit run or production deployment is claimed.

Use the commands in [README](../README.md). Unit/component cases cover translation
parity/fallbacks/API mapping, local navigation, loading/error/retry/cancellation,
proxy origin/path validation, API errors and exact decimal-string preservation.
Browser cases exercise the actual Vite proxy against a disposable loopback stub,
not a route mock alone. A test-only HttpOnly cookie round-trip and CSRF header
forwarding are checked; this is **not real API authentication verification**.

Browser coverage includes desktop and emulated mobile Chromium, all three locales,
language reload persistence, 320px overflow, deep-link reloads, keyboard focus,
read-only healthy/offline/retry states and axe WCAG A/AA checks. Automatic checks
are not a complete accessibility certification. Screenshots are inspected locally,
not committed. Firefox/WebKit and real mobile devices are not yet tested.

No live API, DB, NBU service, personal data or spreadsheet is required by these
tests. No API code changed for this stage; its previous 348-test result belongs
to the configured-report stage and is not a fresh backend run.

## Exact next stage: authentication UI

1. Read all three AGENTS guides, inspect dirty work and read the complete
   [authentication contract](../../zi-app-api/docs/security/authentication.md).
   Confirm current DTOs/error codes rather than guessing from the UI helper.
2. Add localized login, restoration via GET /api/auth/me, logout and protected
   navigation. Keep HTTP-only session cookies; never move auth to localStorage.
   Fetch CSRF before login, renew it after login and send it on all mutations.
   Handle initial loading, invalid credentials, inactive/locked accounts, session
   expiry, unauthorized and forbidden responses without exposing diagnostics.
3. Add super-admin account provisioning using the existing API and role checks.
   There is no public registration. The backend remains the authorization boundary.
   Coordinate the browser preference with the API language enum explicitly.
4. Test the real API cookie/CSRF flow through the Vite proxy, including login,
   restored reload, logout, expired sessions, non-admin denial and account creation.
   Use explicitly designated test accounts/disposable database. Do not silently
   migrate or bootstrap the user's DB or log credentials.
5. Keep changes bounded to authentication/account access. Portfolio/trade/report
   screens follow in the ordered web guide. Do not recompute financial values in JS.
6. Run the web checks/browser suite and relevant API checks if API code changes.
   Update all affected guides, changelogs and acceptance evidence with actual
   results and limitations. Commit/push only when the user asks.

The app remains a user-configured calculation tool, not official-filing software.
Do not restart the superseded legal-review package. Preserve one-portfolio/year
reports, immutable settings snapshots, explicit dividends-not-included status,
and negative losses alongside zero taxes when those screens are implemented.
