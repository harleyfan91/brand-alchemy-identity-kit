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
  health_wellness: {
    offer: [
      { id: 'clinical_care', label: 'clinical care and treatment', description: 'Medical or licensed clinical services patients rely on.' },
      { id: 'wellness_programs', label: 'wellness and prevention programs', description: 'Structured plans for habits, screening, and staying well.' },
      { id: 'coaching_therapy', label: 'coaching or therapy support', description: 'Ongoing guidance for mental health, behavior, or recovery.' },
      { id: 'holistic_services', label: 'holistic and body-based services', description: 'Whole-person care such as acupuncture, bodywork, or integrative support.' },
    ],
    audience: [
      { id: 'busy_professionals', label: 'busy professionals', description: 'People juggling careers and health at the same time.' },
      { id: 'families_children', label: 'families and kids', description: 'Households making care decisions for themselves or children.' },
      { id: 'older_adults', label: 'older adults', description: 'Clients focused on mobility, chronic care, or aging well.' },
      { id: 'performance_focused', label: 'performance-focused clients', description: 'Athletes or people optimizing energy, sleep, or recovery.' },
    ],
    delivery: [
      { id: 'in_person_visits', label: 'in-person visits', description: 'Care delivered on-site at a clinic or office.' },
      { id: 'telehealth', label: 'telehealth and virtual care', description: 'Secure video or remote visits when appropriate.' },
      { id: 'membership_programs', label: 'membership or ongoing programs', description: 'A defined cadence of care over time.' },
      { id: 'home_based_care', label: 'home-based or mobile care', description: 'Providers come to the client when that is the model.' },
    ],
    before: [
      { id: 'symptoms_ignored', label: 'symptoms brushed aside', description: 'They have been postponing care or downplaying warning signs.' },
      { id: 'inconsistent_routine', label: 'inconsistent with routines', description: 'Good intentions, but habits and follow-through drift.' },
      { id: 'overwhelmed_system', label: 'overwhelmed by the system', description: 'Insurance, referrals, or choices feel hard to navigate.' },
      { id: 'stuck_same_cycle', label: 'stuck in the same cycle', description: 'Temporary fixes, but no lasting change yet.' },
    ],
    after: [
      { id: 'clear_plan', label: 'on a clear care plan', description: 'They know what to do next and why it matters.' },
      { id: 'more_energy', label: 'more energy and stability', description: 'Day-to-day life feels more sustainable.' },
      { id: 'confident_body', label: 'confident in their body', description: 'Less fear, more trust in progress.' },
      { id: 'supported_accountable', label: 'supported and accountable', description: 'A relationship that keeps them on track.' },
    ],
    mechanism: [
      { id: 'evidence_based_care', label: 'evidence-based care', description: 'Decisions grounded in clinical best practice.' },
      { id: 'personalized_plan', label: 'a personalized plan', description: 'Adjusted to their history, goals, and constraints.' },
      { id: 'education_coaching', label: 'education and coaching', description: 'They understand their health, not only follow orders.' },
      { id: 'coordinated_support', label: 'coordinated support', description: 'Fewer gaps between advice, habits, and follow-up.' },
    ],
  },
  beauty_personal_care: {
    offer: [
      { id: 'hair_services', label: 'haircuts, color, and styling', description: 'Cut, color, extensions, or ongoing hair care.' },
      { id: 'skin_treatments', label: 'skin and facial treatments', description: 'Facials, peels, brows, or esthetic skin services.' },
      { id: 'nails_body', label: 'nails and body care', description: 'Manicure, pedicure, waxing, or related services.' },
      { id: 'retail_products', label: 'retail and product lines', description: 'Products clients take home to maintain results.' },
    ],
    audience: [
      { id: 'everyday_clients', label: 'everyday maintenance clients', description: 'People who book regular upkeep appointments.' },
      { id: 'event_prep', label: 'event and special-occasion clients', description: 'Weddings, photos, or one-off “big day” prep.' },
      { id: 'self_care_seekers', label: 'self-care seekers', description: 'Clients who want the appointment to feel restorative.' },
      { id: 'results_driven', label: 'results-driven clients', description: 'People focused on a specific look, skin goal, or routine.' },
    ],
    delivery: [
      { id: 'salon_studio', label: 'in-salon or studio appointments', description: 'Standard booked chair or room time.' },
      { id: 'mobile_service', label: 'mobile or on-location service', description: 'You travel to the client when that is the offer.' },
      { id: 'membership_packages', label: 'memberships or packages', description: 'Bundled visits or standing appointments.' },
      { id: 'consult_retail', label: 'consultations plus home care', description: 'Service plus guidance on what to use between visits.' },
    ],
    before: [
      { id: 'dont_know_trust', label: 'unsure what will work', description: 'Trial and error with products or providers.' },
      { id: 'inconsistent_look', label: 'inconsistent look or skin', description: 'Results fade between visits or routines fall off.' },
      { id: 'no_time_self', label: 'no time for themselves', description: 'Self-care keeps getting bumped.' },
      { id: 'special_occasion_stress', label: 'stressed for a big event', description: 'They want to look right and feel confident in photos.' },
    ],
    after: [
      { id: 'confident_look', label: 'confident in how they look', description: 'They trust the outcome for their everyday or event.' },
      { id: 'healthy_routine', label: 'a routine they can keep', description: 'Habits and products that fit real life.' },
      { id: 'polished_put_together', label: 'polished and put together', description: 'Hair, skin, or nails that feel intentional.' },
      { id: 'relaxed_after_visit', label: 'relaxed after the visit', description: 'The experience itself delivers care, not only the result.' },
    ],
    mechanism: [
      { id: 'skilled_technique', label: 'skilled technique and taste', description: 'Craft and judgment in the chair or room.' },
      { id: 'personal_consultation', label: 'a personal consultation', description: 'You match service and products to their goals.' },
      { id: 'quality_products', label: 'quality products and education', description: 'Professional-grade tools they understand how to use.' },
      { id: 'consistent_visits', label: 'consistent visits over time', description: 'Maintenance that compounds instead of one-off fixes.' },
    ],
  },
  technology: {
    offer: [
      { id: 'custom_software', label: 'custom software or apps', description: 'Build or extend products for specific workflows.' },
      { id: 'it_managed_services', label: 'IT and managed services', description: 'Ongoing operations, support, and reliability.' },
      { id: 'implementation_integrations', label: 'implementation and integrations', description: 'Rolling out tools and connecting systems.' },
      { id: 'advisory_security', label: 'advisory and security services', description: 'Strategy, audits, architecture, or risk reduction.' },
    ],
    audience: [
      { id: 'smb_operators', label: 'small and mid-size businesses', description: 'Teams without a full in-house tech department.' },
      { id: 'startups', label: 'startups and product teams', description: 'Speed, iteration, and early-stage tradeoffs.' },
      { id: 'enterprise_teams', label: 'enterprise and internal teams', description: 'Larger orgs needing alignment and delivery discipline.' },
      { id: 'non_technical_leaders', label: 'non-technical leaders', description: 'Owners or execs who need clarity, not jargon.' },
    ],
    delivery: [
      { id: 'project_engagements', label: 'project-based engagements', description: 'Scoped delivery with milestones and handoff.' },
      { id: 'retainer_support', label: 'retainer and ongoing support', description: 'A steady partner for changes and incidents.' },
      { id: 'workshops_training', label: 'workshops and training', description: 'Upskilling teams on tools or practices.' },
      { id: 'fractional_leadership', label: 'fractional or embedded leadership', description: 'Part-time CTO, lead, or architect-style support.' },
    ],
    before: [
      { id: 'tech_debt', label: 'buried in tech debt', description: 'Shortcuts and legacy slowing everything down.' },
      { id: 'downtime_risk', label: 'worried about downtime or breaches', description: 'Reliability and security feel fragile.' },
      { id: 'tool_sprawl', label: 'tool sprawl and poor integration', description: 'Too many systems that do not talk to each other.' },
      { id: 'slow_delivery', label: 'slow or unpredictable delivery', description: 'Roadmaps slip; quality is inconsistent.' },
    ],
    after: [
      { id: 'stable_platform', label: 'a stable, modern platform', description: 'Systems they can build on without fear.' },
      { id: 'faster_shipping', label: 'shipping faster with confidence', description: 'Predictable releases and clearer ownership.' },
      { id: 'aligned_stack', label: 'an aligned stack and workflow', description: 'Fewer handoffs and fewer surprises.' },
      { id: 'measurable_security', label: 'measurable security and compliance posture', description: 'Risk is understood and improving.' },
    ],
    mechanism: [
      { id: 'architecture_standards', label: 'architecture and engineering standards', description: 'Clear patterns, reviews, and guardrails.' },
      { id: 'automation_monitoring', label: 'automation and monitoring', description: 'Less manual toil, earlier detection of issues.' },
      { id: 'delivery_practices', label: 'modern delivery practices', description: 'CI/CD, testing, and collaboration habits that stick.' },
      { id: 'vendor_neutral_advice', label: 'vendor-neutral advice', description: 'Recommendations tied to outcomes, not logos.' },
    ],
  },
  real_estate: {
    offer: [
      { id: 'buying_selling', label: 'buying and selling homes', description: 'Representation for clients transacting residential property.' },
      { id: 'leasing_rentals', label: 'leasing and rentals', description: 'Helping tenants and landlords with rental deals.' },
      { id: 'commercial', label: 'commercial real estate', description: 'Office, retail, or investment property support.' },
      { id: 'relocation', label: 'relocation and move planning', description: 'End-to-end help for people changing markets.' },
    ],
    audience: [
      { id: 'first_time_buyers', label: 'first-time buyers', description: 'People new to financing, offers, and inspections.' },
      { id: 'move_up_families', label: 'move-up families', description: 'Selling and buying with timing and logistics pressure.' },
      { id: 'investors', label: 'investors', description: 'Buyers focused on numbers, tenants, and risk.' },
      { id: 'relocating_professionals', label: 'relocating professionals', description: 'Limited time to learn a new market from scratch.' },
    ],
    delivery: [
      { id: 'full_service_representation', label: 'full-service representation', description: 'End-to-end guidance through contract and close.' },
      { id: 'listing_marketing', label: 'listing marketing and staging coordination', description: 'Presentation and exposure for sellers.' },
      { id: 'market_guidance', label: 'market guidance and tours', description: 'Education-first help before they commit.' },
      { id: 'network_referrals', label: 'referrals through your network', description: 'Lenders, inspectors, and pros you trust.' },
    ],
    before: [
      { id: 'market_confusion', label: 'confused by the market', description: 'Too much noise online; hard to know what is real.' },
      { id: 'timing_pressure', label: 'stressed about timing and money', description: 'Deadlines, rates, and competing priorities.' },
      { id: 'bad_past_deal', label: 'burned by a past experience', description: 'Skeptical after a rough transaction or agent.' },
      { id: 'analysis_paralysis', label: 'stuck in analysis paralysis', description: 'They cannot pick a lane on price or neighborhood.' },
    ],
    after: [
      { id: 'clear_offer_strategy', label: 'clear on offer strategy', description: 'They understand tradeoffs and next steps.' },
      { id: 'smooth_close', label: 'a smoother path to closing', description: 'Fewer surprises; better coordination.' },
      { id: 'confident_decision', label: 'confident in the decision', description: 'The choice fits their goals and risk tolerance.' },
      { id: 'strong_listing', label: 'a stronger listing position', description: 'Sellers show well and attract the right buyers.' },
    ],
    mechanism: [
      { id: 'local_expertise', label: 'deep local expertise', description: 'Nuance on neighborhoods, pricing, and norms.' },
      { id: 'negotiation_advocacy', label: 'negotiation and advocacy', description: 'Representation that protects their interests.' },
      { id: 'process_clarity', label: 'process clarity from day one', description: 'Expectations, documents, and milestones explained.' },
      { id: 'trusted_partners', label: 'trusted partners when needed', description: 'The right specialists at the right time.' },
    ],
  },
  education: {
    offer: [
      { id: 'tutoring_academic', label: 'tutoring and academic support', description: 'Subject or test help for students.' },
      { id: 'courses_programs', label: 'courses and structured programs', description: 'Cohort or sequential learning with a curriculum.' },
      { id: 'workshops_trainings', label: 'workshops and corporate trainings', description: 'Short-form learning for teams or professionals.' },
      { id: 'coaching_mentoring', label: 'coaching and mentoring', description: 'One-on-one guidance for skills or transitions.' },
    ],
    audience: [
      { id: 'k12_families', label: 'K–12 students and families', description: 'Parents coordinating support for school success.' },
      { id: 'college_adults', label: 'college students and adult learners', description: 'Undergrads, career changers, or returning students.' },
      { id: 'organizations', label: 'schools and organizations', description: 'Leaders improving outcomes at scale.' },
      { id: 'professionals_certs', label: 'professionals pursuing credentials', description: 'Certification, licensing, or upskilling paths.' },
    ],
    delivery: [
      { id: 'in_person_sessions', label: 'in-person sessions', description: 'Face-to-face teaching or facilitation.' },
      { id: 'live_online', label: 'live online sessions', description: 'Scheduled virtual classes or tutoring.' },
      { id: 'async_content', label: 'self-paced online content', description: 'Recorded lessons with optional check-ins.' },
      { id: 'hybrid_blend', label: 'hybrid blended programs', description: 'Mix of sync, async, and office hours.' },
    ],
    before: [
      { id: 'behind_confused', label: 'behind or confused', description: 'Gaps in fundamentals or unclear expectations.' },
      { id: 'test_anxiety', label: 'anxious about tests or performance', description: 'Stress gets in the way of showing what they know.' },
      { id: 'no_structure', label: 'no structure or accountability', description: 'Good intent but inconsistent study habits.' },
      { id: 'misaligned_training', label: 'training misaligned to real work', description: 'Content feels theoretical or out of date.' },
    ],
    after: [
      { id: 'solid_understanding', label: 'solid understanding', description: 'Concepts click; they can apply them.' },
      { id: 'better_scores', label: 'better scores or measurable progress', description: 'Results they can point to.' },
      { id: 'confident_skills', label: 'confident applying skills', description: 'Transfer to school, work, or exams.' },
      { id: 'sustainable_habits', label: 'sustainable study or practice habits', description: 'A system that survives busy weeks.' },
    ],
    mechanism: [
      { id: 'diagnostic_teaching', label: 'diagnostic teaching', description: 'You find gaps before piling on new material.' },
      { id: 'practice_feedback', label: 'practice and feedback loops', description: 'Repetition with correction, not only lectures.' },
      { id: 'curriculum_design', label: 'clear curriculum design', description: 'Sequencing, pacing, and outcomes are explicit.' },
      { id: 'motivation_support', label: 'motivation and study skills', description: 'Building confidence and routines, not only content.' },
    ],
  },
  finance: {
    offer: [
      { id: 'financial_planning', label: 'financial planning', description: 'Holistic advice across goals, cash flow, and risk.' },
      { id: 'tax_prep_strategy', label: 'tax preparation and strategy', description: 'Compliance plus smarter year-round decisions.' },
      { id: 'bookkeeping_cfo', label: 'bookkeeping and fractional CFO', description: 'Clean books and forward-looking financial clarity.' },
      { id: 'investment_advisory', label: 'investment advisory', description: 'Portfolio guidance aligned to goals and risk tolerance.' },
    ],
    audience: [
      { id: 'households', label: 'households and families', description: 'Budgeting, saving, and major life transitions.' },
      { id: 'small_business_owners', label: 'small business owners', description: 'Separating personal and business finances.' },
      { id: 'pre_retirement', label: 'people approaching retirement', description: 'Timing, income, and risk shifts.' },
      { id: 'high_complexity', label: 'clients with complex situations', description: 'Equity comp, multiple entities, or cross-border needs.' },
    ],
    delivery: [
      { id: 'ongoing_relationship', label: 'ongoing advisory relationship', description: 'Regular meetings and plan updates.' },
      { id: 'project_based', label: 'project-based engagements', description: 'One-time plans or clean-up projects.' },
      { id: 'virtual_meetings', label: 'virtual meetings and shared dashboards', description: 'Remote-first collaboration with clear documents.' },
      { id: 'full_service_firm', label: 'full-service firm coordination', description: 'Coordination with legal, tax, and investment partners.' },
    ],
    before: [
      { id: 'unclear_numbers', label: 'unclear where money goes', description: 'Cash flow feels opaque or stressful.' },
      { id: 'tax_surprises', label: 'tax surprises or missed opportunities', description: 'Reactive instead of strategic.' },
      { id: 'investment_anxiety', label: 'anxious about investments', description: 'Unsure about risk, fees, or whether they are on track.' },
      { id: 'business_blur', label: 'personal and business finances blurred', description: 'Messy books and unclear owner pay.' },
    ],
    after: [
      { id: 'clear_plan_numbers', label: 'a clear plan with real numbers', description: 'Goals tied to cash flow and timelines.' },
      { id: 'tax_confidence', label: 'more tax confidence year-round', description: 'Fewer surprises; better decisions.' },
      { id: 'aligned_investments', label: 'investments aligned to goals', description: 'A portfolio story they understand.' },
      { id: 'clean_books', label: 'clean books and useful reports', description: 'Decisions based on data, not guesses.' },
    ],
    mechanism: [
      { id: 'fiduciary_standard', label: 'fiduciary or transparent standards', description: 'Advice with clear obligations and fees.' },
      { id: 'scenario_modeling', label: 'scenario modeling and tradeoffs', description: 'Showing choices, not only recommendations.' },
      { id: 'process_discipline', label: 'process and review cadence', description: 'Check-ins that keep the plan alive.' },
      { id: 'education_first', label: 'education-first explanations', description: 'Jargon translated into decisions.' },
    ],
  },
  legal_professional_services: {
    offer: [
      { id: 'transactional_legal', label: 'contracts and transactional work', description: 'Drafting, review, and closing support.' },
      { id: 'dispute_litigation', label: 'disputes and litigation', description: 'Representation when conflict escalates.' },
      { id: 'compliance_counsel', label: 'compliance and regulatory counsel', description: 'Policies, filings, and risk management.' },
      { id: 'outside_general', label: 'outside general counsel', description: 'Ongoing strategic legal partnership for operators.' },
    ],
    audience: [
      { id: 'small_mid_business', label: 'small and mid-size businesses', description: 'Owners who need practical, business-first advice.' },
      { id: 'startups_founders', label: 'startups and founders', description: 'Formation, fundraising, and early contracts.' },
      { id: 'individuals_estates', label: 'individuals and families', description: 'Estates, property, or personal legal needs.' },
      { id: 'regulated_industries', label: 'regulated industry clients', description: 'Extra scrutiny on compliance and documentation.' },
    ],
    delivery: [
      { id: 'project_scoped', label: 'project-scoped engagements', description: 'Clear scope, timeline, and deliverables.' },
      { id: 'retainer_arrangements', label: 'retainer arrangements', description: 'Predictable access for recurring questions.' },
      { id: 'collaborative_firms', label: 'collaboration with other firms', description: 'Coordinating with finance, HR, or specialty counsel.' },
      { id: 'urgent_response', label: 'urgent response when it matters', description: 'Clear protocol for time-sensitive issues.' },
    ],
    before: [
      { id: 'legal_risk_unknown', label: 'legal risk feels unknown', description: 'They are not sure what could go wrong.' },
      { id: 'contract_weakness', label: 'weak contracts or handshakes', description: 'Agreements that will not hold up under stress.' },
      { id: 'dispute_brewing', label: 'a dispute brewing', description: 'Tension with a partner, vendor, or regulator.' },
      { id: 'compliance_backlog', label: 'compliance backlog', description: 'Policies and filings falling behind.' },
    ],
    after: [
      { id: 'risk_clarity', label: 'clarity on real risk', description: 'They understand exposure and priorities.' },
      { id: 'strong_agreements', label: 'stronger agreements in place', description: 'Documents that match how they actually operate.' },
      { id: 'defensible_position', label: 'a defensible position', description: 'If challenged, they are prepared.' },
      { id: 'compliance_current', label: 'compliance brought current', description: 'A credible story to regulators, boards, or investors.' },
    ],
    mechanism: [
      { id: 'practical_counsel', label: 'practical business counsel', description: 'Advice that fits speed and budget realities.' },
      { id: 'clear_documentation', label: 'clear documentation and process', description: 'Paper trails that match decisions.' },
      { id: 'negotiation_strategy', label: 'negotiation and escalation strategy', description: 'Measured moves before burning relationships.' },
      { id: 'specialist_network', label: 'specialist network when needed', description: 'The right expert for the issue, not a generic answer.' },
    ],
  },
  construction_trades: {
    offer: [
      { id: 'residential_projects', label: 'residential construction and remodels', description: 'Homes, additions, and major renovations done right.' },
      { id: 'commercial_builds', label: 'commercial construction', description: 'Build-outs, tenant improvements, and small commercial work.' },
      { id: 'specialty_trades', label: 'specialty trade work', description: 'Focused trades such as electrical, HVAC, roofing, or concrete.' },
      { id: 'repair_restore', label: 'repair and restoration', description: 'Fixing damage, wear, or bringing older structures back.' },
    ],
    audience: [
      { id: 'homeowners_build', label: 'homeowners', description: 'People investing in their property for the long term.' },
      { id: 'property_investors', label: 'property investors', description: 'Owners optimizing rentals or flips on a timeline.' },
      { id: 'business_owners_facilities', label: 'business owners', description: 'Operators who need facilities that work for customers and staff.' },
      { id: 'general_contractors', label: 'general contractors and builders', description: 'Partners who need reliable crews and clear scopes.' },
    ],
    delivery: [
      { id: 'on_site_crews', label: 'on-site crews and project management', description: 'Coordinated labor with a single accountable lead.' },
      { id: 'phased_projects', label: 'phased projects and milestones', description: 'Work sequenced so sites stay livable or operational.' },
      { id: 'maintenance_service', label: 'ongoing maintenance contracts', description: 'Preventive care after the main job is done.' },
      { id: 'design_build', label: 'design-build partnerships', description: 'From plans through punch list with fewer handoffs.' },
    ],
    before: [
      { id: 'unsafe_or_stalled', label: 'unsafe work or stalled projects', description: 'Jobs half-done or corners cut in ways that worry them.' },
      { id: 'timeline_budget', label: 'bleeding time and money', description: 'Slips, change orders, and surprises stacking up.' },
      { id: 'wrong_fit_contractor', label: 'a bad fit with a past contractor', description: 'Communication broke down or quality did not match the bid.' },
      { id: 'code_permit_stress', label: 'code and permit stress', description: 'Uncertainty about inspections, permits, and liability.' },
    ],
    after: [
      { id: 'built_to_last', label: 'built to last', description: 'Work they can trust when weather and use hit it.' },
      { id: 'on_time_budget', label: 'on time and within a clear plan', description: 'Expectations and change orders they understand.' },
      { id: 'permit_ready', label: 'permit-ready and inspection-clean', description: 'Paperwork and workmanship that stand up to review.' },
      { id: 'property_confidence', label: 'more confident in the property', description: 'Value, safety, and day-to-day function improved.' },
    ],
    mechanism: [
      { id: 'skilled_tradespeople', label: 'skilled tradespeople and supervision', description: 'Craft and oversight on the job, not only a low bid.' },
      { id: 'clear_scopes', label: 'clear scopes and change processes', description: 'They know what is included before work starts.' },
      { id: 'project_coordination', label: 'project coordination and communication', description: 'Fewer gaps between trades and decisions.' },
      { id: 'quality_materials', label: 'quality materials and code-aware work', description: 'Built for real conditions and local requirements.' },
    ],
  },
  automotive: {
    offer: [
      { id: 'repair_diagnostics', label: 'repair and diagnostics', description: 'Finding and fixing what is wrong under the hood.' },
      { id: 'maintenance_plans', label: 'preventive maintenance', description: 'Oil, brakes, tires, and schedules that prevent surprises.' },
      { id: 'body_collision', label: 'body and collision work', description: 'Cosmetic and structural repair after damage.' },
      { id: 'detailing_upgrades', label: 'detailing and upgrades', description: 'Protection, appearance, and customization work.' },
    ],
    audience: [
      { id: 'daily_drivers', label: 'daily drivers', description: 'People who depend on one vehicle for work and family.' },
      { id: 'fleet_small_business', label: 'small-business fleets', description: 'Vans and trucks that cannot stay down long.' },
      { id: 'enthusiasts', label: 'enthusiasts and specialty vehicles', description: 'Owners who care about performance or collectibility.' },
      { id: 'families_safety', label: 'families prioritizing safety', description: 'Parents who want reliability and clear explanations.' },
    ],
    delivery: [
      { id: 'shop_service', label: 'in-shop service', description: 'Drop-off work with lifts, tools, and bays.' },
      { id: 'mobile_mechanic', label: 'mobile or on-site service', description: 'Help where the vehicle sits when that is the model.' },
      { id: 'same_day_priority', label: 'same-day and priority service', description: 'Fast turnaround when timing matters.' },
      { id: 'scheduled_maintenance', label: 'scheduled maintenance programs', description: 'Standing appointments that keep cars ahead of failure.' },
    ],
    before: [
      { id: 'breakdown_stress', label: 'stressed by a breakdown', description: 'Stranded, late, or unsure what failed.' },
      { id: 'dealer_trust', label: 'unsure who to trust', description: 'Past upsells or vague diagnoses left them skeptical.' },
      { id: 'mystery_issues', label: 'mystery noises or warnings', description: 'Lights and sounds they cannot interpret.' },
      { id: 'transport_disruption', label: 'life disrupted without wheels', description: 'Work and family plans hinge on the car.' },
    ],
    after: [
      { id: 'reliable_again', label: 'confident the vehicle is reliable', description: 'They trust it for commutes and trips.' },
      { id: 'fair_transparent', label: 'fair price and transparent work', description: 'They understand what was done and why.' },
      { id: 'back_on_road', label: 'back on the road quickly', description: 'Minimal downtime with clear timing.' },
      { id: 'looks_right', label: 'looks and feels right again', description: 'Body and interior match how they use the car.' },
    ],
    mechanism: [
      { id: 'certified_techs', label: 'certified technicians', description: 'Training and tooling matched to modern vehicles.' },
      { id: 'diagnostic_tools', label: 'modern diagnostics', description: 'Data-driven troubleshooting instead of guessing.' },
      { id: 'transparent_estimates', label: 'transparent estimates', description: 'Approval before work; no surprise line items.' },
      { id: 'quality_parts', label: 'quality parts and fluids', description: 'Components that match how long they keep the car.' },
    ],
  },
  photography_media: {
    offer: [
      { id: 'photo_sessions', label: 'photography sessions', description: 'Portraits, lifestyle, product, or brand stills.' },
      { id: 'video_production', label: 'video production', description: 'Filming and editing for promos, social, or events.' },
      { id: 'event_coverage', label: 'event coverage', description: 'Weddings, corporate, and live moments captured well.' },
      { id: 'brand_content', label: 'ongoing brand content', description: 'A steady stream of visuals for marketing channels.' },
    ],
    audience: [
      { id: 'couples_families', label: 'couples and families', description: 'Life milestones and memories worth printing.' },
      { id: 'business_brands', label: 'businesses and brands', description: 'Teams that need visuals that match positioning.' },
      { id: 'creators_public_figures', label: 'creators and public-facing pros', description: 'People who live in content and need a partner.' },
      { id: 'event_planners', label: 'event planners and venues', description: 'Partners who need dependable coverage under pressure.' },
    ],
    delivery: [
      { id: 'on_location_shoots', label: 'on-location shoots', description: 'You meet clients where the story happens.' },
      { id: 'studio_sessions', label: 'studio sessions', description: 'Controlled lighting and sets for products or portraits.' },
      { id: 'editing_packages', label: 'editing and delivery packages', description: 'Clear counts, turnaround, and file formats.' },
      { id: 'content_retainers', label: 'content retainers', description: 'Recurring shoots or edits for active channels.' },
    ],
    before: [
      { id: 'generic_visuals', label: 'stuck with generic visuals', description: 'Stock or phone shots that do not elevate the brand.' },
      { id: 'inconsistent_brand', label: 'inconsistent look across channels', description: 'Nothing feels like one coherent story.' },
      { id: 'event_worry', label: 'worried about missing the moment', description: 'They need a pro who will not flake on the day.' },
      { id: 'content_backlog', label: 'a growing content backlog', description: 'Ideas without execution or edit capacity.' },
    ],
    after: [
      { id: 'standout_visuals', label: 'standout photos and footage', description: 'Work they are proud to publish and print.' },
      { id: 'cohesive_brand_look', label: 'a cohesive brand look', description: 'Recognition and quality across touchpoints.' },
      { id: 'memories_preserved', label: 'moments preserved with care', description: 'Events and people captured the way they felt.' },
      { id: 'publish_ready', label: 'publish-ready assets', description: 'Files sized and styled for where they go live.' },
    ],
    mechanism: [
      { id: 'creative_direction', label: 'creative direction and planning', description: 'Shot lists and mood that match goals, not only gear.' },
      { id: 'pro_workflow', label: 'professional gear and workflow', description: 'Reliable capture, backup, and color.' },
      { id: 'consistent_editing', label: 'consistent editing style', description: 'A signature look or brand guidelines applied well.' },
      { id: 'reliable_turnaround', label: 'reliable turnaround', description: 'Deadlines they can plan launches around.' },
    ],
  },
  pet_services: {
    offer: [
      { id: 'grooming_spa', label: 'grooming and spa services', description: 'Cuts, baths, nails, and coat care.' },
      { id: 'training_behavior', label: 'training and behavior help', description: 'Teaching skills and reducing problem behaviors.' },
      { id: 'daycare_boarding', label: 'daycare and boarding', description: 'Safe social time or overnight care.' },
      { id: 'retail_pet_products', label: 'pet products and nutrition', description: 'Food, gear, and wellness items curated for pets.' },
    ],
    audience: [
      { id: 'new_pet_parents', label: 'new pet parents', description: 'First-time owners learning routines and boundaries.' },
      { id: 'busy_households', label: 'busy households', description: 'People who need dependable care when travel or work wins.' },
      { id: 'multi_pet_homes', label: 'multi-pet homes', description: 'Managing different needs and personalities under one roof.' },
      { id: 'breed_specific', label: 'breed- or age-specific needs', description: 'Coats, energy, or seniors that need extra patience.' },
    ],
    delivery: [
      { id: 'salon_appointments', label: 'salon or facility appointments', description: 'Booked visits in a controlled environment.' },
      { id: 'mobile_grooming', label: 'mobile or at-home visits', description: 'Less stress for pets who hate travel.' },
      { id: 'group_classes', label: 'group classes and playgroups', description: 'Social learning in supervised settings.' },
      { id: 'subscription_pickup', label: 'subscriptions and pickup', description: 'Recurring food or supplies on a rhythm.' },
    ],
    before: [
      { id: 'behavior_frustration', label: 'frustrated by behavior', description: 'Barking, pulling, or anxiety wearing them down.' },
      { id: 'grooming_stress', label: 'grooming stress for pet or owner', description: 'Mats, nails, or fear of the process.' },
      { id: 'travel_guilt', label: 'guilt about time away', description: 'They worry the pet is lonely or bored.' },
      { id: 'nutrition_overwhelm', label: 'overwhelmed by food choices', description: 'Too many brands and opinions online.' },
    ],
    after: [
      { id: 'happier_pet', label: 'a happier, healthier pet', description: 'Energy, coat, and mood noticeably better.' },
      { id: 'confident_handling', label: 'confident handling routines', description: 'They know what works day to day.' },
      { id: 'trusted_care_circle', label: 'a trusted care circle', description: 'Groomer, trainer, or sitter they rely on.' },
      { id: 'calm_consistent', label: 'calmer, more consistent behavior', description: 'Skills and boundaries that stick.' },
    ],
    mechanism: [
      { id: 'positive_methods', label: 'positive, humane methods', description: 'Training and handling that build trust.' },
      { id: 'experienced_handlers', label: 'experienced handlers', description: 'People who read pet body language well.' },
      { id: 'personalized_plans', label: 'personalized care plans', description: 'Coat, diet, and exercise matched to the animal.' },
      { id: 'clear_client_education', label: 'clear client education', description: 'They leave knowing what to do between visits.' },
    ],
  },
  retail: {
    offer: [
      { id: 'handmade_maker_goods', label: 'handmade and maker goods', description: 'Crafts, studio-made pieces, or small-batch goods with a clear maker behind them.' },
      { id: 'curated_merchandise', label: 'curated merchandise', description: 'A tight selection of brands and makers instead of endless aisles.' },
      { id: 'apparel_accessories', label: 'apparel and accessories', description: 'Fit, materials, and style shoppers can judge with confidence.' },
      { id: 'wholesale_stockist_lines', label: 'wholesale and stockist lines', description: 'Niche SKUs, MOQs, and reorders for shops, salons, studios, or pros.' },
    ],
    audience: [
      { id: 'local_regulars', label: 'local regulars', description: 'Neighbors who treat your shop, stall, or pickup spot as part of their routine.' },
      { id: 'marketplace_dtc_buyers', label: 'marketplace and DTC buyers', description: 'People who find you on Etsy, an Amazon storefront, social, or your own site.' },
      { id: 'gift_buyers', label: 'gift and occasion buyers', description: 'Shoppers hunting for something memorable, personal, or well wrapped.' },
      { id: 'wholesale_account_buyers', label: 'wholesale and account buyers', description: 'Stockists and small businesses buying for resale or regular professional use.' },
    ],
    delivery: [
      { id: 'in_store_retail', label: 'in-store, markets, and pop-ups', description: 'Try-on, pickup, or discovery where you meet people in person.' },
      { id: 'ship_nationwide', label: 'shipping and careful fulfillment', description: 'Parcels, tracking, and packaging that respect fragile or handmade work.' },
      { id: 'buy_online_pickup', label: 'buy online, pickup locally', description: 'Speed and certainty for nearby customers who still want a human handoff.' },
      { id: 'made_to_order_platform_orders', label: 'made-to-order, batches, and platform checkout', description: 'Lead times, drops, preorders, or checkout through your site and marketplaces.' },
    ],
    before: [
      { id: 'choice_fatigue', label: 'tired of overwhelming choice', description: 'Big-box fatigue or endless scrolling without a brand they trust yet.' },
      { id: 'fit_quality_risk', label: 'worried about fit, materials, or true quality', description: 'Sizing, fiber, finish, or weight that might not match what they imagined.' },
      { id: 'listing_trust_gap', label: 'unsure listings tell the whole story', description: 'Photos and reviews that still leave them guessing about what arrives.' },
      { id: 'lead_time_stock_chaos', label: 'lead times, sellouts, or shipping surprises', description: 'Preorders, batches, or inventory that do not line up with what was promised.' },
    ],
    after: [
      { id: 'found_the_thing', label: 'found the right thing', description: 'A purchase that fits need, taste, and budget without compromise.' },
      { id: 'enjoyable_visit', label: 'an enjoyable visit or unboxing', description: 'The handoff or package matches the care in how it was made.' },
      { id: 'confident_purchase', label: 'confident in the purchase', description: 'They know materials, sizing, and timing before they commit.' },
      { id: 'feel_valued', label: 'feel valued as a customer', description: 'Recognition and service that earn repeat orders and word of mouth.' },
    ],
    mechanism: [
      { id: 'staff_who_listen', label: 'responsive, personal service', description: 'Real answers before and after the sale—not scripts or ghosting.' },
      { id: 'honest_listings_merchandising', label: 'honest listings and merchandising', description: 'Specs, shots, and displays that match what ships or sits on the shelf.' },
      { id: 'fair_policies', label: 'fair policies and resolutions', description: 'Clear paths when fit, damage, or timing misses the mark.' },
      { id: 'maker_story_consistency', label: 'maker story and consistent batches', description: 'Provenance, small-batch rhythm, and repeatable quality they can count on.' },
    ],
  },
  nonprofit_community: {
    offer: [
      { id: 'direct_services', label: 'direct services to people in need', description: 'Food, shelter, health, or crisis support.' },
      { id: 'advocacy_programs', label: 'advocacy and systems change', description: 'Campaigns and organizing that shift policy or norms.' },
      { id: 'education_training', label: 'education and workforce training', description: 'Skills, literacy, and pathways to stability.' },
      { id: 'capacity_building', label: 'capacity-building for partners', description: 'Helping other orgs and coalitions work better together.' },
    ],
    audience: [
      { id: 'community_members', label: 'community members served', description: 'Residents who rely on programs and trust.' },
      { id: 'donors_volunteers', label: 'donors and volunteers', description: 'People giving time and money who need clarity.' },
      { id: 'partner_orgs', label: 'partner organizations', description: 'Agencies, schools, and funders coordinating impact.' },
      { id: 'local_leaders', label: 'local leaders and coalitions', description: 'People who convene others around a cause.' },
    ],
    delivery: [
      { id: 'in_person_programs', label: 'in-person programs and sites', description: 'Neighborhood centers, events, and door-to-door.' },
      { id: 'virtual_programs', label: 'virtual programs and hotlines', description: 'Remote access when geography or safety matters.' },
      { id: 'mobile_outreach', label: 'mobile outreach', description: 'Meeting people where they are with vans, pop-ups, or tours.' },
      { id: 'peer_networks', label: 'peer networks and cohorts', description: 'Support built on shared experience and mutual aid.' },
    ],
    before: [
      { id: 'under_resourced', label: 'under-resourced and stretched thin', description: 'Demand exceeds staff, money, or space.' },
      { id: 'fragmented_efforts', label: 'fragmented efforts across groups', description: 'Duplication and gaps instead of shared strategy.' },
      { id: 'volunteer_burnout', label: 'volunteer and staff burnout', description: 'Passion without sustainable structure.' },
      { id: 'visibility_gap', label: 'visibility and storytelling gap', description: 'Impact is real but hard for outsiders to see.' },
    ],
    after: [
      { id: 'measurable_impact', label: 'measurable, trusted impact', description: 'Outcomes and stories funders and neighbors believe.' },
      { id: 'stronger_coalition', label: 'a stronger coalition', description: 'Partners aligned on goals and roles.' },
      { id: 'sustained_programs', label: 'sustained programs over time', description: 'Funding and operations that outlast one grant cycle.' },
      { id: 'trusted_voice', label: 'a trusted voice in the community', description: 'Go-to credibility when crises or opportunities hit.' },
    ],
    mechanism: [
      { id: 'community_led', label: 'community-led design', description: 'Programs shaped by the people they serve.' },
      { id: 'evidence_programs', label: 'evidence-informed programs', description: 'Practices tied to outcomes, not only good intentions.' },
      { id: 'volunteer_training', label: 'volunteer training and support', description: 'Roles, boundaries, and care for people giving time.' },
      { id: 'partnership_building', label: 'partnership building', description: 'Shared funding, data, and advocacy across sectors.' },
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
