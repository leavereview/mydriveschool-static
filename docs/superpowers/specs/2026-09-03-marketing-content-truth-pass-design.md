# driveschoolpro.com — App/Site Content Truth Pass

**Date:** 2026-09-03
**Repo:** `leavereview/mydriveschool-static` (Astro site, folder `mydriveschool.software/`)
**Branch:** `content/2026-09-03-app-truth-pass`
**App compared against:** `/Users/john/Projects-code/driveschoolpro` @ `a356a489`

---

## 1. Problem

driveschoolpro.com describes a product that does not match the app. The drift runs in
both directions at once:

- The site **advertises five features that are switched off** behind off-by-default
  feature flags. A visitor who signs up cannot find them.
- The site **labels four shipped features "Coming Soon"** — including the student
  portal, which is GA and is the product's most visible surface.
- Several features that shipped are **not mentioned anywhere**, including offline/PWA
  support and the native app.
- The site **contradicts itself**: `/pricing` says card payments work; the management
  pillar says they are "in development". `/how-progress-works` says parents can be
  invited; `/driving-school-management-software` says a parent portal is "on our roadmap".

This is a marketing-accuracy problem, not a product problem. The app is correct; the
copy is stale.

## 2. Ground truth and how it was established

The app's flag state is authoritative. Flags are declared in
`src/lib/feature-flags.ts` and read through per-feature constants in
`src/lib/config/*-visibility.ts`. Every flag env var is empty in `.env.example`, and
**unset means hidden**.

Two facts were proven against the running production app rather than inferred:

| Probe | Result | Conclusion |
|---|---|---|
| `GET app.driveschoolpro.com/confirm/<token>` | **404** | Lesson confirmation is **off** in production (documented hidden behaviour is a rewrite to an unroutable path) |
| `GET /portal/find-school`, `/portal/login`, `/get-app` | **200** | Student portal and the app-install page are **live** |

Stale claims were also confirmed live, not merely present in the repo:
`/driving-school-management-software/` serves "coming soon" **14×**;
`/driving-school-scheduling-software/` serves it **11×** and "recurring lesson series" **10×**.

### Flag state (app → site consequence)

| Flag | Default | Site currently says | Correct |
|---|---|---|---|
| `studentPortalFlag` | **hardcoded `true` (GA)** | "Coming Soon" ×23 | ❌ under-claims |
| `lessonConfirmationFlag` | off (**proven**) | "one-click confirm" ×9 | ❌ over-claims |
| `recurringBookingFlag` | off | "recurring lesson series" ×16 | ❌ over-claims |
| `parentAccessFlag` | off | "invite a parent or guardian" ×1 | ❌ over-claims |
| `studentDocumentsTabFlag` + `studentDetailsExtrasFlag` | both off | "upload documents with expiry alerts" ×7 | ❌ over-claims |
| `utilisationReportFlag` | off | "instructor utilisation reports" ×2 | ❌ over-claims |
| `testsReportFlag` | off | "record test bookings and results" | ❌ over-claims |
| `complianceReportFlag` | off | — | (no claim) |
| `whatsappFlag` | off | "coming soon" ×30 | ✅ correct — **do not touch** |
| Stripe Connect / card payments | built, live | "in development" ×9 | ❌ under-claims |
| Booking widget (`/embed/book/*`) | built | "Coming Soon" ×4 | ❌ under-claims |
| Multi-instructor | built; `FOUNDING` includes School tier | "Coming Soon" ×1 | ❌ under-claims |

### Two findings that go further than first assumed

1. **Test management is hidden entirely, not just its report.**
   `src/app/(dashboard)/tests/page.tsx:15` calls `notFound()` on the *same*
   `isReportVisible('/reports/tests')` predicate as `/reports/tests`. So there is no
   surface for recording test bookings or results at all.
   The pass-rate KPI still renders on the reports overview
   (`src/lib/queries/report-overview.ts`, unflagged), but the data path that feeds it
   is hidden — the metric exists with no way to populate it. Both the
   "record test bookings and results" and "monitor your first-time pass rate" claims
   must go.

2. **Document upload has no UI surface at all.** `StudentDetailClient.tsx:295` filters
   the Documents tab out of `tabs` when `STUDENT_DOCUMENTS_TAB_ENABLED` is off, and
   `studentDetailsExtrasFlag` (also off) hides the Documents section on the Details
   tab. Both are off, so the claim is false on both counts — not merely
   "alerts missing".

