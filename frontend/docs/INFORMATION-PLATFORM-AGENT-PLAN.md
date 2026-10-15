# PathOS Information Platform Agent Execution Plan

Version: 1.0
Date: 2026-10-15
Owner: PathOS product and engineering
Execution branch: `codex/target-mode`
Working directory: `D:\pathOS\frontend`

## 1. Purpose And Decision

PathOS pauses the paid MVP track and pivots to an information aggregation platform. The product goal is no longer to sell subscriptions first. The next objective is to become the most trustworthy, searchable, comparable, and continuously updated Chinese-language information platform for study-abroad decisions.

This document is the execution contract for AI agents. When this document conflicts with older V2 documents, this document wins for scope and sequencing. Existing code remains authoritative for implementation style.

Product thesis:

> Other platforms publish articles. PathOS maintains structured, source-linked facts, explains what changed, and turns those facts into comparison, planning, and decision tools.

## 2. Non-Negotiable Constraints

1. Do not touch the deployed `main` branch.
2. Do all work on `codex/target-mode`.
3. Preserve the launched PathOS UI language and design tokens: `h-control`, `rounded-control`, `text-text-primary`, `text-text-secondary`, `text-text-muted`, `border-border-soft`, `bg-surface-1`, `bg-surface-muted`, `text-cobalt`, and `ring-focus-ring`.
4. Do not import the separate V2 UI specification into existing surfaces.
5. Do not fabricate data. Missing values remain visibly missing until a source exists.
6. Every externally displayed number, date, policy, cost, deadline, and ranking has a source reference.
7. Social media and community posts may create review tasks or signals, but cannot be published as verified facts.
8. Pause new commercial work: no new pricing logic, payment provider, paywall, lead-nurture workflow, or subscription UI.
9. Keep existing P0/P1 auth, organization, report, shortlist, CRM, and tracking code unless a phase explicitly changes it.
10. Never run `git add .`. Add exact files.
11. Never use `git reset --hard` or `git checkout --`.
12. Each completed work package passes its declared verification gate before commit.

## 3. Current State Snapshot

Authoritative observations from the current repository:

- 62 university detail files exist under `data/preview/university-details/candidate-v2`.
- Preview manifest reports `universities: 62`, `news: 0`, and `regionMetrics: 0`.
- Existing public surfaces include home, map, university details, search, comparison, calculators, assessment, portfolio, guides, opportunities, news, followed schools, reports, shortlists, and workbench.
- Existing schema includes `universities`, `university_details`, `news_articles`, `region_envelope`, and the P0/P1 commercial/auth/org/report/shortlist/track tables.
- The existing data-source contract is `PathOSDataSource`.
- Existing provenance has `SourceReference`, `ProvenanceStatus`, display tiers, and warnings.
- Production data mode defaults to backend; fixture mode is prohibited in production.

Primary interpretation:

- The product already has many application surfaces.
- The missing capability is not another UI page. It is a governed information production system.
- The first engineering priority is a normalized fact and source layer with review and change detection.

## 4. Product Scope

### 4.1 Target Users

1. Chinese-speaking students preparing for undergraduate or graduate applications.
2. Parents who need cost, safety, admission probability, and policy information.
3. Counselors and teachers who need comparison tables, deadlines, and explainable evidence.
4. PathOS operators and editors who need review queues and coverage monitoring.

### 4.2 Primary Jobs To Be Done

1. Understand a school.
2. Understand a major or program.
3. Compare schools and programs.
4. Estimate total cost and aid impact.
5. Track deadlines and requirements.
6. Discover meaningful changes.
7. Build and maintain a school list.
8. Export a defensible decision report.

### 4.3 Information Domains

1. **Schools**: identity, location, type, size, ranking, admission, outcomes, cost, tests, policies.
2. **Programs and majors**: degrees, curriculum, strengths, entry requirements, career paths.
3. **Admission**: acceptance rate, GPA ranges, SAT/ACT ranges, English policy, application rounds.
4. **Cost and aid**: tuition, fees, housing, food, insurance, travel, living cost, scholarships, aid.
5. **Deadlines**: application, aid, scholarship, housing, deposit, and document deadlines.
6. **Policies and changes**: testing, international applicant, visa-relevant, and program changes.
7. **Opportunities**: new programs, competitions, research, internships, scholarships, summer programs.
8. **Geography and life**: safety, employment, transit, weather, Chinese community, cost of living.
9. **Cases and guides**: source-preserving school guides and real application cases.

