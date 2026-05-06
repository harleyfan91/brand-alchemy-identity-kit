# CTA Phrase Banks — Copywriting Reference for Cursor

## How to use this file

Each entry is `[line1, line2]`.

- **Line 1** — The primary CTA. Paste-ready. Button text, caption closer, email CTA, listing line.
- **Line 2** — A second CTA or one supporting line. Also paste-ready. Not an explanation of line 1.

`pickDeterministicVariant(variants, variantSeed, scope)` selects one entry per render.
Three variants per leaf minimum. **Fallback chain:** specific industryGroup → `'any'` → `fallbackByGoal`.

**Normative copy rules:** [`CTA_COPY_RULES.md`](./CTA_COPY_RULES.md).

---

## Copywriting conventions applied throughout

### Exclamation marks

The rule is simple: an exclamation mark has to be earned by what the line says, not added to create
energy that isn't there. "Order online!" is not earned. "Shop the drop!" for a maker's new release is.
"Book your appointment now!" is not earned. "Comment 'WANT IT' and I'll DM the link!" is, because
the instruction + response mechanic has inherent energy.

Earned contexts in this bank:
- Maker/retail drops on casual social, where genuine excitement about limited product is native to the culture
- Community volunteer asks, where warmth and enthusiasm are appropriate to the ask
- Health/wellness booking CTAs on casual social only, where momentum language fits the intent

Never used in this bank:
- `professional_svc` — any surface
- `professional` tone — any industry
- LinkedIn — any surface or industry
- Directory — any surface or industry
- "now!" appended to a plain action verb: "Order online now!" and "Book now!" are removed throughout.
  "Shop now" as a two-word button label is an industry standard — it appears only as a minimal standalone,
  never with an exclamation and never padded to "Order online now!"

### Periods vs commas in short-fragment copy

Two parallel fragments read more naturally with a comma: "No surprises, no pressure" not
"No surprises. No pressure." Three or more in a true parallel-beat manifesto use periods:
"Work. Process. Lessons learned." The test: does a period create a meaningful pause, or does it
just chop a sentence in half? If it's the latter, use a comma.

Single-modifier stacks use commas: "Local, licensed, insured." not "Local. Licensed. Insured."

Periods are used at the end of complete standalone sentences as normal. The staccato style is
used intentionally, not as a default for any short phrase.

### "now" as a word

"now" works in context: "We're open now," "New pieces posted now," "Booking open now."
It does not work bolted onto a routine action: "Order online now," "Book now," "Shop now" is
acceptable as a minimal two-word button label but is not used as a full-line CTA in this bank.

---

## Industry Groups

| Key | Maps from |
|---|---|
| `trades_home` | construction_trades, home_services, automotive |
| `food_hospitality` | food_beverage, hospitality |
| `retail_maker` | retail, marketplace_storefront, etsy |
| `health_wellness` | health_wellness, beauty_personal_care, fitness |
| `creative_pro` | creative_services, photography, design, education |
| `professional_svc` | legal_professional_services, finance, consulting, real_estate |
| `community` | nonprofit, community_organization |

---

---

# SURFACE: WEBSITE

---

## Goal: `direct_sales`

### trades_home

**bold:**
```
["Book your free estimate today.", "We come to you, no obligation."],
["Get a written quote in 24 hours.", "Call or fill out the form and we'll take it from there."],
["See the work, then schedule a visit.", "Open most weeks. Book online."],
```

**friendly:**
```
["Ready when you are. Grab a free estimate.", "We're local and usually available within the week."],
["Let us come take a look. Book online in two minutes.", "No surprises, no pressure."],
["Get your free quote today.", "We'll walk you through everything before you commit."],
```

**professional:**
```
["Request a complimentary project estimate.", "Written quotes provided within one business day."],
["Schedule a site assessment to receive accurate pricing.", "Our team will confirm timing directly."],
["Request your no-obligation estimate online.", "We respond to all inquiries within one business day."],
```

---

### food_hospitality

**bold:**
```
["Order online. Ready in 20 minutes.", "Full menu is right here."],
["Reserve your table.", "We fill up fast on weekends."],
["Book a table or order takeout.", "Open every day."],
```

**friendly:**
```
["Come in or order from home. We'd love to have you.", "We'd love to have you."],
["Reserve a table or grab takeout, whatever fits your evening.", "We're open all week."],
["See what's on the menu and pick your spot.", "New specials every Thursday."],
```

**professional:**
```
["View the menu and make a reservation online.", "Private dining available for parties of eight or more."],
["Reserve your table through our booking system.", "We accept reservations up to 30 days in advance."],
["Place your order or reserve a table.", "Catering available for events of all sizes."],
```

---

### retail_maker

**bold:**
```
["Shop the collection.", "New drops every week."],
["See what's new and buy direct.", "Ships within three days."],
["Browse the shop. Everything is made by hand.", "New pieces added regularly."],
```

**friendly:**
```
["Take a look at what's new. There's always something worth finding.", "Handmade with care, shipped with love."],
["Browse the shop and find something you'll actually use.", "We add new pieces regularly."],
["Shop the latest. Something good is waiting.", "Made by hand, shipped fast."],
```

**professional:**
```
["Browse the full collection and place your order online.", "All items ship within three to five business days."],
["View available inventory and purchase directly.", "Wholesale inquiries are welcome."],
["Place your order with secure checkout.", "Returns accepted within 30 days of delivery."],
```

---

### health_wellness

**bold:**
```
["Book your appointment.", "New clients welcome, same-week slots available."],
["See availability and book today.", "Same-week openings, morning and evening."],
["Reserve your session online.", "Evening and weekend appointments available."],
```

**friendly:**
```
["Ready to book? Pick the time that works best.", "We're looking forward to seeing you."],
["Schedule something that's just for you.", "First appointment is always a good one."],
["Find a time and lock it in. Takes about a minute.", "We'll send a reminder the day before."],
```

**professional:**
```
["Schedule your appointment online.", "New patient intake forms are available in advance."],
["Book a consultation to discuss your goals.", "Complimentary for first-time clients."],
["Request an appointment online.", "We will confirm your booking within one business day."],
```

---

### creative_pro

**bold:**
```
["See the work, then start a project.", "Taking new clients now."],
["View the portfolio and get in touch.", "Quick replies, always."],
["Look at the work, then let's talk.", "Q3 bookings are open."],
```

**friendly:**
```
["Take a look at the work and reach out when it feels right.", "No pressure, just a good conversation."],
["Browse the portfolio and say hello if something clicks.", "New project inquiries are always welcome."],
["See recent projects and start a conversation.", "We'd love to hear what you're working on."],
```

**professional:**
```
["Review our portfolio and submit a project inquiry.", "We respond to all inquiries within two business days."],
["View our work and request a project consultation.", "We provide a written scope before any commitment."],
["Explore the portfolio and contact us to discuss your project.", "All inquiries receive a written proposal."],
```

---

### professional_svc

**bold:**
```
["Book a free consultation today.", "Clear answers, no runaround."],
["Get real answers. Schedule a call.", "First consultation is on us."],
["Start with a free consult.", "Plain language, no jargon."],
```

**friendly:**
```
["Book a free call and let's talk through your situation.", "No pressure, no obligation."],
["Reach out and we'll set up a time. No commitment needed.", "Happy to answer questions first."],
["Schedule a conversation and get some clarity.", "We're straightforward people."],
```

**professional:**
```
["Schedule a complimentary initial consultation.", "All consultations are confidential and without obligation."],
["Request a consultation to discuss your situation.", "We will confirm within one business day."],
["Book an initial consultation.", "We provide clear guidance on next steps before any engagement begins."],
```

---

### community

**bold:**
```
["Get involved. Start here.", "Every contribution matters."],
["Join us and see how.", "We need people like you."],
["Support the work. Volunteer or give, your call.", "It takes about 30 seconds."],
```

**friendly:**
```
["Come find out how you can help.", "There's something for everyone."],
["Join us and see what we're working on.", "Every person makes a difference."],
["Get involved in a way that fits your life.", "We'd love to have you with us."],
```

**professional:**
```
["Learn how to get involved and submit an inquiry.", "We welcome volunteers, donors, and organizational partners."],
["Review our programs and contact us to explore involvement.", "We match contributors with opportunities that fit their capacity."],
["Explore volunteer and giving opportunities.", "We will follow up to match you with the right program."],
```

