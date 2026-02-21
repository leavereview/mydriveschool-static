# DVSA 27 Driving Skills - SEO Implementation Guide

## Overview

This guide contains phased prompts for Claude Code to implement a comprehensive SEO strategy around the DVSA "Ready to Pass" 27 driving skills framework on mydriveschool.software.

**Goal**: Build topical authority for driving test preparation keywords through a hub-and-spoke content architecture.

**Reference**: https://readytopass.campaign.gov.uk/driving-skills/track-progress-learning/

---

## Phase 1: Pillar Page

**Run this prompt first - creates the main hub page**

```
Create the main DVSA 27 Driving Skills pillar page for mydriveschool.software.

## File to create
`/src/pages/dvsa-27-driving-skills.astro`

## Page structure

### Hero Section
- H1: "The Complete Guide to DVSA's 27 Driving Skills"
- Subheading: "Master every skill. Track your progress. Pass first time."
- Brief intro explaining this is the official DVSA framework used by all approved driving instructors
- CTA button: "Start Tracking Your Progress" → links to software trial

### The 5 Progress Levels Section
Visual explanation of the DVSA's 5-level progression system:
1. **Introduced** - Following instructions given
2. **Helped** - Improving but needs assistance  
3. **Prompted** - Occasional prompting needed in new situations
4. **Independent** - Consistent, confident, independent performance
5. **Reflection** - Understands adaptations and safety reasoning

Include a visual progress bar or stepped graphic showing 1→5 progression.
Add note: "You're ready for your test when you consistently achieve Level 5 across all 27 skills"

### The 27 Skills Overview
Create 8 collapsible/accordion sections for each skill group:

**The Basics (Skills 1-4)**
1. Legal responsibilities
2. Safety checks
3. Cockpit checks  
4. Security

**Control & Positioning (Skills 5-7)**
5. Controls and instruments
6. Moving off and stopping
7. Safe positioning

**Observation, Signalling & Planning (Skills 8-13)**
8. Mirrors
9. Signals
10. Anticipation and planning
11. Use of speed
12. Other traffic
13. Fuel-efficient driving

**Junctions, Roundabouts & Crossings (Skills 14-16)**
14. Junctions
15. Roundabouts
16. Pedestrian crossings

**Manoeuvres (Skills 17-20)**
17. Reversing
18. Turning the car around
19. Parking
20. Emergency stop

**Road Types (Skills 21-23)**
21. Country roads
22. Dual carriageways
23. Motorways

**Driving Conditions (Skills 24-26)**
24. Driving in the dark
25. Weather conditions
26. Passengers and loads

**Following Routes (Skill 27)**
27. Independent driving / sat nav

Each skill group should link to its category page (we'll create these in Phase 2).

### Why Digital Progress Tracking Section
- Explain benefits over paper records
- Instructor and learner both see progress at a glance
- Identifies weak areas automatically
- Builds confidence as levels increase
- "Our software follows the exact DVSA framework"

### FAQ Section (for schema markup)
Create an FAQ section with these questions:
- "How many driving lessons do I need to pass?"
- "When am I ready to take my driving test?"
- "What are the 5 levels of learning to drive?"
- "What is the DVSA Ready to Pass campaign?"
- "Can I track my driving progress digitally?"

### CTA Section
- "Track All 27 Skills Digitally"
- Brief software pitch
- Trial signup button

## SEO Meta
- Title: "27 Driving Skills You Need to Pass | DVSA Ready to Pass Guide"
- Description: "Master all 27 DVSA driving skills from Level 1 to test-ready. Complete guide to the official Ready to Pass framework with digital progress tracking."

## Technical Requirements
- Add FAQ JSON-LD structured data
- Add BreadcrumbList schema: Home > 27 Driving Skills
- Use existing site layout (BaseLayout.astro or similar)
- Follow existing design system (Navy #1A1A2E, Red #E94560)
- Make sections linkable with IDs for defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined defined internal linking (e.g., #basics, #manoeuvres)
- Ensure mobile responsive

## Trust Elements
Add somewhere prominent:
- "Aligned with official DVSA Ready to Pass standards"
- Link to gov.uk source: https://readytopass.campaign.gov.uk/driving-skills/
```

