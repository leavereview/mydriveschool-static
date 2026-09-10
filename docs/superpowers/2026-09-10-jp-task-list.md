# DriveSchoolPro — what's left for JP

**As of:** 2026-09-10
**Built and pushed:** homepage restructure (live), `/features` hub (built, not deployed)
**Branch:** `design/benefit-led-content-architecture` · **PR:** #9

---

## 1. Blocking — do these first

### 1.1 Regenerate the marketing screenshots ⚠️ blocks everything visual
The captures in `public/images/marketing/*.webp` date from February 2026, **before** the March
domain migration. The calendar shot still shows **"MyDriveSchool"** in the app sidebar. They are
now on five homepage sections and six feature pages, and they will be far more conspicuous in
video.

- Regenerate in the **app** repo: `driveschoolpro/prompts/regenerate-marketing-screenshots.md`
- Do this **before** recording any clip — the clips reuse these as poster frames
- Check `dashboard-overview.webp` in particular: it is currently standing in for the reviews
  section and does not show the review nudge panel

### 1.2 Three real testimonials
Still the highest-leverage single input to the site. Name, town, one sentence, permission.

**And a live problem regardless:** the four quotes in `src/components/Testimonials.astro` are
attributed to named individuals ("Sarah J., Birmingham"), make specific claims ("one no-show in
the last month"), carry no placeholder marking, and are emitted as JSON-LD `Review` entries — so
search engines ingest them as genuine reviews. If real ones are more than a few days away, mark
or pull these in the meantime.

Your reminder for this fires **09:00 tomorrow** (routine `trig_01MRokmgRNbN7RzEdc9mw81t`).

---

## 2. A product question only you can answer

**Does the review nudge actually fire in production today?**

While writing `/features/reviews/` I traced the mechanism. `getReviewNudgeCandidates` draws from
two sources:

1. **Test passes** — `studentTest` with `result: 'PASS'` on a final-stage test type
2. **Inactive pupils** — pupils who have gone quiet after a run of lessons

Source 1 depends on a test result being recorded — but test management is behind
`testsReportFlag`, which you confirmed **off** on 2026-09-03. If instructors cannot record a
pass, the pass-based half of the feature may never trigger, leaving only the inactive-pupil half.

The copy now describes the mechanism accurately either way, so nothing on the site is false. But
if the pass trigger is genuinely unreachable, the reviews page is selling a weaker feature than
it reads. Worth checking against production before deploying the hub.

Related: `reviewRequestChannels` accepts `email | whatsapp | both`, and WhatsApp is flagged off —
so email is the only live channel. The copy does not mention channels; keep it that way until
WhatsApp lands.

---

## 3. Video — once 1.1 is done

Full shot list with durations, framing and posters is Appendix A of
`docs/superpowers/specs/2026-09-10-driveschoolpro-benefit-architecture-design.md`.

- [ ] **Record `calendar-drag.mp4` as a pilot** (10s). Send it over — I will check file size at
      your capture settings, text legibility at rendered width, loop seam, and whether any
      flag-hidden UI is in frame.
- [ ] Then the remaining four: `briefing-generate` (8s), `dvsa-log` (6s),
      `pupil-buys-block` (14s, phone), `review-request` (10s)
- [ ] I wire each in — one `src` attribute per clip, no other change

**The trap worth repeating:** `verify-claims.js` reads HTML, not MP4s. A clip showing recurring
bookings, parent access, the documents tab, or the utilisation/tests/compliance reports is a
false claim with no automated guard. Frame to exclude them.

Capture spec: one fictional school across all five clips, plausible UK names, **no real pupil
data** (publishing it would breach UK GDPR and contradict the site's own trust bar), 1440×900
(phone viewport for clip 4), light theme, 2s of stillness at each end, H.264 MP4, no audio track.

---

## 4. Ship the features hub

The homepage is **live**. The `/features` hub is built and pushed but **not deployed**.

- [ ] Decide on §2 above first
- [ ] `./deploy.sh mydriveschool.software`
- [ ] SEO changelog entry (I will run it — the homepage one is already logged)
- [ ] Submit the six new URLs to the Indexing API — per your standing rule, not optional:
      `/features/`, `/features/scheduling/`, `/features/lesson-briefings/`,
      `/features/progress-tracking/`, `/features/getting-paid/`, `/features/reviews/`
- [ ] Merge PR #9

---

## 5. Watch after launch

- **Cannibalisation.** `/features/scheduling/` now sits alongside `/driving-school-scheduling-software/`,
  and `/features/progress-tracking/` alongside `/how-progress-works/`. Positioned as different
  intents — keyword entry vs product truth — but watch GSC impressions. **Fallback if it bites:**
  fold the pillar's unique content into the feature page and 301 the pillar.
- **Homepage engagement**, since the hero CTA now lands on a demo section rather than a still.

---

## 6. Small things found along the way

Not urgent, none blocking.

| Thing | Where | Note |
|---|---|---|
| Dead internal-link map | `src/utils/internalLinks.ts` | Maps keywords to `/lesson-scheduling-software/` and `/driving-school-crm/`, **neither of which exists**. Nothing imports it and no post contains the keywords, so it generates no 404s today — but it will the moment someone wires it up. Delete it. |
| Stale pricing in docs | `mydriveschool.software/CLAUDE.md` | Still describes the PPC landers as leading with "Solo £22/mo". The free launch retired that pricing. |
| Uncommitted work | outer repo, `tools/gsc-client/history/changes.json` | Was already modified when this session started, on branch `seo/2026-08-19-changelog-and-structural-config`. My changelog entry is stacked on top. Not mine to commit. |
| Stray file | `Security hardening — running.` | Untracked note from July 2026 in the site repo root. |

---

## Done this session

- `ProductDemo.astro` — silent looping MP4, poster fallback, lazy load, reduced-motion safe
- `scripts/verify-demos.js` — in the postbuild chain
- Homepage restructured into five benefit sections on the week's spine; hero CTA fixed **(live)**
- Setup time corrected to five minutes in eleven places **(live)**
- `/features` hub — six pages, 1,360–1,470 words each, FAQ schema, nav entry **(not deployed)**
- **Two live false claims found and fixed:** parent portal access on `/how-progress-works/`
  (contradicted by its own FAQ), and overstated review automation in my own first draft. Eight
  new guards in `verify-claims.js` so neither wording can return.
