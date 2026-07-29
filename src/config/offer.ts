/**
 * Offer configuration — single source of truth.
 *
 * Changing the current offer requires editing only this file.
 *
 * Last updated: 2026-07-29
 *
 * History:
 *   Jan – early Mar 2026: "14-day free trial"
 *   Mid-Mar – Mar 31:     "Founding Member / Early Access"
 *   Apr 1 – Apr 13:       "Get Started Free"
 *   Apr 14 – Jun 9:       "3 months free"
 *   Jun 10 – Jul 28 2026: "14-day free trial" (evergreen) + SUMMER26 promo (see PROMO below)
 *   Jul 29 2026 – present: "Free until 31 March 2027" (free launch — early access)
 */

export const OFFER = {
  /** Short offer text — used in CTAs, headlines, inline callouts */
  short: "Free until 31 March 2027",

  /** Long offer text — used in hero subheads, body copy */
  long: "DriveSchoolPro is free while we're in early access — until 31 March 2027",

  /** Meta-description-friendly fragment (no dashes, no emphasis).
   *  Evergreen only — never put time-boxed promos here (persists in search results). */
  meta: "Free during early access — until 31 March 2027.",

  /** Primary CTA — used as the main signup button everywhere */
  ctaPrimary: {
    label: "Get started free",
    labelShort: "Get started",
    href: "https://app.driveschoolpro.com/signup",
  },

  /** Secondary CTA — used alongside primary on pricing, hero, etc. */
  ctaSecondary: {
    label: "View Pricing",
    href: "/pricing",
  },
} as const;

export type OfferConfig = typeof OFFER;

/**
 * Time-boxed promotion — rendered as the site-wide banner and the pricing-page
 * callout. On-page only; never include in meta/OG tags or JSON-LD.
 *
 * To take the sale down: set `enabled: false` and rebuild.
 */
export const PROMO = {
  // SUMMER26 ended with the free launch (Jul 29 2026) — object kept for history.
  enabled: false,
  code: "SUMMER26",
  endDate: "2026-08-31",
  headline: "Summer sale: 25% off your first 3 months.",
  body: "Start free for 14 days, then £16.50/month for 3 months with code SUMMER26 — Ends 31 August 2026.",
  /** Short line for the pricing page, near the plan cards */
  pricingNote:
    "Summer sale: enter SUMMER26 at checkout for 25% off your first 3 months (then £22/month). Ends 31 August 2026.",
  href: "https://app.driveschoolpro.com/signup",
} as const;

export type PromoConfig = typeof PROMO;