---

## Phase 2: Category Landing Pages

**Run after Phase 1 is complete**

```
Create 8 category landing pages for each driving skill group under mydriveschool.software.

## Files to create

Create these 8 pages in `/src/pages/driving-skills/`:

### 1. basics.astro
**Skills covered**: 1-4 (Legal responsibilities, Safety checks, Cockpit checks, Security)
**H1**: "Driving Basics: Skills 1-4 | Legal, Safety & Cockpit Checks"
**Target keywords**: driving lesson basics, car safety checks before driving, cockpit drill driving

Content sections:
- Overview of why basics matter (foundation for everything else)
- Skill 1: Legal Responsibilities - what learners need to know about licences, insurance, MOT
- Skill 2: Safety Checks - POWDERY or similar mnemonic (Petrol, Oil, Water, Damage, Electrics, Rubber, Yourself)
- Skill 3: Cockpit Checks - seat, mirrors, steering, seatbelt routine
- Skill 4: Security - vehicle and personal security awareness
- The 5 levels applied to these skills
- "Track your basics progress" CTA

### 2. control-positioning.astro
**Skills covered**: 5-7 (Controls/instruments, Moving off/stopping, Safe positioning)
**H1**: "Control & Positioning: Skills 5-7 | Master Your Vehicle"
**Target keywords**: car controls for beginners, moving off driving lesson, road positioning driving

Content sections:
- Overview of vehicle control fundamentals
- Skill 5: Controls and Instruments - pedals, gears, steering, dashboard
- Skill 6: Moving Off and Stopping - POM routine, smooth stops
- Skill 7: Safe Positioning - lane discipline, road position
- Common mistakes at each skill
- CTA

### 3. observation-signalling.astro
**Skills covered**: 8-13 (Mirrors, Signals, Anticipation, Speed, Traffic, Eco-driving)
**H1**: "Observation & Planning: Skills 8-13 | Read the Road"
**Target keywords**: MSM routine driving, anticipation driving test, eco driving techniques

Content sections:
- Overview: the skills that prevent accidents
- Skill 8: Mirrors - MSM routine, when and how
- Skill 9: Signals - timing, clarity, cancelling
- Skill 10: Anticipation and Planning - reading the road ahead
- Skill 11: Use of Speed - appropriate speed vs speed limits
- Skill 12: Other Traffic - awareness of all road users
- Skill 13: Fuel-efficient Driving - eco-driving benefits
- CTA

### 4. junctions-roundabouts.astro
**Skills covered**: 14-16 (Junctions, Roundabouts, Pedestrian crossings)
**H1**: "Junctions & Roundabouts: Skills 14-16 | Navigate Safely"
**Target keywords**: roundabout rules UK, junction driving test, pedestrian crossing rules driving

Content sections:
- Why these skills cause the most test failures
- Skill 14: Junctions - types, approach, MSPSL routine
- Skill 15: Roundabouts - lane selection, signals, mini roundabouts
- Skill 16: Pedestrian Crossings - types and rules
- Examiner tips for each
- CTA

### 5. manoeuvres.astro
**Skills covered**: 17-20 (Reversing, Turning around, Parking, Emergency stop)
**H1**: "Driving Manoeuvres: Skills 17-20 | Parking & Reversing"
**Target keywords**: parallel parking tips, emergency stop driving test, reverse bay parking

Content sections:
- Which manoeuvres appear on the test
- Skill 17: Reversing - observation and control
- Skill 18: Turning the Car Around - 3-point turn
- Skill 19: Parking - parallel, bay (forward and reverse)
- Skill 20: Emergency Stop - technique and when tested
- Practice tips for each
- CTA

### 6. road-types.astro
**Skills covered**: 21-23 (Country roads, Dual carriageways, Motorways)
**H1**: "Road Types: Skills 21-23 | Country Roads to Motorways"
**Target keywords**: driving on country roads, dual carriageway rules UK, motorway driving lessons

Content sections:
- Adapting to different road environments
- Skill 21: Country Roads - national speed limit, hazards, passing places
- Skill 22: Dual Carriageways - joining, lane use, leaving
- Skill 23: Motorways - post-test requirement, key differences
- Speed awareness on each road type
- CTA

### 7. driving-conditions.astro
**Skills covered**: 24-26 (Night driving, Weather, Passengers/loads)
**H1**: "Driving Conditions: Skills 24-26 | Night, Weather & Passengers"
**Target keywords**: driving at night tips, driving in rain UK, driving with passengers

Content sections:
- Adapting your driving to conditions
- Skill 24: Driving in the Dark - lights, visibility, fatigue
- Skill 25: Weather Conditions - rain, fog, ice, sun glare
- Skill 26: Passengers and Loads - distractions, weight effects
- When to practise these skills
- CTA

### 8. following-routes.astro
**Skills covered**: 27 (Independent driving, sat nav)
**H1**: "Following Routes: Skill 27 | Independent Driving & Sat Nav"
**Target keywords**: independent driving test, sat nav driving test, following signs driving test

Content sections:
- What independent driving means on the test
- Skill 27: Following directions from sat nav OR road signs
- How long the independent section lasts (20 minutes)
- What happens if you go wrong way (spoiler: it's usually fine)
- Tips for staying calm during independent driving
- CTA

## Template for all pages

Each page should include:
- Breadcrumb: Home > 27 Driving Skills > [Category Name]
- Link back to main pillar page (/dvsa-27-driving-skills/)
- "Related skills" linking to other category pages
- Progress level reminder (1-5 scale)
- Software tracking CTA
- BreadcrumbList schema

## SEO Meta Pattern
- Title: "[Category]: Skills X-Y | My Drive School"
- Description: "Master [category] driving skills [X-Y]. Learn [brief list]. Track progress with DVSA-aligned software."

## Navigation
Add a "Driving Skills" dropdown or section to the main navigation linking to:
- 27 Driving Skills (pillar)
- All 8 category pages

Use existing design system and layouts.
```

