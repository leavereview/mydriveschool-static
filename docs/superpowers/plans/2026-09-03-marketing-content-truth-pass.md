# driveschoolpro.com Content Truth Pass — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every feature claim on driveschoolpro.com true against the app's actual feature-flag state — removing claims for flagged-off features, un-staling "Coming Soon" labels on shipped ones, and surfacing built features the site never mentions.

**Architecture:** This is a copy change in the Astro marketing repo only; no app code changes. A new build-time guard, `scripts/verify-claims.js`, encodes each claim rule as an assertion against the built `dist/` HTML and runs in `postbuild` beside the existing `verify-seo.js`. That guard is what makes this plan test-driven: it currently reports **83 failures across 16 pages**, and each task drives a named subset of those to zero.

**Tech Stack:** Astro 5, Tailwind 3, TypeScript, Node (ESM, dependency-free scripts).

**Spec:** `docs/superpowers/specs/2026-09-03-marketing-content-truth-pass-design.md`

## Global Constraints

Copied verbatim from the spec §5. Every task's requirements implicitly include these.

- **Not VAT-registered.** Never write "inc VAT", "including VAT", or add VAT anywhere.
- **WhatsApp stays "coming soon"** — it is the one correct "coming soon" on the site (30 occurrences). **Never mention SMS at all**, not even as "coming soon".
- **Fee wording is exactly** "we take no commission — 0% of your payments", with Stripe's standard processing fee applying to card payments. Never a blanket "no fees".
- **Brand tokens only:** `brand-red #E94560`, `brand-navy #1A1A2E`, `brand-red-dark #D13354`, `brand-red-light #FFE7EC`. Introduce no new hex.
- **PPC landers are live Google Ads contracts:** `/driving-instructor-software` and `/driving-school-software-uk`. Body copy only — **never change their URLs, slugs, or H1s.** Same for `/ads/*`.
- **Never `git add -A`** — this repo is public. Stage named files only.
- **Pricing is settled** ("Free until 31 March 2027") and **DVSA "27 skills / 8 categories" is correct.** Do not touch either.
- Keep the calculator's *industry-benchmark* uses of "utilisation" — they describe the UK market, not our product. Only product claims change.

## Preconditions

**P1 — Confirm production flag values before Tasks 5–7 land.** Only `lessonConfirmationFlag` was proven off (production `/confirm/<token>` → 404). The rest are inferred from code defaults (every flag env var is empty in `.env.example`; unset = hidden). In **Vercel → driveschoolpro.com → Settings → Environment Variables (Production)**, confirm these are unset or `"false"`:

```
NEXT_PUBLIC_RECURRING_BOOKING_ENABLED
NEXT_PUBLIC_PARENT_ACCESS_ENABLED
NEXT_PUBLIC_STUDENT_DOCUMENTS_TAB_ENABLED
NEXT_PUBLIC_STUDENT_DETAILS_EXTRAS_ENABLED
NEXT_PUBLIC_UTILISATION_REPORT_ENABLED
NEXT_PUBLIC_TESTS_REPORT_ENABLED
NEXT_PUBLIC_COMPLIANCE_REPORT_ENABLED
```

If any is `"true"`, that feature is live: **skip its rule** in Task 2 and skip its edits, rather than demoting a working feature. Tasks 1–2 and 8–10 are safe regardless.

---

### Task 1: Claim-verification guard

The site's existing `verify-seo.js` checks structure (sitemap, canonical, H1, meta description, ≥2 inbound links) and would happily pass a page full of false statements. This task adds the guard that makes the rest of the plan testable.

**Files:**
- Create: `scripts/verify-claims.js`
- Modify: `package.json` (the `postbuild` script)

**Interfaces:**
- Consumes: nothing.
- Produces: `node scripts/verify-claims.js`, run from the repo root against `dist/`. Exits `0` when every claim rule passes, `1` with a per-page report otherwise. Rule tables `FORBIDDEN`, `PAIRED`, `FORBIDDEN_PAIR`, `STALE` are edited by later tasks only if a precondition flag turns out to be on.

- [ ] **Step 1: Write the guard**

Create `scripts/verify-claims.js`:

