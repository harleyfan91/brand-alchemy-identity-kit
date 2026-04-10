# Step 1 industry catalogs (reference)

**Purpose:** Scannable copy for every **industry-specific** Step 1 wheel set. Implemented in `apps/web/src/data/step1ControlledOptions.ts` and `packages/shared/src/step1ControlledOptions.ts` (keep them in sync).

**`other` industry:** still uses **`DEFAULT_CATALOG`** (generic phrases).

**Conventions (same as shipped catalogs):**

- **4 options** per axis, plus global **`Something else`** (not listed below).
- **`id`:** stable snake_case — do not rename after launch if outputs depend on them.
- **`label`:** short phrase for the sentence line.
- **`description`:** wheel hint / progressive helper (one line).

**All customized industries (13):**

| Key | UI label |
|-----|----------|
| `health_wellness` | Health and Wellness |
| `beauty_personal_care` | Beauty and Personal Care |
| `technology` | Technology |
| `real_estate` | Real Estate |
| `education` | Education |
| `finance` | Finance |
| `legal_professional_services` | Legal and Professional Services |
| `construction_trades` | Construction and Trades |
| `automotive` | Automotive |
| `photography_media` | Photography and Media |
| `pet_services` | Pet Services |
| `retail` | Retail |
| `nonprofit_community` | Nonprofit and Community |

---

## 1. `health_wellness`

### Offer

| id | label | description |
|----|-------|-------------|
| `clinical_care` | clinical care and treatment | Medical or licensed clinical services patients rely on. |
| `wellness_programs` | wellness and prevention programs | Structured plans for habits, screening, and staying well. |
| `coaching_therapy` | coaching or therapy support | Ongoing guidance for mental health, behavior, or recovery. |
| `holistic_services` | holistic and body-based services | Whole-person care such as acupuncture, bodywork, or integrative support. |

### Audience

| id | label | description |
|----|-------|-------------|
| `busy_professionals` | busy professionals | People juggling careers and health at the same time. |
| `families_children` | families and kids | Households making care decisions for themselves or children. |
| `older_adults` | older adults | Clients focused on mobility, chronic care, or aging well. |
| `performance_focused` | performance-focused clients | Athletes or people optimizing energy, sleep, or recovery. |

### Delivery

| id | label | description |
|----|-------|-------------|
| `in_person_visits` | in-person visits | Care delivered on-site at a clinic or office. |
| `telehealth` | telehealth and virtual care | Secure video or remote visits when appropriate. |
| `membership_programs` | membership or ongoing programs | A defined cadence of care over time. |
| `home_based_care` | home-based or mobile care | Providers come to the client when that is the model. |

### Before (transformation)

| id | label | description |
|----|-------|-------------|
| `symptoms_ignored` | symptoms brushed aside | They have been postponing care or downplaying warning signs. |
| `inconsistent_routine` | inconsistent with routines | Good intentions, but habits and follow-through drift. |
| `overwhelmed_system` | overwhelmed by the system | Insurance, referrals, or choices feel hard to navigate. |
| `stuck_same_cycle` | stuck in the same cycle | Temporary fixes, but no lasting change yet. |

### After (transformation)

| id | label | description |
|----|-------|-------------|
| `clear_plan` | on a clear care plan | They know what to do next and why it matters. |
| `more_energy` | more energy and stability | Day-to-day life feels more sustainable. |
| `confident_body` | confident in their body | Less fear, more trust in progress. |
| `supported_accountable` | supported and accountable | A relationship that keeps them on track. |

### Mechanism (transformation)

| id | label | description |
|----|-------|-------------|
| `evidence_based_care` | evidence-based care | Decisions grounded in clinical best practice. |
| `personalized_plan` | a personalized plan | Adjusted to their history, goals, and constraints. |
| `education_coaching` | education and coaching | They understand their health, not only follow orders. |
| `coordinated_support` | coordinated support | Fewer gaps between advice, habits, and follow-up. |

---

## 2. `beauty_personal_care`

### Offer

| id | label | description |
|----|-------|-------------|
| `hair_services` | haircuts, color, and styling | Cut, color, extensions, or ongoing hair care. |
| `skin_treatments` | skin and facial treatments | Facials, peels, brows, or esthetic skin services. |
| `nails_body` | nails and body care | Manicure, pedicure, waxing, or related services. |
| `retail_products` | retail and product lines | Products clients take home to maintain results. |

### Audience

