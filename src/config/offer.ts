/**
 * Offer configuration — single source of truth.
 *
 * Changing the current offer requires editing only this file.
 *
 * Last updated: 2026-04-20 (extracted from scattered surfaces)
 *
 * History:
 *   Jan – early Mar 2026: "14-day free trial"
 *   Mid-Mar – Mar 31:     "Founding Member / Early Access"
 *   Apr 1 – Apr 13:       "Get Started Free"
 *   Apr 14 – present:     "3 months free"
 */

export const OFFER = {
  /** Short offer text — used in CTAs, headlines, inline callouts */
  short: "3 months free",

  /** Long offer text — used in hero subheads, meta descriptions, body copy */
  long: "Get 3 months free — limited time offer",

  /** Meta-description-friendly fragment (no dashes, no emphasis) */
  meta: "Try free for 3 months.",

  /** Primary CTA — used as the main signup button everywhere */
  ctaPrimary: {
    label: "Start Free — 3 months free",
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