---

## Phase 3: Blog Post Templates

**Run after Phase 2 - creates template posts for the 27 individual skills**

```
Create 3 template blog posts for individual driving skills. These will serve as the pattern for all 27 skill posts.

## Files to create in `/src/content/blog/`

### 1. parallel-parking-driving-test.md

---
title: "Parallel Parking: From Level 1 to Test-Ready"
description: "Master parallel parking for your driving test. Learn the reference points, common mistakes, and how to progress through all 5 DVSA skill levels."
pubDate: 2024-02-20
category: "Manoeuvres"
skill_number: 19
---

## What Examiners Look For

When you're asked to parallel park during your driving test, the examiner assesses:

- **Accuracy** - finishing reasonably close to the kerb (within 2 car widths to start)
- **Control** - smooth steering and clutch control throughout
- **Observation** - checking mirrors and blind spots before and during the manoeuvre  
- **Safety** - not causing other road users to stop or swerve

You won't fail for needing to adjust or reposition, as long as you do so safely and under control.

## The 5 Levels of Progress

Here's how the DVSA's 5-level framework applies to parallel parking:

### Level 1: Introduced
You understand the basic steps. Your instructor guides you through each movement, telling you when to steer and how much.

### Level 2: Helped
You can start the manoeuvre yourself but need help with reference points or correcting positioning. You're getting the feel for the steering.

### Level 3: Prompted
You can do it mostly independently but occasionally need a reminder about observations or a prompt to adjust your angle.

### Level 4: Independent
You can parallel park confidently in various situations - different car sizes, gaps, and slight inclines - without any help.

### Level 5: Reflection
You understand WHY each step matters. You can adapt when the gap is tighter or the road is on a slope. You self-correct without thinking about it.

**You're test-ready when you're consistently at Level 5.**

## Step-by-Step Technique

[Include detailed steps with reference points]

1. Pull up alongside the car you'll park behind...
2. Check mirrors and blind spot...
3. Begin reversing, turning the wheel...
[etc.]

## Common Mistakes and How to Avoid Them

| Mistake | Why It Happens | The Fix |
|---------|----------------|---------|
| Ending too far from kerb | Turning too late | Use the 45-degree reference point |
| Hitting the kerb | Turning too much | Straighten earlier, adjust if needed |
| Not checking blind spot | Focused on steering | Build the habit: check before EVERY reverse |

## Practice Tips

- Start in quiet car parks with plenty of space
- Use reference points consistently until they become automatic
- Practice on slight hills once you've mastered flat ground
- Ask your instructor to vary the gap sizes

## Track Your Progress

Our driving school software lets you and your instructor record your level for parallel parking after every lesson. See your progress from Level 1 to test-ready at a glance.

[CTA: Start Your Free Trial]

## Related Skills

- [Reversing (Skill 17)](/blog/reversing-driving-lesson/)
- [Bay Parking (Skill 19)](/blog/bay-parking-driving-test/)
- [Observation & Mirrors (Skill 8)](/driving-skills/observation-signalling/)

---

### 2. roundabout-rules-uk.md

---
title: "Roundabout Rules UK: Master DVSA Skill 15"
description: "Complete guide to UK roundabout rules for learner drivers. Lane selection, signalling, mini roundabouts, and what examiners look for."
pubDate: 2024-02-20
category: "Junctions & Roundabouts"
skill_number: 15
---

## What Examiners Look For

Roundabouts are one of the most common places for driving test faults. Examiners assess:

- **Approach** - appropriate speed, correct lane selection
- **Observation** - looking right, timing your entry safely
- **Signalling** - correct signals at the right time
- **Lane discipline** - staying in your lane, spiral roundabouts
- **Exit** - checking mirrors, signalling left, smooth departure

## The 5 Levels of Progress

### Level 1: Introduced
You understand the basic concept. Your instructor tells you which lane and when to go.

### Level 2: Helped
You can approach correctly but need guidance on lane choice or when it's safe to enter.

### Level 3: Prompted
You handle familiar roundabouts well but need prompts for unusual layouts or busy conditions.

### Level 4: Independent  
You navigate any roundabout confidently - multi-lane, spiral, mini, or busy junctions.

### Level 5: Reflection
You read roundabout signs in advance, plan your lane early, and understand why lane discipline matters for safety. You adapt to other drivers' mistakes.

## Roundabout Rules Summary

[Include rules for:]
- Turning left (1st exit)
- Going straight (2nd exit)  
- Turning right (3rd+ exit)
- Mini roundabouts
- Spiral/lane-change roundabouts

## Common Mistakes and How to Avoid Them

[Table format similar to parallel parking post]

## Track Your Progress

[CTA]

## Related Skills

- [Junctions (Skill 14)](/blog/junctions-driving-test/)
- [Signalling (Skill 9)](/driving-skills/observation-signalling/)
- [Lane Positioning (Skill 7)](/driving-skills/control-positioning/)

---

### 3. emergency-stop-driving-test.md

---
title: "Emergency Stop: What Examiners Look For (Skill 20)"
description: "How to perform an emergency stop on your driving test. Technique, ABS braking, and how 1 in 3 learners are tested on this skill."
pubDate: 2024-02-20  
category: "Manoeuvres"
skill_number: 20
---

## Will I Get an Emergency Stop on My Test?

Around 1 in 3 driving tests include an emergency stop. The examiner will:

- Choose a safe, quiet road
- Ask you to pull up on the left first to explain
- Say "Shortly, I'll ask you to stop as if an emergency. When I do this [raises hand], stop as quickly and safely as you can."
- Give the signal when it's safe

## What Examiners Look For

- **Reaction time** - prompt response to the signal
- **Braking technique** - firm, progressive braking
- **Control** - keeping the car straight
- **Observation** - checking mirrors before moving off again

## The 5 Levels of Progress

[5 levels specific to emergency stop - from instructor-guided to reflexive]

## The Technique

### Cars with ABS (most modern cars)
1. React quickly when signalled
2. Brake firmly and fully - push the pedal hard
3. Press the clutch down just before stopping (prevents stalling)
4. Keep both hands on the wheel, steering straight
5. Apply handbrake, select neutral, check mirrors, signal, move off when safe

### What ABS Feels Like
You may feel the pedal vibrate or pulse - this is normal. Keep your foot firmly on the brake; don't pump it.

## Common Mistakes

[Table]

## Track Your Progress  

[CTA]

## Related Skills

- [Use of Speed (Skill 11)](/driving-skills/observation-signalling/)
- [Anticipation (Skill 10)](/driving-skills/observation-signalling/)

---

## Blog Post Template Pattern

For future skill posts, follow this structure:

1. **What Examiners Look For** (100-150 words)
2. **The 5 Levels of Progress** (specific to that skill)
3. **Core Content** (technique, rules, or approach - 300-500 words)
4. **Common Mistakes Table** (3-5 mistakes with fixes)
5. **Practice Tips** (bullet list)
6. **Track Your Progress CTA**
7. **Related Skills** (links to 2-3 related posts/pages)

## Frontmatter Schema

All skill posts should include:
- title
- description  
- pubDate
- category (matching one of the 8 groups)
- skill_number (1-27)

This enables filtering and dynamic related content later.
```