| id | label | description |
|----|-------|-------------|
| `everyday_clients` | everyday maintenance clients | People who book regular upkeep appointments. |
| `event_prep` | event and special-occasion clients | Weddings, photos, or one-off “big day” prep. |
| `self_care_seekers` | self-care seekers | Clients who want the appointment to feel restorative. |
| `results_driven` | results-driven clients | People focused on a specific look, skin goal, or routine. |

### Delivery

| id | label | description |
|----|-------|-------------|
| `salon_studio` | in-salon or studio appointments | Standard booked chair or room time. |
| `mobile_service` | mobile or on-location service | You travel to the client when that is the offer. |
| `membership_packages` | memberships or packages | Bundled visits or standing appointments. |
| `consult_retail` | consultations plus home care | Service plus guidance on what to use between visits. |

### Before (transformation)

| id | label | description |
|----|-------|-------------|
| `dont_know_trust` | unsure what will work | Trial and error with products or providers. |
| `inconsistent_look` | inconsistent look or skin | Results fade between visits or routines fall off. |
| `no_time_self` | no time for themselves | Self-care keeps getting bumped. |
| `special_occasion_stress` | stressed for a big event | They want to look right and feel confident in photos. |

### After (transformation)

| id | label | description |
|----|-------|-------------|
| `confident_look` | confident in how they look | They trust the outcome for their everyday or event. |
| `healthy_routine` | a routine they can keep | Habits and products that fit real life. |
| `polished_put_together` | polished and put together | Hair, skin, or nails that feel intentional. |
| `relaxed_after_visit` | relaxed after the visit | The experience itself delivers care, not only the result. |

### Mechanism (transformation)

| id | label | description |
|----|-------|-------------|
| `skilled_technique` | skilled technique and taste | Craft and judgment in the chair or room. |
| `personal_consultation` | a personal consultation | You match service and products to their goals. |
| `quality_products` | quality products and education | Professional-grade tools they understand how to use. |
| `consistent_visits` | consistent visits over time | Maintenance that compounds instead of one-off fixes. |

---

## 3. `technology`

### Offer

| id | label | description |
|----|-------|-------------|
| `custom_software` | custom software or apps | Build or extend products for specific workflows. |
| `it_managed_services` | IT and managed services | Ongoing operations, support, and reliability. |
| `implementation_integrations` | implementation and integrations | Rolling out tools and connecting systems. |
| `advisory_security` | advisory and security services | Strategy, audits, architecture, or risk reduction. |

### Audience

| id | label | description |
|----|-------|-------------|
| `smb_operators` | small and mid-size businesses | Teams without a full in-house tech department. |
| `startups` | startups and product teams | Speed, iteration, and early-stage tradeoffs. |
| `enterprise_teams` | enterprise and internal teams | Larger orgs needing alignment and delivery discipline. |
| `non_technical_leaders` | non-technical leaders | Owners or execs who need clarity, not jargon. |

### Delivery

| id | label | description |
|----|-------|-------------|
| `project_engagements` | project-based engagements | Scoped delivery with milestones and handoff. |
| `retainer_support` | retainer and ongoing support | A steady partner for changes and incidents. |
| `workshops_training` | workshops and training | Upskilling teams on tools or practices. |
| `fractional_leadership` | fractional or embedded leadership | Part-time CTO, lead, or architect-style support. |

### Before (transformation)

| id | label | description |
|----|-------|-------------|
| `tech_debt` | buried in tech debt | Shortcuts and legacy slowing everything down. |
| `downtime_risk` | worried about downtime or breaches | Reliability and security feel fragile. |
| `tool_sprawl` | tool sprawl and poor integration | Too many systems that do not talk to each other. |
| `slow_delivery` | slow or unpredictable delivery | Roadmaps slip; quality is inconsistent. |

### After (transformation)

| id | label | description |
|----|-------|-------------|
| `stable_platform` | a stable, modern platform | Systems they can build on without fear. |
| `faster_shipping` | shipping faster with confidence | Predictable releases and clearer ownership. |
| `aligned_stack` | an aligned stack and workflow | Fewer handoffs and fewer surprises. |
| `measurable_security` | measurable security and compliance posture | Risk is understood and improving. |

### Mechanism (transformation)

| id | label | description |
|----|-------|-------------|
| `architecture_standards` | architecture and engineering standards | Clear patterns, reviews, and guardrails. |
| `automation_monitoring` | automation and monitoring | Less manual toil, earlier detection of issues. |
| `delivery_practices` | modern delivery practices | CI/CD, testing, and collaboration habits that stick. |
| `vendor_neutral_advice` | vendor-neutral advice | Recommendations tied to outcomes, not logos. |