```javascript
/**
 * Claim verification — asserts the built site does not contradict the app.
 *
 * verify-seo.js checks that pages are structurally sound; this checks that what
 * they SAY is true. Each rule cites the app-side flag that makes it a rule, so a
 * flag flip tells you exactly which rule to retire.
 *
 * Ground truth: driveschoolpro/src/lib/feature-flags.ts and the per-feature
 * constants in src/lib/config/*-visibility.ts. Every flag env var is empty in
 * .env.example, and UNSET MEANS HIDDEN.
 */
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.join(process.cwd(), 'dist');

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(full));
    else if (e.name.endsWith('.html')) out.push(full);
  }
  return out;
}

// Strip tags so "Portal <span>Coming Soon</span>" reads as adjacent words,
// decode the entities Astro emits, collapse whitespace, lowercase.
function normalise(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#8212;|&mdash;/g, '-').replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ')
    .toLowerCase();
}

/** Phrases that must never appear. [phrase, why] */
const FORBIDDEN = [
  ['one-click confirm', 'lessonConfirmationFlag is off'],
  ['one click confirm', 'lessonConfirmationFlag is off'],
  ['one-tap confirmation', 'lessonConfirmationFlag is off'],
  ['one-click confirmation', 'lessonConfirmationFlag is off'],
  ['confirm or reschedule', 'lessonConfirmationFlag is off'],
  ['with expiry alerts', 'documents UI has no surface'],
  ['expiry date alerts', 'documents UI has no surface'],
  ['approaching expiry', 'documents UI has no surface'],
  ['upload student documents', 'documents UI has no surface'],
  ['upload and manage student documents', 'documents UI has no surface'],
  ['instructor utilisation report', 'utilisationReportFlag is off'],
  ['monitors your utilisation', 'utilisationReportFlag is off'],
  ['driving test bookings and results', '/tests is gated with /reports/tests'],
  ['invite a parent', 'parentAccessFlag is off'],
  ['inc vat', 'LEAVE.REVIEW LTD is not VAT-registered'],
  ['including vat', 'LEAVE.REVIEW LTD is not VAT-registered'],
  ['#ff385c', 'not a brand token'],
];

/** Phrase is only allowed when a marker sits nearby. [phrase, need, window, why] */
const PAIRED = [
  ['recurring lesson', 'coming soon', 120, 'recurringBookingFlag is off'],
  ['recurring series', 'coming soon', 120, 'recurringBookingFlag is off'],
];

// Forbidden only when two phrases co-occur. Narrower than FORBIDDEN because the
// bare phrase is legitimate elsewhere: the blog cites "first-time pass rates" as
// an industry statistic, which is fine; claiming WE report yours is not.
const FORBIDDEN_PAIR = [
  ['first-time pass rate', 'monitor', 40, 'no data path: /tests is hidden'],
];

/** A shipped feature sitting next to a stale marker. [feature, marker, window, why] */
const STALE = [
  ['student portal', 'coming soon', 60, 'student portal is GA'],
  ['self-service portal', 'coming soon', 60, 'student portal is GA'],
  ['booking widget', 'coming soon', 60, 'embed booking widget is built'],
  ['card payments', 'coming soon', 60, 'Stripe Connect is live'],
  ['card payments', 'in development', 60, 'Stripe Connect is live'],
  ['online payments', 'coming soon', 60, 'Stripe Connect is live'],
  ['multi-instructor management', 'coming soon', 60, 'FOUNDING includes School tier'],
];

function nearby(text, a, b, win) {
  const hits = [];
  let i = text.indexOf(a);
  while (i !== -1) {
    const slice = text.slice(Math.max(0, i - win), i + a.length + win);
    // "WhatsApp ... coming soon" is CORRECT and must never be flagged. If
    // WhatsApp is what the marker belongs to, this is not a stale badge.
    if (slice.includes(b) && !slice.includes('whatsapp'))
      hits.push(text.slice(Math.max(0, i - 40), i + a.length + 60).trim());
    i = text.indexOf(a, i + 1);
  }
  return hits;
}

if (!fs.existsSync(distDir)) {
  console.error('ERROR: dist/ not found. Run npm run build first.');
  process.exit(1);
}

const pages = walk(distDir);
const failures = [];

for (const file of pages) {
  const page = '/' + path.relative(distDir, file).replace(/index\.html$/, '').replace(/\.html$/, '/');
  const text = normalise(fs.readFileSync(file, 'utf8'));

  for (const [phrase, why] of FORBIDDEN)
    if (text.includes(phrase)) failures.push({ page, rule: `forbidden: "${phrase}"`, why });

  for (const [phrase, need, win, why] of PAIRED) {
    let i = text.indexOf(phrase);
    while (i !== -1) {
      const slice = text.slice(Math.max(0, i - win), i + phrase.length + win);
      if (!slice.includes(need)) {
        failures.push({ page, rule: `"${phrase}" without "${need}"`, why });
        break;
      }
      i = text.indexOf(phrase, i + 1);
    }
  }

  for (const [a, b, win, why] of FORBIDDEN_PAIR)
    for (const _ of nearby(text, a, b, win))
      failures.push({ page, rule: `forbidden: "${a}" near "${b}"`, why });

  for (const [a, b, win, why] of STALE)
    for (const _ of nearby(text, a, b, win))
      failures.push({ page, rule: `stale: "${a}" near "${b}"`, why });
}

if (failures.length) {
  console.error(`CLAIM VERIFICATION FAILED - ${failures.length} issue(s):\n`);
  const byPage = {};
  for (const f of failures) (byPage[f.page] ||= []).push(f);
  for (const [page, list] of Object.entries(byPage)) {
    console.error(`  ${page}`);
    for (const f of list) console.error(`    - ${f.rule}  (${f.why})`);
    console.error('');
  }
  process.exit(1);
}
console.log(`Claim verification passed - ${pages.length} pages checked.`);
```

- [ ] **Step 2: Run it against the current site to see it fail**

```bash
rm -rf dist .astro && npm run build   # postbuild currently runs verify-seo.js only
node scripts/verify-claims.js; echo "exit=$?"
```

Expected: `exit=1`, header `CLAIM VERIFICATION FAILED - 83 issue(s):`, with the worst pages being `/driving-school-management-software/` (21), `/driving-school-software/` (17), `/driving-school-scheduling-software/` (11), `/` (7), `/pricing/` (6).

This failing run is the baseline every later task reduces.

- [ ] **Step 3: Confirm the WhatsApp exclusion holds**

The one thing this guard must never do is flag the 30 correct WhatsApp "coming soon" mentions.

```bash
node scripts/verify-claims.js 2>&1 | grep -ci whatsapp; echo "exit=$?"
```

Expected: `0` — no reported issue mentions WhatsApp.

- [ ] **Step 4: Wire it into postbuild**

In `package.json`, change:

```json
"postbuild": "node scripts/verify-seo.js",
```

to:

```json
"postbuild": "node scripts/verify-seo.js && node scripts/verify-claims.js",
```

- [ ] **Step 5: Confirm the build now fails on claims**

```bash
npm run build; echo "exit=$?"
```

Expected: non-zero. `verify-seo.js` passes, then the claim guard fails with the same 83 issues. **The build stays red until Task 9** — that is intended, and is the signal the plan is working.

- [ ] **Step 6: Commit**

```bash
git add scripts/verify-claims.js package.json
git commit -m "test(claims): add a build-time guard for marketing feature claims

Encodes each claim rule as an assertion against built HTML, citing the
app-side flag that justifies it. Reports 83 pre-existing failures across
16 pages; the following commits drive it to zero."
```

---

### Task 2: Feature-status config module

Gives the six claims that have now drifted twice one home, mirroring the existing `src/config/offer.ts` pattern.

**Files:**
- Create: `src/config/features.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `FEATURES` — a `const` object keyed by feature id, each `{ status: 'live' | 'soon', phrase: string }`. Later tasks import it as `import { FEATURES } from '../config/features';` (adjust depth per page). `FEATURES.<key>.phrase` is the canonical wording; `FEATURES.<key>.status` is what a flag flip changes.

- [ ] **Step 1: Write the module**

Create `src/config/features.ts`:

```typescript
/**
 * Feature status — single source of truth for what the site may claim.
 *
 * Mirrors src/config/offer.ts. Covers only the claims that have drifted more
 * than once; prose that must read naturally stays prose. This is not a
 * templating layer.
 *
 * GROUND TRUTH IS THE APP, NOT THIS FILE. Each entry names the flag in
 * driveschoolpro/src/lib/feature-flags.ts that decides it. Every flag env var
 * is empty in the app's .env.example, and UNSET MEANS HIDDEN — so a feature is
 * only 'live' here once its flag is confirmed on in Vercel (Production).
 *
 * Last verified against the app: 2026-09-03 (app @ a356a489).
 *   /confirm/<token>   -> 404  => lesson confirmation OFF
 *   /portal/find-school -> 200 => student portal LIVE
 */

