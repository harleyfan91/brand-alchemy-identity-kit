export const STEP1_OTHER_OPTION_ID = 'other'

/** Shown in scroll wheels for required slots until the user picks a real option (never stored on the form). */
export const STEP1_WHEEL_PLACEHOLDER_ID = '__wheel_placeholder__'

/** Delivery wheel option that maps to an empty deliveryId (optional delivery clause). */
export const STEP1_DELIVERY_WHEEL_SKIP_ID = '__delivery_skip__'

export function withWheelPlaceholder(options: Step1ControlledOption[]): Step1ControlledOption[] {
  return [
    {
      id: STEP1_WHEEL_PLACEHOLDER_ID,
      label: 'Swipe to choose',
      description: 'Scroll to pick the phrase that fits best.',
    },
    ...options,
  ]
}

export function withDeliveryWheelSkip(options: Step1ControlledOption[]): Step1ControlledOption[] {
  return [
    {
      id: STEP1_DELIVERY_WHEEL_SKIP_ID,
      label: 'Not specified',
      description: 'Skip how it is delivered; we will leave that part out.',
    },
    ...options,
  ]
}

export type Step1ControlledOption = {
  id: string
  label: string
  description?: string
}

export type Step1ControlledOptionCatalog = {
  offer: Step1ControlledOption[]
  audience: Step1ControlledOption[]
  delivery: Step1ControlledOption[]
  before: Step1ControlledOption[]
  after: Step1ControlledOption[]
  mechanism: Step1ControlledOption[]
}

function withOther(options: Step1ControlledOption[]): Step1ControlledOption[] {
  return [
    ...options,
    {
      id: STEP1_OTHER_OPTION_ID,
      label: 'Something else',
      description: 'Use a short custom phrase if none of these fit.',
    },
  ]
}

const DEFAULT_CATALOG: Step1ControlledOptionCatalog = {
  offer: [
    { id: 'service_packages', label: 'service packages', description: 'Done-for-you or guided client work.' },
    { id: 'coaching_support', label: 'coaching or advisory support', description: 'Expert help over time.' },
    { id: 'custom_products', label: 'custom products', description: 'A physical or digital product offer.' },
    { id: 'appointments', label: 'appointments or sessions', description: 'Booked one-on-one or repeat services.' },
  ],
  audience: [
    { id: 'busy_adults', label: 'busy adults', description: 'People balancing a lot already.' },
    { id: 'families', label: 'families', description: 'Households making practical decisions.' },
    { id: 'small_businesses', label: 'small business owners', description: 'Founders and small teams.' },
    { id: 'local_customers', label: 'local customers', description: 'People nearby choosing who to trust.' },
  ],
  delivery: [
    { id: 'done_for_you', label: 'done-for-you service', description: 'You take the work off their plate.' },
    { id: 'appointments', label: 'appointments or sessions', description: 'Scheduled time together.' },
    { id: 'custom_plan', label: 'a custom plan and support', description: 'Tailored recommendations and follow-through.' },
    { id: 'ongoing_support', label: 'ongoing support', description: 'Recurring help instead of a one-off.' },
  ],
  before: [
    { id: 'overwhelmed', label: 'overwhelmed', description: 'Too much uncertainty or too many moving parts.' },
    { id: 'inconsistent', label: 'inconsistent', description: 'They want momentum but cannot keep it going.' },
    { id: 'frustrated', label: 'frustrated', description: 'Current options are not working well enough.' },
    { id: 'stuck', label: 'stuck', description: 'They need a clear next step.' },
  ],
  after: [
    { id: 'confident', label: 'confident', description: 'More sure of what to do next.' },
    { id: 'clear', label: 'clear on what to do next', description: 'They know the next step and why.' },
    { id: 'consistent', label: 'more consistent', description: 'The new direction actually sticks.' },
    { id: 'taken_care_of', label: 'taken care of', description: 'They feel supported instead of scrambling.' },
  ],
  mechanism: [
    { id: 'hands_on_service', label: 'hands-on service', description: 'Direct help doing the work.' },
    { id: 'clear_guidance', label: 'clear guidance and accountability', description: 'Structured direction they can follow.' },
    { id: 'custom_system', label: 'a custom plan and better systems', description: 'Practical structure, not just ideas.' },
    { id: 'thoughtful_support', label: 'thoughtful support', description: 'A more human, tailored experience.' },
  ],
}