---

## Goal: `lead_gen`

### trades_home

**bold:**
```
["Tell us what needs doing and get a quote.", "We follow up within one business day."],
["Describe the job and we'll send a price.", "No visit required."],
["Get a free estimate. Describe your project below.", "Fast turnaround on all quote requests."],
```

**friendly:**
```
["Tell us what's going on and we'll figure it out together.", "We'll get back to you the same day."],
["Fill us in on the project and we'll give you an honest number.", "No obligation, just a quote."],
["Send the details and we'll put together a free estimate.", "We're usually pretty quick to respond."],
```

**professional:**
```
["Submit your project details to receive a written estimate.", "Quotes are provided at no charge within one business day."],
["Describe your project and request a formal quote.", "A member of our team will follow up to confirm scope."],
["Request a project assessment.", "We provide detailed written quotes before any work begins."],
```

---

### food_hospitality

**bold:**
```
["Planning an event? Tell us the details.", "We handle groups from 10 to 200."],
["Book your event with us.", "Custom menus built around what you need."],
["Planning something? Let's talk.", "Group bookings and custom menus available."],
```

**friendly:**
```
["Planning an event? Let us know what you're thinking.", "We love making special occasions worth remembering."],
["Reach out about a private dinner or catering.", "We'd love to put something together for you."],
["Tell us about your gathering and we'll put a menu together.", "Flexible for groups of any size."],
```

**professional:**
```
["Submit a catering or private event inquiry.", "Our events team will respond within one business day."],
["Contact us to discuss event catering and group dining.", "We provide custom menus and dedicated service."],
["Request a catering proposal.", "We accommodate dietary requirements and can provide references."],
```

---

### retail_maker

**bold:**
```
["Want something custom? Tell us.", "We'll get back to you fast."],
["Wholesale or bulk orders? Message us.", "Minimums vary by product."],
["Custom orders are open. Reach out.", "Built to your spec, shipped to your door."],
```

**friendly:**
```
["Looking for something custom? Just ask.", "We love making things that don't exist yet."],
["Reach out about bulk or wholesale pricing.", "We're happy to work with small businesses and gift shops."],
["Send us your idea and we'll see what we can do.", "Custom commissions welcome."],
```

**professional:**
```
["Submit a custom or wholesale inquiry.", "We will respond with pricing and lead times within two business days."],
["Request information on bulk orders and wholesale availability.", "Trade pricing available to qualifying businesses."],
["Contact us to discuss a custom order.", "We provide a quote and timeline before production begins."],
```

---

### health_wellness

**bold:**
```
["Book a free intro session.", "No commitment needed to start."],
["Ready to begin? Book a consult.", "We'll build the right plan together."],
["Book your free consultation.", "We'll talk through what you actually need."],
```

**friendly:**
```
["Book a free intro and let's talk about what you're looking for.", "No pressure, no hard sell."],
["Start with a quick conversation. It's complimentary.", "We'll figure out if we're a good fit."],
["Schedule a free consult and let's see how we can help.", "We make it easy to get going."],
```

**professional:**
```
["Schedule a complimentary consultation.", "We will discuss your goals and explain our approach before any commitment."],
["Book an initial assessment.", "All new client consultations are complimentary."],
["Request a consultation to determine the right program for your needs.", "We respond to all inquiries within one business day."],
```

---

### creative_pro

**bold:**
```
["Tell us about the project. Let's see if it's a fit.", "Quick replies, always."],
["Send the brief. We'll get back to you within two days.", "Now booking Q3 and Q4."],
["Reach out with your project scope.", "Honest read within two business days."],
```

**friendly:**
```
["Tell us what you're working on and we'll see how we can help.", "We reply to every inquiry personally."],
["Send a few details about the project and we'll have a conversation.", "No pitch decks required."],
["Reach out about your project. We love hearing what people are building.", "New projects are our favorite part of the job."],
```

**professional:**
```
["Submit a project inquiry and we will respond within two business days.", "We provide a written proposal for all new engagements."],
["Contact us to discuss your project scope and timeline.", "We will follow up to schedule a discovery call at your convenience."],
["Send project details to receive a written scope and estimate.", "We take on a limited number of new clients each quarter."],
```

---

### professional_svc

**bold:**
```
["Get answers. Book a free call.", "We'll tell you exactly where you stand."],
["Book a consult, no strings attached.", "We give straight answers."],
["Schedule a free call and get clarity.", "One conversation can change a lot."],
```

**friendly:**
```
["Book a free call and let's talk it through.", "We'll give you an honest picture of where things stand."],
["Reach out and we'll set up a time. No commitment on your end.", "We're here to help you understand your options."],
["Schedule a free consult. It's a good starting point.", "We'll answer your questions and take it from there."],
```

**professional:**
```
["Schedule a complimentary consultation.", "All discussions are strictly confidential."],
["Request an initial consultation to discuss your situation.", "We will respond within one business day to confirm timing."],
["Contact us to arrange a consultation.", "We provide clear guidance on next steps without obligation."],
```

---

### community

**bold:**
```
["Get in touch and tell us how you want to help.", "We'll find the right role for you."],
["Reach out. We'll make it simple.", "Volunteers and donors, we need both."],
["Tell us you're in and we'll take it from there.", "Every form of support matters."],
```

**friendly:**
```
["Reach out and tell us a bit about yourself.", "We'll find something that fits."],
["Send us a note and let's figure out how you can get involved.", "No experience required, just willingness."],
["Get in touch and we'll walk you through the ways you can help.", "We're glad you're here."],
```

**professional:**
```
["Submit a volunteer or partnership inquiry.", "We will respond within two business days."],
["Contact us to learn about involvement opportunities.", "We match individuals and organizations with programs that fit their capacity."],
["Request information on volunteering, giving, or organizational partnership.", "All inquiries receive a personal response."],
```

---

## Goal: `audience_growth`

### trades_home

**bold:**
```
["Follow the work. New projects posted weekly.", "See what's getting built in your area."],
["Subscribe for project photos, before-and-afters, and tips.", "One email a month, no filler."],
["Sign up for occasional updates from the crew.", "Real jobs, real results."],
```

**friendly:**
```
["We share project updates and honest tips. Subscribe if that sounds useful.", "One short email a month."],
["Follow along for photos of recent jobs and the occasional how-to.", "We keep it real."],
["Sign up and we'll send you our before-and-afters when they're ready.", "Nothing pushy, ever."],
```

**professional:**
```
["Subscribe to receive project updates and industry insights.", "One publication per month, no promotional content."],
["Sign up for our newsletter to stay informed on seasonal tips and completed projects.", "Seasonal tips and project highlights, monthly."],
["Follow us for updates on recent work and guidance on home maintenance.", "We post when we have something worth sharing."],
```

---

### food_hospitality

**bold:**
```
["Follow for what's fresh. We post every week.", "New specials, new dishes, real food."],
["Sign up and be first to know about events and new menu items.", "Short emails, worth opening."],
["Follow the kitchen.", "Everything made in-house, posted regularly."],
```

**friendly:**
```
["Follow along and see what we're cooking up.", "New menu items, events, and the occasional recipe."],
["Sign up and we'll send you updates on what's new at the restaurant.", "Usually once a week, never more."],
["Follow us if you want to know what's on before you arrive.", "We post daily specials every morning."],
```

**professional:**
```
["Subscribe to receive advance notice of menu updates, special events, and seasonal offerings.", "We publish one update per week."],
["Sign up for our newsletter to stay informed about upcoming events and featured menus.", "Events, menus, and what's new each week."],
["Follow us for regular updates on seasonal menus and reservation availability.", "Content published weekly."],
```

---

### retail_maker

**bold:**
```
["Follow for new drops. First to know, first to shop.", "Drops happen fast."],
["Sign up and get early access to new releases.", "One email per collection, promise."],
["Follow the shop. New things weekly, small batches.", "Follow before they sell out."],
```

**friendly:**
```
["Follow along for new product drops, behind-the-scenes, and the occasional discount.", "We post a few times a week."],
["Sign up for early access to new collections, we sell out quickly!", "One email per drop, promise."],
["Subscribe and be the first to see what's coming next.", "We share process, previews, and release dates."],
```

**professional:**
```
["Subscribe to receive advance notice of new collections and limited releases.", "We publish one newsletter per product cycle."],
["Follow us to stay current on new arrivals and inventory updates.", "New products added weekly."],
["Sign up for early access to new releases and subscriber-only pricing.", "We respect your inbox."],
```