## 5. Product Architecture

```text
Source layer
  -> normalized fact layer
  -> product aggregation layer
  -> user decision layer
```

### 5.1 Source Layer

Responsibilities:

- Register every allowed source.
- Fetch source documents.
- Store retrieval metadata.
- Preserve source URLs and retrieval time.
- Detect unavailable or changed pages.

Source precedence:

1. Official university or government pages.
2. Common Data Set.
3. IPEDS, College Scorecard, and official statistics.
4. Exam, visa, and education authorities.
5. Rankings, used only as ranking inputs.
6. Reputable media, used only for event discovery.
7. Community content, used only as a signal for review.

### 5.2 Normalized Fact Layer

A fact is a machine-readable claim about an entity for a scope and time period.

Required dimensions:

- entity type and entity ID
- field key
- value
- unit
- academic year or effective period
- audience or applicant scope
- source reference
- retrieval and review timestamps
- confidence and review status
- null reason when missing

Facts are append-only. Corrections create revisions rather than overwrite history.

### 5.3 Product Aggregation Layer

Normalized facts compose into school profiles, major profiles, comparison rows, cost estimates, deadline entries, information events, coverage metrics, and answer cards.

This layer never invents values. If an input is absent, the product model marks the field missing and propagates missing state to UI.

### 5.4 User Decision Layer

User-facing tools consume the aggregation layer:

- global search
- compare
- calculator
- shortlist
- deadline tracker
- report generator
- followed-school update feed

Reports and comparisons cite the same fact versions used at generation time.

## 6. Information Model

### 6.1 Entities

Core entities:

- `University`
- `Program`
- `Major`
- `Location`
- `AdmissionRound`
- `Deadline`
- `CostItem`
- `Scholarship`
- `Opportunity`
- `InformationEvent`
- `Source`
- `SourceDocument`
- `Fact`
- `FactRevision`
- `ReviewTask`

### 6.2 Initial Fact Contract

```ts
export type FactEntityType =
  | "university"
  | "program"
  | "major"
  | "location"
  | "scholarship"
  | "opportunity";

export type FactValueType =
  | "number"
  | "currency"
  | "percent"
  | "date"
  | "text"
  | "boolean"
  | "enum"
  | "range"
  | "list";

export interface Fact {
  id: string;
  entityType: FactEntityType;
  entityId: string;
  fieldKey: string;
  valueType: FactValueType;
  valueNumber?: number | null;
  valueText?: string | null;
  valueBoolean?: boolean | null;
  valueRange?: { min: number; max: number } | null;
  valueList?: string[];
  unit?: string | null;
  currency?: "USD" | "CNY" | null;
  academicYear?: string | null;
  effectiveFrom?: string | null;
  effectiveTo?: string | null;
  applicantScope?: "all" | "international" | "graduate" | "undergraduate" | null;
  sourceId: string;
  sourceUrl: string;
  retrievedAt: string;
  reviewedAt: string | null;
  reviewStatus: "pending" | "approved" | "rejected" | "stale";
  confidence: "high" | "medium" | "low";
  nullReason?: string | null;
  notes?: string | null;
}
```

### 6.3 Initial Field Keys

```text
admission.acceptance_rate
admission.sat_25
admission.sat_75
admission.act_25
admission.act_75
admission.gpa_average
admission.test_policy
admission.english_policy
admission.application_platform

cost.tuition
cost.fees
cost.housing
cost.food
cost.insurance
cost.books
cost.estimated_total
aid.scholarship_available

outcome.graduation_rate
outcome.retention_rate
outcome.employment_rate
outcome.median_early_career_pay

profile.enrollment_undergraduate
profile.enrollment_graduate
profile.student_faculty_ratio
profile.city
profile.state
profile.school_type
profile.degree_type

program.offered_degrees
program.application_deadline
program.fall_deadline
program.spring_deadline
program.toefl_minimum
program.ielts_minimum
program.gre_policy
```

Do not expand the ontology until these fields are populated and reviewed.

## 7. Data Pipeline

```text
source registry
  -> fetcher
  -> parser
  -> normalizer
  -> validator
  -> deduplicator
  -> differ
  -> review queue
  -> fact publish
  -> aggregate cache
  -> public API/UI
```

### 7.1 Stage Rules