const INDUSTRY_CATALOGS: Partial<Record<string, Partial<Step1ControlledOptionCatalog>>> = {
  creative_services: {
    offer: [
      { id: 'brand_identity', label: 'brand identity systems', description: 'Logo, visual system, and direction.' },
      { id: 'website_copy', label: 'website copy and messaging', description: 'Clear words for key pages and offers.' },
      { id: 'content_systems', label: 'content systems', description: 'Repeatable messaging for regular publishing.' },
      { id: 'positioning_strategy', label: 'positioning strategy', description: 'Sharpen what the brand stands for.' },
    ],
    audience: [
      { id: 'founders_launching', label: 'founders launching something new', description: 'New businesses trying to look credible fast.' },
      { id: 'small_creative_teams', label: 'small creative teams', description: 'Studios and service businesses leveling up.' },
      { id: 'service_providers', label: 'independent service providers', description: 'Experts who need clearer positioning.' },
      { id: 'brands_outgrowing_diy', label: 'brands outgrowing a DIY look', description: 'Good work that no longer matches the brand.' },
    ],
    delivery: [
      { id: 'strategy_sprint', label: 'a strategy and design sprint', description: 'A focused engagement with clear outputs.' },
      { id: 'done_for_you_project', label: 'a done-for-you project', description: 'You build it and hand it over ready to use.' },
      { id: 'collaborative_workshop', label: 'collaborative workshops', description: 'You shape it with the client in real time.' },
      { id: 'retainer_support', label: 'ongoing brand support', description: 'An evolving system rather than a one-off.' },
    ],
    before: [
      { id: 'blending_in', label: 'blending in online', description: 'Nothing about the brand feels distinct yet.' },
      { id: 'scattered_messaging', label: 'scattered and hard to describe', description: 'The offer is real, but the message is fuzzy.' },
      { id: 'diy_look', label: 'stuck with a DIY look', description: 'The brand undercuts the quality of the work.' },
      { id: 'undercharging_energy', label: 'showing up smaller than they should', description: 'The brand does not match the value delivered.' },
    ],
    after: [
      { id: 'professional_presence', label: 'clear and professional online', description: 'The brand reads as credible and intentional.' },
      { id: 'better_fit_clients', label: 'attracting better-fit clients', description: 'The right people understand the offer faster.' },
      { id: 'confident_story', label: 'able to explain what makes them different', description: 'The brand has language and shape.' },
      { id: 'consistent_brand', label: 'more consistent everywhere they show up', description: 'The system is easier to apply across channels.' },
    ],
    mechanism: [
      { id: 'brand_strategy_design', label: 'brand strategy and design direction', description: 'A clearer system for how the brand shows up.' },
      { id: 'positioning_and_copy', label: 'sharper positioning and messaging', description: 'Language that makes the offer easier to understand.' },
      { id: 'visual_identity_system', label: 'a clearer visual identity system', description: 'The look supports the work instead of weakening it.' },
      { id: 'content_frameworks', label: 'practical brand tools and frameworks', description: 'A repeatable system they can keep using.' },
    ],
  },
  fitness_sports: {
    offer: [
      { id: 'personal_training', label: 'personal training', description: 'One-on-one coaching and programming.' },
      { id: 'small_group_training', label: 'small-group training', description: 'A coached group setting with accountability.' },
      { id: 'strength_coaching', label: 'strength coaching', description: 'Programs centered on building strength over time.' },
      { id: 'nutrition_coaching', label: 'nutrition coaching', description: 'Practical support around eating and habits.' },
    ],
    audience: [
      { id: 'busy_adults_fitness', label: 'busy adults who want accountability', description: 'People who need structure that fits real life.' },
      { id: 'beginners', label: 'beginners who need a clear starting point', description: 'Newer clients unsure how to begin.' },
      { id: 'returning_clients', label: 'people getting back into fitness', description: 'Clients rebuilding consistency after a gap.' },
      { id: 'athletes', label: 'athletes who want better performance', description: 'More specific training goals.' },
    ],
    delivery: [
      { id: 'one_on_one_coaching', label: 'one-on-one coaching', description: 'A direct trainer-client relationship.' },
      { id: 'small_group_sessions', label: 'small-group sessions', description: 'Community plus coaching.' },
      { id: 'custom_programming', label: 'custom programming and check-ins', description: 'A plan they follow between sessions.' },
      { id: 'habit_tracking', label: 'habit tracking and accountability', description: 'Support that keeps them consistent.' },
    ],
    before: [
      { id: 'inconsistent', label: 'inconsistent', description: 'They want results but cannot keep a routine going.' },
      { id: 'intimidated', label: 'intimidated by the gym', description: 'They are unsure where they belong.' },
      { id: 'starting_over', label: 'stuck starting over', description: 'They lose momentum and have to restart.' },
      { id: 'plateaued', label: 'plateaued', description: 'Their current approach is not moving them forward.' },
    ],
    after: [
      { id: 'routine_gym_goer', label: 'a routine gym-goer', description: 'Training becomes part of real life.' },
      { id: 'strong_confident', label: 'stronger and more confident', description: 'They feel the progress in daily life.' },
      { id: 'disciplined', label: 'more consistent and disciplined', description: 'The habit actually sticks.' },
      { id: 'energized', label: 'energized again', description: 'They feel physically and mentally better.' },
    ],
    mechanism: [
      { id: 'accountability_coaching', label: 'personal accountability coaching', description: 'The relationship keeps them showing up.' },
      { id: 'custom_strength_plan', label: 'a custom strength plan', description: 'They know exactly what to do and why.' },
      { id: 'small_group_support', label: 'small-group coaching and support', description: 'Consistency through community.' },
      { id: 'habit_checkins', label: 'habit tracking and regular check-ins', description: 'Progress is monitored, not guessed.' },
    ],
  },
  food_beverage: {
    offer: [
      { id: 'specialty_coffee', label: 'specialty coffee', description: 'A place people trust for a real daily ritual.' },
      { id: 'breakfast_pastries', label: 'house-made pastries and breakfast', description: 'Fresh food people come back for.' },
      { id: 'meal_prep', label: 'meal prep', description: 'Prepared food that saves time during the week.' },
      { id: 'catering', label: 'small-event catering', description: 'Food and drinks for gatherings or work events.' },
    ],
    audience: [
      { id: 'neighborhood_regulars', label: 'neighborhood regulars', description: 'People who come back when the experience feels right.' },
      { id: 'commuters', label: 'commuters on the go', description: 'A fast but still quality routine.' },
      { id: 'families_fnb', label: 'families who want something reliable', description: 'Easy choices they can trust.' },
      { id: 'event_hosts', label: 'event hosts', description: 'People who want to take care of a group well.' },
    ],
    delivery: [
      { id: 'walk_in_service', label: 'walk-in service', description: 'An in-person experience people remember.' },
      { id: 'pickup_orders', label: 'pickup orders', description: 'Fast and convenient without losing quality.' },
      { id: 'subscriptions', label: 'recurring orders or subscriptions', description: 'A habit built into the week.' },
      { id: 'catering_delivery', label: 'catering and delivery', description: 'Handled for them with less stress.' },
    ],
    before: [
      { id: 'boring_routine', label: 'stuck in a boring routine', description: 'The everyday option feels generic.' },
      { id: 'settling_chain', label: 'settling for generic chain options', description: 'There is no memorable go-to choice.' },
      { id: 'short_on_time', label: 'short on time', description: 'Convenience keeps beating quality.' },
      { id: 'hosting_stress', label: 'stressed about feeding people well', description: 'They want help pulling it off.' },
    ],
    after: [
      { id: 'look_forward', label: 'looking forward to the experience', description: 'The routine feels worth repeating.' },
      { id: 'taken_care_food', label: 'taken care of', description: 'The service and quality do the heavy lifting.' },
      { id: 'worth_recommending', label: 'sharing something worth recommending', description: 'It becomes the place they mention to others.' },
      { id: 'hosting_confidence', label: 'hosting with confidence', description: 'They trust the experience to hold up.' },
    ],
    mechanism: [
      { id: 'quality_service', label: 'quality ingredients and consistent service', description: 'The basics are done well every time.' },
      { id: 'fast_pickup', label: 'fast ordering and pickup', description: 'Convenience without feeling generic.' },
      { id: 'thoughtful_hospitality', label: 'thoughtful hospitality', description: 'People feel remembered and welcomed.' },
      { id: 'reliable_preparation', label: 'reliable preparation and follow-through', description: 'It works when timing matters.' },
    ],
  },
  home_services: {
    offer: [
      { id: 'plumbing_repair', label: 'plumbing repair', description: 'Fixes that solve the problem cleanly.' },
      { id: 'hvac_service', label: 'HVAC service', description: 'Heating and cooling support people can trust.' },
      { id: 'electrical_work', label: 'electrical repairs', description: 'Practical fixes with safety and clarity.' },
      { id: 'handyman_projects', label: 'handyman projects', description: 'Small to medium jobs that still need doing right.' },
    ],
    audience: [
      { id: 'homeowners', label: 'homeowners', description: 'People trying to protect their home and time.' },
      { id: 'busy_families_home', label: 'busy families', description: 'Households who need problems solved fast.' },
      { id: 'property_managers', label: 'property managers', description: 'Repeat service with clear communication matters.' },
      { id: 'local_businesses_home', label: 'local businesses', description: 'Downtime or disruption costs them money.' },
    ],
    delivery: [
      { id: 'on_site_calls', label: 'on-site service calls', description: 'You show up, assess it, and solve it.' },
      { id: 'maintenance_plans', label: 'recurring maintenance plans', description: 'Prevent issues before they get expensive.' },
      { id: 'same_day_visits', label: 'same-day appointments', description: 'Fast help when time matters.' },
      { id: 'done_for_you_repairs', label: 'done-for-you repairs', description: 'A clear fix without runaround.' },
    ],
    before: [
      { id: 'worried_waiting', label: 'worried and waiting', description: 'They know something is wrong but not what happens next.' },
      { id: 'repeat_problem', label: 'dealing with the same problem again', description: 'Past fixes did not really solve it.' },
      { id: 'repair_overwhelmed', label: 'overwhelmed by the repair', description: 'Too many unknowns and too many opinions.' },
      { id: 'unsure_trust', label: 'unsure who to trust', description: 'The stakes feel high and the market feels noisy.' },
    ],
    after: [
      { id: 'relieved_taken_care', label: 'relieved and taken care of', description: 'They feel looked after, not dismissed.' },
      { id: 'back_to_normal', label: 'back to normal fast', description: 'Life or work can keep moving.' },
      { id: 'confident_fix', label: 'confident the fix will hold', description: 'They trust the work was done right.' },
      { id: 'clear_next_steps', label: 'clear on the next step', description: 'They know what matters now and later.' },
    ],
    mechanism: [
      { id: 'straightforward_calls', label: 'straightforward service calls', description: 'Clear process and no drama.' },
      { id: 'honest_quotes', label: 'honest quotes and practical recommendations', description: 'They understand what they are paying for.' },
      { id: 'preventative_maintenance', label: 'preventative maintenance', description: 'Solve problems before they escalate.' },
      { id: 'clear_communication', label: 'clear communication from start to finish', description: 'Fewer surprises, more trust.' },
    ],
  },
  consulting_coaching: {
    offer: [
      { id: 'business_coaching', label: 'business coaching', description: 'Guidance for better decisions and execution.' },
      { id: 'leadership_coaching', label: 'leadership coaching', description: 'Support for leading people more effectively.' },
      { id: 'operational_consulting', label: 'operational consulting', description: 'Systems and clarity around how the work runs.' },
      { id: 'team_workshops', label: 'team workshops', description: 'Facilitated sessions that create alignment.' },
    ],
    audience: [
      { id: 'founders', label: 'founders', description: 'People carrying too much on their own.' },
      { id: 'managers', label: 'managers and team leads', description: 'Leaders trying to improve how the work happens.' },
      { id: 'small_teams', label: 'small teams', description: 'Groups that need more clarity and alignment.' },
      { id: 'service_business_owners', label: 'service business owners', description: 'Operators who need better systems, not more ideas.' },
    ],
    delivery: [
      { id: 'one_on_one_coaching', label: 'one-on-one coaching', description: 'Direct support around decisions and follow-through.' },
      { id: 'team_workshops_delivery', label: 'team workshops', description: 'Shared language and alignment in the room.' },
      { id: 'audits_action_plans', label: 'audits and action plans', description: 'Clear recommendations that translate into action.' },
      { id: 'ongoing_advisory', label: 'ongoing advisory support', description: 'A steady outside perspective over time.' },
    ],
    before: [
      { id: 'stuck_no_plan', label: 'stuck without a plan', description: 'They know something needs to change but cannot see the path.' },
      { id: 'second_guessing', label: 'second-guessing every decision', description: 'There is too much uncertainty in the work.' },
      { id: 'reactive', label: 'operating reactively', description: 'Everything feels urgent and nothing feels designed.' },
      { id: 'misaligned', label: 'misaligned as a team', description: 'People are moving, but not together.' },
    ],
    after: [
      { id: 'moving_with_clarity', label: 'moving with clarity', description: 'The next steps make sense and feel doable.' },
      { id: 'leading_confidently', label: 'leading with confidence', description: 'They are more decisive and grounded.' },
      { id: 'executing_real_plan', label: 'executing a real plan', description: 'They shift from talking to doing.' },
      { id: 'working_in_sync', label: 'working in sync', description: 'Roles, priorities, and decisions are more aligned.' },
    ],
    mechanism: [
      { id: 'clear_coaching', label: 'clear coaching and accountability', description: 'Progress comes from structure and follow-through.' },
      { id: 'practical_systems', label: 'practical systems and decision frameworks', description: 'Less guessing, more repeatable execution.' },
      { id: 'facilitated_workshops', label: 'facilitated workshops', description: 'People get aligned through shared work.' },
      { id: 'focused_advisory', label: 'focused advisory support', description: 'Specific guidance tied to actual business needs.' },
    ],
  },
}

export function getStep1ControlledOptions(industry: string): Step1ControlledOptionCatalog {
  const scoped = INDUSTRY_CATALOGS[industry] ?? {}
  return {
    offer: withOther(scoped.offer ?? DEFAULT_CATALOG.offer),
    audience: withOther(scoped.audience ?? DEFAULT_CATALOG.audience),
    delivery: withOther(scoped.delivery ?? DEFAULT_CATALOG.delivery),
    before: withOther(scoped.before ?? DEFAULT_CATALOG.before),
    after: withOther(scoped.after ?? DEFAULT_CATALOG.after),
    mechanism: withOther(scoped.mechanism ?? DEFAULT_CATALOG.mechanism),
  }
}

function clean(value?: string): string {
  return value?.trim().replace(/\s+/g, ' ') ?? ''
}

export function resolveControlledOptionLabel(
  options: Step1ControlledOption[],
  selectedId: string,
  otherValue?: string,
): string {
  if (!selectedId) return ''
  if (selectedId === STEP1_OTHER_OPTION_ID) return clean(otherValue)
  return options.find((option) => option.id === selectedId)?.label ?? ''
}