export const FEATURES = {
  /** studentPortalFlag: decide() returns true — GA, not env-gated. */
  studentPortal: { status: 'live', phrase: 'student self-service portal' },

  /** Stripe Connect: built (connect.ts, /pay/[token], portal payment intents). */
  cardPayments: { status: 'live', phrase: 'card payments via Stripe' },

  /** Built at src/app/embed/book/[businessSlug]. */
  bookingWidget: { status: 'live', phrase: 'embeddable booking widget' },

  /** isSchoolPlan() returns true for FOUNDING — free-launch orgs get School tier. */
  multiInstructor: { status: 'live', phrase: 'multi-instructor tools' },

  /** whatsappFlag: off until the Twilio/Meta template provisioning lands. */
  whatsappReminders: { status: 'soon', phrase: 'WhatsApp reminders (coming soon)' },

  /** recurringBookingFlag: off pending sign-off on series double-booking cases. */
  recurringSeries: { status: 'soon', phrase: 'recurring lesson series (coming soon)' },

  /** lessonConfirmationFlag: off — PROVEN by production /confirm/<token> 404. */
  lessonConfirm: { status: 'soon', phrase: 'one-click lesson confirmation (coming soon)' },
} as const;

export type FeatureKey = keyof typeof FEATURES;
export type FeatureStatus = (typeof FEATURES)[FeatureKey]['status'];
```

- [ ] **Step 2: Verify it type-checks**

```bash
npx astro check 2>&1 | tail -5
```

Expected: `0 errors`. (Hints and warnings are pre-existing — the build reported 41 hints before this change; only the error count matters.)

- [ ] **Step 3: Commit**

```bash
git add src/config/features.ts
git commit -m "feat(config): add FEATURES status module

Mirrors offer.ts for the six claims that have drifted twice. Each entry
names the app-side flag that decides it, so a flag flip is a one-line
change here rather than a 15-file hunt."
```

---

### Task 3: Remove "one-click confirm" claims (A1)

`lessonConfirmationFlag` is off — proven by production `/confirm/<token>` returning 404. The whole confirmation slice is hidden, including the pupil-facing landing page.

**Files:**
- Modify: `src/pages/index.astro:69,136`
- Modify: `src/pages/pricing.astro:123` (FAQ JSON-LD), `:332`
- Modify: `src/pages/driving-school-scheduling-software.astro:100`
- Modify: `src/pages/driving-school-software.astro:106`
- Modify: `src/pages/get-started.astro:169`
- Modify: `src/pages/compare/total-drive.astro:248`
- Modify: `src/content/blog/best-driving-school-software.md:176`

**Interfaces:**
- Consumes: `scripts/verify-claims.js` from Task 1.
- Produces: no code interface. Clears rules `one-click confirm` (4), `confirm or reschedule` (3), `one-click confirmation` (1) = **8 issues**.

- [ ] **Step 1: Confirm the 8 failures are present**

```bash
node scripts/verify-claims.js 2>&1 | grep -cE 'one-click confirm|confirm or reschedule|one-click confirmation'
```

Expected: `8`.

- [ ] **Step 2: Apply the replacements**

`src/pages/index.astro:69` — from:
```
    description: 'Automated email reminders with configurable timing. Students confirm lessons with one click — reducing no-shows before they happen. (WhatsApp coming soon.)'
```
to:
```
    description: 'Automated email reminders with configurable timing, sent before every lesson to cut no-shows. (WhatsApp coming soon.)'
```

`src/pages/index.astro:136` — from:
```
    answer: "Reminders go out by email, with one-click confirm so pupils can confirm or reschedule before the lesson. WhatsApp is coming soon.",
```
to:
```
    answer: "Reminders go out by email automatically before every lesson, with configurable timing and full delivery logs. WhatsApp is coming soon.",
```

`src/pages/pricing.astro:123` (**FAQ JSON-LD — persists in search results**) — from:
```
        "text": "Reminders go out by email with one-click confirm, so pupils can confirm or reschedule before the lesson. WhatsApp is coming soon."
```
to:
```
        "text": "Reminders go out by email automatically before every lesson, with configurable timing and full delivery logs. WhatsApp is coming soon."
```

`src/pages/pricing.astro:332` — from:
```
            <p class="text-gray-600 text-sm">Reminders go out by email with one-click confirm, so pupils can confirm or reschedule before the lesson. WhatsApp is coming soon.</p>
```
to:
```
            <p class="text-gray-600 text-sm">Reminders go out by email automatically before every lesson, with configurable timing and full delivery logs. WhatsApp is coming soon.</p>
```

`src/pages/driving-school-scheduling-software.astro:100` — from `label: 'Lesson Confirmation via Email',` to:
```
    label: 'Automated Email Reminders',
```

`src/pages/driving-school-software.astro:106` — from `label: 'Lesson Confirmation via Email with Message Templates',` to:
```
    label: 'Email Reminders with Message Templates',
```

`src/pages/get-started.astro:169` — from:
```
          <p class="text-gray-600 text-sm leading-relaxed">Automatic reminders sent before every lesson. Students confirm or reschedule before you've left the house.</p>
```
to:
```
          <p class="text-gray-600 text-sm leading-relaxed">Automatic reminders sent before every lesson, so fewer pupils forget and fewer slots go to waste.</p>
```

`src/pages/compare/total-drive.astro:248` — from:
```
          body: 'DriveSchoolPro sends automated email reminders with one-click confirm today, and WhatsApp reminders are coming soon — UK pupils actually read WhatsApp. Total Drive does not offer WhatsApp reminders.'
```
to (keep the existing escaped apostrophe in `doesn\'t` exactly as the file has it):
```
          body: 'DriveSchoolPro sends automated email reminders today, and WhatsApp reminders are coming soon — UK pupils actually read WhatsApp. Total Drive doesn\'t offer WhatsApp reminders.'
```

`src/content/blog/best-driving-school-software.md:176` — from:
```
- Email reminders included (configurable timing, delivery logs, one-click confirmation); WhatsApp reminders coming soon
```
to:
```
- Email reminders included (configurable timing, delivery logs); WhatsApp reminders coming soon
```

- [ ] **Step 3: Rebuild and verify those 8 are gone**

```bash
rm -rf dist .astro && npx astro build >/dev/null 2>&1
node scripts/verify-claims.js 2>&1 | grep -cE 'one-click confirm|confirm or reschedule|one-click confirmation'
```

Expected: `0`. Total issue count drops from 83 to 75 (`node scripts/verify-claims.js 2>&1 | grep -c '^    - '`).

Note the `one-tap confirmation` hit on `/changelog/` is **not** part of this task — Task 10 handles it.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro src/pages/pricing.astro \
        src/pages/driving-school-scheduling-software.astro \
        src/pages/driving-school-software.astro src/pages/get-started.astro \
        src/pages/compare/total-drive.astro \
        src/content/blog/best-driving-school-software.md
git commit -m "fix(copy): drop one-click confirm claims (flag is off)