---

### health_wellness

**bold:**
```
["Follow for tips you can actually use. Posted weekly.", "No fluff, just what works."],
["Sign up for one practical tip a week.", "Real advice, no upsell."],
["Follow along for short, useful posts every week.", "We keep it simple."],
```

**friendly:**
```
["Follow for weekly tips, routines, and honest advice. Nothing overwhelming.", "We post the stuff we wish someone had told us."],
["Sign up for one short, useful email a week.", "The kind of thing you'll actually read."],
["Follow along and we'll share what's working for the people we work with.", "Real results, real people."],
```

**professional:**
```
["Subscribe to receive weekly wellness insights and evidence-based recommendations.", "One publication per week."],
["Follow us for regular updates on programs, research, and practitioner guidance.", "Content published three times weekly."],
["Sign up for our newsletter to receive curated wellness guidance from our team.", "Practical guidance from our team, weekly."],
```

---

### creative_pro

**bold:**
```
["Follow the work. New projects posted as they ship.", "Straight from the studio."],
["Sign up for our newsletter: launches, case studies, and process notes.", "We write when we have something real to share."],
["Follow along. New work every few weeks.", "Process, launches, and lessons learned."],
```

**friendly:**
```
["Follow for project reveals, process notes, and the occasional behind-the-scenes.", "We share work we're proud of."],
["Sign up for our newsletter. It's where we share things that didn't make the portfolio.", "One issue per project cycle."],
["Follow along and watch the work come together.", "We post in-progress shots and final reveals."],
```

**professional:**
```
["Subscribe to receive project case studies, process insights, and industry perspective.", "Published monthly."],
["Follow us for updates on recent work, methodology, and professional development resources.", "New content weekly."],
["Sign up for our newsletter to stay current on our latest projects and perspectives.", "We publish when we have something substantive to say."],
```

---

### professional_svc

**bold:**
```
["Sign up for plain-language updates on the issues that affect you.", "One email a month, always worth reading."],
["Follow along for practical guidance, no jargon, no upsell.", "We write what we wish more people knew."],
["Subscribe for regular updates on changes that could affect you or your business.", "Short reads when something important shifts."],
```

**friendly:**
```
["Subscribe for monthly updates that actually help you make decisions.", "We write like we're talking to a smart friend."],
["Follow us for practical guidance on things that matter to people like you.", "No spin, no sales pitch."],
["Sign up and get one useful update a month.", "People tell us it's the only newsletter they actually open."],
```

**professional:**
```
["Subscribe to receive plain-language analysis of issues that affect businesses and individuals.", "Published monthly."],
["Follow for regular updates on regulatory changes, practical guidance, and industry perspective.", "One publication per week."],
["Sign up for updates on the issues that affect you.", "Plain analysis without the noise."],
```

---

### community

**bold:**
```
["Follow along and see the work we do together.", "We post updates, stories, and ways to get involved."],
["Sign up for our newsletter: impact stories, upcoming events, and ways to help.", "One email a month."],
["Subscribe and stay close to the work.", "We share what's happening on the ground."],
```

**friendly:**
```
["Follow along and see what we're building together.", "We share real updates from the field."],
["Sign up for our monthly newsletter: community stories, events, and new ways to help.", "We keep it short and meaningful."],
["Subscribe and stay connected to the work.", "One email a month, always worth reading."],
```

**professional:**
```
["Subscribe to receive impact reports, program updates, and community news.", "One publication per month."],
["Follow us for regular updates on programs, events, and ways to get involved.", "Content published weekly."],
["Sign up for our newsletter to stay informed about our work and upcoming opportunities.", "Impact stories, events, and ways to help, monthly."],
```

---

## Goal: `retention`

### trades_home

```
["Time for another look? Book a check-up.", "Past clients get priority scheduling."],
["Due for seasonal maintenance? Schedule now.", "We remember the job. Just tell us what you need."],
["Ready for the next phase? Let's pick it up.", "Send us a message and we'll sort it out."],
```

### food_hospitality

```
["Come back and see what's changed.", "New menu items added every month."],
["Been a while? We've missed you.", "Reserve your usual spot online."],
["Ready to come back? Your table is waiting.", "Book online in two minutes."],
```

### retail_maker

```
["New things have landed since your last order.", "Come back and take a look."],
["Ready for something new? See the latest collection.", "Past customers get early access on request."],
["Something new just arrived.", "Come see what's added since your last visit."],
```

### health_wellness

```
["Time to book your next appointment.", "We'll pick up right where we left off."],
["Ready to get back on track? Book a session.", "Your history is on file, no need to start over."],
["Slip in a session before the month ends.", "Evening and weekend slots available."],
```

### creative_pro

```
["Working on something new? Let's pick it up.", "Existing clients get priority on timeline."],
["Ready for the next project? Send the brief.", "We keep all past work on file for continuity."],
["Something new on the horizon? Get in touch.", "We make it easy to continue."],
```

### professional_svc

```
["Something changed? Let's revisit your situation.", "A short call is usually enough to get current."],
["Ready to take the next step? Schedule a follow-up.", "We'll review where things stand and map out next steps."],
["Time for a check-in? Book a short call.", "We keep your file updated, no need to start from scratch."],
```

### community

```
["Still with us? We'd love to reconnect.", "There's always more to do and more ways to help."],
["Come back and see what's changed.", "New programs and new ways to get involved."],
["Ready to get back in? Reach out.", "We'll find the right fit for where you are now."],
```

---

---

# SURFACE: EMAIL

---

## Goal: `direct_sales`

### trades_home

**bold:**
```
["Reply with your job details and I'll send a quote by end of day.", "Or call. We pick up."],
["Reply 'ESTIMATE' and I'll follow up with a price and timeline.", "Usually same day."],
["Send your address and a photo. I'll get you a number by tomorrow.", "No obligation."],
```

**friendly:**
```
["Hit reply with a few details about the job and I'll put together a quote.", "We're usually pretty quick."],
["Reply with what's going on. I'll give you an honest number and timeframe.", "No pressure."],
["Send a quick note with the details and I'll have a quote by tomorrow.", "Happy to answer questions along the way."],
```

**professional:**
```
["Reply with your project details and we will send a written estimate in one day.", "No obligation required to receive a quote."],
["To receive a formal quote, please reply with the project scope and your address.", "We will follow up with a written estimate and available dates."],
["Send project details by reply and we will respond with a comprehensive quote.", "All estimates are provided at no charge."],
```

---

### food_hospitality

**bold:**
```
["Reply 'ORDER' and I'll send the link to order online.", "Or just come in. We're open every day."],
["Reserve online or reply and I'll hold a table for you.", "Filling up fast this weekend."],
["Reply with your party size and I'll confirm availability.", "Walk-ins welcome when we have room."],
```

**friendly:**
```
["Reply and I'll grab you a table or set up a takeout order, whichever works.", "Either way, we've got you."],
["Reply with how many people and when, and I'll sort out a reservation.", "Happy to do it by email."],
["Hit reply and tell me what you're thinking: dinner in, takeout, or a bigger event.", "We'll make it easy."],
```

**professional:**
```
["Reply with your date and party size and we will confirm availability in one day.", "Private dining and catering inquiries also welcome by reply."],
["To make a reservation or place a catering inquiry, please reply with the relevant details.", "We respond to all inquiries same day."],
["Reply with your reservation request and we will confirm by return email.", "Group bookings require 48 hours notice."],
```

---

### retail_maker

**bold:**
```
["Reply 'ORDER' and I'll send the checkout link.", "Ships within three days."],
["Want it? Reply and I'll set it aside. I'll send a direct payment link.", "Fast shipping on all orders."],
["Reply with what you want and your address. I'll invoice you directly.", "Usually out the door in two days."],
```

**friendly:**
```
["Hit reply and tell me what you'd like. I'll set up the order for you.", "Happy to answer sizing or product questions first."],
["Reply and I'll grab your order and get it shipped.", "Usually out the door within a couple of days."],
["Send a quick reply with your order and I'll invoice you directly.", "Easy checkout, fast shipping."],
```

**professional:**
```
["Reply to place your order and we'll send a secure payment link in one day.", "All orders ship within three to five business days."],
["To purchase, please reply with the item and quantity and we will send an invoice.", "We accept all major payment methods."],
["Reply with your order details and we will confirm availability and send payment instructions.", "Returns accepted within 30 days."],
```

