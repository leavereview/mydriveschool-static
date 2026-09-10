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

## 2. Review nudge — checked, no action needed

While writing `/features/reviews/` I traced the mechanism and briefly thought half of it was
unreachable. It isn't. Recorded here so nobody re-opens it.

`getReviewNudgeCandidates` draws from two sources: pupils who passed a final-stage test, and
pupils who have gone quiet after a run of lessons. The first needs a `studentTest` PASS recorded
— and `/tests` **is** 404'd in production, because `REPORT_ROUTE_ALIASES` maps `/tests` onto
`/reports/tests`, which is gated by `NEXT_PUBLIC_TESTS_REPORT_ENABLED`.

But `/tests` is not the only way to mark a pass. `LicenceTestsCard` on the student Details tab
exposes `quickMarkTestPassed`, and it sits in the "Licence & Training" section **outside** the
`STUDENT_DETAILS_EXTRAS_ENABLED` gates (which wrap lines 661, 691 and 827 of `DetailsTab.tsx`;
the card is at 712). So passes are recordable today and the trigger fires.

Two live constraints the copy already respects: the feature stays hidden until a Google Place ID
is set, and `reviewRequestChannels` accepts `email | whatsapp | both` while WhatsApp is flagged
off — so email is the only live channel. Don't mention channels until WhatsApp lands.

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

## 6. Claim scan — what it turned up

Every product claim in the new copy was checked against the app on 2026-09-10.

**Verified correct:** three-way conflict checking (`checkLessonConflicts` does take `studentId`,
even though the client-side util only does time+vehicle), day/week/month views, the month heatmap,
configurable reminder timing (`reminderHoursBefore [24, 2]`), test readiness scoring,
cash/bank/cheque recording, package hours, offline via serwist.

**Four were false and are now fixed** — all of them had passed a green `verify-claims.js`:

1. **Parent portal access** on `/how-progress-works/`, contradicted by the same page's own FAQ.
2. **Review requests "go out automatically"** — mine. It is `ReviewNudgePanel` on Today; you tap send.
3. **Instructor calendar export** — the only `text/calendar` response in the app is the public
   booking-management route, a pupil's own lesson. No diary export or feed exists. Claimed in my
   scheduling FAQ *and*, pre-existing, on `/driving-school-scheduling-software/`.
4. **Per-pupil AI briefing toggle** — no such setting anywhere. Claimed on two pages.

Nineteen guards now cover all four wordings.

**One thing for you to confirm:** I changed the test copy from "recording test bookings and results
is coming soon" to saying recording is live and *pass-rate reporting* is what's coming. That
reverses your 3 September call, which assumed recording was hidden — it isn't, the per-pupil
surface on the student Details tab is ungated. Worth a 30-second check in production that the
book-test tiles and "mark passed" really do appear, since I'm reading code rather than the running
app. `src/pages/index.astro` still carries the older "coming soon" wording in its `highlights`
array; I left it alone pending your confirmation.

---

## 7. Small things found along the way

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