1. **Source registry**: no source is fetched unless registered. The registry records source type, authority, license note, rate limit, and parser.
2. **Fetcher**: use timeouts, set a user agent, respect robots and terms, and persist HTTP status and duration.
3. **Parser**: parse HTML, PDF, CSV, JSON, or XML; never guess a field from unrelated text.
4. **Normalizer**: convert units and currencies, normalize academic years and dates to UTC, and preserve original value in revision metadata.
5. **Validator**: check type, range, enum, year, and logical consistency.
6. **Differ**: compare approved facts with newly normalized facts and emit proposed revisions and candidate information events.
7. **Review**: high-confidence official-source facts may auto-approve only after an explicit rule is enabled; media, ranking, and community-derived items require review.
8. **Publish**: only approved facts enter public queries. Rejected and stale facts remain queryable internally.

### 7.2 Information Event Rules

An information event is created only when a fact changes in a way that matters to a user.

Categories:

- admission policy change
- deadline change
- cost change
- new program
- discontinued program
- scholarship update
- ranking movement
- requirement change
- official announcement

Every event includes what changed, previous value, new value, why it matters, action deadline, affected audience, and source. Generic news is not published as an event unless it changes a decision input.

## 8. Application Information Architecture

### 8.1 Route Map

Preserve existing routes where possible. Add a route only when an information need cannot be served by an existing page.

```text
/                         information desk and product entry
/entry/map                existing map
/universities             school index
/university/[id]          school profile
/majors                   major index
/majors/[slug]            major profile
/compare                  comparison workspace
/calculator               existing calculator hub
/costs                    cost and aid center
/deadlines                deadline calendar
/opportunities            opportunity feed
/policy                   policy and change feed
/search                   global search
/guides                   school guides
/topics/[topic]           curated topic and answer-card index
/s/home                   signed-in personal workbench
```

Existing `/s/*` and `/f/*` routes remain compatibility surfaces until public replacements are complete.

### 8.2 School Profile Order

1. Identity and location.
2. Admission reality.
3. Cost and aid.
4. Programs and majors.
5. Outcomes.
6. Deadlines.
7. Life and geography.
8. Recent changes.
9. Sources and data quality.

### 8.3 Home Page Role

The home page is the information desk, not a marketing-only landing page.

Required modules:

1. Important changes today or this week.
2. Deadline reminders.
3. Featured schools with real data.
4. Major entry points.
5. Cost and admission insights.
6. Comparison and calculator entry.
7. Data coverage and freshness statement.
8. Source standard.

Do not duplicate the full map or full school list on the home page.

## 9. Core Product Work Packages

### WP0: Baseline Protection And Commercial Freeze

Goal: make the pivot safe without deleting valuable P0/P1 work.

Tasks:

1. Audit the current test baseline and record exact pre-existing failures.
2. Keep commercial routes functional but remove commercial prominence from growth surfaces.
3. Add a product configuration flag for information-platform mode.
4. Do not remove auth, org, CRM, tracking, reports, or shortlists.
5. Document current route ownership.

Verification:

```powershell
npx tsc --noEmit
npx vitest run
npm run build
```

Acceptance:

- No new test failures.
- Build passes.
- Commercial entry points are not the primary home-page calls to action.

### WP1: Fact And Source Schema

Goal: create the durable information asset.

Tasks:

1. Add migration `008-information-platform.sql`.
2. Create `sources`, `source_documents`, `facts`, `fact_revisions`, `review_tasks`, and `information_events`.
3. Add indexes for entity, field, academic year, review status, and effective dates.
4. Add append-only revision behavior.
5. Add TypeScript contracts under `src/domain/information/`.
6. Add repository functions under `src/server/information/`.

Schema principles:

- IDs are UUID or stable text IDs, never sequential public IDs for user-generated content.
- JSONB is allowed only for parser metadata, not query-critical fact fields.
- Public queries filter on approved facts.
- Every revision stores original source text and normalized value.

Verification:

```powershell
npx tsc --noEmit
npx vitest run src/test/unit/information-schema.test.ts
npm run db:migrate
```

Acceptance:

- Migration is idempotent.
- Fact insert creates one revision.
- Updating a fact creates a second revision without losing the first.
- Public query excludes pending, rejected, and stale facts.

### WP2: Source Registry And Retrieval

Goal: make every source controlled and auditable.

Tasks:

1. Add `SourceRegistry`.
2. Support official HTML, PDF, CSV, JSON API, Common Data Set, and IPEDS source types.
3. Add fetch result logging.
4. Add timeout and response-size limits.
5. Add robots and terms gates.
6. Store unchanged, changed, failed, and blocked outcomes.

Verification:

