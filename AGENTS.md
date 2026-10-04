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

## Working agreement and stack

- Read this guide and inspect current files/Git status before changes. Preserve
  unrelated work and develop one testable stage at a time.
- Implemented stack: React 19, TypeScript 6, Vite 8, React Router, Tailwind CSS 4,
  i18next/react-i18next, Lucide icons and a local Radix Slot/CVA button primitive.
  Dependencies are free/open-source. No shadcn CLI/generated components, table
  library or chart library is installed. Add components deliberately when needed.
- Keep LF line endings and follow `.editorconfig` and `.gitattributes`.
- Use Node 22.23.2 (.nvmrc), npm 10.9.8 and the committed package-lock.json.
  Use npm ci; do not create competing lock files. TypeScript 6.0.3 is intentional:
  typescript-eslint 8.71 supports <6.1, not the newer TypeScript 7 release.
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
- Vite now proxies /api and /health boundaries to `http://localhost:5050`.
  API_PROXY_TARGET is a server-only origin setting; no browser VITE_* secrets.
  Loopback tests verify cookie/header forwarding, not real Identity/CSRF behavior.
  Verify real API authentication in the next stage. A production same-origin
  reverse proxy remains infra work; Vite preview is not a production server.

Portfolio endpoints are available as of 2026-09-07:
`GET/POST /api/portfolios`, `GET/PUT /api/portfolios/{id}`, and
`POST /api/portfolios/{id}/archive` or `/restore`.
See the [portfolio contract](../zi-app-api/docs/portfolios/portfolio-management.md)
for payloads, pagination, and status codes. Names are trimmed and case-sensitive;
new portfolios use USD. Archived portfolios retain their data and reserve their
names. Hard deletion is unavailable. Scope is always the signed-in account,
including for super administrators.

Instrument and manual trade APIs are available as of 2026-09-20. Read the
[trade contract](../zi-app-api/docs/trading/manual-trade-entry.md): searchable catalog,
admin-only instrument creation, owner-scoped trade list/create/get, paginated
correction audit, and replacement corrections with a required reason.
Quantity/price/fee values are exact invariant decimal JSON strings, not numbers.
Execution timestamps require an explicit offset; retain original inputs and use
locale formatting only for display. New trades have pending rates and are not
tax-ready. Duplicate broker IDs return `409`, not a successful retry. Current
lists exclude superseded originals; corrections keep the original FIFO ordering
key. Archived portfolios reject both creation and correction until restored.

NBU rate APIs are available as of 2026-09-20. Read the
[rate contract](../zi-app-api/docs/exchange-rates/nbu-exchange-rates.md):

- `GET /api/exchange-rates/usd/{date}` reads cache only.
- `POST /api/exchange-rates/usd/{date}/fetch` fetches/caches a public USD rate.
- `GET /api/portfolios/{portfolioId}/trades/{tradeId}/exchange-rate` reads status.
- `POST /api/portfolios/{portfolioId}/trades/{tradeId}/exchange-rate/resolve`
  selects and attaches a rate with an audit trail.

All require an active session; POST requires CSRF. Let the backend choose the
trade date/rate; these POSTs need no body. The user confirmed all broker dates,
including old ones, are correct: never shift their rate dates to browser/UTC/Kyiv
time. Keep original broker date visible even if another display timezone is offered.
Rates are decimal strings. Show Pending, LinkedUnverified, and Resolved distinctly;
none means filing-ready (`isTaxReady` remains false). Display NBU attribution/source
links and provenance. Missing exact-date rates stay pending, without weekend fallback.
Corrections retain the original's rate history and start replacements pending.
No scheduler or automatic backfill is available; use explicit per-trade resolution.

Split and holdings APIs are available as of 2026-10-02. Read the
[split/holdings contract](../zi-app-api/docs/holdings/splits-and-holdings.md):

- Active users can read shared instrument splits; only super admins create or
  correct them (CSRF required). Changes affect all owners, not just one portfolio.
  Show the original timestamp, source/actor/time and correction history. Render
  source references safely as text; they are not fetched/verified by the API.
- `GET /api/portfolios/{portfolioId}/holdings?asOf=...` is owner-only, including
  archived portfolios, and exposes positions/open lots/realized FIFO matches.
  URL-encode timestamp offsets. Cutoffs replay current revisions, not what was
  known on that date. There is no tax-year filter yet.
- Preserve decimal result strings (possibly up to 28 fractional digits), source
  trade/rate IDs and the calculation version `fifo-uah-v2-remaining-cost`.
- Show quantities and PendingRates blockers while an instrument's financials
  are null. Complete instruments can display their results, but portfolio totals
  remain null if any instrument is pending. Never substitute zero for null.
- `isComplete` means the calculation has rates, not filing readiness;
  `isTaxReady` stays false. GET never resolves rates or saves a tax report.
