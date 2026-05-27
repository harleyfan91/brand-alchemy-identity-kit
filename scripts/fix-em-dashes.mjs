/**
 * Fix em-dash violations in CTA_PHRASE_BANKS.md.
 *
 * CTA_COPY_RULES §em-dash: em dashes are banned in paste-ready tuple lines.
 * Period replaces the em dash in almost all cases (rules §em-dash examples).
 * Double-em-dash infix patterns use commas (structural parenthetical rhythm preserved).
 *
 * Run: node scripts/fix-em-dashes.mjs
 * Then: node scripts/gen-cta-phrase-banks.mjs
 * Then: npm run test:generation -- ctaPhraseBankPolicy
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const bankPath = path.join(__dirname, '../packages/generation/dev/cta-phrase-banks/CTA_PHRASE_BANKS.md')

// Explicit replacement map — each key is the exact string in the bank (before fix).
// Values are the post-fix strings. All follow CTA_COPY_RULES §em-dash policy.
//
// Single em dash: replace ` — ` with `. ` + capitalize next word.
// Double em dash (infix parenthetical): replace both ` — ` with `, `.
// Edge case "and" continuation: comma retained ("fits, and we'd..." reads better than "fits. And").
// Note "Before-and-afters" in line2 is a hyphenated noun, not an em-dash structure — left alone.
const REPLACEMENTS = [
  // trades_home WEBSITE direct_sales bold
  ["Text or call — we'll have a quote to you today.", "Text or call. We'll have a quote to you today."],
  // trades_home WEBSITE direct_sales friendly local_team
  ["Our team has a range of specialties — we match the trade to the work.", "Our team has a range of specialties. We match the trade to the work."],
  // retail_maker WEBSITE direct_sales friendly
  ["Small batches — when they're gone, that's usually it.", "Small batches. When they're gone, that's usually it."],
  // retail_maker WEBSITE direct_sales professional
  ["Wholesale and trade inquiries available — see our contact page.", "Wholesale and trade inquiries available. See our contact page."],
  // retail_maker WEBSITE direct_sales bold product_led
  ["Handcrafted in small batches. Order now — limited run.", "Handcrafted in small batches. Order now. Limited run."],
  // retail_maker WEBSITE direct_sales friendly product_led
  ["Our products are made in small batches — when they're gone, they're gone.", "Our products are made in small batches. When they're gone, they're gone."],
  // creative_pro WEBSITE direct_sales friendly solo_expert
  ["No formal process — just tell me about the project.", "No formal process. Just tell me about the project."],
  ["I work with a small number of clients at a time. Get in touch early — spots go fast.", "I work with a small number of clients at a time. Get in touch early. Spots go fast."],
  // regulated_services WEBSITE direct_sales bold solo_expert
  ["I practice independently. You'll deal with me directly — no hand-offs.", "I practice independently. You'll deal with me directly. No hand-offs."],
  // community WEBSITE direct_sales bold
  ["Volunteer or donate — we'll find the right fit.", "Volunteer or donate. We'll find the right fit."],
  // trades_home WEBSITE lead_gen bold
  ["Phone, form, or photo — we work with all three.", "Phone, form, or photo. We work with all three."],
  // trades_home WEBSITE lead_gen friendly local_team
  ["Our team has a range of specializations — we'll find the right match.", "Our team has a range of specializations. We'll find the right match."],
  // food_hospitality WEBSITE lead_gen bold
  ["Catering or private dining — tell us what you're planning.", "Catering or private dining. Tell us what you're planning."],
  ["Big group or intimate dinner — we're comfortable with both.", "Big group or intimate dinner. We're comfortable with both."],
  ["Corporate lunch or weekend celebration — we've done them all.", "Corporate lunch or weekend celebration. We've done them all."],
  // food_hospitality WEBSITE lead_gen friendly solo_maker
  ["Private dinners, pop-ups, small events — I handle everything personally.", "Private dinners, pop-ups, small events. I handle everything personally."],
  // retail_maker WEBSITE lead_gen friendly
  ["Custom commissions are welcome — we say yes more often than you'd think.", "Custom commissions are welcome. We say yes more often than you'd think."],
  // creative_pro WEBSITE lead_gen friendly
  ["No formal brief required — just tell us what you're trying to do.", "No formal brief required. Just tell us what you're trying to do."],
  // creative_pro WEBSITE lead_gen friendly solo_expert
  ["I take a small number of new projects at a time. Send me a note — I reply fast.", "I take a small number of new projects at a time. Send me a note. I reply fast."],
  // community WEBSITE lead_gen (volunteer)
  ["Volunteer, donate, advocate — we'll figure out the best fit together.", "Volunteer, donate, or advocate. We'll figure out the best fit together."],
  ["No prior experience required — just a willingness to show up.", "No prior experience required. Just a willingness to show up."],
  // trades_home social_casual audience_growth (project photo posts)
  ["Follow for real project photos — posted as jobs wrap up, not on a schedule.", "Follow for real project photos. Posted as jobs wrap up, not on a schedule."],
  // retail_maker social_casual audience_growth (process posts)
  // Double em dash — parenthetical: use commas
  ["We post the full process — raw material to finished piece — before every drop.", "We post the full process, from raw material to finished piece, before every drop."],
  // health_wellness WEBSITE audience_growth
  ["Follow for honest, practical guidance — not just inspiration.", "Follow for honest, practical guidance. Not just inspiration."],
  // community WEBSITE audience_growth
  ["Real updates from the ground — not press releases.", "Real updates from the ground. Not press releases."],
  // trades_home EMAIL direct_sales bold
  ["Just describe the job — I'll follow up if I have questions.", "Just describe the job. I'll follow up if I have questions."],
  // trades_home EMAIL direct_sales friendly local_team
  ["No obligation — just a good look at the job.", "No obligation. Just a good look at the job."],
  // food_hospitality EMAIL direct_sales bold
  ["Or just come in — we always try to make room.", "Or just come in. We always try to make room."],
  // food_hospitality EMAIL direct_sales friendly (A17 replacement pair)
  ["Dinner in or takeout — I'll handle the details.", "Dinner in or takeout. I'll handle the details."],
  // food_hospitality EMAIL direct_sales friendly (second pair)
  ["Dinner in or takeout — I'll set it up.", "Dinner in or takeout. I'll set it up."],
  // food_hospitality EMAIL direct_sales bold solo_maker
  ["Limited seats — once it's full, that's it.", "Limited seats. Once it's full, that's it."],
  // retail_maker EMAIL direct_sales bold
  ["Small batch — it won't last.", "Small batch. It won't last."],
  // health_wellness EMAIL lead_gen
  ["Morning, afternoon, and evening slots — tell me what works for you.", "Morning, afternoon, and evening slots. Tell me what works."],
  // creative_pro EMAIL lead_gen (two leaves, same string)
  ["Reply with the brief — even rough is fine.", "Reply with the brief. Even rough is fine."],
  ["No pitch deck required — just tell me about the project.", "No pitch deck required. Just tell me about the project."],
  // regulated_services EMAIL lead_gen
  ["I'm here to give you a real answer — not hand you off to someone else.", "I'm here to give you a real answer, not pass you off to someone else."],
  // community EMAIL lead_gen / direct_sales
  ["Volunteer, donate, or advocate — all of it matters.", "Volunteer, donate, or advocate. All of it matters."],
  ["There's a place for everyone here — I'll find yours.", "There's a place for everyone here. I'll find yours."],
  ["Volunteer, donate, or advocate — every kind of help matters.", "Volunteer, donate, or advocate. Every kind of help matters."],
  ["Volunteer, give, or show up — we'll find what makes sense.", "Volunteer, give, or show up. We'll find what makes sense."],
  ["There's something for everyone here — I'll help you find the right fit.", "There's something for everyone here. I'll help you find the right fit."],
  // Comma continuation — "fits, and we'd" reads better than "fits. And we'd"
  ["We'll find a role that fits — and we'd genuinely love to have you.", "We'll find a role that fits, and we'd genuinely love to have you."],
  // retail_maker EMAIL lead_gen
  ["Custom orders, bulk production, or wholesale — we handle all of it in our studio.", "Custom orders, bulk production, or wholesale. We handle all of it in our studio."],
  // food_hospitality EMAIL lead_gen bold
  ["Corporate or personal, big or small — reply with the details.", "Corporate or personal, big or small. Reply with the details."],
  // food_hospitality EMAIL lead_gen friendly solo_maker (double em dash — parenthetical)
  ["Tell me the details — even if it's still early — and I'll put some ideas together.", "Tell me the details, even if it's still early, and I'll put some ideas together."],
  // food_hospitality EMAIL lead_gen friendly
  ["Private dinner or catering — I'd love to hear what you have in mind.", "Private dinner or catering. I'd love to hear what you have in mind."],
  // health_wellness EMAIL lead_gen
  ["Free intro. Just a conversation — no sales pitch.", "Free intro. Just a conversation, no sales pitch."],
  // creative_pro EMAIL lead_gen (double em dash — parenthetical)
  ["Send the scope — even rough — and I'll reply with an honest assessment.", "Send the scope, even rough, and I'll reply with an honest assessment."],
  // creative_pro EMAIL lead_gen (two leaves, same string)
  ["Tell me about the project — even just a sentence or two.", "Tell me about the project, even just a sentence or two."],
  // regulated_services EMAIL lead_gen
  ["Reply with the basics — even if you don't know what to ask.", "Reply with the basics. Even if you don't know what to ask."],
  // trades_home EMAIL audience_growth
  ["Before-and-afters from a local job — the kind you'll recognize from around the neighborhood.", "Before-and-afters from a local job. The kind you'll recognize from around the neighborhood."],
  // food_hospitality EMAIL audience_growth
  ["We update more than most people realize — new dishes, seasonal notes, upcoming events.", "We update more than most people realize: new dishes, seasonal notes, upcoming events."],
  // retail_maker EMAIL audience_growth
  ["Small batch — being on the list is the best way to not miss it.", "Small batch. Being on the list is the best way to not miss it."],
  // health_wellness EMAIL audience_growth
  ["We write about what actually works — no supplements pitch, no productivity hacks.", "We write about what actually works. No supplements pitch, no productivity hacks."],
  // creative_pro EMAIL audience_growth
  ["Not just the final look — the full process, including the parts that didn't work.", "Not just the final look. The full process, including the parts that didn't work."],
  // professional_svc / regulated_services EMAIL audience_growth
  ["We write what we wish more people understood — no jargon, no agenda.", "We write what we wish more people understood. No jargon, no agenda."],
  // community EMAIL audience_growth
  ["Monthly updates on the work — honest, real, and always personal.", "Monthly updates on the work. Honest, real, and always personal."],
]

let bank = readFileSync(bankPath, 'utf8')
let fixCount = 0

for (const [from, to] of REPLACEMENTS) {
  const count = bank.split(from).length - 1
  if (count > 0) {
    bank = bank.replaceAll(from, to)
    fixCount += count
    console.log(`✓ [${count}x] ${from.slice(0, 60)}`)
  } else {
    console.warn(`⚠ NOT FOUND: ${from.slice(0, 60)}`)
  }
}

// Verify no em dashes remain in tuple lines
const tupleLines = bank.split('\n').filter(l => l.trimStart().startsWith('["'))
const remaining = tupleLines.filter(l => l.includes('—'))
if (remaining.length > 0) {
  console.error('\n❌ Remaining em-dash lines:')
  remaining.forEach(l => console.error(' ', l.trim().slice(0, 80)))
} else {
  console.log(`\n✅ All em dashes cleared from tuple lines (${fixCount} replacements applied).`)
}

writeFileSync(bankPath, bank, 'utf8')
console.log(`\nWrote: ${bankPath}`)