---

## Phase 4: Navigation & Internal Linking

**Run after content pages exist**

```
Update mydriveschool.software navigation and internal linking structure for the DVSA 27 Skills content.

## Navigation Updates

### Main Navigation
Add "Driving Skills" to the main navigation with a dropdown/mega menu:

**Driving Skills**
├── 27 Driving Skills Guide (pillar page)
├── ─────────────
├── Basics (Skills 1-4)
├── Control & Positioning (Skills 5-7)
├── Observation & Planning (Skills 8-13)
├── Junctions & Roundabouts (Skills 14-16)
├── Manoeuvres (Skills 17-20)
├── Road Types (Skills 21-23)
├── Driving Conditions (Skills 24-26)
└── Following Routes (Skill 27)

Update Navigation.astro (or equivalent) to include this structure.

## Homepage Updates

Add a new section to the homepage highlighting DVSA alignment:

### Suggested Section: "Track All 27 DVSA Driving Skills"
- Headline: "Aligned with Official DVSA Standards"
- Brief copy: "Our progress tracking follows the government's Ready to Pass framework - the same 27 skills and 5-level system used by approved driving instructors nationwide."
- Visual: Show the 8 skill category icons or a progress dashboard preview
- CTA: "See the 27 Skills" → links to pillar page
- Trust badge: "Based on gov.uk Ready to Pass"

Position this section prominently - ideally above the fold or immediately after the hero.

## Footer Updates

Add a "Driving Skills" column to the footer with links to:
- 27 Driving Skills Guide
- The 8 category pages

## Internal Linking Checklist

Ensure these links exist:

### From Pillar Page (/dvsa-27-driving-skills/)
- → All 8 category pages
- → Individual skill blog posts (as they're created)
- → Software features/trial page

### From Category Pages (/driving-skills/[category]/)
- → Back to pillar page
- → Related category pages (e.g., "Also see: Junctions & Roundabouts")
- → Individual skill blog posts in that category
- → Software CTA

### From Blog Posts
- → Parent category page
- → Pillar page (in intro or CTA)
- → 2-3 related skill posts
- → Software CTA

### From Existing Pages
Review existing pages (homepage, features, pricing, other blog posts) for opportunities to link to the new pillar page. Add contextual links where relevant.

## Breadcrumbs

Ensure breadcrumb structure is consistent:

- Pillar: Home > 27 Driving Skills
- Category: Home > 27 Driving Skills > [Category Name]
- Blog post: Home > Blog > [Post Title]

Add BreadcrumbList JSON-LD schema to all new pages.

## Sitemap

Verify the new pages are included in the sitemap after build:
- /dvsa-27-driving-skills/
- /driving-skills/basics/
- /driving-skills/control-positioning/
- /driving-skills/observation-signalling/
- /driving-skills/junctions-roundabouts/
- /driving-skills/manoeuvres/
- /driving-skills/road-types/
- /driving-skills/driving-conditions/
- /driving-skills/following-routes/
- All new blog posts

Run `npm run build` and check dist/sitemap.xml includes all pages.
```

