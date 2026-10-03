# Changelog

Notable changes to the ZiApp frontend repository are recorded here, using the
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format.

The initial entries summarize completed development work from Git history.
They remain unreleased until assigned to an actual versioned release.
Planned work and development instructions are in [AGENTS.md](AGENTS.md).

## [Unreleased]

### Added

- Separate frontend repository with a placeholder README.
- An `AGENTS.md` guide documenting the planned React/TypeScript/Vite stack,
  English/Ukrainian/Russian support, existing backend authentication contract,
  development milestones, and changelog maintenance rules.

### Changed

- Documented the implemented 2025 annual preparation API: explicit source-report
  selection, reviewed coverage, unverified external inputs/loss claims, signed
  decimal-string subtotals, JSON exports and separate current-source comparisons.
  Preserved portfolio-report and non-filing-ready boundaries. No UI/tooling added.

- Recorded the agreed 2025 filing scope and separate annual-summary design,
  preserving one-portfolio drafts and distinguishing planned preparation summaries
  from existing APIs. Documented unresolved legal/form gates and sample provenance;
  no frontend code, endpoints or tooling were added.

- Documented the saved draft report API: one portfolio/year, immutable full-precision
  snapshots, private history/details, rate blockers, current-input comparison and
  CSV/JSON downloads. Includes draft labeling, legacy-run handling and spreadsheet
  precision/formula-safety guidance. No frontend code or tooling was added.

- Documented admin-only shared splits and audited corrections, private holdings/
  FIFO results, historical cutoff semantics, exact decimal-string results and
  incomplete-rate/null-total handling. No frontend screens or tooling were added.

- Documented the available NBU fetch/cache and trade-rate resolution APIs,
  decimal-string rates, source attribution, audit/status displays, and unchanged
  broker calendar dates for both new and legacy trades. No frontend code was added.

- Documented the available instrument/manual-trade API, precise decimal-string
  inputs, timestamp offsets, audited corrections, and pending-rate states for the
  future trade UI. Frontend implementation remains pending.
- Documented the available portfolio API contract and archive/restore behavior
  for the upcoming portfolio UI stage. Frontend implementation remains pending.

- Standardized text files on LF line endings through Git and editor settings.