## 3. Verified correct — no action

- **Pricing.** Already migrated to "Free until 31 March 2027" in `src/config/offer.ts`
  (2026-07-29). `PROMO.enabled` is already `false`. Matches the app's `FOUNDING` free
  launch and `src/lib/config/launch.ts`. `llms.txt` is correct on pricing.
- **DVSA "27 skills / 8 categories".** Counted directly from
  `src/lib/frameworks/uk-dvsa.ts`: **27 competency codes, 8 category codes**.
  The June 2026 `CAPABILITY_AUDIT.md` claim of "26, off by one" is wrong — the site is
  right. This also means `/dvsa-27-driving-skills` and the "27" in its slug stay as-is.
- **WhatsApp "coming soon"** on ~28 occurrences. Correct and must be preserved.

## 4. Decisions adopted

| Decision | Choice | Rationale |
|---|---|---|
| Direction of fix | **The app is ground truth; change the copy** | No app deploy, no product risk, no release testing pulled forward. The flags were set deliberately (e.g. recurring series is held pending sign-off on double-booking cases) |
| Scope | **Truth pass + promote shipped features in place** | Fix what is wrong, de-stale what shipped, and work the unmarketed features into pages that already rank |
| New pages | **None** | Avoids new URLs, the ≥2-inbound-link rule and sitemap churn |
| Recurrence prevention | **`src/config/features.ts` for the six high-drift claims only** | Mirrors the existing `src/config/offer.ts` pattern; prose that must read naturally stays prose |

## 5. Guardrails

Carried from `CLAUDE.md` and the 2026-06-27 accuracy audit. These are constraints, not
preferences:

- **Not VAT-registered** — never write "inc VAT" or add VAT anywhere.
- **WhatsApp stays "coming soon".** Email is the only live reminder channel. **Never
  mention SMS at all** — not even as "coming soon".
- **Brand tokens only**: `brand-red #E94560`, `brand-navy #1A1A2E`,
  `brand-red-dark #D13354`, `brand-red-light #FFE7EC`. Introduce no new hex.
- **PPC landers are external contracts.** `/driving-instructor-software` and
  `/driving-school-software-uk` are live Google Ads destinations. **Body copy only —
  do not touch their URLs or H1s.** Same for `/ads/*` (noindexed).
- **Never `git add -A`** — this repo is public and `config.json`-style secrets live
  nearby. Stage named files only.
- Keep the calculator's *industry-benchmark* uses of "utilisation" (they describe the
  UK market, not our product). Only the **product claims** change.

## 6. Workstream A — remove false claims

35 occurrences across 13 files. JSON-LD and `<meta>` are called out because they
persist in search results and matter more than body copy.

**A1 — "one-click confirm" → email reminders only** (9)

`index.astro:69,136` · `pricing.astro:123` **(FAQ JSON-LD)**, `:332` ·
`driving-school-scheduling-software.astro:100` · `driving-school-software.astro:106` ·
`get-started.astro:169` · `compare/total-drive.astro:248` ·
`content/blog/best-driving-school-software.md:176`

Reminders are sent by email. Drop the confirm/reschedule promise. Keep "WhatsApp
coming soon" where it appears alongside.

**A2 — "recurring lesson series" → coming soon** (16)

`index.astro:42` **(JSON-LD featureList)**, `:59` ·
`driving-school-scheduling-software.astro:204` **(`<meta description>`)**, `:23`, `:72`
**(featureList labels)**, `:108`, `:174`, `:241` ·
`driving-school-management-software.astro:337` · `driving-school-software.astro:295` ·
`free-driving-school-software.astro:582` · `pricing.astro:228` ·
`content/blog/how-to-choose-driving-school-scheduling-software.md:20,51,99` ·
`content/blog/drivescout-vs-drivingschoolsoftware-comparison.md:79`

Remove from featureList and meta entirely (do not demote in structured data — a
"coming soon" featureList entry is still a claim). Demote to "coming soon" in body prose.

**A3 — parent/guardian invite** (1) — `how-progress-works.astro:38`

Currently "Yes. Instructors can invite a parent or guardian…". Align with the roadmap
wording already used at `driving-school-management-software.astro:425`, resolving the
site's self-contradiction.

**A4 — document upload + expiry alerts** (7)

