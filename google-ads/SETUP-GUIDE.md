# Google Ads Campaign Setup Guide

## Re-importing after ad copy refresh (April 2026)

If you've already imported a previous version of these campaigns, follow these steps to update:

1. **Open Google Ads Editor**
2. **Get recent changes** — File → Get Recent Changes → All Campaigns
3. **Pause the Search campaign** (if live) — set campaign status to Paused temporarily
4. **Delete existing ads only** (keep keywords, extensions, negative lists)
   - Navigate to each ad group
   - Select all ads (Ctrl+A)
   - Delete
5. **Import the new CSV** — File → Import → From CSV → select `google-ads/search-campaign.csv`
6. **Review changes in the Editor before posting**
7. **Post to Google Ads** — File → Post
8. **Review ad approval status** — new ads take 1–24 hours to approve
9. **Resume the campaign** — set status back to Enabled

Do NOT delete the keyword lists, negative keyword lists, or conversion tracking. Those stay as they are.

If you have NOT yet launched the campaign, skip this section and follow the standard setup flow below.

---

## Prerequisites
- Google Ads account created at ads.google.com
- Payment method added
- Google Ads matched credit applied (£320 match)

---

## Step 1: Get Your Conversion Tracking IDs

1. In Google Ads, go to **Tools & Settings → Measurement → Conversions**
2. Click **+ New conversion action**
3. Select **Website**
4. Enter your domain: `driveschoolpro.com`
5. Configure the conversion:
   - **Conversion name:** Signup Started
   - **Category:** Sign-up
   - **Value:** Don't use a value (or set £29 as estimated lifetime value)
   - **Count:** One
6. Select **Install tag yourself**
7. Copy the two values you'll need:
   - **Conversion ID** (format: `AW-XXXXXXXXXX`) → this is your `PUBLIC_GOOGLE_ADS_ID`
   - **Conversion Label** (format: `XXXXXXXXXXXXXXXXXX`) → this is your `PUBLIC_GOOGLE_ADS_CONVERSION_LABEL`

### Add the IDs to your environment

Create a `.env` file in the `mydriveschool.software/` folder:

```
PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXXX
PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=XXXXXXXXXXXXXXXXXX
```

Then rebuild and redeploy the Astro site:

```bash
cd /Users/john/Projects-code/Front-end-sites/mydriveschool.software
npm run build
rsync -avz --delete dist/ lightsail:/var/www/driveschoolpro.com/
```

---

## Step 2: Create the Campaign

1. Click **+ New Campaign**
2. Choose objective: **Leads** (or "Website traffic" if Leads isn't available yet)
3. Campaign type: **Search**
4. Conversion goals: select "Signup Started"
5. Campaign name: `DriveSchoolPro — UK Search — Launch Offer`
6. Networks: ☑ Google Search, ☐ Search Partners, ☐ Display Network
7. Locations: **United Kingdom** only
8. Languages: **English**
9. Budget: **£10/day**
10. Bidding: **Maximize clicks** with maximum CPC bid limit of **£3.00**
11. Leave campaign status as **Paused** — activate once you've verified everything

---

## Step 3: Create Ad Groups and Keywords

Add each keyword in **exact match** by wrapping in square brackets: `[keyword]`

### Ad Group 1: "Driving School Software — Exact"

```
[driving school software]
[driving school software uk]
[driving school management software]
[driving instructor software]
[driving instructor software uk]
[adi software]
[adi booking software]
```

### Ad Group 2: "Scheduling & Booking — Exact"

```
[driving school scheduling software]
[driving school booking system]
[driving lesson booking software]
[adi scheduling app]
[driving instructor diary app]
[driving instructor calendar app]
```

### Ad Group 3: "DVSA Tracking — Exact"

```
[dvsa progress tracking software]
[dvsa competency tracking]
[driving instructor progress tracking]
[student progress tracking driving school]
```

---

## Step 4: Add Negative Keywords (Campaign Level)

```
[free]                          (exact match)
"learn to drive"                (phrase match)
"driving lessons near me"       (phrase match)
"driving test"                  (phrase match)
"theory test"                   (phrase match)
simulator                       (broad match)
game                            (broad match)
download                        (broad match)
```

---

## Step 5: Create Responsive Search Ads

For each ad group, create one Responsive Search Ad. Copy headlines and descriptions from `campaign-config.json`.

**Final URL for all ads:** `https://driveschoolpro.com/ads/driving-school-software`

**Pinning:**
- Ad Group 1: Pin "Driving School Software — UK" to Headline 1
- Ad Group 2: Pin "Driving School Scheduling App" to Headline 1
- Ad Group 3: Pin "DVSA Progress Tracking Software" to Headline 1

---

## Step 6: Add Extensions

### Sitelinks (account level — applies to all campaigns):
Copy all 4 sitelinks from `campaign-config.json`. Add descriptions to each.

### Callout Extensions:
Add all 6 callouts:
- 3 Months Free
- No Credit Card Required
- DVSA Tracking Built In
- UK-Based Support
- Set Up in 10 Minutes
- Works on Any Device

### Structured Snippets:
- Header: **Features**
- Values: DVSA Progress Tracking, Drag-and-Drop Calendar, Automated Reminders, Student Portal, Payment Tracking, Online Booking

---

## Step 7: Review and Launch

1. Preview each ad in the Google Ads preview tool
2. Verify the Final URL opens the ads landing page correctly
3. Check that the landing page has no nav bar and a clear CTA
4. Set campaign status to **Enabled**
5. Set a reminder to check back in 24 hours for first data

### Pre-Launch Checks (AI-first refresh — April 2026)

- [ ] Landing page H1 matches ad copy message (AI-powered, DVSA framework, automated reviews)
- [ ] Landing page mentions AI briefings prominently in the first viewport
- [ ] FAQ on landing page answers "What does the AI actually do?" and "Is this different from Total Drive?"

---

## Step 8: Week 1 Monitoring Checklist

Check daily for the first week:

- [ ] Are ads showing? (Impressions > 0)
- [ ] Quality Score for each keyword (target: 7+)
- [ ] Search terms report — add irrelevant terms as negatives
- [ ] CTR by ad group (target: > 3% for exact match)
- [ ] Cost per click (target: < £2.00)
- [ ] Conversions firing — check Google Ads Conversions column

---

## Step 9: Week 2+ Optimisation

- Pause any keywords with Quality Score < 5 after 100+ impressions
- Add new negative keywords from the Search Terms report weekly
- If CTR > 5% on any ad group, consider increasing the daily budget
- After 30+ conversions: switch bidding from Maximize Clicks to **Target CPA**
- After 2 weeks: create a second RSA per ad group to A/B test ad copy
- After 4 weeks: review hour-of-day performance and add an ad schedule

---

## Conversion Tracking Verification

To confirm tracking is firing correctly:

1. Install the **Google Tag Assistant** Chrome extension
2. Navigate to `driveschoolpro.com/ads/driving-school-software`
3. Accept all cookies in the consent banner
4. Click "Start Your Free Trial"
5. In Tag Assistant, confirm a conversion event fires for your `AW-XXXXXXXXXX` tag

Alternatively, check **Google Ads → Tools → Conversions** — the "Signup Started" conversion should show status "Recording conversions" within 24 hours of the first click.
