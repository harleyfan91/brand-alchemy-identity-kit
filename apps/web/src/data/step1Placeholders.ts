/** Placeholders for Step 1 offer + transformation, keyed by `step1.industry`. */

const DEFAULT_OFFER = 'e.g. Custom cakes, mobile detailing, or one-on-one coaching'
const DEFAULT_TRANSFORMATION =
  'e.g. From stressed and rushed to calm and ready for the week ahead'

const OFFER_BY_INDUSTRY: Record<string, string> = {
  creative_services: 'e.g. Logo design, brand kits, or content for small businesses',
  health_wellness: 'e.g. Massage therapy, nutrition coaching, or acupuncture',
  beauty_personal_care: 'e.g. Hair color, lash extensions, or skincare facials',
  fitness_sports: 'e.g. Personal training, group classes, or youth sports coaching',
  technology: 'e.g. IT support, website builds, or app setup for local teams',
  food_beverage: 'e.g. Specialty coffee, meal prep, or catering for small events',
  home_services: 'e.g. Plumbing, HVAC repair, or handyman visits',
  real_estate: 'e.g. Buyer representation, listings, or relocation help',
  education: 'e.g. Tutoring, music lessons, or workshops for kids or adults',
  finance: 'e.g. Bookkeeping, tax prep, or financial coaching for families',
  legal_professional_services: 'e.g. Estate planning, business filings, or contract review',
  consulting_coaching: 'e.g. Business coaching, career clarity sessions, or team workshops',
  construction_trades: 'e.g. Remodeling, roofing, or custom carpentry',
  automotive: 'e.g. Oil changes, detailing, or mobile mechanic service',
  photography_media: 'e.g. Family portraits, weddings, or product photos for shops',
  pet_services: 'e.g. Dog walking, grooming, or in-home pet sitting',
  retail: 'e.g. Handmade goods online, a boutique storefront, or local pickup',
  nonprofit_community: 'e.g. Food pantry hours, youth programs, or neighborhood events',
  other: DEFAULT_OFFER,
}

const TRANSFORMATION_BY_INDUSTRY: Record<string, string> = {
  creative_services: 'e.g. From a DIY look to a brand that wins better clients',
  health_wellness: 'e.g. From run-down to rested, with habits that actually stick',
  beauty_personal_care: 'e.g. From unsure to confident for the moments that matter',
  fitness_sports: 'e.g. From inconsistent workouts to a routine they enjoy keeping',
  technology: 'e.g. From tech headaches to systems that just work day to day',
  food_beverage: 'e.g. From boring routines to meals and treats worth sharing',
  home_services: 'e.g. From worry and waiting to a fixed home without the runaround',
  real_estate: 'e.g. From overwhelmed to clear on the next right step',
  education: 'e.g. From struggling grades to real confidence in the subject',
  finance: 'e.g. From money stress to a clear picture and a plan',
  legal_professional_services: 'e.g. From legal jargon to decisions they understand',
  consulting_coaching: 'e.g. From stuck to moving with a plan they believe in',
  construction_trades: 'e.g. From patch jobs to work that holds up for years',
  automotive: 'e.g. From neglected cars to reliable, road-ready vehicles',
  photography_media: 'e.g. From phone snapshots to images they are proud to share',
  pet_services: 'e.g. From guilty schedules to pets that are happy and cared for',
  retail: 'e.g. From generic choices to products that feel made for them',
  nonprofit_community: 'e.g. From isolated neighbors to people who show up for each other',
  other: DEFAULT_TRANSFORMATION,
}

export function getStep1OfferPlaceholder(industry: string): string {
  if (!industry.trim()) return DEFAULT_OFFER
  return OFFER_BY_INDUSTRY[industry] ?? DEFAULT_OFFER
}

export function getStep1TransformationPlaceholder(industry: string): string {
  if (!industry.trim()) return DEFAULT_TRANSFORMATION
  return TRANSFORMATION_BY_INDUSTRY[industry] ?? DEFAULT_TRANSFORMATION
}