---

### health_wellness

**bold:**
```
["Reply 'BOOK' and I'll send you the booking link.", "New and returning clients welcome."],
["Reply with your preferred day and I'll check availability.", "Usually have openings within the week."],
["Reply and I'll hold a spot for you.", "Spots fill quickly. Better to reply now."],
```

**friendly:**
```
["Hit reply with a day that works for you and I'll check what's open.", "We'll get something on the books."],
["Reply and I'll send you the scheduling link. Pick whatever works.", "Happy to answer questions first."],
["Send a quick reply and we'll find a time.", "New clients always welcome."],
```

**professional:**
```
["Reply with your preferred appointment times and we will confirm availability within one business day.", "New patient paperwork can be completed in advance."],
["To schedule, please reply with two or three times that work for you.", "We will confirm your appointment by email."],
["Reply to this email to request an appointment and we will respond with available times.", "We offer morning, afternoon, and select evening appointments."],
```

---

### creative_pro

**bold:**
```
["Reply with your brief and I'll get back to you by tomorrow.", "Taking new projects now."],
["Send the scope and I'll give you an honest timeline and price.", "Quick turnaround on proposals."],
["Reply with what you need. We'll reply with an honest read on fit and timing.", "Straight answer, fast."],
```

**friendly:**
```
["Hit reply with your project details and we'll see if we're a good fit.", "No pitch deck needed, just talk to us."],
["Reply with the basics: what it is, when you need it, what you have.", "We'll take it from there."],
["Send a reply with the overview and we'll have a conversation.", "We love early-stage ideas."],
```

**professional:**
```
["Please reply with your scope and timeline. We will respond with proposal in two days.", "All proposals include a written scope, timeline, and fixed fee."],
["Reply to this email to begin the inquiry process.", "We'll schedule a brief discovery call."],
["Send project details by reply and we will provide a written proposal at no obligation.", "We take on a limited number of engagements per quarter."],
```

---

### professional_svc

**bold:**
```
["Reply with your situation in two lines and I'll tell you what I think.", "Straight answers, no runaround."],
["Hit reply and I'll schedule a free call.", "Quick response, always."],
["Reply and I'll set up a call this week.", "First consultation is free."],
```

**friendly:**
```
["Reply with a quick summary and I'll give you my honest read.", "No obligation."],
["Hit reply and we'll set up a call. Happy to talk before you commit.", "Free initial conversation, always."],
["Send a short reply and we'll find a time to talk.", "We'll answer your questions first."],
```

**professional:**
```
["Please reply with a brief summary of your situation. Next steps in one business day.", "Initial consultations are complimentary and confidential."],
["Reply to schedule a complimentary consultation.", "All info stays confidential."],
["To arrange an initial consultation, please reply with your availability for a brief call.", "We will confirm within one business day."],
```

---

### community

**bold:**
```
["Reply 'YES' and I'll add you to the volunteer list!", "We need people like you."],
["Hit reply and tell me how you want to get involved.", "Every kind of help matters."],
["Reply and I'll send you the details on how to sign up.", "Easy to do, takes two minutes."],
```

**friendly:**
```
["Reply with how you'd like to help and we'll find the right fit.", "There's something for everyone."],
["Hit reply and we'll walk you through the ways you can get involved.", "No commitment required to ask questions."],
["Reply and let us know you're interested. We'll send more details.", "We're always glad to hear from people who want to help."],
```

**professional:**
```
["Please reply with your interest. We'll follow up with options in two days.", "All inquiries welcome."],
["Reply to this email for ways to get involved.", "We will respond with available programs and next steps."],
["To get involved, please reply with your interest area and availability.", "We match contributors with the right programs."],
```

---

## Goal: `lead_gen`

### trades_home

**bold:**
```
["Reply with what needs fixing. We'll reply with next steps.", "Free quote, no site visit required."],
["Describe the job and I'll give you a ballpark by end of day.", "No strings."],
["Send me the details and I'll put together a quote.", "One business day turnaround."],
```

**friendly:**
```
["Reply with what's going on and I'll give you an honest read.", "If it sounds like a fit, I'll send a free quote."],
["Tell me a bit about the project and we'll figure out next steps together.", "No pressure."],
["Hit reply with the details and I'll tell you if we're the right fit.", "Always happy to answer questions first."],
```

**professional:**
```
["Reply with a project summary and we'll follow up with next steps in one day.", "All estimates provided at no charge."],
["Please reply with your project details and preferred timeline.", "We'll contact you with scope and a written quote."],
["Please reply with the work type and property address to begin the estimate.", "We respond to all inquiries within one business day."],
```

---

### food_hospitality

**bold:**
```
["Planning an event? Reply with the date and headcount and I'll build the menu.", "Groups of 10 to 200."],
["Reply with your event details and I'll get back to you today.", "We handle everything from corporate lunches to weddings."],
["Tell me the occasion and I'll tell you what we can do.", "Reply to start planning."],
```

**friendly:**
```
["Planning something? Hit reply and tell me about it.", "We love putting together menus for special occasions."],
["Send the details: date, size, vibe. I'll put together some options.", "We're flexible and we make it easy."],
["Reply with what you're thinking and we'll figure out the rest together.", "Private events and catering are our specialty."],
```

**professional:**
```
["Please reply with your event date, expected guest count, and any dietary requirements.", "Our events team will respond within one business day with a proposal."],
["To request a catering or private event proposal, please reply with relevant details.", "We accommodate all group sizes and dietary needs."],
["Reply with your event inquiry and we'll discuss menus and pricing in one day.", "References available on request."],
```

---

### health_wellness

**bold:**
```
["Reply 'INTRO' and I'll send the link for a free first session.", "No commitment."],
["Reply with what you're working on and I'll suggest the right starting point.", "Free consult, your call."],
["Hit reply and I'll send you the intake form. Takes five minutes.", "We'll go from there."],
```

**friendly:**
```
["Reply with what you're hoping to work on and I'll suggest the best start.", "First conversation is always free."],
["Hit reply and I'll send the link to book a free intro session.", "We'll figure out if it's a good fit."],
["Reply with your goals and I'll share an honest read on how we can help.", "No sales pitch, just a conversation."],
```

**professional:**
```
["Please reply with a brief summary of your goals. Focused next step in one day.", "Initial consultations are complimentary."],
["Reply to request a complimentary consultation.", "Available times and intake details."],
["To begin the process, please reply with your goals and current situation.", "We respond to all new client inquiries within one business day."],
```

---

### creative_pro

**bold:**
```
["Reply with the brief. We'll reply with timing and pricing.", "Two-day turnaround on all proposals."],
["Send the scope and I'll get back to you tomorrow.", "Currently booking new projects."],
["Reply with the overview and I'll take it from there.", "Quick response, always."],
```

**friendly:**
```
["Reply with a bit about the project, even if it's still early.", "We love talking through ideas before they're fully formed."],
["Hit reply with the basics and we'll see if we're a good fit.", "No formal brief required, just tell us what you're building."],
["Send a reply with what you need and I'll get back to you in day.", "Happy to answer early questions. Next step in one day."],
```

**professional:**
```
["Please reply with your scope and timeline. We'll respond with written proposal in two days.", "Proposals include scope, timeline, and a fixed fee."],
["Reply to initiate a project inquiry.", "We'll schedule a discovery call."],
["Send project details by reply and we'll follow up with a written proposal.", "We provide clear scope and pricing before any engagement begins."],
```

---

### professional_svc

**bold:**
```
["Reply with your situation in plain terms and I'll tell you what I'd do.", "First conversation is free."],
["Hit reply and I'll set up a call. We'll sort it out.", "Clear answers, fast."],
["Send the overview and I'll get back to you with next steps.", "No jargon in return."],
```

**friendly:**
```
["Reply with what's going on and I'll share an honest read on what makes sense.", "No obligation."],
["Hit reply with the basics, even if you're not sure where to start.", "We'll talk it through and figure out next steps together."],
["Send a quick reply and we'll set up a call.", "Free initial conversation, always."],
```

**professional:**
```
["Please reply with a brief summary of your situation. Focused next step in one day.", "Initial consultations are complimentary and strictly confidential."],
["Reply to schedule a complimentary consultation.", "We'll confirm timing in one day."],
["To initiate the process, please reply with relevant context and your preferred contact times.", "All info stays confidential."],
```