---

## 4. `real_estate`

### Offer

| id | label | description |
|----|-------|-------------|
| `buying_selling` | buying and selling homes | Representation for clients transacting residential property. |
| `leasing_rentals` | leasing and rentals | Helping tenants and landlords with rental deals. |
| `commercial` | commercial real estate | Office, retail, or investment property support. |
| `relocation` | relocation and move planning | End-to-end help for people changing markets. |

### Audience

| id | label | description |
|----|-------|-------------|
| `first_time_buyers` | first-time buyers | People new to financing, offers, and inspections. |
| `move_up_families` | move-up families | Selling and buying with timing and logistics pressure. |
| `investors` | investors | Buyers focused on numbers, tenants, and risk. |
| `relocating_professionals` | relocating professionals | Limited time to learn a new market from scratch. |

### Delivery

| id | label | description |
|----|-------|-------------|
| `full_service_representation` | full-service representation | End-to-end guidance through contract and close. |
| `listing_marketing` | listing marketing and staging coordination | Presentation and exposure for sellers. |
| `market_guidance` | market guidance and tours | Education-first help before they commit. |
| `network_referrals` | referrals through your network | Lenders, inspectors, and pros you trust. |

### Before (transformation)

| id | label | description |
|----|-------|-------------|
| `market_confusion` | confused by the market | Too much noise online; hard to know what is real. |
| `timing_pressure` | stressed about timing and money | Deadlines, rates, and competing priorities. |
| `bad_past_deal` | burned by a past experience | Skeptical after a rough transaction or agent. |
| `analysis_paralysis` | stuck in analysis paralysis | They cannot pick a lane on price or neighborhood. |

### After (transformation)

| id | label | description |
|----|-------|-------------|
| `clear_offer_strategy` | clear on offer strategy | They understand tradeoffs and next steps. |
| `smooth_close` | a smoother path to closing | Fewer surprises; better coordination. |
| `confident_decision` | confident in the decision | The choice fits their goals and risk tolerance. |
| `strong_listing` | a stronger listing position | Sellers show well and attract the right buyers. |

### Mechanism (transformation)

| id | label | description |
|----|-------|-------------|
| `local_expertise` | deep local expertise | Nuance on neighborhoods, pricing, and norms. |
| `negotiation_advocacy` | negotiation and advocacy | Representation that protects their interests. |
| `process_clarity` | process clarity from day one | Expectations, documents, and milestones explained. |
| `trusted_partners` | trusted partners when needed | The right specialists at the right time. |

---

## 5. `education`

### Offer

| id | label | description |
|----|-------|-------------|
| `tutoring_academic` | tutoring and academic support | Subject or test help for students. |
| `courses_programs` | courses and structured programs | Cohort or sequential learning with a curriculum. |
| `workshops_trainings` | workshops and corporate trainings | Short-form learning for teams or professionals. |
| `coaching_mentoring` | coaching and mentoring | One-on-one guidance for skills or transitions. |

### Audience

| id | label | description |
|----|-------|-------------|
| `k12_families` | K–12 students and families | Parents coordinating support for school success. |
| `college_adults` | college students and adult learners | Undergrads, career changers, or returning students. |
| `organizations` | schools and organizations | Leaders improving outcomes at scale. |
| `professionals_certs` | professionals pursuing credentials | Certification, licensing, or upskilling paths. |

### Delivery

| id | label | description |
|----|-------|-------------|
| `in_person_sessions` | in-person sessions | Face-to-face teaching or facilitation. |
| `live_online` | live online sessions | Scheduled virtual classes or tutoring. |
| `async_content` | self-paced online content | Recorded lessons with optional check-ins. |
| `hybrid_blend` | hybrid blended programs | Mix of sync, async, and office hours. |

### Before (transformation)

| id | label | description |
|----|-------|-------------|
| `behind_confused` | behind or confused | Gaps in fundamentals or unclear expectations. |
| `test_anxiety` | anxious about tests or performance | Stress gets in the way of showing what they know. |
| `no_structure` | no structure or accountability | Good intent but inconsistent study habits. |
| `misaligned_training` | training misaligned to real work | Content feels theoretical or out of date. |

### After (transformation)

| id | label | description |
|----|-------|-------------|
| `solid_understanding` | solid understanding | Concepts click; they can apply them. |
| `better_scores` | better scores or measurable progress | Results they can point to. |
| `confident_skills` | confident applying skills | Transfer to school, work, or exams. |
| `sustainable_habits` | sustainable study or practice habits | A system that survives busy weeks. |