```powershell
npx vitest run src/test/unit/source-registry.test.ts
npx vitest run src/test/unit/source-fetcher.test.ts
```

Acceptance:

- Unknown source cannot be fetched.
- Timeout is enforced.
- Failed fetch does not alter facts.
- Fetch result records URL, status, duration, hash, and retry eligibility.

### WP3: Normalizer, Validator, And Differ

Goal: convert documents into trustworthy facts.

Tasks:

1. Add field-specific normalizers.
2. Convert percent ratios, USD amounts, academic years, dates, and SAT/ACT ranges.
3. Add validators and logical consistency checks.
4. Add fact differ.
5. Add null-reason classification.

Verification:

```powershell
npx vitest run src/test/unit/fact-normalizer.test.ts
npx vitest run src/test/unit/fact-validator.test.ts
npx vitest run src/test/unit/fact-differ.test.ts
```

Acceptance:

- Invalid values are rejected with a machine-readable reason.
- Valid values retain original text.
- New value creates a proposed revision.
- No change creates no revision.
- Contradictory facts from equally authoritative sources create a review task instead of overwriting.

### WP4: Review Console

Goal: let operators approve information before it becomes public.

Tasks:

1. Add `/admin/information`.
2. Add queues for pending facts, contradictions, failed sources, and stale facts.
3. Add approve, reject, request-recheck, and mark-stale actions.
4. Add audit trail.
5. Restrict access to advisor or owner.

Verification:

```powershell
npx vitest run src/test/unit/information-review.test.ts
npm run build
```

Acceptance:

- Unauthenticated users cannot review.
- Students cannot review.
- Every action records actor, time, reason, and resulting revision.
- Public API changes only after approval.

### WP5: School Profile 2.0

Goal: make each school page the canonical answer for that school.

Tasks:

1. Refactor school detail UI into information sections.
2. Consume approved facts through aggregation services.
3. Add source popover for every fact.
4. Add missing-value explanation.
5. Add recent changes timeline.
6. Add deadlines and programs modules.
7. Preserve current PathOS visual language.

Verification:

```powershell
npx vitest run src/test/unit/school-profile.test.ts
npx tsc --noEmit
npm run build
```

Acceptance:

- Each displayed fact has an approved source.
- Missing data is explicit.
- No fabricated placeholders exist.
- Recent changes link to information events.
- Mobile layout does not overlap.

### WP6: Major And Program Profiles

Goal: answer major-level questions, not only school-level questions.

Tasks:

1. Normalize program names to major slugs.
2. Build the first 12 majors: Computer Science, Engineering, Business, Economics, Mathematics, Data Science, Biology, Chemistry, Psychology, Political Science, Communications, and Art and Design.
3. Add school strength lists.
4. Add curriculum and career fields where officially available.
5. Add compare entry.

Verification:

```powershell
npx vitest run src/test/unit/major-profile.test.ts
```

Acceptance:

- Every major page explains scope.
- Every school association is derived from data.
- Missing program fields are labeled.
- No cross-walked major is presented as exact equivalence without a warning.

### WP7: Deadline Calendar

Goal: make dates actionable.

Tasks:

1. Add deadline model.
2. Normalize application rounds.
3. Add deadline list and filters.
4. Add personal deadline view from shortlist.
5. Add countdown labels.
6. Add source and verification time.

Verification:

```powershell
npx vitest run src/test/unit/deadlines.test.ts
```

Acceptance:

- Timezone is explicit.
- No deadline is inferred from last year unless labeled historical.
- Expired deadlines are visually separated.
- User shortlist deadlines are sorted by urgency.

### WP8: Cost And Aid Center

Goal: make the full cost picture understandable.

Tasks:

1. Normalize cost items by academic year.
2. Group direct and indirect costs.
3. Add multi-year projection.
4. Add scholarship and aid fields.
5. Add inflation and exchange-rate sensitivity controls.
6. Keep uncertainty visible.

Verification:

```powershell
npx vitest run src/test/unit/cost-model.test.ts
```

Acceptance:

- Output separates official values and assumptions.
- Missing components do not silently become zero.
- Projection labels its assumed growth rate.
- Currency conversion shows source and date when used.

### WP9: Information Feed And Opportunities

Goal: turn data changes into a reason to return.

Tasks:

1. Map `information_events` to the existing opportunities/news model.
2. Add filters by school, major, audience, urgency, and category.
3. Add what changed and why it matters.
4. Add action deadline.
5. Add followed-school feed.
6. Add weekly digest structure.

Verification:

```powershell
npx vitest run src/test/unit/information-feed.test.ts
```

Acceptance:

- Feed contains only reviewed events.
- Every event has old value, new value, source, and audience.
- Followed-school feed works without payment.
- Empty state explains what the platform monitors.

### WP10: Compare 2.0

Goal: make comparison the primary decision surface.

Tasks:

1. Add comparison presets for admission, cost, outcomes, programs, location, and deadlines.
2. Add missing-value display.
3. Add difference highlighting.
4. Add source inspection.
5. Add comparison export.

Verification:

```powershell
npx vitest run src/test/unit/compare.test.ts
npm run build
```

Acceptance:

- Rows align semantically across schools.
- Units are normalized before display.
- Mixed academic years are never silently compared.
- Source mismatch is visible.

### WP11: Answer Cards And SEO

Goal: make high-intent questions discoverable.

Tasks:

1. Define answer-card schema.
2. Generate cards only from approved aggregates.
3. Add topic pages for CS selection, engineering selection, cost comparison, test-optional policy, and deadline planning.
4. Add structured metadata.
5. Add internal links to schools, majors, compare, and tools.

Verification:

```powershell
npx vitest run src/test/unit/answer-card.test.ts
```

Acceptance:

- Each card cites underlying facts.
- Card updates when underlying facts change.
- No generated card claims a fact outside the platform.
- Sitemap includes canonical answer cards only.

### WP12: Coverage And Quality Dashboard

Goal: make data completeness measurable.

Tasks:

1. Define coverage matrix by school and field.
2. Calculate freshness.
3. Calculate source availability.
4. Calculate review backlog.
5. Expose internal dashboard.
6. Surface a public aggregate quality statement.

Verification:

```powershell
npx vitest run src/test/unit/coverage.test.ts
```

Acceptance:

- Dashboard shows exact missing fields.
- Freshness uses latest successful retrieval and latest approval.
- Review backlog is separated by severity.
- Public statement does not expose internal source credentials or failed crawl details.

## 10. Execution Sequence

### Sprint 1: Foundation And Cleanup

1. WP0 baseline protection.
2. WP1 fact and source schema.
3. WP2 source registry.

Exit:

- Build passes.
- Migration passes.
- Fact revision behavior is tested.
- Source registry can execute a controlled mock fetch.

### Sprint 2: Production Pipeline

1. WP3 normalizer, validator, differ.
2. WP4 review console.
3. Seed first 20 schools.

Exit:

- At least 20 schools have approved facts.
- At least 12 high-value fields per school are covered where officially available.
- Review actions are auditable.

### Sprint 3: Public Information Experience

1. WP5 school profile 2.0.
2. WP9 information feed.
3. WP12 coverage dashboard.

Exit:

- School page consumes approved facts.
- Feed shows real reviewed events.
- Coverage dashboard identifies next data tasks.

### Sprint 4: Decision Depth

1. WP6 major profiles.
2. WP7 deadlines.
3. WP8 cost center.
4. WP10 compare 2.0.

Exit:

- Major, deadline, cost, and comparison surfaces use the same fact layer.
- No feature maintains a private duplicate data source.

### Sprint 5: Growth And Scale

1. Expand schools to Top 100.
2. WP11 answer cards and SEO.
3. Add weekly update cadence.
4. Add Playwright end-to-end journey.

Exit:

- Public search and SEO pages work end to end.
- Weekly update job is documented and observable.
- Release can be rolled back without losing fact history.

## 11. Engineering Implementation Standards

### 11.1 Directory Plan

```text
src/domain/information/
  fact.ts
  source.ts
  event.ts
  coverage.ts

src/server/information/
  fact-repository.ts
  source-repository.ts
  review-repository.ts
  aggregate-school.ts
  aggregate-major.ts
  aggregate-cost.ts
  aggregate-deadline.ts

scripts/information/
  register-sources.ts
  fetch-sources.ts
  normalize-documents.ts
  diff-facts.ts
  coverage-report.ts

src/app/api/information/
  facts/
  events/
  coverage/

src/app/admin/information/
  page.tsx
```

Do not place parsing logic in React components.

### 11.2 API Rules

Public APIs are read-only, cacheable where appropriate, versioned, source-aware, and fail explicitly when the database is unavailable.

Internal ingestion APIs are authenticated, rate-limited, idempotent by source document hash and entity key, and never public.

### 11.3 Testing Rules

Every new module requires:

1. Unit tests for domain rules.
2. Repository tests using mocked `pg` queries.
3. API tests for auth and error cases.
4. One aggregation consistency test.

For UI:

1. Component contract tests where a renderer is available.
2. Build verification.
3. Playwright smoke test for the primary route when a phase touches a major page.

### 11.4 Current Test Baseline

Before starting WP0, run:

```powershell
npx vitest run
```

Record total passed, total failed, failing files, and failing tests.

A phase is not blocked by a pre-existing failure only when:

1. the failure exists in the recorded baseline;
2. the phase does not touch that file;
3. the failure count does not increase;
4. the limitation is stated in the phase report.

### 11.5 Migration And Compatibility Rules

1. Migration numbers continue from the highest existing migration. Do not fill a missing historical number.
2. Every `CREATE TABLE` and `CREATE INDEX` uses `IF NOT EXISTS`.
3. Every additive column has a safe default or is nullable.
4. No migration drops or rewrites P0/P1 tables.
5. No migration depends on live data existing.
6. Migration tests cover idempotency by running the migration twice.
7. `npm run db:migrate` is a verification command only when `DATABASE_URL` is configured.
8. When `DATABASE_URL` is absent, the agent must:
   - run `npx tsc --noEmit`;
   - run a migration structure unit test if available;
   - run the targeted repository tests with mocked SQL;
   - explicitly report that live migration verification was not run;
   - not claim the migration was deployed.
9. The information layer must read existing `universities` and `university_details` as legacy imports, not require an immediate destructive backfill.
10. `news_articles` remains a public read model while `information_events` becomes the source of truth for reviewed changes. Do not keep two independently editable copies of the same event.

### 11.6 Agent Execution Loop

For every work package:

1. Read this document and the referenced work package only.
2. Inspect current files before editing.
3. Write the smallest coherent implementation that satisfies the complete acceptance list.
4. Add or update tests in the same work package.
5. Run targeted tests first.
6. Run typecheck.
7. Run the full regression baseline when the phase touches shared code.
8. Run build for routes, components, API handlers, configuration, or migrations.
9. Inspect `git diff` file by file.
10. Add exact files and commit with the work-package prefix.
11. Push only `codex/target-mode`.
12. Report completed evidence, unfinished items, and pre-existing failures separately.

An agent must not:

- implement multiple unrelated work packages in one commit;
- introduce a private data copy to make a UI feature easier;
- mark a missing field as zero, false, unknown, or estimated;
- publish facts without source and review state;
- leave generated temporary scripts or patch files in the repository.

## 12. Data Quality Gates

Phase 1:

- 20 schools.
- 12 priority fields.
- 80% field coverage where an official source exists.
- 100% approved facts have source URL.
- 0 public facts without review status.

Phase 2:

- 62 existing schools.
- 80% priority field coverage.
- Review queue pendency under 7 days.
- Stale official source detection active.

Phase 3:

- Top 100 schools.
- 90% priority field coverage where officially reported.
- Weekly source freshness job.
- Comparison never silently mixes academic years.

## 13. Operating Cadence

Daily:

1. Fetch registered sources.
2. Normalize and diff.
3. Create review tasks.

Weekly:

1. Approve pending high-impact facts.
2. Publish information events.
3. Review coverage dashboard.
4. Choose the next data expansion batch.

Monthly:

1. Audit sources and licenses.
2. Remove dead sources.
3. Reassess the field ontology.
4. Review user search queries with no results.

## 14. Risks And Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Data fabrication | Trust destroyed | Missing-first UI and mandatory source references |
| Crawler misuse | Legal or reliability risk | Source registry, robots/terms gate, rate limits |
| Stale facts | Wrong decisions | Freshness metrics and stale status |
| Contradictory sources | User confusion | Authority precedence and contradiction review |
| UI drift | Launched brand breaks | Reuse PathOS tokens and components |
| Feature sprawl | No compounding value | Every feature must read the fact layer |
| Review bottleneck | Slow publishing | Auto-approve only narrowly defined high-confidence official facts |
| SEO spam | Low-quality pages | Answer cards only from approved aggregates |
| Test baseline debt | Hidden regressions | Recorded baseline and no-new-failure gate |

## 15. Release Gate

A phase may be committed only when all are true:

1. Scope matches one work package.
2. `npx tsc --noEmit` passes.
3. Targeted tests pass.
4. Full vitest does not add failures.
5. `npm run build` passes.
6. Migration is idempotent where applicable.
7. New public facts have source and review status.
8. UI remains aligned with launched PathOS.
9. Exact-file git add is used.
10. Commit message names the work package.