lessonConfirmationFlag is off in production - /confirm/<token> returns
404. Includes the pricing page's FAQ JSON-LD, which persists in search
results."
```

---

### Task 4: Demote "recurring lesson series" (A2)

`recurringBookingFlag` is off, held pending sign-off on series-level double-booking and daily-cap cases.

**Files:**
- Modify: `src/pages/index.astro:42` (JSON-LD featureList), `:59`
- Modify: `src/pages/driving-school-scheduling-software.astro:23,72,204` (meta description), `:108,174,241`
- Modify: `src/pages/driving-school-management-software.astro:337`
- Modify: `src/pages/driving-school-software.astro:295`
- Modify: `src/pages/free-driving-school-software.astro:582`
- Modify: `src/pages/pricing.astro:228`
- Modify: `src/content/blog/how-to-choose-driving-school-scheduling-software.md:20,51,99`
- Modify: `src/content/blog/drivescout-vs-drivingschoolsoftware-comparison.md:79`

**Interfaces:**
- Consumes: Task 1's guard.
- Produces: clears `"recurring lesson" without "coming soon"` (7) and `"recurring series" without "coming soon"` (1) = **8 issues**.

**Rule:** in **structured data and meta**, delete the claim outright — a "coming soon" entry in a `featureList` is still a claim. In **body prose**, demote to "(coming soon)".

- [ ] **Step 1: Confirm the 8 failures are present**

```bash
node scripts/verify-claims.js 2>&1 | grep -c 'recurring'
```

Expected: `8`.

- [ ] **Step 2: Structured data and meta — delete the claim**

`src/pages/index.astro:42` — delete this line from the `featureList` array entirely:
```
    "Recurring Lesson Series",
```
While in that array, also delete this line — `/tests` is gated by the same predicate as `/reports/tests`, so test management is hidden entirely:
```
    "Test Date Management",
```

`src/pages/driving-school-scheduling-software.astro:204` (`<meta description>`) — from:
```
  description="Driving school scheduling software with three-way conflict detection, recurring lesson series, and automated reminders. Drag-and-drop calendars. Reduce no-shows by up to 50%."
```
to:
```
  description="Driving school scheduling software with three-way conflict detection, drag-and-drop calendars, and automated reminders. Reduce no-shows by up to 50%."
```

- [ ] **Step 3: Stat card and comparison row**

`src/pages/driving-school-scheduling-software.astro:23` — this is a `{label, value, context}` stat card. Change:
```
    label: 'Recurring Lessons',
    value: 'Built in',
    context: 'Set up a weekly series in one go'
```
to:
```
    label: 'Recurring Lessons',
    value: 'Coming soon',
    context: 'Weekly series in one go — in testing now'
```

`src/pages/driving-school-scheduling-software.astro:72` — this is a `ComparisonTable` row. `ComparisonRow.values` is typed `(string | number | boolean)[]` and `formatValue` renders strings as text, so a string cell is valid (there is precedent at `compare/total-drive.astro:13`). Change:
```
    label: 'Recurring Lesson Series',
    values: [true, false, false]
```
to:
```
    label: 'Recurring Lesson Series',
    values: ['Coming soon', false, false]
```

- [ ] **Step 4: Body prose — demote to "(coming soon)"**

`src/pages/index.astro:59` — remove the claim from the middle of the sentence:
```
    description: 'Day, week and month calendar views with colour-coded lessons across every instructor. Three-way conflict detection checks student, instructor, and vehicle before every booking. Drag-and-drop rescheduling and quick booking straight from the calendar.'
```

`src/pages/pricing.astro:228`:
```
            <p class="text-gray-600 text-sm">Interactive calendar with day, week, and month heatmap views. Reschedule lessons with drag-and-drop. Recurring lesson series coming soon.</p>
```

For the remaining prose hits — `driving-school-scheduling-software.astro:108,174,241`, `driving-school-management-software.astro:337`, `driving-school-software.astro:295`, `free-driving-school-software.astro:582`, and the four blog lines — append `(coming soon)` immediately after the phrase, or drop the phrase from its list. The guard requires "coming soon" within 120 characters of every "recurring lesson"/"recurring series" occurrence, so keep the marker in the same sentence.

Worked example for `driving-school-software.astro:295`:
```
            <p class="text-gray-700">Drag-and-drop calendar with conflict detection across students, instructors, and vehicles. Day, week, and month views. Recurring lesson series coming soon.</p>
```

- [ ] **Step 5: Rebuild and verify**

```bash
rm -rf dist .astro && npx astro build >/dev/null 2>&1
node scripts/verify-claims.js 2>&1 | grep -c 'recurring'
```

Expected: `0`. Running total: 75 → 67.

- [ ] **Step 6: Commit**

```bash
git add src/pages/index.astro src/pages/pricing.astro \
        src/pages/driving-school-scheduling-software.astro \
        src/pages/driving-school-management-software.astro \
        src/pages/driving-school-software.astro \
        src/pages/free-driving-school-software.astro \
        src/content/blog/how-to-choose-driving-school-scheduling-software.md \
        src/content/blog/drivescout-vs-drivingschoolsoftware-comparison.md
git commit -m "fix(copy): demote recurring lesson series to coming soon

recurringBookingFlag is off. Deleted from featureList and meta outright
(a coming-soon entry in structured data is still a claim); demoted in
prose. Also drops Test Date Management from the featureList - /tests is
gated by the same predicate as /reports/tests."
```

---

### Task 5: Remove documents, tests and reports claims (A3, A4, A5)

Three flagged-off areas, grouped because they share `index.astro:64` and `pricing.astro:248`.

**Precondition:** P1 must confirm `NEXT_PUBLIC_STUDENT_DOCUMENTS_TAB_ENABLED`, `NEXT_PUBLIC_STUDENT_DETAILS_EXTRAS_ENABLED`, `NEXT_PUBLIC_TESTS_REPORT_ENABLED`, `NEXT_PUBLIC_UTILISATION_REPORT_ENABLED` and `NEXT_PUBLIC_PARENT_ACCESS_ENABLED` are off.

**Files:**
- Modify: `src/pages/index.astro:64,74`
- Modify: `src/pages/pricing.astro:248`
- Modify: `src/pages/how-progress-works.astro:38`
- Modify: `src/pages/driving-school-management-software.astro:94,213,490`
- Modify: `src/pages/driving-school-software.astro:102,373`
- Modify: `src/pages/driving-school-calculator.astro:716`

**Interfaces:**
- Consumes: Task 1's guard.
- Produces: clears documents (9), tests/pass-rate (6), utilisation (2), parent (1) = **18 issues**.

- [ ] **Step 1: Confirm the 18 failures are present**

```bash
node scripts/verify-claims.js 2>&1 | grep -cE 'expiry|upload|test bookings|pass rate|utilisation|invite a parent'
```

Expected: `18`.

- [ ] **Step 2: The two shared lines**

`src/pages/index.astro:64` — documents have no UI surface at all (the tab is filtered out of `tabs` and the Details-tab section is hidden by a second flag), and `/tests` is hidden. From:
```
    description: 'Complete student profiles with DVSA competency tracking across all 27 skills. Manage driving test bookings and results, upload documents with expiry alerts, and track every student\'s balance with a full credit and debit ledger.'