### Mechanism (transformation)

| id | label | description |
|----|-------|-------------|
| `diagnostic_teaching` | diagnostic teaching | You find gaps before piling on new material. |
| `practice_feedback` | practice and feedback loops | Repetition with correction, not only lectures. |
| `curriculum_design` | clear curriculum design | Sequencing, pacing, and outcomes are explicit. |
| `motivation_support` | motivation and study skills | Building confidence and routines, not only content. |

---

## 6. `finance`

### Offer

| id | label | description |
|----|-------|-------------|
| `financial_planning` | financial planning | Holistic advice across goals, cash flow, and risk. |
| `tax_prep_strategy` | tax preparation and strategy | Compliance plus smarter year-round decisions. |
| `bookkeeping_cfo` | bookkeeping and fractional CFO | Clean books and forward-looking financial clarity. |
| `investment_advisory` | investment advisory | Portfolio guidance aligned to goals and risk tolerance. |

### Audience

| id | label | description |
|----|-------|-------------|
| `households` | households and families | Budgeting, saving, and major life transitions. |
| `small_business_owners` | small business owners | Separating personal and business finances. |
| `pre_retirement` | people approaching retirement | Timing, income, and risk shifts. |
| `high_complexity` | clients with complex situations | Equity comp, multiple entities, or cross-border needs. |

### Delivery

| id | label | description |
|----|-------|-------------|
| `ongoing_relationship` | ongoing advisory relationship | Regular meetings and plan updates. |
| `project_based` | project-based engagements | One-time plans or clean-up projects. |
| `virtual_meetings` | virtual meetings and shared dashboards | Remote-first collaboration with clear documents. |
| `full_service_firm` | full-service firm coordination | Coordination with legal, tax, and investment partners. |

### Before (transformation)

| id | label | description |
|----|-------|-------------|
| `unclear_numbers` | unclear where money goes | Cash flow feels opaque or stressful. |
| `tax_surprises` | tax surprises or missed opportunities | Reactive instead of strategic. |
| `investment_anxiety` | anxious about investments | Unsure about risk, fees, or whether they are on track. |
| `business_blur` | personal and business finances blurred | Messy books and unclear owner pay. |

### After (transformation)

| id | label | description |
|----|-------|-------------|
| `clear_plan_numbers` | a clear plan with real numbers | Goals tied to cash flow and timelines. |
| `tax_confidence` | more tax confidence year-round | Fewer surprises; better decisions. |
| `aligned_investments` | investments aligned to goals | A portfolio story they understand. |
| `clean_books` | clean books and useful reports | Decisions based on data, not guesses. |

### Mechanism (transformation)

| id | label | description |
|----|-------|-------------|
| `fiduciary_standard` | fiduciary or transparent standards | Advice with clear obligations and fees. |
| `scenario_modeling` | scenario modeling and tradeoffs | Showing choices, not only recommendations. |
| `process_discipline` | process and review cadence | Check-ins that keep the plan alive. |
| `education_first` | education-first explanations | Jargon translated into decisions. |

---

## 7. `legal_professional_services`

### Offer

| id | label | description |
|----|-------|-------------|
| `transactional_legal` | contracts and transactional work | Drafting, review, and closing support. |
| `dispute_litigation` | disputes and litigation | Representation when conflict escalates. |
| `compliance_counsel` | compliance and regulatory counsel | Policies, filings, and risk management. |
| `outside_general` | outside general counsel | Ongoing strategic legal partnership for operators. |

### Audience

| id | label | description |
|----|-------|-------------|
| `small_mid_business` | small and mid-size businesses | Owners who need practical, business-first advice. |
| `startups_founders` | startups and founders | Formation, fundraising, and early contracts. |
| `individuals_estates` | individuals and families | Estates, property, or personal legal needs. |
| `regulated_industries` | regulated industry clients | Extra scrutiny on compliance and documentation. |

### Delivery

| id | label | description |
|----|-------|-------------|
| `project_scoped` | project-scoped engagements | Clear scope, timeline, and deliverables. |
| `retainer_arrangements` | retainer arrangements | Predictable access for recurring questions. |
| `collaborative_firms` | collaboration with other firms | Coordinating with finance, HR, or specialty counsel. |
| `urgent_response` | urgent response when it matters | Clear protocol for time-sensitive issues. |

### Before (transformation)