---

## Goal: `audience_growth` — Email

### trades_home

```
["Reply 'YES' and I'll add you to our project update list.", "One email a month: before-and-afters, tips, and seasonal reminders."],
["Want to stay updated on local projects and maintenance tips? Reply 'IN'.", "Short, useful updates without a sales pitch."],
["Reply to subscribe. We send one practical update per month.", "Real jobs, honest advice."],
```

### food_hospitality

```
["Reply 'YES' and I'll add you to the weekly specials list.", "First to know about events and menu changes."],
["Want our weekly update? Reply 'IN' and you're on the list.", "Events, specials, and the occasional behind-the-scenes."],
["Reply to get the weekly update: what's new, what's on, what's good.", "One email a week, always worth opening."],
```

### retail_maker

```
["Reply 'YES' and I'll add you to the early-access list.", "First to see new drops before they go live."],
["Want early access to new releases? Reply 'IN'.", "Small batches. Being on the list matters."],
["Reply to get early notification on new collections.", "We send one email per drop, promise."],
```

### health_wellness

```
["Reply 'YES' and I'll add you to the weekly tips list.", "One short, useful email a week."],
["Want practical weekly guidance? Reply 'IN'.", "No upsell, just useful."],
["Reply to subscribe to our weekly newsletter.", "Evidence-based, plainly written, one issue per week."],
```

### creative_pro

```
["Reply 'YES' and I'll add you to the studio newsletter.", "Project reveals, process notes, and occasional industry perspective."],
["Want to follow the work? Reply 'IN' and I'll add you.", "One email per project cycle, promise."],
["Reply to subscribe to our newsletter.", "Case studies, process notes, project reveals."],
```

### professional_svc

```
["Reply 'YES' and I'll add you to our monthly update.", "Plain-language coverage of issues that affect you."],
["Want regular practical guidance on things that matter? Reply 'IN'.", "One email a month, no promotional content."],
["Reply to subscribe to our newsletter.", "Practical updates on what matters."],
```

### community

```
["Reply 'YES' and I'll add you to our community update.", "Impact stories, events, and ways to help monthly."],
["Want to stay close to the work? Reply 'IN'.", "We share what's happening on the ground."],
["Reply to subscribe to our monthly update.", "Stories, events, and ways to help."],
```

---

## Goal: `retention` — Email

### trades_home

```
["Been a while since we've worked together? Reply and let's talk about what's next.", "We keep your job history on file."],
["Seasonal maintenance coming up? Reply and I'll get you on the schedule.", "Past clients get priority booking."],
["Ready for the next phase of the project? Reply and we'll pick it up.", "We remember the job. Just tell us what you need."],
```

### food_hospitality

```
["Been a while? Come back and see what's changed.", "Reply to make a reservation or order online."],
["We've added some new things to the menu since you last visited.", "Reply to see what's on or to book a table."],
["We miss you. Come in this week.", "Reply and I'll hold a table."],
```

### retail_maker

```
["New things have arrived since your last order.", "Reply to see what's new or to reorder."],
["Ready to reorder? Reply and I'll set it up.", "Same product, still made by hand."],
["Something new has landed that you might like based on your last purchase.", "Reply and I'll send the details."],
```

### health_wellness

```
["Ready to book your next appointment? Reply and I'll check availability.", "We'll pick up right where we left off."],
["Time for a check-in? Reply with a few days that work.", "Your history is on file, no need to start over."],
["It's been a while. Ready to get back on track? Reply and we'll find time.", "New slots just opened up."],
```

### creative_pro

```
["Working on something new? Reply with the brief.", "Existing clients get priority on timeline."],
["Ready for the next project? Reply and let's pick it up.", "We keep all past files for continuity."],
["Something new on the horizon? Reply and let's talk.", "We make it easy to continue."],
```

### professional_svc

```
["Something changed in your situation? Reply and we'll set up a quick call.", "A 20-minute check-in is usually enough."],
["Ready to take the next step? Reply and I'll pull up your file.", "We'll review where things stand and map out what's next."],
["Time for a review? Reply to schedule a short call.", "Your records are up to date, no restart needed."],
```

### community

```
["Ready to get back involved? Reply and we'll find the right fit.", "New programs have launched since you last joined us."],
["We'd love to have you back. Reply and we'll reconnect.", "There's always more to do."],
["Miss being part of it? Reply and we'll figure out the best way to re-engage.", "Every return matters as much as the first time."],
```

---

---

# SURFACE: SOCIAL — Casual (Instagram, TikTok, Facebook, Pinterest, Threads)

Platform-native vocabulary throughout. "Link in bio" for Instagram-type surfaces. "DM" for all casual social.
The casual register allows sentence fragments and informal punctuation naturally — no period is needed
after a short declarative fragment in a caption context. These read as a human wrote them.

---

## Goal: `direct_sales`

### trades_home

**bold:**
```
["DM 'QUOTE' and I'll get back to you today.", "Or tap the bio link to book."],
["Comment 'ESTIMATE' and I'll reach out.", "Fast response, no obligation."],
["Tap the link in bio to book a free estimate.", "Available most weeks. See open slots in the link."],
```

**friendly:**
```
["DM us the details and we'll put together a free estimate.", "We get back to everyone fast."],
["Tap the link in bio to book, or just DM us.", "Happy to answer questions in comments too."],
["Drop a comment or DM if you want a quote.", "We're local and we respond quickly."],
```

---

### food_hospitality

**bold:**
```
["Order online. Link in bio.", "Ready in 20 minutes."],
["Tap to reserve your table.", "Booking fast for this weekend."],
["Link in bio to order or reserve.", "Come see us."],
```

**friendly:**
```
["Order online or reserve a table. Link in bio.", "We'd love to see you."],
["Tap the link to book a table or grab takeout tonight.", "Either way, we've got you."],
["Come in or order from home. The link in bio has everything.", "Open every day."],
```

---

### retail_maker

**bold:**
```
["Tap the link in bio to shop!", "Ships in three days, handmade."],
["Comment 'WANT IT' and I'll DM the link!", "Small batch. Grab it while it's here."],
["Link in bio to shop the drop.", "Selling fast."],
```

**friendly:**
```
["Shop the collection. Link in bio.", "Handmade with care, shipped with love."],
["Tap the link and grab one while they're here.", "Small batches, won't be around forever."],
["Link in bio to shop. New pieces just landed.", "Everything made by hand."],
```

---

### health_wellness

**bold:**
```
["Book online. Link in bio.", "Same-week slots for new clients."],
["Tap to book. Same-week slots open.", "New and returning clients welcome."],
["Link in bio to book your appointment.", "Evening and weekend slots available."],
```

**friendly:**
```
["Book your appointment through the bio link.", "New clients welcome. We're glad you're here."],
["Tap the link and pick a time that works for you.", "We'll take care of the rest."],
["Ready to book? Link is in our bio.", "We send a day-before reminder."],
```

---

### creative_pro

**bold:**
```
["DM to start a project.", "Taking new clients now."],
["Tap the link to see the work and get in touch.", "Quick responses, always."],
["DM with your brief and I'll respond today.", "New projects welcome."],
```

**friendly:**
```
["DM us and tell us about the project.", "We love early-stage ideas."],
["Tap the link to see the portfolio. DM if something resonates.", "We reply to every message personally."],
["Send us a DM if you're working on something and want to talk it through.", "No formal brief required."],
```

---

### professional_svc

**bold:**
```
["DM 'CONSULT' for a free consultation.", "Plain answers, fast."],
["Tap the link to book a free call.", "First consultation is on us."],
["Link in bio to schedule a free consult.", "Clear guidance, no jargon."],
```

**friendly:**
```
["DM us and we'll set up a free call.", "No pressure, just a conversation."],
["Tap the link to book a free consult.", "We answer every question honestly."],
["Send a DM if you have questions.", "Happy to talk before you commit."],
```

---

### community

**bold:**
```
["Tap the link to get involved!", "Every contribution matters."],
["DM us to volunteer.", "We need you."],
["Link in bio to sign up!", "Takes 30 seconds."],
```

**friendly:**
```
["Tap the link to see how you can help.", "There's something for everyone."],
["DM us if you want to get involved. We'll find the right fit.", "No experience needed."],
["Link in bio to join us.", "We'd love to have you."],
```

---

## Goal: `lead_gen` — Social Casual

