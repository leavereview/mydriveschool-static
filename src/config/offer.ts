/**
 * Offer configuration — single source of truth.
 *
 * Changing the current offer requires editing only this file.
 *
 * Last updated: 2026-06-10
 *
 * History:
 *   Jan – early Mar 2026: "14-day free trial"
 *   Mid-Mar – Mar 31:     "Founding Member / Early Access"
 *   Apr 1 – Apr 13:       "Get Started Free"
 *   Apr 14 – Jun 9:       "3 months free"
 *   Jun 10 – present:     "14-day free trial" (evergreen) + SUMMER26 promo (see PROMO below)
 */

export const OFFER = {
  /** Short offer text — used in CTAs, headlines, inline callouts */
  short: "14-day free trial",

  /** Long offer text — used in hero subheads, body copy */
  long: "Start with a 14-day free trial",

  /** Meta-description-friendly fragment (no dashes, no emphasis).
   *  Evergreen only — never put time-boxed promos here (persists in search results). */
  meta: "Start with a 14-day free trial.",

  /** Primary CTA — used as the main signup button everywhere */
  ctaPrimary: {
    label: "Start Free — 14-day free trial",
    labelShort: "Start Free",
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
  enabled: true,
  code: "SUMMER26",
  endDate: "2026-08-31",
  headline: "Summer sale: 25% off your first 3 months.",
  body: "Start free for 14 days, then £16.50/month for 3 months with code SUMMER26 — Ends 31 August.",
  /** Short line for the pricing page, near the plan cards */
  pricingNote:
    "Summer sale: enter SUMMER26 at checkout for 25% off your first 3 months (then £22/month). Ends 31 Aug.",
  href: "https://app.driveschoolpro.com/signup",
} as const;

export type PromoConfig = typeof PROMO;