| id | label | description |
|----|-------|-------------|
| `legal_risk_unknown` | legal risk feels unknown | They are not sure what could go wrong. |
| `contract_weakness` | weak contracts or handshakes | Agreements that will not hold up under stress. |
| `dispute_brewing` | a dispute brewing | Tension with a partner, vendor, or regulator. |
| `compliance_backlog` | compliance backlog | Policies and filings falling behind. |

### After (transformation)

| id | label | description |
|----|-------|-------------|
| `risk_clarity` | clarity on real risk | They understand exposure and priorities. |
| `strong_agreements` | stronger agreements in place | Documents that match how they actually operate. |
| `defensible_position` | a defensible position | If challenged, they are prepared. |
| `compliance_current` | compliance brought current | A credible story to regulators, boards, or investors. |

### Mechanism (transformation)

| id | label | description |
|----|-------|-------------|
| `practical_counsel` | practical business counsel | Advice that fits speed and budget realities. |
| `clear_documentation` | clear documentation and process | Paper trails that match decisions. |
| `negotiation_strategy` | negotiation and escalation strategy | Measured moves before burning relationships. |
| `specialist_network` | specialist network when needed | The right expert for the issue, not a generic answer. |

---

## 8. `construction_trades`

### Offer

| id | label | description |
|----|-------|-------------|
| `residential_projects` | residential construction and remodels | Homes, additions, and major renovations done right. |
| `commercial_builds` | commercial construction | Build-outs, tenant improvements, and small commercial work. |
| `specialty_trades` | specialty trade work | Focused trades such as electrical, HVAC, roofing, or concrete. |
| `repair_restore` | repair and restoration | Fixing damage, wear, or bringing older structures back. |

### Audience

| id | label | description |
|----|-------|-------------|
| `homeowners_build` | homeowners | People investing in their property for the long term. |
| `property_investors` | property investors | Owners optimizing rentals or flips on a timeline. |
| `business_owners_facilities` | business owners | Operators who need facilities that work for customers and staff. |
| `general_contractors` | general contractors and builders | Partners who need reliable crews and clear scopes. |

### Delivery

| id | label | description |
|----|-------|-------------|
| `on_site_crews` | on-site crews and project management | Coordinated labor with a single accountable lead. |
| `phased_projects` | phased projects and milestones | Work sequenced so sites stay livable or operational. |
| `maintenance_service` | ongoing maintenance contracts | Preventive care after the main job is done. |
| `design_build` | design-build partnerships | From plans through punch list with fewer handoffs. |

### Before (transformation)

| id | label | description |
|----|-------|-------------|
| `unsafe_or_stalled` | unsafe work or stalled projects | Jobs half-done or corners cut in ways that worry them. |
| `timeline_budget` | bleeding time and money | Slips, change orders, and surprises stacking up. |
| `wrong_fit_contractor` | a bad fit with a past contractor | Communication broke down or quality did not match the bid. |
| `code_permit_stress` | code and permit stress | Uncertainty about inspections, permits, and liability. |

### After (transformation)

| id | label | description |
|----|-------|-------------|
| `built_to_last` | built to last | Work they can trust when weather and use hit it. |
| `on_time_budget` | on time and within a clear plan | Expectations and change orders they understand. |
| `permit_ready` | permit-ready and inspection-clean | Paperwork and workmanship that stand up to review. |
| `property_confidence` | more confident in the property | Value, safety, and day-to-day function improved. |

### Mechanism (transformation)

| id | label | description |
|----|-------|-------------|
| `skilled_tradespeople` | skilled tradespeople and supervision | Craft and oversight on the job, not only a low bid. |
| `clear_scopes` | clear scopes and change processes | They know what is included before work starts. |
| `project_coordination` | project coordination and communication | Fewer gaps between trades and decisions. |
| `quality_materials` | quality materials and code-aware work | Built for real conditions and local requirements. |

---

## 9. `automotive`

### Offer

| id | label | description |
|----|-------|-------------|
| `repair_diagnostics` | repair and diagnostics | Finding and fixing what is wrong under the hood. |
| `maintenance_plans` | preventive maintenance | Oil, brakes, tires, and schedules that prevent surprises. |
| `body_collision` | body and collision work | Cosmetic and structural repair after damage. |
| `detailing_upgrades` | detailing and upgrades | Protection, appearance, and customization work. |

### Audience