### trades_home

**bold:**
```
["DM your address and what needs doing. I'll get you a quote.", "Same-day response."],
["Comment 'QUOTE' and I'll reach out.", "Free estimate, no visit required."],
["DM us the job details.", "Quote in 24 hours."],
```

**friendly:**
```
["DM us the details and we'll put together a free estimate.", "We get back to everyone within a day."],
["Tell us what's going on in a DM. We'll figure out the right next step.", "No pressure."],
["Drop a DM with the project details.", "We'll give you an honest number."],
```

---

### food_hospitality

**bold:**
```
["DM 'EVENT' and I'll send the catering menu.", "Groups from 10 to 200."],
["Planning an event? DM the details.", "Quick response, custom menus."],
["Comment 'CATERING' for menu details.", "Built around your group."],
```

**friendly:**
```
["DM us about your event and we'll see what we can put together.", "We love a good reason to cook."],
["Tell us about the occasion in a DM.", "We'll come back with options."],
["Drop a DM with the basics: date, headcount, occasion. We'll take it from there.", "Private events are our specialty."],
```

---

### health_wellness

**bold:**
```
["DM 'START' for a free intro session!", "No commitment needed."],
["Comment 'CONSULT' and I'll reach out.", "Free first conversation."],
["DM us to book a free intro.", "New clients always welcome."],
```

**friendly:**
```
["DM us and tell us what you're working on.", "We'll figure out the best place to start."],
["Send a DM about what you're hoping to achieve.", "Free intro session to see if we're a fit."],
["Drop a DM. We'll set up a free conversation.", "No hard sell, just a good chat."],
```

---

### creative_pro

**bold:**
```
["DM the brief and I'll get back to you today.", "Taking new projects now."],
["Send the scope in a DM.", "Quick turnaround on all proposals."],
["DM with the overview.", "Fast, honest, personal response."],
```

**friendly:**
```
["DM us about the project, even if it's still early.", "We love conversations before the brief is finalized."],
["Tell us what you're building in a DM.", "We reply personally to everything."],
["Send a DM with the basics and we'll pick it up from there.", "No formal process to get started."],
```

---

### professional_svc

**bold:**
```
["DM the situation and I'll give you my honest read.", "First conversation is free."],
["Comment 'CALL' and I'll set up a free consult.", "No jargon, straight answers."],
["DM us for a free initial conversation.", "We'll tell you what we actually think."],
```

**friendly:**
```
["DM us with your situation and we'll help you figure out the next step.", "Free, no obligation."],
["Send a DM and we'll set up a free call.", "Happy to answer questions before you commit to anything."],
["Drop a DM and let's talk it through.", "Free first conversation, always."],
```

---

### community

**bold:**
```
["DM to volunteer and say hi.", "We match you to a role."],
["Comment 'HELP' and we'll reach out.", "Every form of support matters."],
["DM and tell us how you want to get involved.", "We make it easy."],
```

**friendly:**
```
["DM us and let's figure out how you can help.", "No experience required."],
["Send a DM and we'll walk you through the options.", "There's something for everyone."],
["Drop a DM and we'll find the right fit together.", "We're glad you're here."],
```

---

## Goal: `audience_growth` — Social Casual

### trades_home

**bold:**
```
["Follow for before-and-afters, tips, and local project updates.", "New posts a few times a week."],
["Save this and follow the account.", "We post jobs we're proud of."],
["Follow along for real work, real results.", "Posted as projects finish."],
```

**friendly:**
```
["Follow along for project updates and honest tips from the field.", "We post a few times a week."],
["Save this post and follow us, we share before-and-afters you'll actually want to see.", "The jobs we're proud of, shared honestly."],
["Follow the account. We show our work and talk about what we actually do.", "Real people, real jobs."],
```

---

### food_hospitality

**bold:**
```
["Follow for daily specials, events, and behind-the-scenes!", "We post every day we're open."],
["Follow the kitchen for daily posts.", "New dishes, real food, daily."],
["Save this post and follow for what's on next.", "We share the good stuff."],
```

**friendly:**
```
["Follow along and see what we're cooking up.", "New menu items, events, and the occasional recipe."],
["Follow us if you want to know what's on before you arrive.", "We post daily specials every morning."],
["Save this and follow for more. New things posted every week.", "We love sharing what's on."],
```

---

### retail_maker

**bold:**
```
["Follow so you don't miss the next drop!", "Small batches, they go fast."],
["Follow for new drops, process shots, and the occasional discount!", "First to know, first to shop."],
["Save this and follow. New things every week, everything made by hand."],
```

**friendly:**
```
["Follow along for new product drops, behind-the-scenes, and the occasional discount.", "We post a few times a week."],
["Save this post, follow for more like it.", "New pieces land often. Shared here first."],
["Follow the shop. We share process, new pieces, and the stories behind them.", "Made with care, posted with love."],
```

---

### health_wellness

**bold:**
```
["Follow for one practical tip a week!", "No fluff, just what works."],
["Follow along for routines, advice, and real results.", "Posted three times a week."],
["Save this post, follow for more like it.", "We share what's actually useful."],
```

**friendly:**
```
["Follow for weekly tips you can actually use.", "We keep it practical and down to earth."],
["Save this and follow. More coming every week.", "Real advice, no hard sell."],
["Follow along. We share what's working for the people we work with.", "Honest, practical, worth your time."],
```

---

### creative_pro

**bold:**
```
["Follow for project reveals, process shots, and the occasional tip.", "New work posted as it ships."],
["Follow the studio: work, process, lessons learned.", "New posts every week or so."],
["Save this post and follow for more.", "We post when it's worth seeing."],
```

**friendly:**
```
["Follow for the work and everything behind it.", "Process, reveals, and outtakes too."],
["Save and follow. New work weekly, with the full story.", "Always the process, not just the hero shot."],
["Follow the studio. We're building something and we like showing how.", "New posts every week or so."],
```

---

### professional_svc

**bold:**
```
["Follow for plain-language takes on the things that affect you.", "No jargon, no upsell."],
["Follow along for practical guidance you can actually use.", "Posted a few times a week."],
["Save this, follow for more.", "Plain writing on what matters."],
```

**friendly:**
```
["Follow along for content that actually helps you make decisions.", "Practical posts in plain language."],
["Save this and follow, we write a few times a week on things that matter.", "Real guidance, plain language."],
["Follow the account, we cover the stuff nobody explains clearly.", "We hope it saves you time and stress."],
```

---

### community

**bold:**
```
["Follow for impact stories, events, and ways to get involved!", "Posted regularly."],
["Follow along and see the work we do together!", "Real updates from the ground."],
["Save this and follow the account.", "Updates and ways to help."],
```

**friendly:**
```
["Follow along. We share what we're building and the people who make it possible.", "Real work, real community."],
["Save this and follow for more.", "Updates, stories, ways to get involved."],
["Follow us and see what's possible when people show up for each other.", "New posts every week."],
```

---

## Goal: `retention` — Social Casual

```
["Been a while? Come back and see what's new.", "Tap the link in bio."],
["We've added a lot since you last checked in.", "Link in bio to see what's changed."],
["Miss us? We missed you too.", "Come back and see what's on."],
```

---

---

# SURFACE: SOCIAL — Professional (LinkedIn)

Professional voice throughout. No exclamation marks in this section. Value-led, specific, and direct.

---

## Goal: `lead_gen`

### trades_home

```
["Working on a commercial project? DM us to discuss scope and timeline.", "We work with property managers, contractors, and developers."],
["Need a reliable trade partner for ongoing work? Connect and message.", "We take on commercial and residential work throughout the region."],
["If you manage properties or run a construction business, let's connect.", "DM to discuss ongoing work or one-time projects."],
```

### food_hospitality

```
["Planning a corporate event or team lunch? DM us to discuss catering.", "We handle groups and tailor menus to the event."],
["Need catering for an office event or client dinner? Connect with details.", "We provide custom proposals for corporate clients."],
["Corporate catering and private dining available. DM with your event details.", "We'll have a proposal back to you within one business day."],
```

### retail_maker

```
["Interested in wholesale or B2B purchasing? DM to discuss terms.", "We work with boutiques, gift shops, and corporate gifting programs."],
["Looking for a craft supplier or maker for your retail business? Connect and let's talk.", "Wholesale pricing available for qualifying buyers."],
["We supply independent retailers and corporate gifting programs. DM to learn more.", "Trade pricing and minimums available on request."],
```