- Split corrections preserve FIFO keys/originals. No deletion/cancellation or
  automatic cash-in-lieu workflow exists. New entries reject duplicate active
  effective instants. Only current revisions are listed by default.

Saved draft reporting APIs are available as of 2026-10-03. Read the
[report contract](../zi-app-api/docs/reports/draft-tax-reports.md):

- Owner-only `POST /api/portfolios/{portfolioId}/tax-reports` with `{ "taxYear": 2025 }`
  and CSRF saves one portfolio/year draft. Archived owned portfolios are supported.
- GET the collection for paginated history, `/{id}` for the saved snapshot,
  `/{id}/current-status` for source comparison, and `/{id}/export?format=csv|json`
  for downloads. Only lowercase `csv` or `json` is accepted.
- Select sales by their unchanged broker calendar year, not browser/UTC year.
  The backend replays earlier trades/splits to consume prior FIFO lots.
- Every report is `Draft` with `isTaxReady: false`. Do not imply tax payable,
  official filing forms or final rounding are implemented. Preserve all decimal strings.
- Unresolved included rates block creation with 409 `UnresolvedRates` and trade
  blockers; there is no partial report. Report operations never fetch/resolve rates.
- GET/export uses saved inputs/results, even after corrections. Show current-status
  separately: Current, InputsChanged, or CurrentInputsInvalid (unknown, not current).
  Recalculation is an explicit new POST, not replacement of the saved report.
- Legacy runs without full snapshots return 409 `LegacySnapshotUnavailable` for
  details/status/export; don't invent a reconstructed report in the client.
- Download attachments unchanged. CSV prefixes user text with a literal apostrophe
  for formula safety; import financial columns as text to avoid spreadsheet precision
  loss. JSON retains original text and is the authoritative complete snapshot.

### Filing research and separate annual summary

The [2025 filing-readiness review](../zi-app-api/docs/reports/ua-2025-filing-readiness.md)
records the user's scope: Ukrainian tax-resident individuals, personal foreign-
broker stock/ETF sales, initially year 2025. Legal FX/fee/loss/FIFO/rounding and
form-version validation remains open. Research is not a new filing-ready contract.

The user approved a separate taxpayer-year summary with relevant portfolios,
outside-app activity and prior-loss claims. The
[annual preparation API](../zi-app-api/docs/reports/annual-preparation-drafts.md)
is implemented as of 2026-10-04. Preserve existing one-portfolio drafts.

- `POST /api/annual-summaries` saves an immutable 2025 draft with explicit owned
  report IDs, broker-account aliases, external inputs and prior-loss claims.
  Requires CSRF and explicit coverage/overlap-review confirmations.
- GET the collection for private history; `/{id}` for saved details,
  `/{id}/export` for exact JSON and `/{id}/current-status` for a separate comparison.
- Show Unknown, None and Provided distinctly. Unknown external amounts are null,
  not zero; claims are unverified and never deducted. Keep signed decimal-string
  selected-report subtotals separate from external results and legal taxable income.
- Render evidence references as text. Show omitted portfolios, unknown broker
  context and possible overlap without implying legal completeness. Known overlap
  and mixed source policy versions reject creation; no automatic latest selection.
- Archived owned sources work. New selections create new annual IDs; never replace
  old reports/exports. `Current` describes observed inputs only, not readiness.
- All remain `Draft` / `isTaxReady: false`. There are no official forms, payable,
  accepted loss deductions or client-side tax calculations. See the contract for
  bounds, machine-readable errors and exact confirmation semantics.

The [sample audit](../zi-app-api/docs/domain/spreadsheet-sample-audit.md) records
read-only examples and the user's BXMT correction to 18.08 USD. Personal source
workbooks are not frontend fixtures or CI dependencies.

Statistics endpoints remain pending. Coordinate their contracts with the API repo;
make development fixtures explicit and do not present mock data as persisted data.

## Development progress

### Available backend: user-configured reporting, 2026-10-04

Read the [configured-report contract](../zi-app-api/docs/reports/configured-tax-reports.md)
before building settings/report screens. The user clarified that configurable
spreadsheet-based reports, not official filing certification, are the immediate
goal. Specialist review is not a blocker for those screens/calculations.

- Private `GET/POST /api/tax-settings/{year}` and `/{year}/history` save/read
  immutable revisions; use explicit same-year settings, never today's rates for
  older years. Percentages are decimal strings in [0, 100], up to four places.
- The user's example is investment income 18%, military 5%, dividend income 9%.
  No settings are implicitly seeded. The dividend rate is stored but not applied:
  the user explicitly deferred dividend recording/calculation.
- `POST /api/portfolios/{id}/configured-tax-reports` selects `sourceReportId`
  and `settingsId`. GET history/details, JSON/CSV export and current-status.
  Existing portfolio drafts and the separate 2025 annual preparation API remain.