```
to:
```
    description: 'Complete student profiles with DVSA competency tracking across all 27 skills, per-student notification preferences, and every student\'s balance tracked with a full credit and debit ledger.'
```

`src/pages/pricing.astro:248` — from:
```
            <p class="text-gray-600 text-sm">Record driving test bookings and results. Upload student documents with expiry alerts. Monitor your school's first-time pass rate.</p>
```
to:
```
            <p class="text-gray-600 text-sm">Track every pupil against the full DVSA framework, record lesson outcomes, and see progress at a glance across your whole school.</p>
```

- [ ] **Step 3: Utilisation reports**

`src/pages/index.astro:74` — the visible reports are the hub overview, revenue, students, lessons and vehicles; utilisation, tests and compliance are hidden. From:
```
    description: 'Real-time dashboard with 8 business metrics. Financial reports with 6-month revenue trends, instructor utilisation reports, and student progress overviews.'
```
to:
```
    description: 'Real-time dashboard with 8 business metrics. Financial reports with 6-month revenue trends, lesson and vehicle reporting, and student progress overviews.'
```

`src/pages/driving-school-calculator.astro:716` — from:
```
              DriveSchoolPro automatically monitors your utilisation, revenue per hour, pupil pipeline, and seasonal trends—so you always know exactly where your business stands. No more spreadsheets or manual calculations. Get real-time insights that help you maximise earnings.
```
to:
```
              DriveSchoolPro tracks your revenue, lessons delivered, and pupil pipeline—so you always know exactly where your business stands. No more spreadsheets or manual calculations. Get real-time insights that help you maximise earnings.
```

**Do not** touch the calculator's other uses of "utilisation" (lines 42, 57, 113, 130, 250–254, 535–611, 660–672, 751–759, 807, and the whole `<script>` block from 1261). Those are UK industry benchmarks and the calculator's own input field — legitimate content, and the guard does not flag them.

- [ ] **Step 4: Parent/guardian invite**

`src/pages/how-progress-works.astro:38` — `parentAccessFlag` is off, and `driving-school-management-software.astro:425` already calls this a roadmap item. From:
```
    answer: "Yes. Instructors can invite a parent or guardian to view the pupil's progress portal. Parents see DVSA skill ratings, upcoming lessons, and lesson notes (if you choose to share them). They don't have access to payment details or instructor-only notes.",
```
to:
```
    answer: "Not yet. A dedicated parent and guardian view of a pupil's progress is on our roadmap. Today, pupils see their own DVSA skill ratings, upcoming lessons and lesson notes in the student portal, and can share that with a parent themselves.",
```

- [ ] **Step 5: The remaining document claims**

`src/pages/driving-school-management-software.astro:213` is a full FAQ answer, `:490` a paragraph, `:94` a feature line; `src/pages/driving-school-software.astro:102` a feature line and `:373` a paragraph. Remove the document upload/expiry claims from each, keeping the surrounding true content.

Worked example for `driving-school-software.astro:373` — from:
```
            <p class="text-gray-700">Upload and track student documents — provisional licence, passport photos, medical declarations — with expiry date alerts. The dashboard flags documents nearing expiry.</p>
```
to:
```
            <p class="text-gray-700">Keep every pupil's contact details, DVSA progress, lesson history and balance in one record, so anyone covering a lesson has the full picture.</p>
```

For `management:213`, replace the FAQ question/answer pair with one covering a feature that exists (student records, or the credit/debit ledger) rather than leaving a question with a negative answer.

- [ ] **Step 6: Rebuild and verify**

```bash
rm -rf dist .astro && npx astro build >/dev/null 2>&1
node scripts/verify-claims.js 2>&1 | grep -cE 'expiry|upload|test bookings|pass rate|utilisation|invite a parent'
```

Expected: `0`. Running total: 67 → 49.

Also confirm the blog's industry statistic survived — it is legitimate and must not be collateral damage:

```bash
node scripts/verify-claims.js 2>&1 | grep -c 'student-progress-tracking'
```

Expected: `0`.

- [ ] **Step 7: Commit**

```bash
git add src/pages/index.astro src/pages/pricing.astro \
        src/pages/how-progress-works.astro \
        src/pages/driving-school-management-software.astro \
        src/pages/driving-school-software.astro \
        src/pages/driving-school-calculator.astro
git commit -m "fix(copy): remove documents, tests and utilisation claims

The documents UI has no surface (tab filtered out, details section
flagged off); /tests is gated with /reports/tests; the utilisation
report is held back. Parent invites align with the roadmap wording used
elsewhere. Industry-benchmark uses of utilisation are untouched."
```

---

### Task 6: Student portal is live (B1)

The largest single win. `studentPortalFlag.decide()` returns `true` — GA, not env-gated — and production `/portal/find-school` and `/portal/login` both return 200.

**Files:**
- Modify: `src/pages/driving-school-management-software.astro:62,139,183,274,325,333,386,403,425`
- Modify: `src/pages/driving-school-scheduling-software.astro:64,123,167,392,415,462`
- Modify: `src/pages/driving-school-software.astro:78,130,324`
- Modify: `src/pages/free-driving-school-software.astro:473,539,543,694`
- Modify: `src/pages/dvsa-27-driving-skills.astro:38`

**Interfaces:**
- Consumes: Task 1's guard; `FEATURES.studentPortal` from Task 2.
- Produces: clears `"student portal" near "coming soon"` (13) and `"self-service portal" near "coming soon"` (13) = **26 issues**.

- [ ] **Step 1: Confirm the 26 failures are present**

```bash
node scripts/verify-claims.js 2>&1 | grep -c 'portal'
```

Expected: `26`.

- [ ] **Step 2: Strip the badges**

Every occurrence takes one of two shapes. Remove the `<span>` entirely:

```
<h3 class="...">Student Portal <span class="badge-coming-soon ml-2">Coming Soon</span></h3>
```
becomes
```
<h3 class="...">Student Portal</h3>
```

and in comparison tables:
```
<td class="p-4 font-medium">Student Portal <span class="badge-coming-soon ml-1">Coming Soon</span></td>
```
becomes
```
<td class="p-4 font-medium">Student Portal</td>
```

Find them all with:
```bash
grep -rn "badge-coming-soon" src/pages | grep -iv whatsapp
```

- [ ] **Step 3: Rewrite the future tense**

Removing a badge is not enough — the surrounding prose says "students *will* be able to". Rewrite to present tense. The portal genuinely does more than the site ever promised: dashboard, lessons, progress, packages, invoices, profile, messages and self-service booking.

Worked example, `driving-school-management-software.astro:386` — from:
```
          <li>Students will soon view their own progress through their self-service portal (coming soon)</li>
```
to:
```
          <li>Students view their own DVSA progress, lessons, invoices and package balances in their self-service portal</li>