`index.astro:64` · `pricing.astro:248` ·
`driving-school-management-software.astro:94,213,490` ·
`driving-school-software.astro:102,373`

Remove the upload and expiry-alert claims (§2 finding 2 — no UI surface exists).

**A5 — reports: utilisation, tests, pass rate** (2 + shared lines)

`index.astro:74` ("instructor utilisation reports") ·
`driving-school-calculator.astro:716` ("automatically monitors your utilisation…") ·
`pricing.astro:248` and `index.astro:64` (test bookings/results, first-time pass rate —
shared with A4)

Reword to the reports that are actually visible: revenue and financial reporting,
student progress, lessons. Not utilisation, tests, compliance or pass rate.

## 7. Workstream B — de-stale shipped features

39 "Coming Soon" occurrences across 8 files. The 30 **WhatsApp** ones are correct and
are explicitly excluded.

**B1 — Student portal → live** (23) — the single biggest win

`driving-school-management-software.astro:62,139,183,274,325,333,386,403,425` (9) ·
`driving-school-scheduling-software.astro:64,123,167,392,415,462` (6) ·
`driving-school-software.astro:78,130,324` (3) ·
`free-driving-school-software.astro:473,539,543,694` (4) ·
`dvsa-27-driving-skills.astro:38` (1)

Remove `badge-coming-soon`, and rewrite the future tense ("students *will* be able to…")
to present tense. Note the portal genuinely does more than the site once promised:
dashboard, lessons, progress, packages, invoices, profile, messages and self-service
booking.

**B2 — Online card payments → live** (9)

`driving-school-management-software.astro:146,341,453,454` ·
`driving-school-software.astro:152` ·
`driving-instructor-accounting-software.astro:60,144` ·
`compare/driving-school-office.astro:19` ·
`content/blog/best-driving-school-software.md:178`

Stripe Connect, pay-links and portal payment intents are built. Keep the existing
precisely-true fee wording: **"we take no commission — 0% of your payments"**, with
Stripe's standard processing fee applying to card payments. Do **not** write "no fees".

**B3 — Booking widget → live** (4) —
`driving-school-software.astro:90,189,357` · `driving-school-scheduling-software.astro:370`

**B4 — Multi-instructor → live** (1) — `driving-school-software.astro:86`.
`isSchoolPlan()` returns true for `FOUNDING`, so every free-launch org has School-tier
features including vehicles and team management.

**B5 — comparison-table cells** (2) — `free-driving-school-software.astro:451,452`

## 8. Workstream C — promote the unmarketed, in place

Built, shipped, and currently invisible on the site. No new URLs; these are worked into
existing sections on `index.astro`, the two pillars, and `get-started.astro`.

| Surface | Evidence | Angle |
|---|---|---|
| **PWA offline + native app** | `src/sw.ts` (Serwist 9), `src/lib/local-db/*` (IndexedDB), `/get-app` **live (200)**, Capacitor shell repo | **Zero mentions of "PWA", "offline" or "native app" on the entire site.** Strongest untold story: works in the car with no signal |
| `/today` daily agenda | `src/app/(dashboard)/today` | The instructor's start-of-day screen |
| `/money` hub | `src/app/(dashboard)/money` | Unified payments view |
| Messages + quick pings | `src/lib/constants/lesson-quick-messages.ts` | "On my way" / "Running late" / "I've arrived" |
| Google review automation | `src/lib/services/reviews/google-places.ts`, `ReviewNudgePanel` | Review requests by email |
| `/alerts` | `src/app/(dashboard)/alerts` | Fold into existing dashboard copy |

Constraint: quick-message pings send via SMS/WhatsApp in-app, both currently off —
describe the **feature**, not the channel, or omit the channel entirely.

## 9. Workstream D — structured data, changelog, llms.txt

**D1 — `changelog.astro` is itself a source of false claims.** Stale since April 2026
and carrying three errors:

- `:16` "WhatsApp messaging for lesson reminders — schools can **now** connect a
  WhatsApp Business number" — flatly contradicts the 30 "coming soon" mentions
  elsewhere on the site. **Highest-priority single fix.**
- `:10` "one-tap confirmation" — the flagged-off confirmation feature.
- `:28` "iCal **subscription** feeds… subscribe their schedule" — export is one-way
  ICS/Google links per booking; the tokened feed has no subscription UX.

Then add entries for what has actually shipped since April 2026.