- Display signed `netProfitUah` and `lossUah` separately from taxes. A loss
  of `-10000` must stay visible while income/military/total taxes show `0.00`.
  Never replace a negative result with zero or present it as a refund.
- Taxes apply to positive annual net realized profit only; each final tax rounds
  to two places, half away from zero. The backend owns arithmetic; preserve strings.
- Label `UserConfigured`, dividends `NotIncluded` and `isTaxReady: false` clearly;
  that flag means no official filing certification, not absent configured taxes.
  No withholding/accepted carryforward or taxpayer-wide tax aggregation exists.
- Changing settings appends a revision; generating again creates another report.
  Do not rewrite old displays/exports with current rates or recompute in JavaScript.

### Current handoff: frontend foundation, 2026-10-05

**Next shared stage: authentication UI (step 2 below).** Foundation is implemented;
do not scaffold a second app or resume the superseded specialist-review blocker.
Read [README](README.md), [foundation decisions](docs/frontend-foundation.md) and
the full API authentication guide before starting. Preserve the existing shell.

Implemented: localized overview, explicit read-only connection check, unknown-route
page, keyboard route focus/skip link, browser language preference, API read helper,
proxy, UI primitive, pinned toolchain, unit/UI tests, browser tests and CI.
There are no sign-in, account-management, portfolio, trade, report/settings or
statistics screens yet. No account or financial data is loaded by this stage.
User tax settings and signed losses remain backend-owned.

- [x] Separate Git repository and placeholder README.
- [x] Shared LF line-ending conventions.
- [x] Runnable React/Vite foundation, lock file, three locales, proxy and checks.
- [ ] Product UI: no login, portfolio, trade, report, or statistics screens yet.
- [ ] Production web Dockerfile and same-origin TLS deployment.

## Remaining development steps

1. [x] Frontend foundation: React/TypeScript/Vite, npm/lock file, routing,
   Radix/Tailwind component foundation, en/uk/ru, API proxy, environment example,
   setup docs, type/lint/format/build checks, UI/browser tests and CI.
2. [ ] Authentication UI: login, session restoration, logout, protected navigation,
   and super-admin account creation. Test cookies/CSRF against the real API,
   failed login, expired sessions, forbidden access, and all three languages.
3. [ ] Portfolio UI using the existing API: list/create/rename and reversible
   archive/restore. Include loading, empty, validation, and error states;
   verify persistence after reload and isolation with two accounts.
4. [ ] Instrument and trade workflows: manual buys/sells, fees, broker timestamps,
   rate provenance, transaction history, and audited corrections. Test decimal
   entry, localized display, duplicates, and API validation errors.
5. [ ] Holdings and splits: show positions and realized results, add the permitted
   split-management workflow, and verify results against the backend FIFO cases.
6. [ ] Draft report UI using the existing API: one portfolio/year selection,
   saved history/details, source rates/lot matches, changed-input status and exports.
   Keep draft/non-filing-ready labels and full-precision strings; no client tax
   calculation. Reconcile displayed/exported values with saved backend results.
   Add a separate annual-summary UI using its now-existing backend contract; keep
   portfolio drafts intact, coverage gaps visible and loss claims unverified.
   Official filing features await separately validated backend contracts.
   Add year-specific rate settings and configured tax reports using the contract
   above. Keep negative losses visible alongside zero tax and dividends NotIncluded.
7. [ ] Statistics and S&P 500 comparison: charts and tables based on the agreed
   valuation/return methodology, including dates, currency, and dividend treatment.
8. [ ] Release preparation: accessibility and responsive review, browser tests for
   the full account-to-report flow, production Dockerfile, and integration with
   infra's TLS/proxy/deployment setup.

Later broker imports, dividends, transfers, and account recovery screens follow
their backend contracts and the product priorities agreed for those stages.

## Verification

Run from this repository root:

```powershell
npm ci
npm run check
npx playwright install chromium
npm run test:e2e
git diff --check
```

`npm run check` runs typecheck, lint, formatting, unit/UI tests and the production
build. Browser tests use isolated loopback servers (4173/5510), not the user's API
or database. See README for preview-build checks and platform browser prerequisites.
Screenshots/traces stay in ignored test-results/playwright-report folders.

Verified locally on 2026-10-05: clean `npm ci`, all `npm run check` stages,
46 unit/component tests, and 12 browser cases each against dev and built-preview
servers. Desktop/mobile screenshots were inspected; automated accessibility checks
passed. npm reported no known vulnerabilities at the time of checking.
LF, local Markdown links and diff checks passed across all three repositories.
The GitHub workflow is configured but was not remotely run; real API login is
not tested or implemented yet. No user DB migrations, commits or pushes were made.

For UI changes, run the relevant checks and exercise the affected
flow in a browser, including loading/error/empty states and all required locales.
Report which checks ran and any missing API or environment dependency.
For documentation-only changes, check links, accuracy, LF endings, and
`git diff --check`.