| id | label | description |
|----|-------|-------------|
| `daily_drivers` | daily drivers | People who depend on one vehicle for work and family. |
| `fleet_small_business` | small-business fleets | Vans and trucks that cannot stay down long. |
| `enthusiasts` | enthusiasts and specialty vehicles | Owners who care about performance or collectibility. |
| `families_safety` | families prioritizing safety | Parents who want reliability and clear explanations. |

### Delivery

| id | label | description |
|----|-------|-------------|
| `shop_service` | in-shop service | Drop-off work with lifts, tools, and bays. |
| `mobile_mechanic` | mobile or on-site service | Help where the vehicle sits when that is the model. |
| `same_day_priority` | same-day and priority service | Fast turnaround when timing matters. |
| `scheduled_maintenance` | scheduled maintenance programs | Standing appointments that keep cars ahead of failure. |

### Before (transformation)

| id | label | description |
|----|-------|-------------|
| `breakdown_stress` | stressed by a breakdown | Stranded, late, or unsure what failed. |
| `dealer_trust` | unsure who to trust | Past upsells or vague diagnoses left them skeptical. |
| `mystery_issues` | mystery noises or warnings | Lights and sounds they cannot interpret. |
| `transport_disruption` | life disrupted without wheels | Work and family plans hinge on the car. |

### After (transformation)

| id | label | description |
|----|-------|-------------|
| `reliable_again` | confident the vehicle is reliable | They trust it for commutes and trips. |
| `fair_transparent` | fair price and transparent work | They understand what was done and why. |
| `back_on_road` | back on the road quickly | Minimal downtime with clear timing. |
| `looks_right` | looks and feels right again | Body and interior match how they use the car. |

### Mechanism (transformation)

| id | label | description |
|----|-------|-------------|
| `certified_techs` | certified technicians | Training and tooling matched to modern vehicles. |
| `diagnostic_tools` | modern diagnostics | Data-driven troubleshooting instead of guessing. |
| `transparent_estimates` | transparent estimates | Approval before work; no surprise line items. |
| `quality_parts` | quality parts and fluids | Components that match how long they keep the car. |

---

## 10. `photography_media`

### Offer

| id | label | description |
|----|-------|-------------|
| `photo_sessions` | photography sessions | Portraits, lifestyle, product, or brand stills. |
| `video_production` | video production | Filming and editing for promos, social, or events. |
| `event_coverage` | event coverage | Weddings, corporate, and live moments captured well. |
| `brand_content` | ongoing brand content | A steady stream of visuals for marketing channels. |

### Audience

| id | label | description |
|----|-------|-------------|
| `couples_families` | couples and families | Life milestones and memories worth printing. |
| `business_brands` | businesses and brands | Teams that need visuals that match positioning. |
| `creators_public_figures` | creators and public-facing pros | People who live in content and need a partner. |
| `event_planners` | event planners and venues | Partners who need dependable coverage under pressure. |

### Delivery

| id | label | description |
|----|-------|-------------|
| `on_location_shoots` | on-location shoots | You meet clients where the story happens. |
| `studio_sessions` | studio sessions | Controlled lighting and sets for products or portraits. |
| `editing_packages` | editing and delivery packages | Clear counts, turnaround, and file formats. |
| `content_retainers` | content retainers | Recurring shoots or edits for active channels. |

### Before (transformation)

| id | label | description |
|----|-------|-------------|
| `generic_visuals` | stuck with generic visuals | Stock or phone shots that do not elevate the brand. |
| `inconsistent_brand` | inconsistent look across channels | Nothing feels like one coherent story. |
| `event_worry` | worried about missing the moment | They need a pro who will not flake on the day. |
| `content_backlog` | a growing content backlog | Ideas without execution or edit capacity. |

### After (transformation)

| id | label | description |
|----|-------|-------------|
| `standout_visuals` | standout photos and footage | Work they are proud to publish and print. |
| `cohesive_brand_look` | a cohesive brand look | Recognition and quality across touchpoints. |
| `memories_preserved` | moments preserved with care | Events and people captured the way they felt. |
| `publish_ready` | publish-ready assets | Files sized and styled for where they go live. |

### Mechanism (transformation)

| id | label | description |
|----|-------|-------------|
| `creative_direction` | creative direction and planning | Shot lists and mood that match goals, not only gear. |
| `pro_workflow` | professional gear and workflow | Reliable capture, backup, and color. |
| `consistent_editing` | consistent editing style | A signature look or brand guidelines applied well. |
| `reliable_turnaround` | reliable turnaround | Deadlines they can plan launches around. |

---

## 11. `pet_services`

