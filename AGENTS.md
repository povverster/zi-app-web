# ZiApp Web: agent guide

## Purpose and repository boundaries

This repository owns the browser UI for ZiApp, a multi-user USD stock/ETF tracker
with multiple portfolios per account, mandatory FIFO results, UAH tax reports,
and portfolio statistics with S&P 500 comparison.

Keep the frontend, [API](../zi-app-api/AGENTS.md), and
[infrastructure](../zi-app-infra/AGENTS.md) in their separate Git repositories.
The API owns authentication enforcement, persistence, FIFO, and tax calculations.
This repository owns screens, forms, API integration, localization, accessibility,
UI tests, and eventually its own Dockerfile.

## Working agreement and planned stack

- Read this guide and inspect current files/Git status before changes. Preserve
  unrelated work and develop one testable stage at a time.
- Planned stack: React, TypeScript, Vite, and free/open-source UI components.
  Tailwind CSS, shadcn/ui, TanStack Table, and Recharts were proposed; none are
  installed yet. Check suitability and licensing when introducing dependencies.
- Keep LF line endings and follow `.editorconfig` and `.gitattributes`.
- Introduce and document the package manager, supported Node version, scripts,
  and lock file during scaffolding. Do not create competing lock files.
- Support English (`en`), Ukrainian (`uk`), and Russian (`ru`) from the first
  real screens. API language values are `English`, `Ukrainian`, and `Russian`;
  map them explicitly. Use translation keys and locale-aware display formatting.
- Treat API UUIDs as opaque strings. The backend generates entity UUIDv7 IDs;
  the UI must not infer ownership or trade execution order from them.
- Display authoritative financial results from the API. Avoid JavaScript floating
  point recalculation of tax values; preserve decimal input precision and define
  the serialization contract with the API before submitting financial forms.
- Keep real secrets out of source and client environment variables. Values bundled
  into a browser application are public.
- Commit or push only when requested. Update this guide and README when completing
  a stage, including real commands and checks that future contributors can run.
- The roadmap guides later work; adding this guide does not start all those stages.

## Changelog maintenance

- Update [CHANGELOG.md](CHANGELOG.md) under `Unreleased` in the same task as each
  notable completed feature, behavior change, fix, or security improvement.
- Use the relevant Keep a Changelog categories: `Added`, `Changed`, `Deprecated`,
  `Removed`, `Fixed`, and `Security`. Omit empty categories and describe the
  effect for users or developers rather than copying commit messages.
- Document breaking changes and any required configuration or migration steps.
  Minor formatting edits do not need separate entries.
- Keep future work in this guide's development checklist, not in the changelog.
  For changes spanning repositories, update each affected repository's changelog.
- Move unreleased entries into a version/date section when an actual release is
  made. Do not invent historical releases or treat a commit as a release.
  A changelog update alone does not authorize tagging, publishing, or deployment.

## Existing backend contract

Read the [authentication guide](../zi-app-api/docs/security/authentication.md)
and inspect current Swagger/API contracts before implementing clients.

- `GET /api/auth/csrf`: obtain a CSRF token.
- `POST /api/auth/login`: send the token in `X-CSRF-TOKEN`.
- `GET /api/auth/me`: restore the signed-in account.
- Fetch a fresh CSRF token after login; send it on state-changing requests.
- `POST /api/auth/logout`: end the session with CSRF protection.
- `POST /api/admin/accounts`: super-admin account creation with CSRF protection.
- There is no public registration. Navigation visibility supplements server-side
  authorization; hiding a button is not access control.
- Authentication uses HTTP-only cookies. Preserve this flow and handle `401`
  and `403` responses explicitly.
- Plan a Vite development proxy to the local API at `http://localhost:5050`
  for same-origin browser requests, and a same-origin reverse proxy in production.
  Confirm cookie and CSRF behavior end to end when configuring the proxy.

Portfolio, trade, rate, split, reporting, and statistics endpoints are not yet
implemented at the baseline below. Coordinate their contracts with the API repo;
make development fixtures explicit and do not present mock data as persisted data.

## Development progress

Baseline inspected on 2026-09-05, at commit `d16aa69`.

- [x] Separate Git repository and placeholder README.
- [x] Shared LF line-ending conventions.
- [ ] Runnable frontend foundation: there is currently no `package.json`,
  React/Vite app, dependency lock file, frontend test setup, CI, or Dockerfile.
- [ ] Product UI: no login, portfolio, trade, report, or statistics screens yet.

## Remaining development steps

1. [ ] Frontend foundation: scaffold React/TypeScript/Vite, establish the package
   manager and lock file, add routing, the UI component foundation, three-language
   setup, API proxy, environment example, and setup documentation. Add type checks,
   linting, a build, suitable UI tests, and CI; verify a responsive starter page.
2. [ ] Authentication UI: login, session restoration, logout, protected navigation,
   and super-admin account creation. Test cookies/CSRF against the real API,
   failed login, expired sessions, forbidden access, and all three languages.
3. [ ] Portfolio UI after the API is available: list/create/edit and the agreed
   archive/delete workflow. Include loading, empty, validation, and error states;
   verify persistence after reload and isolation with two accounts.
4. [ ] Instrument and trade workflows: manual buys/sells, fees, broker timestamps,
   rate provenance, transaction history, and audited corrections. Test decimal
   entry, localized display, duplicates, and API validation errors.
5. [ ] Holdings and splits: show positions and realized results, add the permitted
   split-management workflow, and verify results against the backend FIFO cases.
6. [ ] Tax report UI: year/portfolio selection, calculation details, source rates,
   lot matches, and exports. Follow agreed report scope and rounding; reconcile
   displayed/exported values with saved backend results.
7. [ ] Statistics and S&P 500 comparison: charts and tables based on the agreed
   valuation/return methodology, including dates, currency, and dividend treatment.
8. [ ] Release preparation: accessibility and responsive review, browser tests for
   the full account-to-report flow, production Dockerfile, and integration with
   infra's TLS/proxy/deployment setup.

Later broker imports, dividends, transfers, and account recovery screens follow
their backend contracts and the product priorities agreed for those stages.

## Verification

There are no frontend build/test commands yet. Do not claim `npm run` checks
passed in this baseline repository. During scaffolding, add the actual install,
development, typecheck, lint, test, and production-build commands to README and
this guide, matching the chosen package manager.

For UI changes once runnable, run the relevant checks and exercise the affected
flow in a browser, including loading/error/empty states and all required locales.
Report which checks ran and any missing API or environment dependency.
For documentation-only changes, check links, accuracy, LF endings, and
`git diff --check`.