```

Worked example, `driving-school-scheduling-software.astro:415` — from:
```
          <li>Allow rescheduling through the student portal without calling (coming soon)</li>
```
to:
```
          <li>Pupils book and reschedule through the student portal without calling</li>
```

Also update the image caption at `driving-school-scheduling-software.astro:392`:
```
        <p class="text-sm text-gray-500 text-center -mt-4 mb-8">The student self-service portal on mobile</p>
```

- [ ] **Step 4: Rebuild and verify**

```bash
rm -rf dist .astro && npx astro build >/dev/null 2>&1
node scripts/verify-claims.js 2>&1 | grep -c 'portal'
```

Expected: `0`. Running total: 49 → 23.

Confirm no stray future tense survived:
```bash
grep -rniE "portal \(coming soon\)|will (soon )?(be able to|view)" src/pages | grep -i portal
```
Expected: no output.

- [ ] **Step 5: Commit**

```bash
git add src/pages/driving-school-management-software.astro \
        src/pages/driving-school-scheduling-software.astro \
        src/pages/driving-school-software.astro \
        src/pages/free-driving-school-software.astro \
        src/pages/dvsa-27-driving-skills.astro
git commit -m "fix(copy): the student portal is live, not coming soon

studentPortalFlag returns true unconditionally and production
/portal/find-school and /portal/login both return 200. Removes 26 stale
badges and rewrites the surrounding future tense."
```

---

### Task 7: Card payments are live (B2, B5)

Stripe Connect is built — `services/stripe/connect.ts`, seven `/api/stripe/connect/*` endpoints, `/pay/[token]`, and portal payment intents. Today `/pricing` says card payments work while the management pillar says they are "in development"; this resolves the contradiction in favour of the app.

**Precondition:** P1 — confirm `FEATURE_FLAG_STRIPE_CONNECT` is on in Production. If it is off, stop and raise it: `/pricing` and the pricing FAQ JSON-LD already claim card payments work, so the fix would be the reverse of this task.

**Files:**
- Modify: `src/pages/driving-school-management-software.astro:146,341,453,454`
- Modify: `src/pages/driving-school-software.astro:152`
- Modify: `src/pages/driving-instructor-accounting-software.astro:60,144`
- Modify: `src/pages/compare/driving-school-office.astro:19`
- Modify: `src/content/blog/best-driving-school-software.md:178`

**Interfaces:**
- Consumes: Task 1's guard; `FEATURES.cardPayments` from Task 2.
- Produces: clears `"card payments" near "coming soon"` (12) and `near "in development"` (1) = **13 issues**.

- [ ] **Step 1: Confirm the 13 failures are present**

```bash
node scripts/verify-claims.js 2>&1 | grep -cE 'card payments|online payments'
```

Expected: `13`.

- [ ] **Step 2: Apply the fee-accurate wording**

Every instance of "online card payments are coming soon" / "Online card payments coming soon" / "Stripe integration for online card payments is in development" becomes a statement that they work, using the **exact** fee wording from the Global Constraints.

Worked example, `driving-instructor-accounting-software.astro:60` — from:
```
      'Yes. You can record payments taken by cash, bank transfer or cheque against the lesson and pupil they belong to, which is what makes the income side reconcile later. Online card payments are coming soon.'
```
to:
```
      'Yes. You can record payments taken by cash, bank transfer or cheque against the lesson and pupil they belong to, which is what makes the income side reconcile later. You can also take card payments through Stripe pay-links on invoices — we take no commission — 0% of your payments — and Stripe\'s standard processing fee applies.'
```

Worked example, `driving-school-management-software.astro:453-454` — from:
```
          <p class="font-bold text-brand-navy">Online card payments coming soon</p>
          <p>Stripe integration for online card payments is in development. Currently, the system supports manual payment recording with full invoice lifecycle management.</p>
```
to:
```
          <p class="font-bold text-brand-navy">Take card payments online</p>
          <p>Send invoices with Stripe pay-links so pupils can pay by card, alongside manual recording of cash, bank transfer and cheque. We take no commission — 0% of your payments — and Stripe's standard processing fee applies to card payments.</p>
```

Also fix the two comparison-table cells at `free-driving-school-software.astro:451,452` (spec **B5**), which currently read `Coming Soon` in an amber cell.

- [ ] **Step 3: Rebuild and verify**

```bash
rm -rf dist .astro && npx astro build >/dev/null 2>&1
node scripts/verify-claims.js 2>&1 | grep -cE 'card payments|online payments'
```

Expected: `0`. Running total: 23 → 10.

Confirm the fee wording did not drift into a blanket "no fees":
```bash
grep -rniE "no fees|fee-free|zero fees" src/pages src/content
```
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add src/pages/driving-school-management-software.astro \
        src/pages/driving-school-software.astro \
        src/pages/driving-instructor-accounting-software.astro \
        src/pages/compare/driving-school-office.astro \
        src/pages/free-driving-school-software.astro \
        src/content/blog/best-driving-school-software.md
git commit -m "fix(copy): card payments are live via Stripe Connect

Resolves the site contradicting itself - /pricing already said card
payments work while the management pillar said in development. Uses the
precise fee wording: no commission, 0% of your payments, Stripe's
standard processing fee applies."
```

---

### Task 8: Booking widget and multi-instructor are live (B3, B4)

The embeddable widget is built at `src/app/embed/book/[businessSlug]`, and `isSchoolPlan()` returns true for `FOUNDING`, so every free-launch org already has School-tier features.

**Files:**
- Modify: `src/pages/driving-school-software.astro:86,90,189,357`
- Modify: `src/pages/driving-school-scheduling-software.astro:370`
- Modify: `src/pages/compare/total-drive.astro` (the booking-widget row)

**Interfaces:**
- Consumes: Task 1's guard; `FEATURES.bookingWidget`, `FEATURES.multiInstructor` from Task 2.
- Produces: clears `"booking widget" near "coming soon"` (8) and `"multi-instructor management" near "coming soon"` (1) = **9 issues**, taking the guard from 10 to **1** — the remaining `/changelog/` entry is cleared in Task 9.

- [ ] **Step 1: Confirm the 9 failures are present**

```bash
node scripts/verify-claims.js 2>&1 | grep -cE 'booking widget|multi-instructor'
```

Expected: `9`.

- [ ] **Step 2: Booking widget**

`src/pages/driving-school-software.astro:357` — from:
```
            <h3 class="text-xl font-bold text-brand-navy mb-3">Online Booking Widget <span class="badge-coming-soon ml-2">Coming Soon</span></h3>
```
to:
```
            <h3 class="text-xl font-bold text-brand-navy mb-3">Online Booking Widget</h3>
```

`src/pages/driving-school-software.astro:90` — from `label: 'Online Booking Widget (Coming Soon)',` to:
```
    label: 'Online Booking Widget',
```

For the prose at `:189` and `scheduling-software.astro:370`, rewrite the future tense. Worked example — from:
```
    answer: "An embeddable booking widget is coming soon. When launched, you'll be able to add it to any website with a single code snippet so students can see available time slots, choose one, and book."
```
to:
```
    answer: "Yes. Add the embeddable booking widget to any website with a single code snippet, and pupils see your live availability, pick a slot, and book — with three-way conflict detection running before the booking is confirmed."
```

- [ ] **Step 3: Multi-instructor**

`src/pages/driving-school-software.astro:86` — from `label: 'Multi-Instructor Management (Coming Soon)',` to:
```
    label: 'Multi-Instructor Management',
```

- [ ] **Step 4: Rebuild and verify only the changelog remains**

```bash
rm -rf dist .astro && npx astro build >/dev/null 2>&1
node scripts/verify-claims.js 2>&1 | grep -c '^    - '
```

Expected: `1` — exactly one issue left, `forbidden: "one-tap confirmation"` on `/changelog/`, which Task 9 clears. Running total: 10 → 1.

- [ ] **Step 5: Commit**

```bash
git add src/pages/driving-school-software.astro \
        src/pages/driving-school-scheduling-software.astro \
        src/pages/compare/total-drive.astro
git commit -m "fix(copy): booking widget and multi-instructor are live

The embed widget is built at /embed/book/[businessSlug], and
isSchoolPlan() returns true for FOUNDING so free-launch orgs already
have School-tier features. One claim issue remains, on /changelog/."
```

---

### Task 9: Changelog, JSON-LD sweep and llms.txt (D)

`changelog.astro` is stale since April 2026 and is itself a source of false claims.

**Files:**
- Modify: `src/pages/changelog.astro:10,16,28` and the `entries` array
- Verify: `public/llms.txt`

**Interfaces:**
- Consumes: Task 1's guard.
- Produces: clears `forbidden: "one-tap confirmation"` (1) on `/changelog/` — the last outstanding issue, taking the guard to **0**.

- [ ] **Step 1: Fix the three false changelog entries**

`:16` is the worst — it announces WhatsApp as shipped, flatly contradicting the 30 "coming soon" mentions everywhere else. Remove that entry entirely (it describes something that never launched):

```javascript
  {
    date: "April 2026",
    tag: "Messaging",
    title: "WhatsApp messaging for lesson reminders",
    body: "Driving schools on DriveSchoolPro can now connect a WhatsApp Business number to send lesson reminders and follow-ups directly from the platform — in addition to existing email notifications.",
  },
```

`:10` — drop the confirmation claim from the portal entry:
```javascript
  {
    date: "April 2026",
    tag: "Portal",
    title: "Student booking portal redesign",
    body: "Students can now book and reschedule lessons directly from a redesigned dashboard — with a weekly calendar view and live instructor availability. The updated portal works smoothly on mobile without any app download.",
  },
```

`:28` — export is one-way ICS/Google links per booking; there is no subscription-feed UX:
```javascript
  {
    date: "March 2026",
    tag: "Calendar",
    title: "Calendar export for lessons",
    body: "Add any lesson to Google Calendar, Apple Calendar or Outlook straight from its confirmation — a one-way export, so your DriveSchoolPro diary stays the source of truth.",
  },
```

- [ ] **Step 2: Add entries for what actually shipped since April 2026**

Prepend, newest first, matching the existing shape exactly:

```javascript
  {
    date: "August 2026",
    tag: "Mobile",
    title: "Offline access and the installable app",
    body: "Install DriveSchoolPro on your phone and it keeps working with no signal. Your diary, pupil records and lesson notes stay available in the car, and anything you change syncs when you are back online.",
  },
  {
    date: "July 2026",
    tag: "Pricing",
    title: "Free until 31 March 2027",
    body: "DriveSchoolPro is free for every school during early access — no card required, no setup fees, and we take no commission on the payments you collect. Pricing will be announced well before 1 April 2027.",
  },
  {
    date: "June 2026",
    tag: "Dashboard",
    title: "Your day on one screen",
    body: "A daily agenda that opens on today: every lesson in order, who is next, where you are picking them up, and what they owe.",
  },
  {
    date: "May 2026",
    tag: "Payments",
    title: "Money in one place",
    body: "Invoices, payments, package balances and outstanding requests in a single view, so you can see who has paid without leaving the page.",
  },
```

- [ ] **Step 3: Verify llms.txt**

Already correct on pricing and DVSA; confirm nothing stale crept in:

```bash
grep -niE "coming soon|trial|£22|recurring|one-click" public/llms.txt
```
Expected: no output. If a line appears, correct it to match the site.

- [ ] **Step 4: Rebuild and verify**

```bash
rm -rf dist .astro && npm run build; echo "exit=$?"
```
Expected: `exit=0`, `Claim verification passed - 149 pages checked.` **This is the first fully green build since Task 1.**

- [ ] **Step 5: Commit**

```bash
git add src/pages/changelog.astro public/llms.txt
git commit -m "fix(changelog): correct three false entries and bring it current

The WhatsApp entry announced a feature that never launched and
contradicted the 30 coming-soon mentions elsewhere; the portal entry
claimed one-tap confirmation; the calendar entry claimed a subscription
feed where only one-way export exists."
```

---

### Task 10: Promote the unmarketed features (C)

Built, shipped, and currently invisible. No new URLs — these are worked into existing sections on pages that already rank.

**Files:**
- Modify: `src/pages/index.astro` (feature grid + `featureList` JSON-LD)
- Modify: `src/pages/get-started.astro` (feature list)
- Modify: `src/pages/driving-school-management-software.astro` (a new H2 section)

**Interfaces:**
- Consumes: a green claim guard from Task 9.
- Produces: no code interface. The guard must stay at 0.

**Constraint:** the quick-message pings send via SMS/WhatsApp in-app, and both are off. Describe the **feature**, never the channel — and never write "SMS".

- [ ] **Step 1: Add the offline/native story to the homepage**

The strongest untold story: the site has **zero** mentions of "PWA", "offline" or "native app", while `src/sw.ts` (Serwist 9), `src/lib/local-db/*` (IndexedDB per-user cache) and a live `/get-app` page all ship.

Add to the `index.astro` feature grid, matching the shape of the existing entries:

```javascript
  {
    title: 'Works without signal',
    description: 'Install DriveSchoolPro on your phone and it keeps working in the car with no signal — your diary, pupil records and lesson notes stay available, and anything you change syncs when you are back online.'
  },
```

Add to the `featureList` JSON-LD array in the same file:
```
    "Offline Access",
    "Installable Mobile App",
```

- [ ] **Step 2: Add the daily-agenda and money entries**

To the same grid:

```javascript
  {
    title: 'Your day, one screen',
    description: 'A daily agenda that opens on today: every lesson in order, who is next, where you are picking them up, and what they owe — so you start the day without opening five screens.'
  },
  {
    title: 'Money in one place',
    description: 'Invoices, payments, package balances and outstanding requests in a single view, so you can see who has paid and who has not without leaving the page.'
  },
```

- [ ] **Step 3: Add a section on pupil communication and reviews**

To `driving-school-management-software.astro`, as a new H2 in the existing flow (keep the heading-level rhythm of the page):

```html
        <h2 class="text-3xl font-bold text-brand-navy mt-12 mb-6">Keeping pupils in the loop</h2>
        <p class="text-gray-700 mb-4">
          Send a pupil a quick update in one tap — running late, on my way, arrived — without
          digging out your phone and typing it. Automated email reminders go out before every
          lesson (WhatsApp coming soon), with configurable timing and full delivery logs so you
          can see exactly what was sent.
        </p>
        <p class="text-gray-700 mb-4">
          After a pass, DriveSchoolPro can prompt you to ask for a Google review at the moment a
          pupil is happiest, and keeps a record of who has already been asked so nobody gets
          chased twice.
        </p>
```

- [ ] **Step 4: Mirror the highlights onto `/get-started`**

Add to the `get-started.astro` feature list, matching its `{ name, desc }` shape:

```javascript
  { name: 'Works offline', desc: 'Install it on your phone — your diary keeps working with no signal' },
  { name: 'Daily agenda', desc: 'Every lesson, pickup and balance for today on one screen' },
```

- [ ] **Step 5: Rebuild and verify both gates stay green**

```bash
rm -rf dist .astro && npm run build; echo "exit=$?"
```

Expected: `exit=0`. Both `verify-seo.js` and `verify-claims.js` stay green — this task adds copy, so it must not introduce a new claim failure. `verify-seo.js` enforces ≥2 inbound internal links per page — this task only adds copy to existing pages, so link structure is unchanged.

Confirm the constraint held:
```bash
grep -rn "SMS" src/pages/index.astro src/pages/get-started.astro src/pages/driving-school-management-software.astro
```
Expected: no output.

- [ ] **Step 6: Commit**

```bash
git add src/pages/index.astro src/pages/get-started.astro \
        src/pages/driving-school-management-software.astro
git commit -m "feat(copy): surface offline, daily agenda, money and reviews

These shipped and the site never mentioned them - PWA, offline and
native app had zero mentions anywhere. Worked into existing pages, so
no new URLs and no change to internal link structure."
```

---

### Task 11: Verify, deploy, submit, log

**Files:** none modified. This task runs the release.

**Interfaces:**
- Consumes: a green build from Tasks 1–10.

- [ ] **Step 1: Full clean verification**

```bash
cd /Users/john/Projects-code/Front-end-sites/mydriveschool.software
rm -rf dist .astro && npm run build; echo "exit=$?"
```

Expected: `exit=0`. `astro check` reports 0 errors, `verify-seo.js` passes, `verify-claims.js` prints `Claim verification passed - 149 pages checked.`

- [ ] **Step 2: Confirm the WhatsApp copy survived intact**

The one thing that must NOT have changed. Its count was 30 before this work:

```bash
grep -rio "whatsapp[^.]*coming soon" src/pages src/content | wc -l
```

Expected: a number in the high twenties or thirties — non-zero and roughly unchanged. If it is 0, WhatsApp copy was destroyed by a sweeping edit; stop and fix before deploying.

- [ ] **Step 3: Deploy**

```bash
cd /Users/john/Projects-code/Front-end-sites
./deploy.sh mydriveschool.software
```

`deploy.sh` rebuilds from clean, shows a `--delete` dry-run for confirmation, deploys to `lightsail:/var/www/driveschoolpro.com/`, and **fails unless the live sitemap matches the fresh build** — the guard against the recurring stale-`dist/` zombie-page bug. Never rsync a stale `dist/` by hand.

- [ ] **Step 4: Verify the fix is live**

Re-run the probes that found the problem:

```bash
curl -s https://driveschoolpro.com/driving-school-management-software/ | grep -oic "coming soon"
curl -s https://driveschoolpro.com/driving-school-scheduling-software/ | grep -oic "recurring lesson series"
```

Expected: the first returns only WhatsApp-related mentions (was 14, should now be low single digits); the second returns 0 unaccompanied by "coming soon" — spot-check the surrounding text.

- [ ] **Step 5: Submit changed URLs to the Indexing API**

Not optional. Every page touched by Tasks 3–10:

```
/  /pricing/  /get-started/  /changelog/  /how-progress-works/
/driving-school-software/  /driving-school-management-software/
/driving-school-scheduling-software/  /driving-instructor-accounting-software/
/free-driving-school-software/  /dvsa-27-driving-skills/  /driving-school-calculator/
/compare/total-drive/  /compare/driving-school-office/
/blog/best-driving-school-software/
/blog/how-to-choose-driving-school-scheduling-software/
/blog/drivescout-vs-drivingschoolsoftware-comparison/
```

Use the batch submitter recorded in the indexing-API notes (`tools/` in the outer repo).

- [ ] **Step 6: Log to the SEO changelog**

```bash
cd /Users/john/Projects-code/Front-end-sites/tools/gsc-client
node src/enhanced-report.js \
  --log-change="Content truth pass: aligned site copy with the app's feature-flag state" \
  --sites=driveschoolpro.com \
  --category=content \
  --reason="The site advertised 5 flagged-off features (lesson confirm, recurring series, parent invites, document upload/expiry, held-back reports) and labelled 4 shipped ones coming soon, including the GA student portal in 26 places" \
  --expected-impact="Fewer signup-to-product expectation mismatches; accurate SERP snippets and rich results" \
  --expected-timeline="2-4 weeks"
```

- [ ] **Step 7: Merge**

```bash
cd /Users/john/Projects-code/Front-end-sites/mydriveschool.software
git push -u origin content/2026-09-03-app-truth-pass
```

Open a PR against `main`. Note in the description that this branch is based on `seo/2026-08-19-comparison-pages-and-link-fixes` (it needs the compare hub and accounting page, which are in this plan's inventory), so **that branch must merge first**.

---

## Notes for the executor

- **The build is red from Task 1 through Task 8, and goes green at Task 9.** That is the plan working, not a broken repo.
- **Never sweep "coming soon" globally.** 30 of the occurrences are correct — they belong to WhatsApp. Every rule in the guard excludes them deliberately; a `sed` across the repo would destroy them silently and the guard would still pass.
- **If a precondition flag turns out to be ON**, do not demote that feature. Retire its rule from `scripts/verify-claims.js`, skip its edits, and note it in the commit.
- **Blog `.md` files are in scope** for Tasks 3, 4 and 7. They render into `dist/` and the guard checks them like any other page.