---

## Phase 5: Schema & Technical SEO

**Run after all content is in place**

```
Add structured data and technical SEO enhancements to the DVSA 27 Skills content on mydriveschool.software.

## Schema Markup Required

### 1. FAQ Schema (Pillar Page)

Add this JSON-LD to `/src/pages/dvsa-27-driving-skills.astro`:

The page should have an FAQ section with these questions. Add corresponding FAQPage schema:

- "How many driving lessons do I need to pass?"
- "When am I ready to take my driving test?"
- "What are the 5 levels of learning to drive?"
- "What is the DVSA Ready to Pass campaign?"
- "Can I track my driving progress digitally?"

### 2. BreadcrumbList Schema (All Pages)

Add BreadcrumbList JSON-LD to:
- Pillar page
- All 8 category pages

Example for category page:
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://mydriveschool.software/"},
    {"@type": "ListItem", "position": 2, "name": "27 Driving Skills", "item": "https://mydriveschool.software/dvsa-27-driving-skills/"},
    {"@type": "ListItem", "position": 3, "name": "Manoeuvres", "item": "https://mydriveschool.software/driving-skills/manoeuvres/"}
  ]
}
```

### 3. HowTo Schema (Skill Blog Posts)

For blog posts that explain techniques (parallel parking, emergency stop, etc.), add HowTo schema:

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Parallel Park",
  "description": "Step-by-step guide to parallel parking for UK driving test",
  "step": [
    {"@type": "HowToStep", "name": "Position your car", "text": "Pull up alongside..."},
    {"@type": "HowToStep", "name": "Check observations", "text": "Check mirrors and blind spot..."}
  ]
}
```

### 4. Article Schema (All Blog Posts)

Ensure all blog posts have Article schema with:
- headline
- description
- datePublished
- author (can be organization)
- publisher

## Meta Tags Audit

Check all new pages have:
- Unique, keyword-optimised title (50-60 chars)
- Unique meta description (150-160 chars)
- Canonical URL
- Open Graph tags (og:title, og:description, og:image)

## Image Optimisation

For any images added:
- Use descriptive filenames (e.g., "parallel-parking-reference-points.webp")
- Add alt text with keywords where natural
- Use WebP format
- Ensure responsive sizing

## Page Speed Check

After implementing, run Lighthouse on:
- /dvsa-27-driving-skills/
- One category page
- One blog post

Address any issues with:
- Image sizing
- Unused CSS
- Render-blocking resources

## robots.txt & Sitemap

Verify:
- No new pages are accidentally blocked in robots.txt
- Sitemap includes all new URLs
- Sitemap is submitted to Google Search Console
```