### health_wellness

```
["Interested in corporate wellness programs or employer partnerships? DM to learn more.", "We work with HR and wellness leads to tailor programs."],
["Looking for a wellness provider for your team or workplace? Connect and let's talk.", "We customize programs for groups of any size."],
["Corporate wellness partnerships available. DM with your organization's needs.", "We'll put together a program proposal at no charge."],
```

### creative_pro

```
["Working on a project and need a creative partner? Connect and send the brief.", "We respond to all inquiries within two business days."],
["Need a creative studio for brand, campaign, or content work? DM your scope.", "We provide written proposals for all new engagements."],
["We take limited new engagements each quarter. Planning something? Connect now.", "DM with project details and timeline."],
```

### professional_svc

```
["Looking for guidance on something in our area of practice? Connect and send a message.", "Initial conversations are complimentary and confidential."],
["Working through a situation that needs professional input? DM and we'll set up a call.", "Free initial consultation for LinkedIn connections."],
["If you're navigating something complex and want a straight answer, connect and send the details.", "We respond to all professional inquiries within one business day."],
```

### community

```
["Looking to partner with a mission-driven organization? Connect and let's discuss alignment.", "We welcome organizational partners, donors, and advocates."],
["If your company has a community investment focus, DM to explore partnership.", "We offer structured partnership programs for businesses of all sizes."],
["Interested in corporate volunteering or sponsorship? Connect and we'll send the details.", "We have programs that fit a range of organizational commitments."],
```

---

## Goal: `audience_growth` — LinkedIn

### trades_home

```
["Follow this page for project updates, before-and-afters, and trade insights.", "We post weekly."],
["Follow along for a ground-level view of the construction and trades industry.", "Real projects, honest commentary."],
["If you work in property management, construction, or facilities, this page is worth following.", "We post practical content on a weekly basis."],
```

### food_hospitality

```
["Follow for updates on our catering programs, seasonal menus, and events.", "Content published weekly."],
["If you manage corporate events or work in hospitality, follow this page for practical guidance.", "We post regularly on catering, private dining, and event production."],
["Follow for updates on our menu, events, and catering capabilities.", "New content every week."],
```

### creative_pro

```
["Follow for case studies, process breakdowns, and perspective on the creative industry.", "New content published regularly."],
["If you work with creative agencies or manage brand projects, this page is worth following.", "We share work, process, and honest industry perspective."],
["Follow this page for project reveals, methodology, and creative industry commentary.", "We publish when we have something substantive to say."],
```

### professional_svc

```
["Follow for plain-language analysis of issues that affect businesses and individuals.", "Published weekly."],
["If you deal with the kinds of challenges we cover, this page will be useful.", "We write what we wish more people understood."],
["Follow for regular updates on regulatory changes, practical guidance, and industry perspective.", "One publication per week."],
```

### health_wellness / retail_maker / community

```
["Follow this page for updates on our programs, work, and practical guidance.", "Content published weekly."],
["If our work is relevant to what you do, follow along.", "We post when we have something worth sharing."],
["Follow for updates on our work and how it helps you.", "New content every week."],
```

---

---

# SURFACE: DIRECTORY — Google Business (`directory_post_offer_v1`)

Short, action-verb led. Native vocabulary: Call, Message, Get Directions, Request info.
No exclamation marks in this section (any industry or tone).

---

## Goal: `direct_sales`

### trades_home

**bold:**
```
["Call to schedule your free estimate.", "We come to you. Same-week availability."],
["Request a quote and we'll get back to you same day.", "Free, no obligation."],
["Message us the job details. Quote in 24 hours.", "Local, licensed, insured."],
```

**friendly:**
```
["Give us a call and we'll set up a free estimate.", "We're local and usually available quickly."],
["Message us what you need and we'll put together a quote.", "No pressure, no obligation."],
["Call or message. We're happy to help with an estimate.", "Usually available within the week."],
```

**professional:**
```
["Call us to schedule a complimentary on-site assessment.", "Written estimates provided within one business day."],
["Request an estimate using the contact button.", "Response within one business day."],
["Call or message to discuss your project.", "We provide written estimates at no charge."],
```

---

### food_hospitality

**bold:**
```
["Call to reserve your table.", "Or book online."],
["Order online or call ahead.", "Ready in 20 minutes."],
["Reserve your spot. We fill up fast.", "Call or use the booking link."],
```

**friendly:**
```
["Call to make a reservation or order ahead.", "We love having you."],
["Give us a call or tap the website link to reserve.", "Walk-ins welcome when we have room."],
["Call ahead or order online. Either way, we're ready for you.", "Open every day."],
```

**professional:**
```
["Call to make a reservation or inquire about private dining.", "We accept reservations up to 30 days in advance."],
["Contact us to reserve a table or discuss catering options.", "We respond to all inquiries within one business day."],
["Call or message to arrange a reservation or catering inquiry.", "Group reservations require 48 hours notice."],
```

---

### health_wellness

**bold:**
```
["Call to book your appointment today.", "New clients welcome, same-week availability."],
["Request an appointment online.", "Confirmation in one day."],
["Call and we'll get you on the schedule.", "Evening and weekend slots available."],
```

**friendly:**
```
["Give us a call and we'll find a time that works.", "New clients always welcome."],
["Call or message to book your appointment.", "We make booking easy."],
["Reach out and we'll get something on the books.", "Morning, afternoon, and evening availability."],
```

**professional:**
```
["Call to schedule your appointment.", "Morning, afternoon, and evening slots."],
["Request an appointment through the contact button.", "We will confirm within one business day."],
["Call or message to arrange your first visit.", "New patient paperwork can be completed in advance."],
```

---

### all other industries

```
["Call for a free consultation.", "Response within one business day."],
["Message us with your question.", "No obligation to ask questions."],
["Request information via the contact button.", "Follow-up within one business day."],
```

---

## Goal: `lead_gen` — Google Business Directory

```
["Message us with your project or question.", "We respond within one business day."],
["Call or message with the details.", "Free estimates and consultations available."],
["Tap 'Request info' and tell us what you need.", "We follow up with a focused next step."],
```

---

---

# SURFACE: DIRECTORY — Yelp / TripAdvisor (`directory_sponsored_listing_v1`)

Discovery-mode copy. No pressure language. Actions: Call, Website, Get Directions.

---

### trades_home

```
["Call before you visit to confirm scope and availability.", "We provide written estimates on all jobs."],
["Tap 'Call' to reach us directly.", "Free estimates. No site visit required."],
["Check our reviews and call when you're ready.", "Honest pricing, quality work."],
```

### food_hospitality

```
["Check the menu and call ahead to reserve.", "We fill up fast. Better to book."],
["Read the reviews and tap Website to see the full menu.", "Reservations available online."],
["Call ahead or tap Website to order online.", "Fresh daily, made in-house."],
```

### health_wellness

```
["Read reviews and call to book your first appointment.", "New clients always welcome."],
["Tap 'Call' to check availability.", "Same-week appointments usually available."],
["Check our profile and call when you're ready.", "Evening and weekend availability."],
```

### all other industries

```
["Review our profile, then call or message.", "Response within one business day."],
["Tap 'Website' for full details, then call or message with questions.", "Free consultations available."],
["Read our reviews and reach out when you're ready.", "Happy to answer questions before you commit."],
```

---

---

# SURFACE: MARKETPLACE

Transactional. Cart and collection language. Shop-front native vocabulary.

---

## Goal: `direct_sales`

### retail_maker

**bold:**
```
["Add to cart. Ships in three days, made by hand.", ""],
["Shop the collection. Everything is in stock.", "Ships within three business days."],
["Grab yours. Small batch. When it's gone, it's gone.", "Free shipping over $75."],
```

**friendly:**
```
["Add to cart and we'll have it on its way to you quickly.", "Made with care, every single one."],
["Shop the collection and find something you'll actually keep.", "Small batches, made with intention."],
["See the full shop. You might want more than one piece.", "We ship within a few days of every order."],
```

**professional:**
```
["Add to cart and complete your purchase with secure checkout.", "All orders ship within three to five business days."],
["Browse the collection and place your order.", "Returns accepted within 30 days of delivery."],
["Purchase directly from the listing.", "Wholesale welcome. Message the shop."],
```

---

## Goal: `lead_gen` — Marketplace

