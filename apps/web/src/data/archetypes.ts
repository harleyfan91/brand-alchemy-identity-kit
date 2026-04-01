export interface BuyerArchetypeOption {
  id: string
  title: string
  description: string
  icon: string
}

const genericArchetypes: BuyerArchetypeOption[] = [
  {
    id: 'value_seeker',
    title: 'The Value Seeker',
    description: 'Wants quality results without overspending.',
    icon: '◎',
  },
  {
    id: 'quality_first_buyer',
    title: 'The Quality-First Buyer',
    description: 'Will pay more for trusted, proven quality.',
    icon: '◉',
  },
  {
    id: 'time_pressed_decider',
    title: 'The Time-Pressed Decider',
    description: 'Needs fast, clear choices and quick delivery.',
    icon: '↗',
  },
  {
    id: 'relationship_loyalist',
    title: 'The Relationship Loyalist',
    description: 'Returns when service feels personal and reliable.',
    icon: '◇',
  },
]

export const industryArchetypes: Record<string, BuyerArchetypeOption[]> = {
  creative_services: [
    { id: 'visionary_founder', title: 'The Visionary Founder', description: 'Has bold ideas and needs a creative partner.', icon: '✦' },
    { id: 'launching_creator', title: 'The Launching Creator', description: 'Needs polished visuals to launch confidently.', icon: '◎' },
    { id: 'rebrand_ready_team', title: 'The Rebrand-Ready Team', description: 'Established and ready for a sharper look.', icon: '◈' },
    { id: 'social_first_marketer', title: 'The Social-First Marketer', description: 'Wants assets that perform across channels.', icon: '◉' },
  ],
  health_wellness: [
    { id: 'wellness_seeker', title: 'The Wellness Seeker', description: 'Looking for healthier habits and consistency.', icon: '◇' },
    { id: 'busy_professional', title: 'The Busy Professional', description: 'Wants practical support that fits a packed schedule.', icon: '↗' },
    { id: 'recovery_focused_client', title: 'The Recovery-Focused Client', description: 'Needs relief, healing, or stress support.', icon: '◎' },
    { id: 'long_term_committer', title: 'The Long-Term Committer', description: 'Invests in trusted care over time.', icon: '◉' },
  ],
  beauty_personal_care: [
    { id: 'routine_upgrader', title: 'The Routine Upgrader', description: 'Wants better daily self-care results.', icon: '✦' },
    { id: 'special_event_client', title: 'The Special-Event Client', description: 'Books services for weddings, events, or travel.', icon: '◈' },
    { id: 'trend_explorer', title: 'The Trend Explorer', description: 'Loves trying new looks and treatments.', icon: '◉' },
    { id: 'premium_loyalist', title: 'The Premium Loyalist', description: 'Returns for high-touch, high-quality care.', icon: '◇' },
  ],
  fitness_sports: [
    { id: 'fitness_beginner', title: 'The Fitness Beginner', description: 'Needs guidance, structure, and confidence.', icon: '◎' },
    { id: 'goal_chaser', title: 'The Goal Chaser', description: 'Tracks progress and wants measurable wins.', icon: '↗' },
    { id: 'consistency_builder', title: 'The Consistency Builder', description: 'Wants sustainable routines and accountability.', icon: '◉' },
    { id: 'performance_athlete', title: 'The Performance Athlete', description: 'Focused on competitive improvement.', icon: '◇' },
  ],
  technology: [
    { id: 'efficiency_operator', title: 'The Efficiency Operator', description: 'Adopts tools that save time and money.', icon: '↗' },
    { id: 'scaling_team', title: 'The Scaling Team', description: 'Needs reliable systems to handle growth.', icon: '◉' },
    { id: 'cautious_buyer', title: 'The Cautious Buyer', description: 'Needs proof, trust, and clear onboarding.', icon: '◎' },
    { id: 'innovation_driver', title: 'The Innovation Driver', description: 'Early adopter seeking strategic edge.', icon: '✦' },
  ],
  food_beverage: [
    { id: 'daily_regular', title: 'The Daily Regular', description: 'Comes back often for dependable favorites.', icon: '◉' },
    { id: 'special_occasion_diner', title: 'The Special-Occasion Diner', description: 'Books for celebrations and memorable moments.', icon: '◇' },
    { id: 'health_conscious_eater', title: 'The Health-Conscious Eater', description: 'Looks for balanced, transparent options.', icon: '◎' },
    { id: 'adventurous_foodie', title: 'The Adventurous Foodie', description: 'Seeks unique flavors and shareable experiences.', icon: '✦' },
  ],
  home_services: [
    { id: 'urgent_fix_caller', title: 'The Urgent-Fix Caller', description: 'Needs fast response when problems happen.', icon: '↗' },
    { id: 'preventive_planner', title: 'The Preventive Planner', description: 'Books routine maintenance to avoid issues.', icon: '◉' },
    { id: 'value_conscious_homeowner', title: 'The Value-Conscious Homeowner', description: 'Compares quotes and expects fair pricing.', icon: '◎' },
    { id: 'quality_first_homeowner', title: 'The Quality-First Homeowner', description: 'Prioritizes trusted workmanship and reliability.', icon: '◇' },
  ],
  real_estate: [
    { id: 'first_time_buyer', title: 'The First-Time Buyer', description: 'Needs education, confidence, and step-by-step help.', icon: '◎' },
    { id: 'move_up_family', title: 'The Move-Up Family', description: 'Balancing timing, budget, and lifestyle upgrades.', icon: '◉' },
    { id: 'investor_mindset_client', title: 'The Investor-Mindset Client', description: 'Focused on returns and long-term value.', icon: '↗' },
    { id: 'seller_on_timeline', title: 'The Seller on a Timeline', description: 'Needs a fast, smooth, low-stress sale.', icon: '◇' },
  ],
  education: [
    { id: 'career_advancer', title: 'The Career Advancer', description: 'Upskilling for better opportunities.', icon: '↗' },
    { id: 'supportive_parent', title: 'The Supportive Parent', description: 'Investing in a child’s growth and confidence.', icon: '◇' },
    { id: 'exam_goal_student', title: 'The Exam-Goal Student', description: 'Focused on clear outcomes and milestones.', icon: '◎' },
    { id: 'lifelong_learner', title: 'The Lifelong Learner', description: 'Driven by curiosity and personal development.', icon: '◉' },
  ],
  finance: [
    { id: 'security_planner', title: 'The Security Planner', description: 'Wants stability, safety, and trusted advice.', icon: '◇' },
    { id: 'growth_investor', title: 'The Growth Investor', description: 'Focused on long-term wealth building.', icon: '↗' },
    { id: 'debt_reducer', title: 'The Debt Reducer', description: 'Needs a realistic path to financial freedom.', icon: '◎' },
    { id: 'business_operator', title: 'The Business Operator', description: 'Needs clean systems and financial clarity.', icon: '◉' },
  ],
  legal_professional_services: [
    { id: 'compliance_focused_client', title: 'The Compliance-Focused Client', description: 'Needs guidance to stay protected and compliant.', icon: '◉' },
    { id: 'high_stakes_decider', title: 'The High-Stakes Decider', description: 'Needs confidence during critical decisions.', icon: '◇' },
    { id: 'startup_builder', title: 'The Startup Builder', description: 'Needs fast, practical support to launch.', icon: '↗' },
    { id: 'ongoing_advisory_client', title: 'The Ongoing Advisory Client', description: 'Values long-term strategic counsel.', icon: '◎' },
  ],
  consulting_coaching: [
    { id: 'clarity_seeker', title: 'The Clarity Seeker', description: 'Needs focus, direction, and a clear plan.', icon: '◎' },
    { id: 'growth_committed_leader', title: 'The Growth-Committed Leader', description: 'Invests in better results and accountability.', icon: '↗' },
    { id: 'stuck_operator', title: 'The Stuck Operator', description: 'Needs momentum and decisive next steps.', icon: '◉' },
    { id: 'transformation_ready_client', title: 'The Transformation-Ready Client', description: 'Ready to make meaningful business changes.', icon: '◇' },
  ],
  construction_trades: [
    { id: 'project_timeline_owner', title: 'The Project-Timeline Owner', description: 'Needs dependable scheduling and communication.', icon: '↗' },
    { id: 'budget_control_client', title: 'The Budget-Control Client', description: 'Wants transparent pricing and no surprises.', icon: '◎' },
    { id: 'quality_finish_client', title: 'The Quality-Finish Client', description: 'Prioritizes craft, durability, and clean work.', icon: '◇' },
    { id: 'property_improvement_planner', title: 'The Property-Improvement Planner', description: 'Invests in long-term home value.', icon: '◉' },
  ],
  automotive: [
    { id: 'preventive_maintenance_driver', title: 'The Preventive-Maintenance Driver', description: 'Keeps up with service to avoid bigger problems.', icon: '◉' },
    { id: 'urgent_repair_driver', title: 'The Urgent-Repair Driver', description: 'Needs fast and trustworthy repair support.', icon: '↗' },
    { id: 'family_safety_driver', title: 'The Family-Safety Driver', description: 'Prioritizes reliability and peace of mind.', icon: '◇' },
    { id: 'performance_enthusiast', title: 'The Performance Enthusiast', description: 'Wants specialized upgrades and expertise.', icon: '✦' },
  ],
  photography_media: [
    { id: 'milestone_client', title: 'The Milestone Client', description: 'Booking for weddings, launches, and life events.', icon: '◈' },
    { id: 'brand_content_team', title: 'The Brand Content Team', description: 'Needs consistent visuals for marketing channels.', icon: '◉' },
    { id: 'story_driven_founder', title: 'The Story-Driven Founder', description: 'Wants media that communicates mission clearly.', icon: '◇' },
    { id: 'social_growth_creator', title: 'The Social-Growth Creator', description: 'Needs high-performing short-form content.', icon: '↗' },
  ],
  pet_services: [
    { id: 'care_first_owner', title: 'The Care-First Owner', description: 'Prioritizes safety, trust, and compassion.', icon: '◇' },
    { id: 'busy_pet_parent', title: 'The Busy Pet Parent', description: 'Needs reliable recurring support.', icon: '↗' },
    { id: 'training_goal_owner', title: 'The Training-Goal Owner', description: 'Looking for behavior and obedience progress.', icon: '◉' },
    { id: 'premium_pet_parent', title: 'The Premium Pet Parent', description: 'Invests in premium services and experiences.', icon: '◎' },
  ],
  retail: [
    { id: 'deal_hunter', title: 'The Deal Hunter', description: 'Wants value and timely promotions.', icon: '◎' },
    { id: 'loyal_regular', title: 'The Loyal Regular', description: 'Returns for consistency and trust.', icon: '◉' },
    { id: 'gift_shopper', title: 'The Gift Shopper', description: 'Needs fast help choosing the right item.', icon: '◈' },
    { id: 'quality_seeker', title: 'The Quality Seeker', description: 'Prefers craftsmanship and product longevity.', icon: '◇' },
  ],
  nonprofit_community: [
    { id: 'mission_supporter', title: 'The Mission Supporter', description: 'Motivated by impact and purpose alignment.', icon: '◇' },
    { id: 'community_participant', title: 'The Community Participant', description: 'Wants connection, belonging, and involvement.', icon: '◎' },
    { id: 'volunteer_advocate', title: 'The Volunteer Advocate', description: 'Ready to give time and share your cause.', icon: '◉' },
    { id: 'impact_donor', title: 'The Impact Donor', description: 'Wants transparency and measurable outcomes.', icon: '↗' },
  ],
  other: genericArchetypes,
}

export const fallbackArchetypes = genericArchetypes