---

## Phase 6: Content Expansion (27 Blog Posts)

**Run incrementally - creates remaining skill posts**

```
Create blog posts for the remaining DVSA driving skills. Follow the template established in Phase 3.

## Content Calendar - Priority Order

Create these posts in order (highest search volume / test importance first):

### Week 1-2: Manoeuvres (High test relevance)
- [ ] bay-parking-driving-test.md (Skill 19 - reverse bay parking)
- [ ] reversing-driving-lesson.md (Skill 17)
- [ ] turn-in-the-road.md (Skill 18)

### Week 3-4: Junctions & Roundabouts (High failure rate)
- [ ] junctions-driving-test.md (Skill 14)
- [ ] pedestrian-crossings-rules.md (Skill 16)

### Week 5-6: Observation Skills (Foundation skills)
- [ ] msm-routine-driving.md (Skill 8 - mirrors)
- [ ] signalling-driving-test.md (Skill 9)
- [ ] anticipation-driving.md (Skill 10)
- [ ] speed-awareness-driving.md (Skill 11)
- [ ] other-road-users.md (Skill 12)
- [ ] eco-driving-techniques.md (Skill 13)

### Week 7-8: Control Basics
- [ ] car-controls-beginners.md (Skill 5)
- [ ] moving-off-stopping.md (Skill 6)
- [ ] road-positioning-driving.md (Skill 7)

### Week 9-10: Road Types
- [ ] country-roads-driving.md (Skill 21)
- [ ] dual-carriageway-rules.md (Skill 22)
- [ ] motorway-driving-lessons.md (Skill 23)

### Week 11-12: Conditions & Basics
- [ ] night-driving-tips.md (Skill 24)
- [ ] driving-in-rain.md (Skill 25)
- [ ] driving-with-passengers.md (Skill 26)
- [ ] independent-driving-test.md (Skill 27)
- [ ] legal-responsibilities-driving.md (Skill 1)
- [ ] car-safety-checks.md (Skill 2)
- [ ] cockpit-drill-driving.md (Skill 3)
- [ ] vehicle-security.md (Skill 4)

## Post Template Reminder

Each post must include:
1. What Examiners Look For
2. The 5 Levels of Progress (specific to that skill)
3. Core technique/rules content (300-500 words)
4. Common Mistakes table
5. Practice Tips
6. Track Your Progress CTA
7. Related Skills links

## Keyword Targets

Research and include relevant keywords for each post. Primary patterns:
- "[skill] driving test"
- "[skill] driving lesson"
- "how to [skill] UK"
- "[skill] tips for learners"

## Internal Linking

As each post is created:
- Add it to the relevant category page
- Link from the pillar page skill list
- Add "Related Skills" links to/from existing posts
- Update any existing blog posts that could link to the new content
```