### Offer

| id | label | description |
|----|-------|-------------|
| `grooming_spa` | grooming and spa services | Cuts, baths, nails, and coat care. |
| `training_behavior` | training and behavior help | Teaching skills and reducing problem behaviors. |
| `daycare_boarding` | daycare and boarding | Safe social time or overnight care. |
| `retail_pet_products` | pet products and nutrition | Food, gear, and wellness items curated for pets. |

### Audience

| id | label | description |
|----|-------|-------------|
| `new_pet_parents` | new pet parents | First-time owners learning routines and boundaries. |
| `busy_households` | busy households | People who need dependable care when travel or work wins. |
| `multi_pet_homes` | multi-pet homes | Managing different needs and personalities under one roof. |
| `breed_specific` | breed- or age-specific needs | Coats, energy, or seniors that need extra patience. |

### Delivery

| id | label | description |
|----|-------|-------------|
| `salon_appointments` | salon or facility appointments | Booked visits in a controlled environment. |
| `mobile_grooming` | mobile or at-home visits | Less stress for pets who hate travel. |
| `group_classes` | group classes and playgroups | Social learning in supervised settings. |
| `subscription_pickup` | subscriptions and pickup | Recurring food or supplies on a rhythm. |

### Before (transformation)

| id | label | description |
|----|-------|-------------|
| `behavior_frustration` | frustrated by behavior | Barking, pulling, or anxiety wearing them down. |
| `grooming_stress` | grooming stress for pet or owner | Mats, nails, or fear of the process. |
| `travel_guilt` | guilt about time away | They worry the pet is lonely or bored. |
| `nutrition_overwhelm` | overwhelmed by food choices | Too many brands and opinions online. |

### After (transformation)

| id | label | description |
|----|-------|-------------|
| `happier_pet` | a happier, healthier pet | Energy, coat, and mood noticeably better. |
| `confident_handling` | confident handling routines | They know what works day to day. |
| `trusted_care_circle` | a trusted care circle | Groomer, trainer, or sitter they rely on. |
| `calm_consistent` | calmer, more consistent behavior | Skills and boundaries that stick. |

### Mechanism (transformation)

| id | label | description |
|----|-------|-------------|
| `positive_methods` | positive, humane methods | Training and handling that build trust. |
| `experienced_handlers` | experienced handlers | People who read pet body language well. |
| `personalized_plans` | personalized care plans | Coat, diet, and exercise matched to the animal. |
| `clear_client_education` | clear client education | They leave knowing what to do between visits. |

---

## 12. `retail`

### Offer

| id | label | description |
|----|-------|-------------|
| `handmade_maker_goods` | handmade and maker goods | Crafts, studio-made pieces, or small-batch goods with a clear maker behind them. |
| `curated_merchandise` | curated merchandise | A tight selection of brands and makers instead of endless aisles. |
| `apparel_accessories` | apparel and accessories | Fit, materials, and style shoppers can judge with confidence. |
| `wholesale_stockist_lines` | wholesale and stockist lines | Niche SKUs, MOQs, and reorders for shops, salons, studios, or pros. |

### Audience

| id | label | description |
|----|-------|-------------|
| `local_regulars` | local regulars | Neighbors who treat your shop, stall, or pickup spot as part of their routine. |
| `marketplace_dtc_buyers` | marketplace and DTC buyers | People who find you on Etsy, an Amazon storefront, social, or your own site. |
| `gift_buyers` | gift and occasion buyers | Shoppers hunting for something memorable, personal, or well wrapped. |
| `wholesale_account_buyers` | wholesale and account buyers | Stockists and small businesses buying for resale or regular professional use. |

### Delivery

| id | label | description |
|----|-------|-------------|
| `in_store_retail` | in-store, markets, and pop-ups | Try-on, pickup, or discovery where you meet people in person. |
| `ship_nationwide` | shipping and careful fulfillment | Parcels, tracking, and packaging that respect fragile or handmade work. |
| `buy_online_pickup` | buy online, pickup locally | Speed and certainty for nearby customers who still want a human handoff. |
| `made_to_order_platform_orders` | made-to-order, batches, and platform checkout | Lead times, drops, preorders, or checkout through your site and marketplaces. |

### Before (transformation)