## 16. Agent Task Prompts

### WP0

> Read `docs/INFORMATION-PLATFORM-AGENT-PLAN.md`. Execute WP0 only. Audit the test baseline, protect current commercial features, remove commercial prominence from growth surfaces, and record route ownership. Do not change schema. Verify with tsc, vitest, and build. Commit exact files on `codex/target-mode`.

### WP1

> Read `docs/INFORMATION-PLATFORM-AGENT-PLAN.md`. Execute WP1 only. Add the information-platform schema, TypeScript domain contracts, repository functions, and revision tests. Do not build UI. Verify migration, targeted tests, tsc, and build. Commit exact files.

### WP2

> Read `docs/INFORMATION-PLATFORM-AGENT-PLAN.md`. Execute WP2 only. Implement the source registry and controlled fetcher with timeout, hash, status, and failure logging. No crawler expansion beyond registered mock or official sources. Add tests. Commit exact files.

### WP3

> Read `docs/INFORMATION-PLATFORM-AGENT-PLAN.md`. Execute WP3 only. Implement normalizers, validators, null reasons, and fact differ. Do not publish facts. Add tests proving invalid values are rejected and revisions preserve history. Commit exact files.

### WP4

> Read `docs/INFORMATION-PLATFORM-AGENT-PLAN.md`. Execute WP4 only. Build the admin information review console and review APIs with advisor/owner authorization and audit trail. Follow current PathOS UI. Add tests. Commit exact files.

## 17. Governance And Roles

### 17.1 Decision Rights

| Decision | Owner | Consulted | Informed |
|---|---|---|---|
| Product scope and phase order | Product owner | Engineering, data, content | All contributors |
| Field ontology | Data lead | Engineering, content | Product owner |
| Source allowlist | Data lead | Legal or advisor, engineering | Product owner |
| Auto-approval rules | Data lead | Engineering, product owner | Operators |
| Public information event publication | Content lead | Data lead | Product owner |
| Schema migration | Engineering lead | Data lead | Product owner |
| UI language and tokens | Product owner | Engineering | All contributors |
| Release | Engineering lead | Product owner | Operators |

### 17.2 Content Authority Matrix

| Source type | May become fact | May create event | Review requirement |
|---|---|---|---|
| Official school page | Yes | Yes | Standard review, or approved auto-rule |
| Common Data Set | Yes | Yes | Standard review |
| Government or statistics source | Yes | Yes | Standard review |
| Ranking publication | Only ranking fields | Ranking movement only | Mandatory review |
| Reputable media | No direct fact | Candidate event only | Mandatory review plus official source where possible |
| Community or social post | No | No | Signal only; create research task |

### 17.3 Escalation Rules

Escalate to human review when:

1. Two authoritative sources conflict on the same year and scope.
2. A cost or deadline change exceeds 20% or moves across an application round.
3. A source license or republication right is unclear.
4. A parser confidence is low but user impact is high.
5. A proposed change affects more than 20 schools.
6. A public page could confuse applicants near a deadline.
7. Personal data appears in a fetched document.

## 18. Legal, Licensing, Privacy, And Security

### 18.1 Legal And Licensing

1. Maintain a source registry with authority, URL, license note, and permitted use.
2. Prefer facts over full-text republication.
3. Quote only the minimum text needed for verification.
4. Store ranking values with ranking name, edition, retrieval date, and link.
5. Do not bypass authentication, paywalls, CAPTCHA, rate limits, or technical protection.
6. Do not scrape a site after a terms or robots review rejects it.
7. Do not remove source attribution when transforming or translating a fact.
8. Community content is never copied into public pages without separate permission.

### 18.2 Privacy

PathOS may process public institutional information and user account data. It must not:

1. store personal data from third-party pages;
2. publish applicant names, contact details, scores, essays, or case identities without explicit consent;
3. use counseling conversation content as public content without separate permission;
4. store raw tracking IP addresses;
5. expose user IDs in public APIs.

### 18.3 Security

1. Ingestion and review APIs require authenticated advisor or owner roles.
2. Public APIs are read-only.
3. All writes validate input at the domain boundary.
4. Source URLs are constrained to `http` and `https` and rejected if they point to private networks.
5. Fetchers enforce timeout and maximum response size.
6. Secrets remain in environment variables and are checked by the existing secrets script.
7. Access logs do not contain database credentials or session cookies.
8. SQL always uses parameterized queries.

## 19. Observability And Service Levels

