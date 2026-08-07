/**
 * Single source of truth for the physical-shop facts Google uses to rank and
 * display a local business: coordinates, opening hours, categories, and the
 * external profiles that prove the business is real.
 *
 * IMPORTANT — NAP consistency: the name, address and phone below must match
 * the Google Business Profile character-for-character. Any mismatch weakens
 * the entity match and can suppress the business from the local pack.
 */

/**
 * Coordinates taken from the verified Google Maps place for
 * "SUPER TECH INT'L CONSTRUCTION MATERIALS CO", Shuwaikh Industrial.
 */
export const geo = {
  latitude: 29.3289452,
  longitude: 47.9465109,
} as const

/**
 * Typical Kuwait hardware-trade hours: Sat–Thu split shift, Friday closed.
 * Update these to the real shop hours and mirror them exactly in the Google
 * Business Profile — conflicting hours are a common local-ranking problem.
 */
export const openingHours = [
  {
    days: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    opens: '08:00',
    closes: '13:00',
  },
  {
    days: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    opens: '16:00',
    closes: '20:00',
  },
] as const

/** Days the shop is closed, emitted so Google never guesses. */
export const closedDays = ['Friday'] as const

/**
 * Profiles that let Google tie the website and the Maps listing to the same
 * entity. Add every new profile (Facebook, LinkedIn, directory listings) here.
 */
export const sameAs: string[] = [
  'https://www.instagram.com/supertechint',
  'https://maps.app.goo.gl/82yxw5UwSk57wctz9',
]

/**
 * Schema.org types describing the business. `HardwareStore` is the type that
 * matches "hardware shop near me" intent; the extra types cover the HVAC and
 * building-supply sides of the catalogue.
 */
export const businessTypes = ['HardwareStore', 'HomeGoodsStore', 'Store'] as const

/** Rough price positioning — Google shows this in local results. */
export const priceRange = 'KD'

/** Payment and fulfilment signals surfaced in local knowledge panels. */
export const paymentAccepted = ['Cash', 'Credit Card', 'KNET', 'Bank Transfer']
export const currenciesAccepted = 'KWD'