---

## Quick Reference: The 27 Skills

| # | Skill | Category | Blog Post Slug |
|---|-------|----------|----------------|
| 1 | Legal responsibilities | Basics | legal-responsibilities-driving |
| 2 | Safety checks | Basics | car-safety-checks |
| 3 | Cockpit checks | Basics | cockpit-drill-driving |
| 4 | Security | Basics | vehicle-security |
| 5 | Controls and instruments | Control | car-controls-beginners |
| 6 | Moving off and stopping | Control | moving-off-stopping |
| 7 | Safe positioning | Control | road-positioning-driving |
| 8 | Mirrors | Observation | msm-routine-driving |
| 9 | Signals | Observation | signalling-driving-test |
| 10 | Anticipation and planning | Observation | anticipation-driving |
| 11 | Use of speed | Observation | speed-awareness-driving |
| 12 | Other traffic | Observation | other-road-users |
| 13 | Fuel-efficient driving | Observation | eco-driving-techniques |
| 14 | Junctions | Junctions | junctions-driving-test |
| 15 | Roundabouts | Junctions | roundabout-rules-uk |
| 16 | Pedestrian crossings | Junctions | pedestrian-crossings-rules |
| 17 | Reversing | Manoeuvres | reversing-driving-lesson |
| 18 | Turning around | Manoeuvres | turn-in-the-road |
| 19 | Parking | Manoeuvres | parallel-parking-driving-test, bay-parking-driving-test |
| 20 | Emergency stop | Manoeuvres | emergency-stop-driving-test |
| 21 | Country roads | Road Types | country-roads-driving |
| 22 | Dual carriageways | Road Types | dual-carriageway-rules |
| 23 | Motorways | Road Types | motorway-driving-lessons |
| 24 | Driving in the dark | Conditions | night-driving-tips |
| 25 | Weather conditions | Conditions | driving-in-rain |
| 26 | Passengers and loads | Conditions | driving-with-passengers |
| 27 | Following routes | Routes | independent-driving-test |

---

## Implementation Notes

- Run phases in order (1 → 2 → 3 → 4 → 5 → 6)
- Phase 6 can be done incrementally over weeks
- After each phase, run `npm run build` to verify no errors
- Check new pages render correctly with `npm run preview`
- Submit new URLs to Google Search Console after deployment

## Success Metrics

Track in Google Search Console:
- Impressions for "27 driving skills" and related queries
- Click-through rate on pillar page
- Average position for target keywords
- Pages indexed from this content cluster

Track in your analytics:
- Traffic to pillar page and category pages
- Blog post engagement (time on page)
- CTA clicks to software trial