### 19.1 Pipeline Metrics

Track by source and stage:

- fetch success rate
- fetch duration
- parse success rate
- validation rejection count and reason
- normalization error count
- review queue age
- approved fact count
- stale fact count
- contradiction count
- event publication count

### 19.2 Product Metrics

Track by route and feature:

- search success rate
- search no-result rate
- school profile completion view
- comparison creation rate
- calculator completion rate
- shortlist creation rate
- report generation rate
- feed click-through rate
- return visits within 7 days

### 19.3 Quality Signals

| Signal | Green | Yellow | Red |
|---|---|---|---|
| Priority field coverage | >= 90% | 75-89% | < 75% |
| Official source age | <= 365 days | 366-547 days | > 547 days |
| Review queue age | <= 3 days | 4-7 days | > 7 days |
| Fact contradiction | 0 open | 1-5 open | > 5 open |
| Public unsourced facts | 0 | 0 | >= 1 |

### 19.4 Operational Alerts

Alert when:

1. a scheduled source job has not succeeded for 48 hours;
2. parse success falls below 80% for a source;
3. public API error rate exceeds 2%;
4. a migration changes more rows than expected;
5. an unsourced fact reaches a public query;
6. review queue contains a high-impact item older than 48 hours.

## 20. Release, Rollback, And Continuity

### 20.1 Release Checklist

1. Branch is `codex/target-mode`.
2. Targeted tests pass.
3. Typecheck passes.
4. Build passes.
5. Migration has an idempotency test.
6. Feature flag defaults to a safe value.
7. Public empty, loading, error, and missing states are implemented.
8. Source display is present for facts.
9. Route ownership is updated.
10. No temporary files are committed.

### 20.2 Rollback Rules

1. Application rollback is a revert commit plus redeploy.
2. Additive migrations remain in place unless they are provably unused.
3. No destructive rollback runs without a database snapshot.
4. Fact history is never deleted during application rollback.
5. A bad aggregation may be disabled while source facts remain intact.
6. A bad public event is unpublished, not silently edited without an audit entry.

### 20.3 Business Continuity

The platform must remain usable when:

- the fact database is unavailable;
- a source fetch fails;
- the review service is unavailable;
- one parser breaks;
- the map provider is unavailable.

Required behavior:

1. Existing static-compatible pages degrade to source-preserving preview data only where already legitimate.
2. New fact-backed sections show an explicit unavailable state.
3. No tool substitutes fabricated defaults.
4. Operators see the failed dependency.

## 21. Measurement Plan

### 21.1 North Star

Weekly verified decisions supported:

```text
school profile views that lead to a compare, shortlist, calculator, or report action
```

### 21.2 Trust Metrics

1. Percent of public numeric fields with approved source.
2. Median source age.
3. Contradiction resolution time.
4. User-visible correction rate.
5. Report citation completeness.

### 21.3 Utility Metrics

1. Search-to-profile success rate.
2. Profile-to-compare rate.
3. Compare-to-shortlist rate.
4. Shortlist-to-report rate.
5. Deadline view retention.

### 21.4 Content Efficiency

1. Approved facts per operator hour.
2. Auto-approval precision.
3. Parser rejection reasons by frequency.
4. Sources fixed per week.
5. Field coverage gained per source added.

## 22. First Operating Milestone

The first credible public milestone is not Top 100. It is:

> 20 schools, 12 priority fields, reviewed sources, visible changes, comparison, cost, deadlines, and a coverage dashboard.

Milestone exit evidence:

1. Coverage report shows each school and field as covered, missing, or not reported.
2. At least 20 school profiles read the fact layer.
3. Each public number exposes source and academic year.
4. At least 10 reviewed information events exist.
5. Compare and cost tools work on those 20 schools.
6. A deadline view works for those schools.
7. Review queue actions are auditable.
8. The operator can run the daily fetch, normalize, and diff sequence repeatably.

## 23. Definition Of Done For The Pivot

The pivot is done when:

1. Approved facts are the only source for public numbers.
2. School, major, cost, deadline, compare, feed, and report features share one information layer.
3. Every fact is source-linked and revision-controlled.
4. Operators can review contradictions and stale data.
5. Coverage and freshness are measurable.
6. Users can search, compare, save, track, and export without payment.
7. The weekly update pipeline is observable and repeatable.
8. No page presents community content as verified fact.
9. Existing PathOS UI remains recognizable and stable.
10. Build, targeted tests, migration, and baseline regression gate pass.
