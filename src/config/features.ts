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
 *   /confirm/<token>    -> 404  => lesson confirmation OFF
 *   /portal/find-school -> 200  => student portal LIVE
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