### retail_maker

```
["Message the shop for custom orders or bulk pricing.", "We respond within one business day."],
["Questions about sizing, materials, or custom options? Message us.", "We're happy to help before you buy."],
["Looking for something specific? Message the shop. We may be able to make it.", "Custom orders welcome."],
```

### trades_home

```
["Message the shop with your project details.", "We'll confirm what's available and provide pricing."],
["Questions about the product or installation? Message us.", "We reply within one business day."],
["Custom orders and bulk pricing available. Message the shop for details.", "We work with contractors and property managers."],
```

---

---

# `ctaTemplates` — Three Paste-Ready Lines Per Goal

Standalone copy references rendered in the guide. Shaped by industry group and tone.

---

## `direct_sales`

**trades_home, bold:** `["Book your free estimate.", "See the work first.", "Call when you're ready. We pick up."]`
**trades_home, friendly:** `["Get a free estimate, no strings attached.", "Come see recent jobs.", "We're easy to reach. Call or fill out the form."]`
**trades_home, professional:** `["Request a complimentary estimate.", "View completed projects on our site.", "Contact us to schedule an on-site assessment."]`

**food_hospitality, bold/friendly:** `["Reserve your table online.", "Order for pickup, ready in 20 minutes.", "See the full menu and plan your visit."]`
**food_hospitality, professional:** `["Make a reservation online.", "View the menu and plan your visit.", "Catering and private dining inquiries welcome."]`

**retail_maker, bold:** `["Shop the collection.", "New drops every week.", "Add to cart. Ships in three days."]`
**retail_maker, friendly:** `["Browse what's new in the shop.", "Find something worth keeping.", "Order and it'll be on its way within the week."]`
**retail_maker, professional:** `["Browse the full collection.", "Place your order with secure checkout.", "All items ship within three to five business days."]`

**health_wellness, bold:** `["Book your appointment.", "New clients welcome, same-week slots open.", "Pick a time and we'll take care of the rest."]`
**health_wellness, friendly:** `["Book your appointment today.", "New clients always welcome.", "Pick a time and we'll take care of the rest."]`
**health_wellness, professional:** `["Book your appointment online.", "New patient paperwork available in advance.", "We will confirm your booking within one business day."]`

**creative_pro, bold:** `["See the work.", "Book a call when you're ready.", "Taking new clients now."]`
**creative_pro, friendly:** `["Browse the portfolio.", "Reach out when something clicks.", "We'd love to hear what you're working on."]`
**creative_pro, professional:** `["View our portfolio.", "Submit a project inquiry.", "We respond to all inquiries within two business days."]`

**professional_svc, bold:** `["Book a free consultation today.", "Clear answers, no jargon.", "First consultation is always on us."]`
**professional_svc, friendly:** `["Book a free call today.", "Get clear answers, no jargon.", "First conversation is always complimentary."]`
**professional_svc, professional:** `["Schedule a complimentary initial consultation.", "All consultations are confidential.", "We provide clear guidance on next steps without obligation."]`

**community, bold:** `["Get involved today!", "Volunteer, donate, or partner with us.", "Every contribution makes a difference."]`
**community, friendly:** `["Get involved today.", "Volunteer, donate, or partner with us.", "Every form of help matters."]`
**community, professional:** `["Learn how to get involved.", "We welcome volunteers, donors, and organizational partners.", "Contact us to explore the right fit."]`

---

## `lead_gen`

**trades_home, bold:** `["Get a free estimate.", "Tell us what needs doing.", "We follow up within one business day."]`
**trades_home, friendly:** `["Tell us about the project.", "We'll put together a free quote.", "No visit required."]`
**trades_home, professional:** `["Request a project estimate at no charge.", "Describe your project and we'll provide a written quote.", "We respond to all inquiries within one business day."]`

**food_hospitality, any:** `["Inquire about private dining or catering.", "Tell us your event details.", "We build custom menus for groups of any size."]`
**retail_maker, any:** `["Ask about custom orders.", "Wholesale inquiries welcome.", "Tell us what you need and we'll see what we can do."]`

**health_wellness, bold:** `["Book a free intro session.", "Tell us your goals.", "No commitment to get started."]`
**health_wellness, friendly:** `["Book a free consult and let's talk.", "Tell us what you're hoping to work on.", "We'll figure out if we're a good fit."]`
**health_wellness, professional:** `["Schedule a complimentary consultation.", "Tell us about your goals.", "We respond to all new client inquiries within one business day."]`

**creative_pro, bold:** `["Send the brief.", "Tell us what you're building.", "We'll get back to you within two days."]`
**creative_pro, friendly:** `["Tell us about the project.", "Reach out with the overview.", "We love early-stage ideas."]`
**creative_pro, professional:** `["Submit a project inquiry.", "Tell us about your scope and timeline.", "We provide a written proposal for all new engagements."]`

**professional_svc, bold:** `["Book a free consult.", "Tell us what's going on.", "Straight answers, fast."]`
**professional_svc, friendly:** `["Reach out and let's talk it through.", "Tell us your situation.", "Free initial conversation, always."]`
**professional_svc, professional:** `["Schedule a complimentary consultation.", "Describe your situation.", "All consultations are confidential and without obligation."]`

**community, any:** `["Tell us how you'd like to get involved.", "We match people to the right role.", "Every form of support is welcome."]`

---

## `audience_growth`

**trades_home, any:** `["Follow for project photos and tips.", "Subscribe for one update a month.", "See recent jobs and follow along."]`
**food_hospitality, bold/friendly:** `["Follow for daily specials and events!", "Subscribe to stay in the loop.", "See what's on before you visit."]`
**food_hospitality, professional:** `["Follow for menu updates and upcoming events.", "Subscribe to our weekly newsletter.", "Stay informed on what's new each week."]`
**retail_maker, bold:** `["Follow for new drops and behind-the-scenes!", "Subscribe for early access to new releases.", "Follow so you don't miss the next batch."]`
**retail_maker, friendly/professional:** `["Follow for new drops and behind-the-scenes.", "Subscribe for early access to new releases.", "Follow so you don't miss the next batch."]`
**health_wellness, any:** `["Follow for one practical tip a week.", "Subscribe for weekly guidance.", "Follow along for routines and real results."]`
**creative_pro, any:** `["Follow for project reveals and process.", "Subscribe to the studio newsletter.", "Follow along as the work comes together."]`
**professional_svc, any:** `["Follow for plain-language guidance.", "Subscribe for monthly updates.", "Follow for content that's actually useful."]`
**community, bold/friendly:** `["Follow for impact stories and events!", "Subscribe for monthly updates from the field.", "Follow along and see what we're building together."]`
**community, professional:** `["Follow for impact reports and program updates.", "Subscribe for monthly updates from the field.", "Follow along and see what we're building together."]`

---

## `retention`

**any industry:** `["Pick up where we left off.", "See what's new since your last visit.", "Come back and let's continue."]`

---

---

# Implementation Notes for Cursor

1. **`industryGroupFromIndustry(industry: string): IndustryGroup`** defaults to `creative_pro` for unrecognized values. `professional_svc` and `health_wellness` groups are already pre-softened; do not apply additional sensitive_industry modification on top of them.

2. **Exclamation marks:** Pre-calibrated per entry. Do not strip or add programmatically. The marks that appear are intentional; the ones that don't are also intentional.

3. **"now" as a word:** Not used as a CTA intensifier ("Order online now") anywhere in this bank. "Now booking Q3 and Q4" (availability statement) is acceptable — it's factual, not a pressure tactic.

4. **Tone selection fallback:** `tonePreset` not in `['bold', 'friendly', 'professional']` defaults to `professional` on LinkedIn and `friendly` everywhere else.

5. **Social surface split:** `socialTone === 'professional'` uses LinkedIn banks. `socialTone === 'casual'` uses Instagram/casual banks.

6. **Directory split:** `directory_post_offer_v1` uses Google Business banks. `directory_sponsored_listing_v1` uses Yelp banks.

7. **Empty line2 in some retail_maker entries:** Where `line2` is `""`, the frame should render only line1. This is intentional for very short complete CTAs that don't need a second line.

8. **Existing `variantSeed` hash** provides adequate fixture spread. No changes to hash logic needed.

9. **`ctaTemplates` lookup:** Prefer specific industryGroup + tonePreset entry. Fall back to industryGroup + `'any'`, then goal-level `'any'`.