| id | label | description |
|----|-------|-------------|
| `choice_fatigue` | tired of overwhelming choice | Big-box fatigue or endless scrolling without a brand they trust yet. |
| `fit_quality_risk` | worried about fit, materials, or true quality | Sizing, fiber, finish, or weight that might not match what they imagined. |
| `listing_trust_gap` | unsure listings tell the whole story | Photos and reviews that still leave them guessing about what arrives. |
| `lead_time_stock_chaos` | lead times, sellouts, or shipping surprises | Preorders, batches, or inventory that do not line up with what was promised. |

### After (transformation)

| id | label | description |
|----|-------|-------------|
| `found_the_thing` | found the right thing | A purchase that fits need, taste, and budget without compromise. |
| `enjoyable_visit` | an enjoyable visit or unboxing | The handoff or package matches the care in how it was made. |
| `confident_purchase` | confident in the purchase | They know materials, sizing, and timing before they commit. |
| `feel_valued` | feel valued as a customer | Recognition and service that earn repeat orders and word of mouth. |

### Mechanism (transformation)

| id | label | description |
|----|-------|-------------|
| `staff_who_listen` | responsive, personal service | Real answers before and after the sale—not scripts or ghosting. |
| `honest_listings_merchandising` | honest listings and merchandising | Specs, shots, and displays that match what ships or sits on the shelf. |
| `fair_policies` | fair policies and resolutions | Clear paths when fit, damage, or timing misses the mark. |
| `maker_story_consistency` | maker story and consistent batches | Provenance, small-batch rhythm, and repeatable quality they can count on. |

---

## 13. `nonprofit_community`

### Offer

| id | label | description |
|----|-------|-------------|
| `direct_services` | direct services to people in need | Food, shelter, health, or crisis support. |
| `advocacy_programs` | advocacy and systems change | Campaigns and organizing that shift policy or norms. |
| `education_training` | education and workforce training | Skills, literacy, and pathways to stability. |
| `capacity_building` | capacity-building for partners | Helping other orgs and coalitions work better together. |

### Audience

| id | label | description |
|----|-------|-------------|
| `community_members` | community members served | Residents who rely on programs and trust. |
| `donors_volunteers` | donors and volunteers | People giving time and money who need clarity. |
| `partner_orgs` | partner organizations | Agencies, schools, and funders coordinating impact. |
| `local_leaders` | local leaders and coalitions | People who convene others around a cause. |

### Delivery

| id | label | description |
|----|-------|-------------|
| `in_person_programs` | in-person programs and sites | Neighborhood centers, events, and door-to-door. |
| `virtual_programs` | virtual programs and hotlines | Remote access when geography or safety matters. |
| `mobile_outreach` | mobile outreach | Meeting people where they are with vans, pop-ups, or tours. |
| `peer_networks` | peer networks and cohorts | Support built on shared experience and mutual aid. |

### Before (transformation)

| id | label | description |
|----|-------|-------------|
| `under_resourced` | under-resourced and stretched thin | Demand exceeds staff, money, or space. |
| `fragmented_efforts` | fragmented efforts across groups | Duplication and gaps instead of shared strategy. |
| `volunteer_burnout` | volunteer and staff burnout | Passion without sustainable structure. |
| `visibility_gap` | visibility and storytelling gap | Impact is real but hard for outsiders to see. |

### After (transformation)

| id | label | description |
|----|-------|-------------|
| `measurable_impact` | measurable, trusted impact | Outcomes and stories funders and neighbors believe. |
| `stronger_coalition` | a stronger coalition | Partners aligned on goals and roles. |
| `sustained_programs` | sustained programs over time | Funding and operations that outlast one grant cycle. |
| `trusted_voice` | a trusted voice in the community | Go-to credibility when crises or opportunities hit. |

### Mechanism (transformation)

| id | label | description |
|----|-------|-------------|
| `community_led` | community-led design | Programs shaped by the people they serve. |
| `evidence_programs` | evidence-informed programs | Practices tied to outcomes, not only good intentions. |
| `volunteer_training` | volunteer training and support | Roles, boundaries, and care for people giving time. |
| `partnership_building` | partnership building | Shared funding, data, and advocacy across sectors. |

---

## Feedback checklist

- [ ] Any **label** too long for the sentence line?
- [ ] Any **description** too long for wheel hints?
- [ ] **Cross-axis fit:** offer + audience + delivery read as one story; before / after / mechanism match transformation tone.
- [ ] **ID stability:** comfortable committing to these `id` values for v1?

---

## Implementation status

All **13** industry blocks above are in `INDUSTRY_CATALOGS` in both `apps/web/src/data/step1ControlledOptions.ts` and `packages/shared/src/step1ControlledOptions.ts`. Edit both when changing copy.
