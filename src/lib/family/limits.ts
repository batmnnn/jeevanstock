/** Caps chain writes paid by the server wallet. Enforced in the report action. */
export const FAMILY_LIMITS = {
  perClient: { limit: 3, windowMs: 10 * 60 * 1000 },
  perCentre: { limit: 30, windowMs: 60 * 60 * 1000 },
} as const;