**D2 — JSON-LD and meta** get the same treatment as body copy, per A1/A2. Specifically
`pricing.astro:123` (FAQ), `index.astro:42` (featureList),
`driving-school-scheduling-software.astro:204` (meta description), `:23`, `:72`.

**D3 — `llms.txt`** — spot-check only; verified correct on pricing and DVSA.

## 10. `src/config/features.ts`

Mirrors `src/config/offer.ts`. Covers only the six claims that have now drifted twice:

```ts
export const FEATURES = {
  studentPortal:     { status: 'live', phrase: 'student self-service portal' },
  cardPayments:      { status: 'live', phrase: 'card payments via Stripe' },
  bookingWidget:     { status: 'live', phrase: 'embeddable booking widget' },
  whatsappReminders: { status: 'soon', phrase: 'WhatsApp reminders (coming soon)' },
  recurringSeries:   { status: 'soon', phrase: 'recurring lesson series (coming soon)' },
  lessonConfirm:     { status: 'soon', phrase: 'one-click lesson confirmation (coming soon)' },
} as const;
```

Each entry carries a comment naming the app-side flag it tracks, so the next flag flip
is a one-line change here rather than a 15-file hunt. Prose stays prose — this module is
not a templating layer.

## 11. Sequencing

0. **Confirm production flag values in the Vercel dashboard** (see §12). Blocking for
   A2–A5 only; A1 is already proven and B1–B5 are safe regardless.
1. `src/config/features.ts` + Workstream A (false claims first — these are the live risk).
2. Workstream B (de-stale).
3. Workstream C (promote).
4. Workstream D (changelog, JSON-LD, llms.txt).
5. Verify → deploy → submit → log.

## 12. Verification and deploy

```bash
cd mydriveschool.software
rm -rf dist .astro && npm run build     # postbuild runs scripts/verify-seo.js
./deploy.sh mydriveschool.software      # deploys to lightsail:/var/www/driveschoolpro.com/
```

`deploy.sh` rebuilds from clean and **fails unless the live sitemap matches the fresh
build** — this is the guard against the recurring stale-`dist/` zombie-page bug. Never
rsync a stale `dist/`.

Then, per `CLAUDE.md` and standing practice:

- Submit changed URLs to the **Google Indexing API** (not optional).
- Log to the **SEO changelog**:
  ```bash
  cd tools/gsc-client && node src/enhanced-report.js \
    --log-change="Content truth pass: aligned site copy with app feature-flag state" \
    --sites=driveschoolpro.com --category=content \
    --reason="Site advertised 5 flagged-off features and labelled 4 shipped ones coming soon" \
    --expected-impact="Fewer signup-to-product expectation mismatches; accurate SERP snippets" \
    --expected-timeline="2-4 weeks"
  ```

**Post-deploy spot check** (the same probes that found the problem):

```bash
curl -s https://driveschoolpro.com/driving-school-management-software/ \
  | grep -oic "coming soon"     # expect: WhatsApp mentions only
```

## 13. Risks and open items

| Risk | Mitigation |
|---|---|
| **Only `lessonConfirmationFlag` was proven off in production.** The other flags are inferred from code defaults (all env vars empty in `.env.example`). If one is actually on in Vercel, this pass would wrongly demote a live feature | **Step 0 — JP confirms the values in the Vercel dashboard before A2–A5 land.** A1, and all of Workstream B, are unaffected |
| PPC landers carry the confirm claim; their URLs/H1s are live Ads contracts | Body copy only. No URL, slug or H1 changes. Verify ads still resolve after deploy |
| Removing text can drop a page below the ≥2-inbound-internal-link rule | `verify-seo.js` runs on every build and fails the build; net copy is added, not removed |
| Blog `.md` files carry claims too | 4 files are in scope (A1, A2, B2) and listed explicitly |
| Structured-data edits can break rich results | JSON-LD changes are removals of false entries, not schema changes. Validate `pricing.astro` FAQ after build |
| Flags flip again and copy re-drifts | `src/config/features.ts` (§10) gives the six worst offenders one home |

## 14. Out of scope

- Any change to the app repo, including turning flags on. Explicitly rejected in §4.
- Pricing and offer copy — already correct (§3).
- New indexable pages — considered and rejected (§4).
- `/dvsa-27-driving-skills` slug — the "27" is accurate (§3).
- The WhatsApp "coming soon" mentions — correct as they stand (§5).
