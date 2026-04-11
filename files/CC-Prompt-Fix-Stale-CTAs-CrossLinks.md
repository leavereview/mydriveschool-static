# Fix: Stale CTAs and Internal Cross-Linking Audit

## ⚠️ SCOPE WARNING
This prompt fixes inconsistencies found during the site audit.
**DO NOT** change page content, structure, or design.
**ONLY** fix CTA links/text and add internal cross-links to new content.

---

## Phase 0: Discovery

```bash
# Find all "Early Access" / "Join Early Access" references — these are stale
grep -rn "early.access\|Early Access\|early-access\|Join Early" src/ --include="*.astro" --include="*.mdx" --include="*.ts"

# Find all CTA destinations to check consistency
grep -rn "href.*signup\|href.*get-started\|href.*early-access\|href.*contact" src/pages/ src/components/ --include="*.astro" | grep -v node_modules | head -30

# Check nav component for stale links
cat src/components/Nav.astro 2>/dev/null || cat src/components/Header.astro 2>/dev/null

# Find any pages still linking to /early-access/
grep -rn "/early-access" src/ --include="*.astro" --include="*.mdx"

# Check for the Cost of Learning Calculator in the nav (it should be there now)
grep -rn "cost-calculator\|Cost.*Calculator\|cost.*learning" src/components/Nav.astro src/components/Header.astro 2>/dev/null
```

---

## Phase 1: Fix Stale "Early Access" / "Join Early Access" CTAs

Replace ALL instances of:
- "Join Early Access" → "Get Started Free" (linking to /get-started/ or https://app.driveschoolpro.com/signup)
- "/early-access" URLs → "/get-started/"
- Any "early-access" page reference → "/get-started/"

The early access phase is over — the app is live with a free trial.

Check these specific locations:
- Navigation component (nav/header)
- /driving-school-software/ page CTAs
- /driving-school-scheduling-software/ page CTAs
- /driving-school-management-software/ page CTAs
- /free-driving-school-software/ page CTAs
- Footer CTAs
- Any blog post CTAs

### Validation:
```bash
grep -rn "early.access\|Early Access\|early-access" src/ --include="*.astro" --include="*.mdx" --include="*.ts" | grep -v node_modules
# Expected: 0 results
```

---

## Phase 2: Ensure Consistent Primary CTA Across All Pages

Every page with a primary CTA should link to the same destination. Audit and standardise:

**Primary CTA destination:** `/get-started/` (the conversion landing page)
**Primary CTA text:** "Start Free Trial" or "Get Started Free" (either is fine, but pick one and use it consistently across the nav)

**Exception:** The /get-started/ page itself and the /pricing/ page can link directly to `https://app.driveschoolpro.com/signup` since visitors on those pages have already been through the conversion messaging.

Check and fix:
```bash
# Find all primary CTAs
grep -rn "Start Free Trial\|Get Started Free\|Start Your Free Trial\|Try Free\|Sign Up Free" src/ --include="*.astro" --include="*.mdx" | grep -v node_modules
```

Ensure the nav "Get Started Free" button links to `/get-started/` (not directly to the app signup).

---

## Phase 3: Add Cross-Links to New Pillar Content

After the three new pillar blog posts are published, add links to them from relevant existing pages. This strengthens the internal linking network.

### From /driving-school-software/:
Add a "Related Guides" section or add inline links:
- "Learn how to [reduce lesson no-shows](/blog/reduce-driving-lesson-no-shows/) with automated reminders"
- "Thinking about [switching from a paper diary](/blog/switch-paper-diary-to-driving-school-software/)?"
- "New to the industry? Read our guide to [starting a driving school in the UK](/blog/how-to-start-a-driving-school/)"

### From /pricing/:
Below the pricing cards or in the FAQ section:
- "Not sure if software is worth it? See [how quickly it pays for itself](/blog/switch-paper-diary-to-driving-school-software/#the-numbers)"

### From the /blog/ index page:
Ensure the three new pillar posts appear prominently. If the blog has a "Featured" or "Popular" section, include at least one pillar post there.

### From existing blog posts:
Where relevant, add contextual links to the new pillar content:
- The best-driving-school-software comparison post could link to the switching guide
- Any driving skills posts could link back to the DVSA framework hub (probably already linked)

### Between the new pillar posts:
Each new pillar post should link to the other two:
- "How to Start" links to "Switching from Paper" and "Reducing No-Shows"
- "Reducing No-Shows" links to "Switching from Paper" and "How to Start"  
- "Switching from Paper" links to "Reducing No-Shows" and "How to Start"

This creates a content cluster that Google recognises as topical authority.

---

## Phase 4: Verify Sitemap Includes All New Pages

```bash
npx astro build

# Check all pillar pages are in the sitemap
for page in "how-to-start-a-driving-school" "reduce-driving-lesson-no-shows" "switch-paper-diary-to-driving-school-software" "get-started" "tools/cost-calculator"; do
  if grep -q "$page" dist/sitemap-0.xml 2>/dev/null; then
    echo "✅ $page in sitemap"
  else
    echo "❌ $page MISSING from sitemap"
  fi
done

# Also verify the city calculator pages
grep -c "cost-calculator" dist/sitemap-0.xml
# Expected: 21+ (main page + 20 city pages)
```

---

## Validation

```bash
npx astro check
npx astro build

# Zero stale CTAs
grep -rn "early.access\|Early Access" src/ --include="*.astro" --include="*.mdx" | grep -v node_modules | wc -l
# Expected: 0

# Consistent primary CTA
grep -rn "Get Started Free" src/components/Nav.astro src/components/Header.astro 2>/dev/null
# Expected: 1+ result linking to /get-started/
```

---

## Commit

```
fix(marketing): replace stale Early Access CTAs and add pillar content cross-links

- Replace all "Join Early Access" CTAs with "Get Started Free" → /get-started/
- Remove /early-access/ URL references
- Standardise primary CTA destination to /get-started/ across all pages
- Add cross-links between new pillar blog posts (start, no-shows, switching)
- Add contextual links from software pages to relevant pillar guides
- Verify all new pages included in sitemap
```
