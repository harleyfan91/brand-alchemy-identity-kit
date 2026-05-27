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
["Same-week availability. Book your estimate this week.", "Licensed, insured, and local."],
["Text or call. We'll have a quote to you today.", "No visit required. Send a photo if that's easier."],
["Free estimate, no sales pitch.", "We'll tell you exactly what the job involves and what it costs."],
["Schedule a site visit. We'll write up a quote on the spot.", "Nothing changes hands until you say yes."],
["Get a quote without picking up the phone.", "Fill out the form. You'll have a number by tomorrow."],
```

**friendly:**
```
["Ready when you are. Grab a free estimate.", "We're local and usually available within the week."],
["Let us come take a look. Book online in two minutes.", "No surprises, no pressure."],
["Get your free quote today.", "We'll walk you through everything before you commit."],
["Tell us what you're dealing with.", "We'll come by, take a look, and give you a straight number."],
["Send us a photo and a few details.", "We'll get back to you with a ballpark before we even need to visit."],
["Call before you commit to anything.", "We'll tell you what you're dealing with and what it'll cost."],
["We work in your neighborhood most weeks.", "Book a day that works for you and we'll be there."],
["Easy to reach, quick to respond.", "Book your free estimate and we'll answer every question before you decide."],
```

**professional:**
```
["Request a complimentary project estimate.", "Written quotes provided within one business day."],
["Schedule a site assessment to receive accurate pricing.", "Our team will confirm timing directly."],
["Request your no-obligation estimate online.", "We respond to all inquiries within one business day."],
["View our completed project portfolio, then request an estimate.", "Written quotes provided at no charge within one business day."],
["Schedule a complimentary site assessment at a time that suits you.", "We will confirm timing the same day and provide a written estimate on-site."],
["Contact us to discuss your project scope before committing to a visit.", "We are happy to answer questions by phone first."],
["Submit a project description to receive a detailed written estimate.", "All quotes include a full scope of work at no cost to you."],
["Schedule your on-site assessment online, by phone, or by email.", "We confirm all bookings same day and respond to all inquiries within one business day."],
```

---
**narrator: local_team**

**bold:**
```
["Get a free estimate. Our team can be out within the week.", "Licensed, insured, and local. We cover the whole area."],
["Book a site visit. We'll send a crew to assess the job.", "Available most weeks. See open slots in the booking link."],
["Get a written estimate from our team.", "We respond to all booking requests within one business day."],
["Request a quote. Our estimators will have a number to you within the week.", "Our team is local and knows the area."],
["Schedule a site visit. Our team will assess the job and send a quote.", "No commitment until you see the number."],
```


**friendly:**
```
["Contact us and we'll send someone out to take a look.", "Our team covers the whole area and we get back to everyone fast."],
["Book with us and we'll have someone there this week.", "Our crew gives honest quotes and knows the area."],
["Tell us what's going on. We'll send the right person for the job.", "Our team has a range of specialties. We match the trade to the work."],
["Request a free estimate and one of our team will come by.", "We follow up on every job and flag anything that comes up."],
["Book a site visit with our team.", "We work around your schedule and take the time to explain what the job involves."],
```


**professional:**
```
["Request a complimentary site assessment from our team.", "We will confirm within one business day and dispatch a licensed estimator."],
["Book an on-site estimate.", "Our team provides all quotes in writing with full scope and itemized pricing."],
["Submit a quote request and our team will follow up within one business day.", "All on-site assessments are complimentary and attended by a licensed tradesperson."],
["Schedule a site assessment with our team.", "We confirm all bookings same day and provide a written quote on completion."],
["Request a written estimate from our team.", "We are fully licensed and insured. All quotes are itemized with no hidden costs."],
```

### food_hospitality

**bold:**
```
["Order online. Ready in 20 minutes.", "Full menu is right here."],
["Reserve your table.", "We fill up fast on weekends."],
["Book a table or order takeout.", "Open every day."],
["Same-day reservations available.", "Call or book online and we'll have your table ready."],
["Reserve your seat or grab it to go.", "We're open every day, lunch and dinner."],
["Come in tonight. The table is ready.", "Reserve in two minutes or walk right in."],
["Online ordering open now.", "Order ahead and pick it up hot."],
["Book your table for this week.", "Private dining available for larger groups."],
```

**friendly:**
```
["Come in or order from home. We'd love to have you.", "Something new is on the menu this week."],
["Reserve for dinner or order ahead for pickup.", "Come hungry. We'll take care of the rest."],
["See what's on the menu and pick your spot.", "New specials every Thursday."],
["Come in this week.", "We'd love to have you."],
["Reserve a table or order ahead.", "Something new on the menu you haven't tried yet."],
["Browse the menu and plan your evening.", "We can work with any dietary needs. Just mention it when you book."],
["Come for dinner or grab takeout on your way home.", "We're open every day."],
["See what's on and make a reservation.", "New dishes this week. Come try one."],
```

**professional:**
```
["View the menu and make a reservation online.", "Private dining available for parties of eight or more."],
["Reserve your table through our booking system.", "We accept reservations up to 30 days in advance."],
["Place your order or reserve a table.", "Catering available for events of all sizes."],
["Browse the current menu and reserve your table online.", "Group reservations and private dining inquiries welcome by phone."],
["Book a table or contact us about a catering arrangement.", "Our team responds to all inquiries within one business day."],
["Reserve your seat or arrange a catering inquiry through our contact form.", "We accommodate all dietary requirements with advance notice."],
```

---
**narrator: solo_maker**

**bold:**
```
["Save your seat at my next dinner.", "Small group. Made entirely from scratch, by me."],
["Order ahead. My schedule is in the link.", "Made to order, pickup or delivery."],
["Tap to book your spot.", "Limited seats. I cook everything myself."],
["Reserve your place at the table.", "I host small dinners. Everything on the menu made by hand."],
["My next dinner is accepting bookings.", "Limited seats. Tap the link and grab yours."],
```


**friendly:**
```
["Come find me at my next pop-up or book a private dinner.", "Link in bio for dates and booking."],
["Reserve your spot and I'll take care of everything.", "Small, personal, made entirely by me."],
["Book a seat and come eat well.", "I cook everything myself. The menu changes with the season."],
["Find my schedule in the link and grab a spot.", "I only take a small number of bookings. When it fills, it's done."],
["Come sit at my table.", "I cook for small groups. It's always intimate and always good."],
```


**professional:**
```
["Book a private dining experience or catering event.", "I provide custom menus for small groups. Contact for availability and pricing."],
["Reserve a place at my table or inquire about private catering.", "All menus are custom and prepared entirely by me. Reply to discuss your event."],
["For private dining or event catering, please use the contact form.", "I take a limited number of bookings each month. I respond to all inquiries within one business day."],
["Book a private dinner or catering consultation.", "Custom menus, full preparation, and personal service. Contact for availability."],
["Submit a booking or private dining inquiry.", "I respond to all inquiries within one business day. All events prepared personally."],
```

### retail_maker

**bold:**
```
["Shop the collection.", "New drops every week."],
["See what's new and buy direct.", "Ships within three days."],
["Browse the shop. Everything is made by hand.", "New pieces added regularly."],
["New batch in the shop.", "Everything ships within three days. Made by hand, sold in small runs."],
["New pieces just landed.", "Handmade, limited quantity. Shop before they're gone."],
["Something good is in the shop right now.", "Small batch. Once it's gone, it's gone."],
["Shop the latest.", "Everything is made by hand. New pieces every week."],
["Order today, shipped by end of week.", "All orders made to order, out the door in two days."],
```

**friendly:**
```
["Take a look at what's new. There's always something worth finding.", "Handmade with care, shipped with love."],
["Browse the shop and find something you'll actually use.", "We add new pieces regularly."],
["Shop the latest. Something good is waiting.", "Made by hand, shipped fast."],
["If you've been looking for the right thing, it might be here now.", "New handmade pieces land every week. They don't stay long."],
["Come take a look at what's in the shop this week.", "Small batches. When they're gone, that's usually it."],
["New pieces are in the shop.", "Handmade in small batches. Get them before they're gone."],
["There's always something good happening in the shop.", "We add new handmade work every week."],
["Something good landed this week.", "It won't be here long. Come take a look."],
```

**professional:**
```
["Browse the full collection and place your order online.", "All items ship within three to five business days."],
["View available inventory and purchase directly.", "Wholesale inquiries are welcome."],
["Place your order with secure checkout.", "Returns accepted within 30 days of delivery."],
["View the current collection and purchase securely online.", "All items ship within three to five business days."],
["Browse and order from the full handmade collection.", "Wholesale and trade inquiries available. See our contact page."],
["Order directly through the shop.", "Handmade to order. Allow three to five business days for fulfillment."],
["Shop the current collection with secure checkout.", "Returns accepted within 30 days. Trade pricing available on request."],
["View and order from the full collection.", "All orders ship within stated lead times. Wholesale pricing available."],
```

---
**narrator: product_led**

**bold:**
```
["Shop the new collection.", "Designed and made in our studio. New pieces every season."],
["New drop is live. Shop now.", "Handcrafted, limited run. Order before it sells out."],
["Browse the full collection. Order online.", "Every product is handmade. Ships within three days."],
["Shop our latest release.", "Handcrafted in small batches. Order now. Limited run."],
["The new collection is here.", "Everything handmade, ships within three days. Shop now."],
```


**friendly:**
```
["Take a look at our new collection.", "Everything designed and made by us. New pieces every season."],
["Browse the shop and find something you'll love.", "Our products are made in small batches. When they're gone, they're gone."],
["Shop the latest.", "Something new shows up every season. Come see what's here."],
["Come see what we've been making.", "New additions to the collection every month. Handmade and built to last."],
["See what's new in the collection.", "We design and make everything in our studio. Get yours before it sells out."],
```


**professional:**
```
["Browse and purchase from our full handmade collection online.", "All orders ship within three to five business days. Wholesale inquiries welcome."],
["View the current collection and place your order securely online.", "All products are designed and handcrafted by our team. Ships within stated lead times."],
["Shop our full range of handcrafted products.", "Wholesale and trade inquiries welcome. All orders ship within stated lead times."],
["Order from our collection with secure online checkout.", "Our products are handmade in small batches. Returns accepted within 30 days."],
["View our handmade collection and purchase directly online.", "Trade and wholesale pricing available. Contact us for details."],
```

### health_wellness

**bold:**
```
["Book your appointment.", "New clients welcome, same-week slots available."],
["See availability and book today.", "Same-week openings, morning and evening."],
["Reserve your session online.", "Evening and weekend appointments available."],
["Book your next session.", "Morning, afternoon, and evening available. New and returning clients welcome."],
["Take 60 seconds and lock in your appointment.", "Evening and weekend slots available. New clients welcome."],
["Pick a time and book it.", "New openings added weekly. Spots fill fast."],
["Open your calendar and find a time that works.", "We'll take care of the rest when you arrive."],
```

**friendly:**
```
["Ready to book? Pick the time that works best.", "We're looking forward to seeing you."],
["Schedule something that's just for you.", "New clients always welcome. We'll handle the details."],
["Find a time and lock it in. Takes about a minute.", "We'll send a reminder the day before."],
["Whenever you're ready, there's a spot with your name on it.", "Pick the time that works. We'll be ready."],
["There's no wrong time to book a session.", "Morning, afternoon, and evening slots available. New clients always welcome."],
["Find a time that works and lock it in.", "We'll take care of everything when you arrive."],
["Booking takes about a minute. The rest is up to us.", "New and returning clients welcome. Evening and weekend slots available."],
["When it works for you, we'll make it work for us.", "Book online any time. We'll confirm the same day."],
```

**professional:**
```
["Schedule your appointment online.", "New patient intake forms are available in advance."],
["Book a consultation to discuss your goals.", "Complimentary for first-time clients."],
["Request an appointment online.", "We will confirm your booking within one business day."],
["Book an appointment online.", "Morning, afternoon, and select evening appointments available. New patients welcome."],
["Schedule your session or consultation through our online booking system.", "We confirm all bookings within one business day."],
["Schedule online or contact us directly to arrange an appointment.", "All bookings confirmed within one business day."],
["Book your appointment or initial consultation online.", "New client intake paperwork is available in advance to save time."],
```

---
**narrator: local_team**

**bold:**
```
["Book with our team. Same-week slots available.", "We match you with the right practitioner for what you're working on."],
["Reserve a session online.", "Our team covers morning, afternoon, and evening. New clients welcome."],
["Book now. Our team has availability this week.", "Multiple disciplines. We'll find the right fit."],
["Schedule your session with our team.", "Same-week openings. Evening and weekend appointments available."],
["Book online. Our team will match you with the right practitioner.", "New clients welcome. Multiple session types available."],
```


**friendly:**
```
["Book with our team and we'll match you with the right person.", "Morning, afternoon, and evening availability. New clients always welcome."],
["Book a session with us.", "Our team covers a range of specialties. We'll make sure you're with the right person."],
["Find a time that works and book with our team.", "We'll take care of matching you with the right practitioner."],
["Book your appointment with our team.", "We work across multiple disciplines. New clients are always welcome here."],
["When it works for you, our team will be ready.", "Book online any time. We'll confirm the same day."],
```


**professional:**
```
["Schedule your appointment with our team online.", "We will match you with the appropriate practitioner. New client intake available in advance."],
["Book an appointment with our practice.", "Our team provides services across multiple disciplines. We confirm all bookings within one business day."],
["Request an appointment with our team.", "We will match you with the right practitioner and confirm within one business day."],
["Schedule your session or consultation through our online booking system.", "Our team covers morning, afternoon, and select evening appointments."],
["Book with our team.", "We will confirm your booking and match you with the appropriate practitioner within one business day."],
```

### creative_pro

**bold:**
```
["See the work, then start a project.", "Taking new clients now."],
["View the portfolio and get in touch.", "Quick replies, always."],
["Look at the work, then let's talk.", "Q3 bookings are open."],
["Look at the work. Then let's talk about yours.", "New project inquiries open. We reply within two days."],
["Taking new clients.", "See the portfolio and reach out if it looks like a fit."],
["The work speaks. If it sounds like what you need, get in touch.", "Now booking Q3. Quick replies, always."],
["See recent work. Start a project.", "We're selective. If the brief looks interesting, we'll say yes quickly."],
```

**friendly:**
```
["Take a look at the work and reach out when it feels right.", "No pressure, just a good conversation."],
["Browse the portfolio and say hello if something clicks.", "New project inquiries are always welcome."],
["See recent projects and start a conversation.", "We'd love to hear what you're working on."],
["If the work looks like yours in a few months, let's talk.", "New project conversations welcome. No pitch deck required."],
["Look at recent projects. Reach out if you like what you see.", "We'd love to hear what you're working on."],
["Browse the work and say hello when it feels like the right time.", "We reply to every inquiry personally."],
```

**professional:**
```
["Review our portfolio and submit a project inquiry.", "We respond to all inquiries within two business days."],
["View our work and request a project consultation.", "We provide a written scope before any commitment."],
["Explore the portfolio and contact us to discuss your project.", "All inquiries receive a written proposal."],
["View recent projects and contact us to discuss your requirements.", "We provide a written scope and fee estimate before any engagement begins."],
["Review our work and request a project brief review.", "We respond to all inquiries within two business days with an honest assessment."],
["View the portfolio and submit a project inquiry.", "We take on a limited number of new engagements per quarter. Proposals provided in writing."],
```

---
**narrator: solo_expert**

**bold:**
```
["See the work. DM if it looks like a fit.", "I take a small number of projects at a time. Currently booking."],
["I'm taking new clients. View the portfolio first.", "I reply to every inquiry personally."],
["Look at the work. Get in touch.", "I work with a limited number of clients per quarter."],
["My portfolio is live. DM with the brief.", "I give every project my full attention. Currently booking."],
["View my work. Start a project.", "I take on a small number of new clients each quarter. I reply to every inquiry."],
```


**friendly:**
```
["Take a look at my work and reach out if something resonates.", "I'd love to hear what you're working on."],
["Browse my portfolio and say hello when it feels right.", "No formal process. Just tell me about the project."],
["See recent projects and start a conversation.", "I reply to every inquiry personally. New project conversations always welcome."],
["Take a look at the work. If it clicks, reach out.", "I work with a small number of clients at a time. Get in touch early. Spots go fast."],
["Browse the portfolio and reach out when you're ready.", "I love early-stage conversations. No pitch deck required."],
```


**professional:**
```
["Review my portfolio and submit a project inquiry.", "I respond to all inquiries within two business days with an honest assessment."],
["View my work and request a project consultation.", "I provide written proposals for all new engagements. Limited capacity each quarter."],
["Explore the portfolio and contact me to discuss your project.", "All inquiries receive a written proposal. I take on a limited number of new clients."],
["Review recent work and submit a project inquiry.", "I respond within two business days with a written proposal or an honest redirect."],
["View my portfolio and submit a project inquiry.", "I provide a written scope and fee before any engagement begins."],
```

### professional_svc

**bold:**
```
["Book a free consultation today.", "Clear answers, no runaround."],
["Get real answers. Schedule a call.", "First consultation is on us."],
["Start with a free consult.", "Plain language, no jargon."],
["Schedule a call and get actual clarity.", "Plain answers. First consultation free."],
["Book a free call this week.", "You'll leave knowing exactly what to do next."],
["Get clear on your situation. Book a free consultation.", "We give straight answers, not qualified maybes."],
["First consultation is free.", "Book now and get clear on your next step."],
```

**friendly:**
```
["Book a free call and let's talk through your situation.", "No pressure, no obligation."],
["Reach out and we'll set up a time. No commitment needed.", "Happy to answer questions first."],
["Schedule a conversation and get some clarity.", "We're straightforward people."],
["Book a free call. We'll talk through your situation and figure out what makes sense.", "No pressure. Just a good conversation."],
["Schedule a free consultation and get some clarity.", "We talk to people the way a smart friend would. Honestly, plainly."],
["Book a free call. We'll listen first and then tell you what we think.", "No obligation, no jargon."],
["Schedule something and let's talk it through.", "We'll give you an honest picture of where things stand."],
```

**professional:**
```
["Schedule a complimentary initial consultation.", "All consultations are confidential and without obligation."],
["Request a consultation to discuss your situation.", "We will confirm within one business day."],
["Book an initial consultation.", "We provide clear guidance on next steps before any engagement begins."],
["Request an initial consultation to discuss your matter.", "We will confirm your booking within one business day and explain what to bring."],
["Arrange a complimentary initial consultation.", "We review your situation and outline next steps before any commitment is required."],
["Book a complimentary consultation.", "Our team will provide an honest assessment of your options without obligation."],
```

---
**narrator: solo_expert**

**bold:**
```
["Book a free consultation.", "I practice independently. You'll deal with me directly. No hand-offs."],
["Schedule a free call. I give straight answers.", "I work with a limited number of clients. Clear guidance, fast response."],
["First consultation is free.", "I handle every file personally. Book now."],
["Get a free consult. I'll tell you exactly where you stand.", "I practice on my own. Every client gets my direct attention."],
["Book a free call with me.", "I work independently. You get me, not an associate."],
```


**friendly:**
```
["Book a free call with me. Let's talk through your situation.", "I practice independently. You'll always deal with me directly."],
["Reach out and I'll find a time to talk.", "I'm a one-person practice. You'll get my full attention from the first call."],
["Schedule a free call and let's figure out what makes sense.", "I keep my client list small so every client gets my full attention."],
["Book a free call. I'll listen first and give you a straight answer.", "No hand-offs. You deal with me."],
["Schedule something and let's talk it through.", "I practice independently. I'm here to give you a real answer."],
```


**professional:**
```
["Schedule a complimentary initial consultation.", "I practice independently. All consultations are handled personally and in strict confidence."],
["Book an initial consultation at no charge.", "I work with clients one-on-one. No associates, no hand-offs. All discussions are confidential."],
["Request an initial consultation to discuss your matter.", "I respond to all new inquiries within one business day. All discussions are strictly confidential."],
["Arrange a complimentary initial consultation.", "I review every matter personally and provide clear guidance on next steps before any commitment is required."],
["Book a complimentary consultation.", "I practice independently and handle every client file personally. All discussions are confidential."],
```

### community

**bold:**
```
["Get involved. Start here.", "Volunteer, give, or partner with us."],
["Join us and see how.", "We need people like you."],
["Show up for the work. Volunteer, donate, or partner.", "We'll help you find the right way in."],
["There's work to be done. Come help.", "Volunteer or donate. We'll find the right fit."],
["This is the work that needs doing.", "Get involved in a way that fits your life. Start here."],
["Join us. Every kind of contribution matters.", "Find how you want to help and take the first step."],
["Be part of the work.", "Volunteer, give, or show up. All of it matters."],
["The work needs people like you.", "Find your place in it. Get involved today."],
```

**friendly:**
```
["Come find out how you can help.", "There's something for everyone."],
["Join us and see what we're working on.", "Come once and see what it feels like."],
["Get involved in a way that fits your life.", "We'd love to have you with us."],
["There's more than one way to help. Find yours.", "We'll help you find the right role."],
["Come be part of it.", "We're always looking for people who want to do something that matters."],
```

**professional:**
```
["Learn how to get involved and submit an inquiry.", "We welcome volunteers, donors, and organizational partners."],
["Review our programs and contact us to explore involvement.", "We will respond with options that fit your interests and schedule."],
["Explore volunteer and giving opportunities.", "We will respond within two business days to connect you with the right team."],
["Review our volunteer programs and submit an inquiry.", "We respond to all inquiries within two business days and match individuals with programs by fit."],
["Explore involvement options and contact us to discuss your goals.", "We accommodate individuals, teams, and organizational partners."],
["Submit a volunteer or giving inquiry.", "We will follow up within two business days to confirm the best program for your situation."],
["Explore ways to get involved and contact us to discuss next steps.", "We work with individual volunteers, corporate partners, and institutional donors."],
```

---

## Goal: `lead_gen`

### trades_home

**bold:**
```
["Tell us what needs doing and get a quote.", "We follow up within one business day."],
["Describe the job and we'll send a price.", "No visit required."],
["Get a free estimate. Describe your project below.", "Fast turnaround on all quote requests."],
["Snap a photo and send it. Quote back same day.", "No site visit required."],
["Tell us the job. We'll tell you the price.", "Phone, form, or photo. We work with all three."],
["Free quote, 24 hours.", "Describe the job and we'll have a number to you by tomorrow."],
["What's the job? Get a quote today.", "Response in one business day, no exceptions."],
["Send the job details. Written quote within 24 hours.", "Clear scope, no surprises."],
```

**friendly:**
```
["Tell us what's going on and we'll figure it out together.", "We'll get back to you the same day."],
["Fill us in on the project and we'll give you an honest number.", "No obligation, just a quote."],
["Send the details and we'll put together a free estimate.", "We're usually pretty quick to respond."],
["Not sure what needs doing? That's fine.", "Describe what you're seeing and we'll tell you what the job is."],
["Just describe what's going on at the property.", "We'll figure out what it needs and give you an honest quote."],
["Tell us the problem, not the solution.", "Nine times out of ten, we already know what it needs."],
["No job is too basic to ask about.", "Send us a message and we'll tell you what's involved and what it'll cost."],
["If you can point to the problem, we can put a price on it.", "Send a photo and a sentence. That's usually enough."],
```

**professional:**
```
["Submit your project details to receive a written estimate.", "Quotes are provided at no charge within one business day."],
["Describe your project and request a formal quote.", "A member of our team will follow up to confirm scope."],
["Request a project assessment.", "We provide detailed written quotes before any work begins."],
["Complete the inquiry form with your project details.", "We will contact you to confirm scope and provide a written quote at no charge."],
["Submit a project description by phone, email, or our online form.", "All quotes are written, itemized, and provided at no obligation."],
["Contact us with your project scope and preferred timeline.", "We will discuss the job before preparing a written estimate."],
["Request a complimentary written estimate for any project size.", "Our team responds to all inquiries within one business day."],
["For commercial or multi-phase projects, we provide a detailed scope assessment.", "Contact us to discuss requirements. Written quotes at no cost."],
```

---
**narrator: local_team**

**bold:**
```
["Tell us the job. Our team will get you a quote today.", "We cover the whole region."],
["Send the details. Our team will put together a quote within 24 hours.", "Residential and commercial. We get a number back to you fast."],
["Get a quote from our team.", "Photo, form, or phone. We respond fast."],
["Request a quote. Our estimators will have a number to you by tomorrow.", "We respond to every inquiry within one business day."],
["What's the job? Get a quote from our team.", "Same-day response on most inquiries. Written quote follows."],
```


**friendly:**
```
["Tell us what's going on and our team will give you an honest read.", "We cover the whole area and respond fast."],
["Describe the job and we'll figure out the right crew to send.", "Our team has a range of specializations. We'll find the right match."],
["Tell us the problem. We'll tell you what the job is and what it'll cost.", "Our team has been doing this for years."],
["Not sure what needs doing? Tell us what you're seeing.", "Our team will give you a clear picture of what's involved."],
["Send us the details and we'll work out the scope.", "We're good at figuring out what a job actually needs."],
```


**professional:**
```
["Submit a project description and our team will respond with a written estimate within one business day.", "All quotes are provided at no charge and include a full scope and pricing breakdown."],
["Complete the inquiry form with your project details.", "Our team will contact you to confirm scope and schedule a site visit at no obligation."],
["Contact us with your project scope and preferred timeline.", "We will respond within one business day to discuss the job and arrange an estimate."],
["Submit an inquiry and our team will confirm next steps within one business day.", "All quotes are written, itemized, and provided at no cost."],
["Request a complimentary estimate from our team.", "We respond to all inquiries within one business day and confirm site visits same day."],
```

### food_hospitality

**bold:**
```
["Planning an event? Tell us the details.", "We handle groups from 10 to 200."],
["Book your event with us.", "Custom menus built around what you need."],
["Planning something? Let's talk.", "Group bookings and custom menus available."],
["Corporate lunch, private dinner, or a full event?", "Tell us what you've got and we'll build around it."],
["Custom menu, private space, flexible headcount.", "Tell us the occasion and we'll handle the rest."],
["Hosting a group? We've done this before.", "Tell us the size and date and we'll build from there."],
["Catering or private dining. Tell us what you're planning.", "We'll put together options that work for your group."],
["Need a caterer or a private space?", "Tell us the occasion. We'll take care of everything."],
```

**friendly:**
```
["Planning an event? Let us know what you're thinking.", "We love making special occasions worth remembering."],
["Reach out about a private dinner or catering.", "We'd love to put something together for you."],
["Tell us about your gathering and we'll put a menu together.", "Flexible for groups of any size."],
["Something special coming up? Tell us about it.", "We love building menus around occasions."],
["Big group or intimate dinner. We're comfortable with both.", "Tell us the details and we'll figure out the rest together."],
["Planning a private event? We'd love to host it.", "Reach out with the date and headcount and we'll start from there."],
["Corporate lunch or weekend celebration. We've done them all.", "Tell us what you're thinking and we'll make it easy."],
["Got an event on the horizon? Let's plan it together.", "Tell us the vibe and the guest count and we'll get excited about it with you."],
```

**professional:**
```
["Submit a catering or private event inquiry.", "Our events team will respond within one business day."],
["Contact us to discuss event catering and group dining.", "We provide custom menus and dedicated service."],
["Request a catering proposal.", "We accommodate dietary requirements and can provide references."],
["Complete our event inquiry form and we will respond within one business day.", "We provide custom proposals for all group sizes and occasion types."],
["For private dining or catering inquiries, please contact our events team.", "References and sample menus available on request."],
["Submit your event details and we will respond with a proposal within one business day.", "We accommodate all dietary requirements and work within your budget."],
["Request an event proposal by phone or through our contact form.", "Custom menus and dedicated service for all group sizes."],
["Contact us with your event date, guest count, and any dietary requirements.", "Our events coordinator will respond within one business day with a detailed proposal."],
```

---
**narrator: solo_maker**

**bold:**
```
["Planning an event? Tell me the date and the occasion.", "I build every menu from scratch around the group and the moment."],
["Catering inquiry? Tell me the headcount and the vibe.", "I build a custom menu around your event. I'll reply by end of day."],
["Private event or catering? Send the details.", "I respond fast and build the menu around your group."],
["Planning something? Tell me the basics.", "I do private dinners, pop-ups, and events. Tell me what you're planning."],
["Send me the event details. I'll build the menu.", "Private catering for groups of 6 to 50. I reply personally."],
```


**friendly:**
```
["Planning something special? Tell me about it.", "I do private dinners and small events. I'd love to hear what you have in mind."],
["Looking for a private chef or caterer? Tell me about the occasion.", "I design menus around the moment. Send me the details."],
["Have an event coming up? Reach out and tell me about it.", "Private dinners, pop-ups, small events. I handle everything personally."],
["Tell me about the event and I'll put together a menu concept.", "Private dining and catering is a big part of what I do."],
["Planning a dinner or event? Send me the details.", "I cook everything myself. Tell me the vibe and the headcount."],
```


**professional:**
```
["Submit a catering or private dining inquiry.", "I provide custom proposals for all events within one business day. All preparation handled personally."],
["To inquire about private catering or a dining experience, please use the contact form.", "I respond within one business day and provide a custom menu proposal."],
["Contact me to discuss your event catering or private dining requirements.", "Custom menus for groups of 6 to 50. Proposals within one business day."],
["Submit a private event or catering inquiry.", "I review all inquiries personally and respond within one business day with availability and a menu concept."],
["Request a catering proposal or private dining consultation.", "I handle all preparation personally and respond to all inquiries within one business day."],
```

### retail_maker

**bold:**
```
["Want something custom? Tell us.", "We'll get back to you fast."],
["Wholesale or bulk orders? Message us.", "Minimums vary by product."],
["Custom orders are open. Reach out.", "Built to your spec, shipped to your door."],
["Corporate gifts or branded pieces? We do that.", "Tell us the quantity and timeline. Quote in two days."],
["Trade pricing available.", "We work with gift shops, boutiques, and interior designers."],
["Looking for a custom piece? Give us a call to work through the idea.", "We respond to all custom inquiries within two business days."],
["Need something made to spec?", "Custom commissions open. Tell us the brief."],
["Bulk order or wholesale? Let's talk.", "Minimums vary by product. Send the details."],
```

**friendly:**
```
["Looking for something custom? Just ask.", "We love making things that don't exist yet."],
["Reach out about bulk or wholesale pricing.", "We're happy to work with small businesses and gift shops."],
["Send us your idea and we'll see what we can do.", "Custom commissions welcome."],
["Have something specific in mind that isn't in the shop?", "Tell us what you're thinking. We love custom work."],
["Want to stock our work in your shop?", "Reach out about wholesale. We work with small retailers we believe in."],
["Got a gift idea that needs to be made from scratch?", "Tell us who it's for and what they love. We'll figure out the rest."],
["Looking for a larger order than what's in the shop?", "Send the details and we'll put together pricing and a timeline."],
["If you need something that isn't in the shop, just ask.", "Custom commissions are welcome. We say yes more often than you'd think."],
```

**professional:**
```
["Submit a custom or wholesale inquiry.", "We will respond with pricing and lead times within two business days."],
["Request information on bulk orders and wholesale availability.", "Trade pricing available to qualifying businesses."],
["Contact us to discuss a custom order.", "We provide a quote and timeline before production begins."],
["Submit a product inquiry for corporate gifting or branded commissions.", "We accommodate quantities of 25 and above. Lead times vary by product type."],
["Request trade or wholesale pricing.", "Volume discounts and net-30 terms available to qualifying retailers."],
["For commercial or volume orders, please submit a product inquiry.", "We accommodate custom specifications, branded packaging, and minimum orders from 25 units."],
```

---
**narrator: product_led**

**bold:**
```
["Wholesale or trade inquiry? Get in touch.", "We work with boutiques, gift shops, and interior designers."],
["Looking for a handmade product supplier? We're open to wholesale.", "Contact us with your requirements."],
["Custom or bulk order? Tell us what you need.", "We produce to spec and quote within two business days."],
["Want to stock our products? Reach out.", "We work with a select number of retail partners."],
["Corporate gifting or wholesale? Contact us.", "We design and produce handmade products at volume."],
```


**friendly:**
```
["Want to carry our products in your shop?", "We love working with independent retailers. Reach out and let's talk."],
["Looking for a handmade product supplier for your store?", "We work with boutiques and gift shops we believe in."],
["Interested in wholesale or a custom order?", "We produce in volume without losing the handmade quality. Send us the details."],
["Want something from our collection for a corporate gift?", "We can produce to spec and ship in bulk. Tell us what you need."],
["Looking to stock handmade goods in your space?", "Reach out about wholesale. We love finding the right retail partners."],
```


**professional:**
```
["Submit a wholesale or trade inquiry.", "We supply boutiques, gift shops, and corporate gifting programs. Response within two business days."],
["Request wholesale or volume pricing.", "Our products are available to qualifying retailers. Volume discounts and net-30 terms available."],
["Contact us to discuss wholesale, custom, or corporate gifting requirements.", "We respond to all trade inquiries within two business days with a formal quote."],
["Submit a wholesale or custom production inquiry.", "We accommodate volumes from 25 units. Custom branding and packaging available."],
["For wholesale or trade inquiries, please submit via our contact form.", "We respond within two business days with pricing, minimums, and lead times."],
```

### health_wellness

**bold:**
```
["Book a free intro session.", "No commitment needed to start."],
["Ready to begin? Book a consult.", "We'll build the right plan together."],
["Book your free consultation.", "We'll talk through what you actually need."],
["Start with a free consultation.", "We'll talk through what you're working toward and build the right plan."],
["Not sure where to start? That's what the first call is for.", "Book a free intro. No commitment needed."],
["Free first session, no strings attached.", "Tell us what you're after. We'll tell you if we're the right fit."],
["Book a free consult and find out exactly what to do first.", "Clear next step, no obligation."],
["See if we're the right fit. Start with a free session.", "We'll give you an honest read on what makes sense for your situation."],
```

**friendly:**
```
["Book a free intro and let's talk about what you're looking for.", "No pressure, no hard sell."],
["Start with a quick conversation. It's complimentary.", "We'll figure out if we're a good fit."],
["Schedule a free consult and let's see how we can help.", "We make it easy to get going."],
["Not sure if it's the right time? It usually is.", "Book a free intro and let's just have a conversation."],
["Start with a free conversation. No commitment, no pressure.", "We'll listen, ask the right questions, and let you decide."],
["Tell us what you're hoping to change.", "Free first conversation, and we'll give you a straight answer on what might help."],
["Book a free intro. It's just a conversation.", "We'll figure out together whether this is the right fit."],
["You don't need to know exactly what you want yet.", "Book a free intro and we'll help you figure it out."],
```

**professional:**
```
["Schedule a complimentary consultation.", "We will discuss your goals and explain our approach before any commitment."],
["Book an initial assessment.", "All new client consultations are complimentary."],
["Request a consultation to determine the right program for your needs.", "We respond to all inquiries within one business day."],
["Schedule an initial consultation at no charge.", "We will discuss your goals and current situation before making any recommendations."],
["Request a complimentary intake consultation.", "We will outline our approach and explain what to expect before any commitment is required."],
["Book a complimentary assessment to determine the right starting point.", "All new client consultations include a full intake and goal-setting conversation."],
["Submit an inquiry to schedule a complimentary initial consultation.", "We respond to all new client inquiries within one business day."],
["Arrange a complimentary consultation to explore whether our approach is right for you.", "No commitment required. All discussions are private."],
```

---
**narrator: local_team**

**bold:**
```
["Book a free consultation with our team.", "We'll match you with the right practitioner and build the right plan."],
["Start with a free intro session.", "Our team will assess where you are and recommend the best starting point."],
["Free first consultation. Book with our team.", "We work across multiple disciplines. We'll find the right fit."],
["Book a free consult. Our team will assess your situation.", "Multiple disciplines, same-day response."],
["Not sure where to start? Our team will figure it out.", "Book a free intro. No commitment."],
```


**friendly:**
```
["Book a free intro with our team and we'll figure out the best starting point.", "Just a good conversation about where you're at."],
["Start with a free conversation with one of our team.", "We'll listen and work out the best path forward for what you're working on."],
["Book a free consult. Our team will match you with the right practitioner.", "No commitment. Just a conversation."],
["Not sure which practitioner is right for you? That's what the intro is for.", "Book a free session with our team."],
["Let our team figure out the best starting point for you.", "Free first conversation. We'll do the matching."],
```


**professional:**
```
["Schedule a complimentary consultation with our team.", "We will match you with the appropriate practitioner and outline the recommended approach before any commitment."],
["Request a complimentary intake assessment.", "Our team will review your situation and recommend the right practitioner and program."],
["Book a complimentary consultation with our practice.", "We will discuss your goals and assign the appropriate practitioner before any commitment is required."],
["Submit an inquiry to schedule a complimentary assessment with our team.", "We respond to all new client inquiries within one business day."],
["Arrange a complimentary consultation.", "Our team will determine the right fit and outline our recommended approach. No commitment required."],
```

### creative_pro

**bold:**
```
["Tell us about the project. Let's see if it's a fit.", "Quick replies, always."],
["Send the brief. We'll get back to you within two days.", "Now booking Q3 and Q4."],
["Reach out with your project scope.", "Honest read within two business days."],
["Tell us the scope. We'll give you an honest read within two days.", "Taking new projects now."],
["Send the brief, even if it's rough.", "We'll get back to you with a clear answer on fit, timing, and price."],
["Project inquiry? Reply with the scope.", "Two-business-day turnaround on all proposals."],
["Reach out with the project. We'll tell you if it's a fit.", "Now booking Q3 and Q4."],
["Tell us what you need. We'll tell you what it takes.", "Honest proposals, fast replies."],
```

**friendly:**
```
["Tell us what you're working on and we'll see how we can help.", "We reply to every inquiry personally."],
["Send a few details about the project and we'll have a conversation.", "No pitch decks required."],
["Reach out about your project. We love hearing what people are building.", "New projects are our favorite part of the job."],
["Tell us about the project, even if it's still early.", "We love hearing what people are building before it's all figured out."],
["Send the overview and we'll see if we're a good fit.", "No formal brief required. Just tell us what you're trying to do."],
["Reach out and tell us what you're working on.", "Every project starts with a good conversation. Let's have one."],
["Tell us about it. We'll figure out if we're the right people.", "New project conversations welcome. We reply personally."],
["Send a quick note about the project.", "If it sounds interesting, we'll come back to you the same day."],
```

**professional:**
```
["Submit a project inquiry and we will respond within two business days.", "We provide a written proposal for all new engagements."],
["Contact us to discuss your project scope and timeline.", "We will follow up to schedule a discovery call at your convenience."],
["Send project details to receive a written scope and estimate.", "We take on a limited number of new clients each quarter."],
["Contact us with your project scope and preferred timeline.", "We will schedule a discovery call and follow up with a written proposal."],
["To begin a project inquiry, please submit details via our contact page.", "We provide clear written proposals before any engagement begins."],
```

---
**narrator: solo_expert**

**bold:**
```
["Tell me about the project. I'll give you an honest read.", "I take on a small number of projects per quarter. I reply to every inquiry."],
["Send the brief. I'll reply with fit, timing, and price.", "Now booking. Two-day turnaround on proposals."],
["Reach out with the project. I'll tell you if it's a match.", "Honest assessment within two business days."],
["Tell me the scope. I'll tell you what it takes.", "Fast, honest, personal. I reply to every inquiry."],
["Send me the overview. I'll give you a real answer.", "Every proposal is written specifically for the project. Two-day turnaround."],
```


**friendly:**
```
["Tell me what you're working on, even if it's early.", "I love hearing about projects before they're fully figured out."],
["Reach out about the project and let's have a conversation.", "I reply personally to every inquiry. No formal brief required."],
["Send me a few details about the project.", "I'll tell you honestly whether it's the right fit."],
["Tell me about it. I'll figure out if I'm the right person.", "I take a small number of new projects at a time. Send me a note. I reply fast."],
["Drop me a note about the project.", "If it sounds interesting, I'll come back to you the same day."],
```


**professional:**
```
["Submit a project inquiry and I will respond within two business days with a written proposal.", "I provide fixed-fee proposals for all new engagements."],
["Contact me with your project scope and preferred timeline.", "I will respond within two business days and follow up with a written proposal."],
["Send project details and I will respond with a written scope and estimate within two business days.", "I take on a limited number of clients each quarter."],
["Submit a project inquiry and I will follow up within two business days.", "All proposals include a full scope, timeline, and fixed fee."],
["To begin a project inquiry, please submit details via my contact page.", "I provide clear written proposals before any engagement begins."],
```

### professional_svc

**bold:**
```
["Get answers. Book a free call.", "We'll tell you exactly where you stand."],
["Book a consult, no strings attached.", "We give straight answers."],
["Schedule a free call and get clarity.", "One conversation can change a lot."],
["Get a straight answer. Book a free call.", "We'll tell you exactly where you stand. No jargon."],
["One free call. Real clarity.", "Tell us your situation and we'll tell you what we'd do."],
["Schedule a free consult and leave knowing your options.", "We give real answers, not qualified maybes."],
["One conversation can change how you see your situation.", "Book a free consult. No obligation."],
["Get the honest read. Free first call.", "We talk like humans. No disclaimers, no runaround."],
```

**friendly:**
```
["Book a free call and let's talk it through.", "We'll give you an honest picture of where things stand."],
["Reach out and we'll set up a time. No commitment on your end.", "We're here to help you understand your options."],
["Schedule a free consult. It's a good starting point.", "We'll answer your questions and take it from there."],
["Schedule a free call. You'll leave with more clarity than you have now.", "No obligation. Just a conversation."],
["Not sure what to do next? That's what the first call is for.", "Free, no commitment, and we'll give you an actual answer."],
["Book a free consult and get an honest picture of your situation.", "We talk to people the way we'd want someone to talk to us."],
```

**professional:**
```
["Schedule a complimentary consultation.", "All discussions are strictly confidential."],
["Request an initial consultation to discuss your situation.", "We will respond within one business day to confirm timing."],
["Contact us to arrange a consultation.", "We provide clear guidance on next steps without obligation."],
["Book a complimentary consultation.", "We outline your options and recommend next steps before any engagement begins."],
["Arrange an initial consultation at no charge.", "We provide written guidance on next steps following all complimentary consultations."],
["Submit an inquiry to schedule a complimentary consultation.", "We respond within one business day. Confidentiality guaranteed."],
```

---
**narrator: solo_expert**

**bold:**
```
["Get a straight answer. Book a free call with me.", "I practice independently. No jargon, no runaround."],
["One free call. I'll tell you exactly where you stand.", "I work independently. You get me on the phone."],
["Schedule a free consult and leave knowing your options.", "I give real answers. I work with a limited number of clients."],
["Book a free consult. I'll give you an honest read.", "I practice on my own. Every client gets my direct attention."],
["Get the real answer. Free first call.", "I work independently. Clear guidance, no disclaimers."],
```


**friendly:**
```
["Book a free call and let's talk through what's going on.", "I practice independently. You'll get an honest answer and deal with me directly."],
["Reach out and I'll find a time.", "I keep my client list small so I can give you my full focus. Free first call."],
["Schedule a free call with me. You'll leave with real clarity.", "I don't hand things off. I stay on every matter personally."],
["Not sure what to do next? That's what the first call is for.", "Free, honest, and you'll deal with me directly."],
["Book a free consult. I'll give you an honest picture of where things stand.", "I practice independently. No firms, no associates."],
```


**professional:**
```
["Schedule a complimentary consultation.", "I practice independently. All discussions are confidential and handled personally. No hand-offs."],
["Request a complimentary initial consultation to discuss your situation.", "I respond within one business day. All discussions remain strictly confidential."],
["Book a complimentary consultation.", "I provide clear guidance on next steps before any engagement begins. I handle every matter personally."],
["Arrange an initial consultation at no charge.", "I review every matter personally and provide written guidance on next steps following all consultations."],
["Submit an inquiry to schedule a complimentary consultation.", "I practice independently and respond within one business day. Confidentiality guaranteed."],
```

### community

**bold:**
```
["Get in touch and tell us how you want to help.", "We'll find the right role for you."],
["Reach out. We'll make it simple.", "Volunteers and donors, we need both."],
["Tell us you're in and we'll take it from there.", "Every form of support matters."],
["Reach out and tell us you want to be part of it.", "We'll find the right role and walk you through next steps."],
["Tell us how you'd like to help.", "Volunteer, donate, or advocate. We'll figure out the best fit together."],
["Get in touch. We need people like you.", "Tell us you're interested and we'll take it from there."],
["Reach out and we'll match you with the right opportunity.", "Every kind of help matters. We'll find yours."],
["Tell us you're in.", "We'll connect you with the right program and walk you through next steps."],
```

**friendly:**
```
["Reach out and tell us a bit about yourself.", "We'll find something that fits."],
["Send us a note and let's figure out how you can get involved.", "No experience required, just willingness."],
["Get in touch and we'll walk you through the ways you can help.", "We're glad you're here."],
["Tell us a bit about yourself and how you'd like to help.", "We'll find the right fit and walk you through what's involved."],
["Reach out and we'll figure out the best way for you to get involved.", "No prior experience required. Just a willingness to show up."],
["Send us a note. There's a place for you here.", "We'll talk through the different ways to get involved and find the right one."],
["Get in touch and tell us what you care about.", "We'll match you with the work that makes the most sense."],
["Reach out, even if you're not sure where to start.", "We'll walk you through everything and find the right fit together."],
```

**professional:**
```
["Submit a volunteer or partnership inquiry.", "We will respond within two business days."],
["Contact us to learn about involvement opportunities.", "We match individuals and organizations with programs that fit their capacity."],
["Request information on volunteering, giving, or organizational partnership.", "All inquiries receive a personal response."],
["Contact us to discuss involvement opportunities for individuals or organizations.", "We provide detailed program information and match contributors by fit and capacity."],
["Submit a partnership or involvement inquiry.", "We work with individuals, corporate partners, and institutional organizations. Response in two business days."],
["Contact us to explore the best way to support our work.", "We will respond with available programs and follow up to discuss fit."],
```

---

## Goal: `audience_growth`

### trades_home

**bold:**
```
["Follow the work. New projects posted weekly.", "See what's getting built in your area."],
["Subscribe for project photos, before-and-afters, and tips.", "One email a month, no filler."],
["Sign up for occasional updates from the crew.", "Real jobs, real results."],
["Follow for the maintenance tips that could save you a call later.", "We post the seasonal stuff you actually need to know."],
["See what a good job looks like before you hire anyone.", "We post the work. You decide."],
["Follow before you need us.", "When the time comes, you'll already know who to call."],
["Save this and follow. Next post might be a job on your street.", "We cover the whole area."],
["Follow for real project photos. Posted as jobs wrap up, not on a schedule.", "No stock content. No filler."],
```

**friendly:**
```
["We share project updates and honest tips. Subscribe if that sounds useful.", "One short email a month."],
["Follow along for photos of recent jobs and the occasional how-to.", "We keep it real."],
["Sign up and we'll send you our before-and-afters when they're ready.", "Nothing pushy, ever."],
["Follow for the tips we wish people knew before their project started.", "Short posts, genuinely useful."],
["We post the jobs we're proud of. And the ones that taught us something.", "Follow for the real thing."],
["Sign up if you'd like a heads-up before peak season.", "One useful email when it matters, nothing else."],
["Follow for before-and-afters worth watching and the honest story of how we got there.", "No spin, just the job."],
["We post what you'd want to know before you hire anyone.", "Follow now. When you need us, you'll already know us."],
```

**professional:**
```
["Subscribe to receive project updates and industry insights.", "One publication per month, no promotional content."],
["Sign up for our newsletter to stay informed on seasonal tips and completed projects.", "One email a month. No advertising content, ever."],
["Follow us for updates on recent work and guidance on home maintenance.", "We post when we have something to say."],
["Follow for before-and-after documentation and practical home maintenance guidance.", "New content published as projects complete."],
["Sign up for our monthly project and maintenance newsletter.", "Plain writing, no promotional content."],
["Follow for regional project updates and seasonal maintenance schedules.", "Published when we have something substantive to share."],
```

---

### food_hospitality

**bold:**
```
["Follow for what's fresh. We post every week.", "New specials, new dishes, real food."],
["Sign up and be first to know about events and new menu items.", "Short emails, worth opening."],
["Follow the kitchen.", "Everything made in-house, posted regularly."],
["Follow so you always know what's on tonight.", "We post the daily menu every morning."],
["Sign up and hear about our seasonal menu before anyone else.", "First to know, first to reserve."],
["Follow so nothing changes before you hear about it.", "Menu updates, event announcements, and the good stuff."],
["Save this and follow. Every day has something new.", "We post daily. Come back often."],
```

**friendly:**
```
["Follow along and see what we're cooking up.", "New menu items, events, and the occasional recipe."],
["Sign up and we'll send you updates on what's new at the restaurant.", "Usually once a week, never more."],
["Follow us if you want to know what's on before you arrive.", "We post daily specials every morning."],
["Follow along and we'll show you the story behind the food.", "The sourcing, the people, and why each dish made the cut."],
["Follow us if you like knowing the people who cook your food.", "We post from inside the kitchen, not just the finished plate."],
["Subscribe and we'll send you the weekly menu when it drops.", "One email a week with what's new and what's actually worth ordering."],
["Follow along. There's always something new in the kitchen.", "New dishes, the people who make them, and the occasional recipe we're willing to share."],
```

**professional:**
```
["Subscribe to receive advance notice of menu updates, special events, and seasonal offerings.", "We publish one update per week."],
["Sign up for our newsletter to stay informed about upcoming events and featured menus.", "Published weekly, without fail."],
["Follow us for regular updates on seasonal menus and reservation availability.", "Content published weekly."],
["Sign up to receive our weekly update on specials, events, and new menu items.", "We publish every week and never share your information."],
["Subscribe for advance notice of menu launches, featured ingredients, and dining events.", "We send one newsletter per week."],
["Sign up for our weekly newsletter covering menu updates, seasonal items, and event announcements.", "Published consistently. No third-party advertising."],
```

---

### retail_maker

**bold:**
```
["Follow for new drops. First to know, first to shop.", "Drops happen fast."],
["Sign up and get early access to new releases.", "One email per collection, promise."],
["Follow the shop. New things weekly, small batches.", "First to follow, first to shop."],
["Follow and you'll know first.", "New drops go live here before anywhere else. Small batches, no restocks."],
["Follow and see how each piece comes to life.", "We post the full process, from raw material to finished piece, before every drop."],
["Sign up for the mailing list.", "One email per drop, sent before items go live. Nothing else."],
["Follow to see where the materials come from.", "We share the sourcing story before every new collection."],
["New pieces drop fast and sell out faster.", "Follow so you're ready when they do."],
["Follow along if you like watching things get made.", "You'll see the raw material, the hands at work, and the finished piece before it ever reaches the shop."],
["Sign up and you'll hear about each drop before it goes live.", "Small batches. Being on the list is how you actually get one."],
["Follow to see what's coming next.", "We share work-in-progress shots and previews before anything hits the shop."],
["If you've ever wondered what goes into making something like this, follow along.", "You'll see how the materials get chosen and what it takes to turn them into something you'll actually keep."],
["Subscribe and you'll hear about new pieces before they're available to everyone.", "One email per collection. Nothing else."],
["Subscribe for advance release notification and collection previews.", "One communication per product cycle. Wholesale subscribers notified separately."],
["Follow for collection updates, inventory alerts, and seasonal previews.", "Updated as new inventory becomes available."],
["Sign up for advance notice of new releases and wholesale availability.", "One message per drop, no promotional filler."],
["Subscribe to receive new product announcements, production notes, and purchase links.", "Published once per collection cycle."],
["Follow for priority notification on limited inventory releases.", "Small-batch runs frequently sell out within 24–48 hours of announcement."],
```

**friendly:**
```
["Follow along for new product drops, behind-the-scenes, and the occasional discount.", "We post a few times a week."],
["Sign up for early access to new collections. We sell out quickly.", "One email per drop, promise."],
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
["Follow for one useful thing a week.", "Not a course. Not a challenge. Just one thing that actually helps."],
["Sign up for the things we wish we could tell everyone.", "One post a week. Practical, specific, no upsell."],
["Follow for the stuff that actually makes a difference.", "Weekly posts. No filler, no sales pitch."],
["Follow before you need us.", "Useful content now. When the time comes, you'll already know us."],
["One useful post a week. That's the whole deal.", "Follow for practical guidance that actually makes a difference."],
["Follow along for the advice we wish someone had told us earlier.", "One post a week, nothing overwhelming."],
["Sign up for the email that people actually look forward to.", "One short, useful thing a week. No hard sell, ever."],
["Follow if you like practical advice from people who do this every day.", "No influencer formulas. Just what actually works."],
["We share what's working for the people we work with.", "Follow for honest, practical guidance. Not just inspiration."],
["Subscribe and you'll get one genuinely useful thing a week.", "We write it the way we'd explain it to a friend."],
["Subscribe to receive evidence-based wellness guidance and practitioner insights.", "Published weekly. No promotional content."],
["Follow for clinical updates, research summaries, and practical application notes.", "New content three times weekly."],
["Sign up for weekly wellness guidance grounded in current research.", "We cite our sources. No trend-chasing."],
["Subscribe to our practitioner newsletter for research, case insights, and program updates.", "Published weekly. Written by our clinical team."],
["Follow for regular evidence-based content on health, performance, and recovery.", "One newsletter per week. Plain language, referenced."],
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
["Sign up for our newsletter to receive curated wellness guidance from our team.", "Evidence-based, plainly written, one issue per week."],
```

---

### creative_pro

**bold:**
```
["Follow the work. New projects posted as they ship.", "Straight from the studio."],
["Sign up for our newsletter: launches, case studies, and process notes.", "We write when we have something real to share."],
["Follow along. New work every few weeks.", "Process, launches, and lessons learned."],
["Follow to see the work before it's done.", "In-progress shots, process decisions, and reveals. Posted as they happen."],
["Sign up for the newsletter: the case study, the launch story, and what we'd do differently.", "Written when we have something worth saying."],
["Sign up and we'll show you what goes into each project.", "The brief, the thinking, and the finished work."],
["Follow to see how the work gets made, not just what it looks like.", "Studio process, decisions, and project launches."],
["Follow if you like seeing how design decisions get made.", "We share the thinking behind the work, not just the outcome."],
["Sign up for the newsletter. It's where the real project stories live.", "One issue per project cycle. Real stories."],
["Follow along and see how each project comes together.", "Process shots, creative decisions, and the final reveal."],
["Follow if you want to see more than the portfolio.", "We share what worked, what didn't, and what we'd do again."],
["Subscribe and you'll see new projects before they're on the portfolio.", "Process notes, launch details, and what happened next."],
["Subscribe to receive project case studies, methodology notes, and industry perspective.", "Published monthly."],
["Follow for updates on recent engagements, creative process documentation, and professional commentary.", "New content weekly."],
["Subscribe for in-depth project documentation and creative process insight.", "One issue per project cycle."],
["Follow for project updates, case documentation, and professional perspective on the field.", "Content published consistently each month."],
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
["Follow for practical guidance on things that actually affect you.", "No jargon. No upsell. Just what applies to you."],
["Sign up before something changes in your situation.", "When it matters, you'll want to already be reading this."],
["Follow for the plain-language take on what's happening.", "We translate the complicated stuff so you don't have to."],
["Subscribe and stay ahead of the things that affect people like you.", "One email a month. Two minutes to read."],
["Follow before you need us.", "Regular updates that help you understand your options before you're in a situation."],
["Subscribe for monthly updates that actually help you make sense of things.", "We write like we're talking to a smart friend."],
["Follow for practical guidance on the things that affect your life and your business.", "No spin, no sales pitch."],
["Sign up for one useful update a month.", "People tell us it's the only email they actually read."],
["Follow along for the plain-language guidance we wish more people had access to.", "One issue per month."],
["Subscribe and we'll keep you informed on the things that matter without the jargon.", "We respect your inbox. One email a month, never more."],
["Subscribe to receive monthly analysis of regulatory changes and industry developments.", "Published on the first of each month. No promotional content."],
["Follow for regular updates on the issues, regulations, and decisions that affect businesses and individuals.", "New content each week."],
["Sign up for monthly commentary on matters that affect our clients and their situations.", "Plain analysis. No advertising."],
["Subscribe to receive our monthly briefing on the issues most relevant to your circumstances.", "Published monthly. Written by our team."],
["Follow for timely updates on regulatory developments, policy changes, and their practical implications.", "One publication per week. Plain language throughout."],
```

**friendly:**
```
["Subscribe for monthly updates that actually help you make decisions.", "We write like we're talking to a smart friend."],
["Follow us for practical guidance on things that matter to people like you.", "No spin, no sales pitch."],
["Sign up and get one useful update a month.", "Plain language on things that actually affect you."],
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
["Follow to see what the work actually looks like.", "Impact stories, field updates, and real results from the community."],
["Sign up and stay close to the work.", "Monthly updates on what's happening, what's working, and what's coming."],
["Follow to see what we're getting done together.", "Real updates from the ground. Not press releases."],
["Subscribe and hear what's happening on the ground.", "We share what's working, what's hard, and how the community is showing up."],
["Sign up and we'll share what's happening on the ground.", "Monthly: stories from the community, updates on impact, and ways to get more involved."],
["Follow along and watch what a community can accomplish.", "Updates, stories, and moments from the work every week."],
["Sign up and we'll keep you close to what matters.", "Monthly updates on the community, the impact, and the people making it possible."],
["Subscribe to receive our monthly impact report and program updates.", "Published on the first of each month."],
["Follow for regular updates on programs, outcomes, and organizational news.", "Content published weekly."],
["Subscribe to receive our impact reports, annual review, and partnership updates.", "One publication per month. No solicitations."],
["Follow for program updates, impact data, and opportunities to get involved.", "We publish consistent, honest updates on our work."],
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
["We've done work on your property before.", "Call when you're ready for the next job. We'll know the setup."],
["Something come up since we last worked together?", "Reach out and we'll take care of it."],
["Annual maintenance is easier with a crew that knows your property.", "Book your check-in for this season."],
["Schedule seasonal maintenance before it becomes urgent.", "We'll review what's been done and recommend what's next."],
["Still have a second phase on the list? Let's get it back on the schedule.", "We keep notes on every job."],
["A quick check-up costs less than waiting.", "Book a short inspection and we'll tell you where things stand."],
```

### food_hospitality

```
["It's been a while. We'd love to see you again.", "The menu has changed. Come find your new favorite."],
["Been a while? We've missed you.", "Reserve your usual spot online."],
["Ready to come back? Your table is waiting.", "Book online in two minutes."],
["We've changed the menu since you last came in.", "Come back and find your new favorite."],
["It's been too long.", "Whenever you're ready, your table is here."],
["You're always welcome back.", "New dishes, same kitchen, same care. Come see us."],
["The menu has changed since you were last in.", "Several new dishes that weren't here before."],
["Your table is waiting. New additions landed this month.", "Reserve in two minutes."],
["We've changed a few things since your last visit.", "Come back and try something you haven't had before."],
```

### retail_maker

```
["New things have landed since your last order.", "Come back and take a look."],
["Ready for something new? See the latest collection.", "Past customers get early access on request."],
["Something new just arrived.", "Come see what's added since your last visit."],
["New pieces have arrived since you were last here.", "Some of the best work we've done. Take a look."],
["The shop has changed since your last visit.", "New materials, new pieces, new work in the shop."],
["It's been a while. Plenty has landed in the shop since then.", "Come back and see what's here."],
["We restock selectively.", "Come see what made it back and what's new alongside it."],
["Some pieces that were requested are back in the shop.", "Come take a look at what's here."],
```

### health_wellness

```
["Time to book your next appointment.", "We'll pick up right where we left off."],
["Ready to get back on track? Book a session.", "Your history is on file, no need to start over."],
["Slip in a session before the month ends.", "Evening and weekend slots available."],
["Time for another session?", "We'll pick up right where we left off. Book online any time."],
["It's been a while. Your next session is waiting.", "Book online and we'll get you back on track."],
["Ready to check in?", "Book your next session online. We keep your history on file."],
["New practitioners have joined the team since your last visit.", "Come back and see what's available now."],
["Consistency is what keeps the progress going. Ready to get back on a schedule?", "Evening and weekend slots are open right now."],
```

### creative_pro

```
["Working on something new? Let's pick it up.", "Existing clients get priority on timeline."],
["Ready for the next project? Send the brief.", "We keep all past work on file for continuity."],
["Something new on the horizon? Get in touch.", "We make it easy to continue."],
["Something new in the pipeline?", "Send the brief and we'll tell you how we'd approach it."],
["Have a new project coming up? Get in touch early.", "Existing clients get priority on timeline."],
["Have something new taking shape? We'll get up to speed fast.", "We keep your files and preferences on hand."],
["New project this quarter? Send the brief.", "Existing clients get first access to the calendar."],
["Something been sitting on your list? This might be the right time.", "We respond to past clients within 24 hours."],
```

### professional_svc

```
["Something changed? Let's revisit your situation.", "A short call is usually enough to get current."],
["Ready to take the next step? Schedule a follow-up.", "We'll review where things stand and map out next steps."],
["Time for a check-in? Book a short call.", "We keep your file updated, no need to start from scratch."],
["Something in your situation has changed?", "Schedule a check-in. We'll review where things stand and map out next steps."],
["Time for an annual review?", "We'll pull up your file and catch up on what's changed."],
["Things change. A short review call keeps your situation current.", "We'll flag anything that needs attention."],
["It's been over a year. Time to revisit where things stand.", "A 20-minute call is enough to get oriented."],
["If your situation has changed since we last spoke, reach out.", "We keep current on what matters to past clients."],
```

### community

```
["Still with us? We'd love to reconnect.", "New programs have launched since you were last here."],
["Come back and see what's changed.", "New programs and new ways to get involved."],
["Ready to get back in? Reach out.", "We'll find the right fit for where you are now."],
["Still believe in the work? We'd love to have you back.", "New programs have launched. There's more to do."],
["Ready to re-engage?", "Reach out and we'll find the best way to bring you back in."],
["A lot has happened since you were last involved.", "Come back and see what's been built."],
["New programs have launched. There's a better fit for where you are now.", "Come back and see where you belong."],
["Your contribution still matters. Come back and continue it.", "We'll find the right role for where you are today."],
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
["Reply and I'll have a written estimate in your inbox today.", "Every quote breaks down what the job is, how long it takes, and what it costs."],
["Send the job. I'll send the quote.", "Same day. No site visit required."],
["Reply 'PRICE' and I'll put together a number by end of day.", "Written, no commitment to move forward."],
["Hit reply with the details. Quote back same day.", "Just describe the job. I'll follow up if I have questions."],
["Send a quick note about the job and I'll price it out.", "You'll have a number by end of day."],
```

**friendly:**
```
["Hit reply with a few details about the job and I'll put together a quote.", "We're usually pretty quick."],
["Reply with what's going on. I'll give you an honest number and timeframe.", "No pressure."],
["Send a quick note with the details and I'll have a quote by tomorrow.", "Happy to answer questions along the way."],
["Not sure how to describe the job? Just tell me what you noticed.", "I'll ask a couple questions and get you a number."],
["Hit reply and I'll sort it out.", "A photo helps. A description works too."],
["Reach out and I'll tell you what the job involves and what it'll cost.", "No commitment needed."],
["Reply when you're ready.", "I'll give you an honest read on what it'll take and what it'll cost."],
["Drop me a message about the job.", "I'll reply with a quote or a couple quick questions to get there."],
```

**professional:**
```
["Reply with your project details and we will send a written estimate in one day.", "No obligation required to receive a quote."],
["To receive a formal quote, please reply with the project scope and your address.", "We will follow up with a written estimate and available dates."],
["Send project details by reply and we will respond with a comprehensive quote.", "All estimates are provided at no charge."],
["Please reply with your project requirements and we will provide a written estimate within one business day.", "Formal quotes include scope, materials, and labor breakdown."],
["Reply with the property address and a description of the work.", "We will respond with a written quote and available dates."],
["Please reply with the relevant details and we will follow up with a written quote.", "No site visit required for preliminary pricing."],
```

---
**narrator: local_team**

**bold:**
```
["Reply with the job details. Our team will have a quote to you today.", "We cover the whole area. Same-day response on most inquiries."],
["Send the address and what needs doing. We'll dispatch someone this week.", "Our team responds within one business day."],
["Reply with your address. We'll send an estimator to take a look.", "Written quote within 24 hours of the site visit."],
["Reply now. Our team will put together a quote by end of day.", "We respond to every inquiry within one business day."],
["Reply with the job and your location. Our team covers the area.", "Quote comes back fast."],
```


**friendly:**
```
["Reply and we'll send someone out to take a look.", "Our team is in the area most weeks."],
["Hit reply and we'll arrange a time for one of our crew to come by.", "No obligation. Just a good look at the job."],
["Reply with the details and our team will get back to you the same day.", "We like to understand the job properly before quoting."],
["Reply and we'll organise a site visit.", "Our team covers the whole area and responds fast."],
["Reply with the address and what's going on. We'll get someone out.", "We give honest quotes and take the time to explain what's needed."],
```


**professional:**
```
["Please reply with your project requirements. Our team will respond with next steps within one business day.", "All quotes are provided in writing with full scope and cost breakdown."],
["Reply to arrange an on-site assessment.", "Our team will confirm timing within one business day and provide a written quote on completion."],
["Please reply with your project details and preferred timeline.", "We will assign an estimator and respond within one business day to confirm the visit."],
["Reply to request a site assessment from our team.", "We confirm all bookings same day and provide written quotes within 24 hours of each visit."],
["Please reply with a brief project description.", "Our team will contact you within one business day to arrange a complimentary estimate."],
```

### food_hospitality

**bold:**
```
["Reply 'ORDER' and I'll send the link to order online.", "Or just come in. We're open every day."],
["Reserve online or reply and I'll hold a table for you.", "Filling up fast this weekend."],
["Reply with your party size and I'll confirm availability.", "Walk-ins welcome when we have room."],
["Reply and I'll hold you a table.", "Tell me the day and how many. I'll have it confirmed by tonight."],
["Reply 'TABLE' and I'll reserve your spot.", "Or just come in. We always try to make room."],
["Hit reply with your order and I'll set it aside for pickup.", "Usually ready in 20 minutes."],
["Reply with when you want to come in.", "I'll confirm your table and let you know what's on."],
["Want to come this week? Reply and I'll hold a spot for you.", "Tables go fast on weekends. Better to reply now."],
```

**friendly:**
```
["Hit reply and tell me what sounds good.", "Dinner in or takeout. I'll handle the details."],
["Reply with how many people and when, and I'll sort out a reservation.", "Happy to do it by email."],
["Hit reply and tell me what you're thinking: dinner in, takeout, or a bigger event.", "We'll make it easy."],
["Reply and I'll grab you a table.", "Just tell me when and how many."],
["Hit reply with a day that works and I'll hold a spot for you.", "We'd love to have you in this week."],
["Want to come in? Hit reply.", "Tell me the date and party size and I'll take care of it."],
["Dinner in or takeout. I'll set it up.", "Reply and I'll take it from there."],
```

**professional:**
```
["Reply with your date and party size and we will confirm availability in one day.", "Private dining and catering inquiries also welcome by reply."],
["To make a reservation or place a catering inquiry, please reply with the relevant details.", "We respond to all inquiries same day."],
["Reply with your reservation request and we will confirm by return email.", "Group bookings require 48 hours notice."],
["Please reply with your preferred date and party size and we will confirm availability within one business day.", "Advance notice of 48 hours required for group bookings."],
["To reserve a table, please reply with your name, preferred date, and party size.", "We will confirm your reservation by return email."],
["For reservations, catering inquiries, or private dining, please reply with the relevant details.", "Our team responds to all inquiries same day."],
["Please reply with your dining or event requirements and we will confirm arrangements promptly.", "We accommodate all dietary requirements with advance notice."],
```

---
**narrator: solo_maker**

**bold:**
```
["Reply with the date and party size and I'll hold your spot.", "Limited seats. Once it's full, that's it."],
["Reply and I'll book you in.", "Tell me the date that works. I'll confirm availability."],
["Hit reply and I'll secure your place.", "Small dinner. Everything made by me."],
["Reply and I'll add you to the booking.", "Limited seats. First to reply gets them."],
["Reply with your preferred date. I'll confirm the spot.", "I run small dinners. When they fill, they fill."],
```


**friendly:**
```
["Hit reply and I'll get you a spot at the next dinner.", "Just tell me the date and how many."],
["Reply and I'll save a seat for you.", "Small group, made entirely by me. Every time."],
["Reply with the date that works.", "I'll send you the details and hold the seat."],
["Hit reply and let's get it in the calendar.", "I keep the groups small. Tell me how many."],
["Reply and I'll take care of the rest.", "Just tell me when and I'll get you sorted."],
```


**professional:**
```
["Please reply with your preferred date and party size and I will confirm availability within one business day.", "All bookings include a full menu in advance and personal preparation."],
["Reply to book your place at my next dinner or catering event.", "I confirm all bookings within one business day and provide the full menu in advance."],
["To reserve your place, please reply with your preferred date and guest count.", "I take a limited number of bookings each month. I will confirm availability within one business day."],
["Reply with your booking details and I will respond within one business day.", "All events prepared personally. Menu provided in advance."],
["To make a booking, please reply with the date and number of guests.", "I confirm all bookings within one business day."],
```

### retail_maker

**bold:**
```
["Reply 'ORDER' and I'll send the checkout link.", "Ships within three days."],
["Want it? Reply and I'll set it aside. I'll send a direct payment link.", "Fast shipping on all orders."],
["Reply with what you want and your address. I'll invoice you directly.", "Usually out the door in two days."],
["Reply and I'll hold it. Payment link in my next message.", "Small batch. It won't last."],
["Want it shipped by Friday? Reply by Wednesday.", "All orders placed by midweek ship the same week."],
["Reply with your order and I'll send an invoice today.", "Direct payment link. Ships fast."],
["Reply and I'll grab the item and have it ready to ship.", "Usually out the door in two days."],
```

**friendly:**
```
["Hit reply and tell me what you'd like. I'll set up the order for you.", "Happy to answer sizing or product questions first."],
["Reply and I'll grab your order and get it shipped.", "Usually out the door within a couple of days."],
["Send a quick reply with your order and I'll invoice you directly.", "Easy checkout, fast shipping."],
["Hit reply with what you'd like and your shipping address. I'll set it aside for you.", "Happy to answer any questions about the product first."],
["Just reply and tell me what you want. I'll make it easy.", "Payment link, fast shipping, done."],
["Reply and I'll have it packed and ready to ship.", "I like making sure everything arrives in good shape."],
["If you're ready to order, just hit reply. I'll take care of it.", "Made by hand, packed carefully, shipped fast."],
["Hit reply with your order. I'll take it from there.", "Made by hand, shipped with care. Usually out the door in two days."],
```

**professional:**
```
["Reply to place your order and we'll send a secure payment link in one day.", "All orders ship within three to five business days."],
["To purchase, please reply with the item and quantity and we will send an invoice.", "We accept all major payment methods."],
["Reply with your order details and we will confirm availability and send payment instructions.", "Returns accepted within 30 days."],
["Reply with the item and quantity and we will issue an invoice within one business day.", "All orders ship within three to five business days of payment confirmation."],
["To place an order, please reply with the product name, quantity, and shipping address.", "We will send a secure payment link and confirm your order by return email."],
["Reply to purchase and we will send a payment link within one business day.", "We include tracking information when the item ships."],
["Please reply with your order details and preferred shipping address to complete your purchase.", "We accept all major payment methods and ship within the stated lead time."],
```

---
**narrator: product_led**

**bold:**
```
["Reply to order and we'll invoice you directly.", "New collection is live. Ships within three days."],
["Reply with what you want. We'll set the order up today.", "Everything in stock ships within two days."],
["Reply and we'll hold it. Invoice on the way.", "New pieces in the collection. Small run."],
["Want it? Reply and we'll handle the order.", "Ships fast. Handmade and ready to go."],
["Reply with your order. We'll send the invoice and ship fast.", "Everything in our collection ships within three days."],
```


**friendly:**
```
["Hit reply with what you'd like and we'll sort the order.", "Made by hand, packed carefully, shipped fast."],
["Reply with what you'd like and we'll get it ready for you.", "New pieces in the collection. Happy to answer questions."],
["Hit reply with your order. We'll take care of the rest.", "Everything ships within two to three days."],
["Reply with what you'd like. We'll pack and ship it.", "Made by hand. Careful packing, fast shipping."],
["Hit reply and tell us what you'd like. We'll sort it out.", "Ships within three days of payment. Everything made by our team."],
```


**professional:**
```
["Reply with the item and quantity and we will send an invoice within one business day.", "All orders ship within three to five business days."],
["Please reply with your order details and we will confirm availability and send payment instructions.", "We accept all major payment methods."],
["Reply to place your order and we will issue an invoice within one business day.", "All products ship within three to five business days of payment confirmation."],
["To complete your purchase, please reply with the item and your shipping address.", "We will send a secure payment link and confirm your order within one business day."],
["Reply with your order and we will confirm availability and send an invoice.", "Returns accepted within 30 days. All products ship within the stated lead time."],
```

### health_wellness

**bold:**
```
["Reply 'BOOK' and I'll send you the booking link.", "New and returning clients welcome."],
["Reply with your preferred day and I'll check availability.", "Usually have openings within the week."],
["Reply and I'll hold a spot for you.", "Spots fill quickly. Better to reply now."],
["Reply with a day that works and I'll check availability.", "New openings added every week. Usually have spots within a few days."],
["Want a spot this week? Reply now.", "Tell me your preference and I'll check right away."],
["Reply and I'll send the booking link for the next open slot.", "Morning, afternoon, and evening available."],
```

**friendly:**
```
["Hit reply with a day that works for you and I'll check what's open.", "We'll get something on the books."],
["Reply and I'll send you the scheduling link. Pick whatever works.", "Happy to answer questions first."],
["Send a quick reply and we'll find a time.", "New clients always welcome."],
["Reply with what days work best and I'll find you a spot.", "New and returning clients always welcome."],
["Hit reply and I'll check availability.", "Morning, afternoon, and evening slots. Tell me what works."],
["Just reply and we'll figure out the time together.", "I try to make it as easy as possible to get something on the books."],
["Reply with a couple of days that work and I'll pick the best one.", "I'll also get a quick intake form to you before the first session."],
["When you're ready, just hit reply.", "Tell me what works for your schedule and I'll find the right spot."],
```

**professional:**
```
["Reply with your preferred appointment times and we will confirm availability within one business day.", "New patient paperwork can be completed in advance."],
["To schedule, please reply with two or three times that work for you.", "We will confirm your appointment by email."],
["Reply to this email to request an appointment and we will respond with available times.", "We offer morning, afternoon, and select evening appointments."],
["Please reply with your preferred appointment times and we will confirm within one business day.", "Morning, afternoon, and select evening appointments available."],
["To arrange your appointment, please reply with two or three times that work for you.", "We will confirm by email and send any intake documentation in advance."],
["Reply with your scheduling preferences and we will respond with available times within one business day.", "New client paperwork can be completed online prior to your first appointment."],
["Please reply to request an appointment and include your preferred days and times.", "We will confirm within one business day and provide any pre-appointment forms."],
["To schedule your session, please reply with your availability for the week ahead.", "All appointments are confirmed in writing."],
```

---
**narrator: local_team**

**bold:**
```
["Reply and we'll hold the next available slot.", "Our team covers morning, afternoon, and evening."],
["Reply and we'll match you with the right practitioner.", "Same-week slots available."],
["Reply with your preferred day and we'll find the right slot.", "Our team responds within one business day."],
["Reply to book. We'll match you with the right person on our team.", "Morning, afternoon, and evening available."],
["Reply and our team will confirm your appointment.", "We have availability this week. Same-week bookings welcome."],
```


**friendly:**
```
["Hit reply with a day that works and we'll find the right slot.", "Happy to answer questions about our practitioners first."],
["Reply and we'll match you with the right person for what you're working on.", "We're glad you reached out."],
["Reply with a couple of days that work and our team will find a time.", "We'll also send a brief intake form so we make the most of your first session."],
["Reply and our team will book you in.", "We'll take care of matching you with the right practitioner."],
["Hit reply and we'll sort a time for you.", "Our team covers a range of days and times. We'll find something that works."],
```


**professional:**
```
["Please reply with your preferred appointment times and our team will confirm within one business day.", "We will match you with the appropriate practitioner."],
["Reply to schedule and our team will confirm within one business day.", "We will assign the appropriate practitioner and send intake paperwork in advance."],
["To arrange your appointment, please reply with two or three times that work for you.", "Our team will confirm and match you with the right practitioner."],
["Please reply to request an appointment and our team will respond with available times within one business day.", "We cover morning, afternoon, and select evening appointments."],
["Reply to book and our team will confirm within one business day.", "We will assign the appropriate practitioner and send pre-appointment paperwork."],
```

### creative_pro

**bold:**
```
["Reply with your brief and I'll get back to you by tomorrow.", "Taking new projects now."],
["Send the scope and I'll give you an honest timeline and price.", "Quick turnaround on proposals."],
["Reply with what you need. We'll reply with an honest read on fit and timing.", "Straight answer, fast."],
["Reply with the brief. Honest read back by tomorrow.", "Taking new work now."],
["Reply with the overview. I'll get back to you today.", "Clear answer on fit, timeline, and price."],
["Reply with the brief. Even rough is fine.", "I'll give you an honest read and a proposal if it's a fit."],
["Send the project scope. I'll reply with an honest timeline and fee.", "Two-day turnaround on all proposals."],
```

**friendly:**
```
["Hit reply with your project details and we'll see if we're a good fit.", "No pitch deck needed, just talk to us."],
["Reply with the basics: what it is, when you need it, what you have.", "We'll take it from there."],
["Send a reply with the overview and we'll have a conversation.", "We love early-stage ideas."],
["Reply with what you're building and I'll see if I can help.", "No pitch deck required. Just tell me about the project."],
["Hit reply with the project overview. I'll read it today.", "If it sounds like a good fit, I'll get back to you the same day."],
["Tell me about the project.", "Even early-stage is fine. I love hearing about things before they're figured out."],
["Send a quick reply and I'll let you know if we're a good fit.", "Honest read, fast reply."],
["Reply with the overview. I'll take it from there.", "We love early-stage projects. Send what you have."],
```

**professional:**
```
["Please reply with your scope and timeline. We will respond with a proposal within two days.", "All proposals include a written scope, timeline, and fixed fee."],
["Reply to this email to begin the inquiry process.", "We'll schedule a brief discovery call."],
["Send project details by reply and we will provide a written proposal at no obligation.", "We take on a limited number of engagements per quarter."],
["Reply with your project requirements and we will respond with a written proposal.", "We take on a limited number of engagements per quarter."],
["To begin a project inquiry, please reply with scope and deadline details.", "We provide written proposals for all inquiries within two business days."],
["Reply to initiate a project inquiry and we will respond within two business days.", "All proposals include scope, timeline, and fixed-fee pricing."],
```

---
**narrator: solo_expert**

**bold:**
```
["Reply with the brief. I'll get back to you today.", "Taking new work now."],
["Send the scope. I'll give you an honest timeline and price.", "Quick response, always."],
["Reply with the overview. I'll get back to you today.", "Clear answer on fit, timing, and price."],
["Reply with the brief. Even rough is fine.", "I'll give you an honest read and a proposal if it's a fit."],
["Send the project scope. I'll reply with timeline and fee.", "Two-day turnaround on all proposals."],
```


**friendly:**
```
["Reply with what you're building and I'll see if I can help.", "No pitch deck required. Just tell me about the project."],
["Hit reply with the project overview.", "If it sounds like a good fit, I'll get back to you the same day."],
["Tell me about the project.", "Even early stage is fine. I love hearing about things before they're figured out."],
["Send a quick reply and I'll let you know if I'm the right fit.", "Honest read, fast reply."],
["Reply with the overview. I'll take it from there.", "I love early-stage projects. Send what you have."],
```


**professional:**
```
["Please reply with your project scope and timeline. I will respond with a proposal within two business days.", "All proposals include a full scope of work and fixed fee."],
["Reply with your project requirements and I will respond with a written proposal.", "I take on a limited number of engagements each quarter."],
["To begin a project inquiry, please reply with scope and deadline details.", "I provide written proposals within two business days."],
["Please reply with your scope, objectives, and timeline.", "I will follow up with a discovery call and written proposal within two business days."],
["Reply to initiate a project inquiry and I will respond within two business days.", "All proposals include scope, timeline, and fixed-fee pricing."],
```

### professional_svc

**bold:**
```
["Reply with your situation in two lines and I'll tell you what I think.", "Straight answers, no runaround."],
["Hit reply and I'll schedule a free call.", "Quick response, always."],
["Reply and I'll set up a call this week.", "First consultation is free."],
["Hit reply and we'll sort it out.", "Tell me what's going on. I'll tell you what I'd do."],
["Reply and I'll book the call.", "You'll leave the first conversation knowing exactly what to do next."],
```

**friendly:**
```
["Reply with a quick summary and I'll give you my honest read.", "No obligation."],
["Hit reply and we'll set up a call. Happy to talk before you commit.", "Free initial conversation, always."],
["Send a short reply and we'll find a time to talk.", "We'll answer your questions first."],
["Hit reply and I'll set up a free conversation.", "No obligation. I'm just a good person to talk to about this."],
["Send a quick reply and we'll find a time to talk.", "We always answer questions first. No commitment required."],
["Reply with the basics and I'll tell you where things stand.", "Free first call. Honest answer."],
["Hit reply and let's set something up.", "You'll leave the first call with more clarity than you have now."],
```

**professional:**
```
["Please reply with a brief summary of your situation. Next steps in one business day.", "Initial consultations are complimentary and confidential."],
["Reply to schedule a complimentary consultation.", "All info stays confidential."],
["To arrange an initial consultation, please reply with your availability for a brief call.", "We will confirm within one business day."],
["To arrange a consultation, please reply with your availability for a brief call.", "We will confirm within one business day. All discussions are confidential."],
["Reply to request a complimentary initial consultation.", "We respond to all inquiries within one business day. All info stays confidential."],
```

---
**narrator: solo_expert**

**bold:**
```
["Reply and I'll set up a call this week.", "I practice independently. Clear answers, no runaround."],
["Hit reply and I'll give you a straight read.", "Tell me what's going on. I'll tell you what I'd do."],
["Reply with your situation and I'll give you an honest answer.", "I handle every file personally. Fast response."],
["Reply and I'll book a call.", "You'll leave the first conversation knowing exactly what to do next."],
["Reply and I'll set up a free consult.", "Clear answers. No jargon. I practice independently."],
```


**friendly:**
```
["Reply with a quick summary and I'll give you my honest read.", "I practice independently. You'll deal with me directly."],
["Hit reply and I'll set up a free conversation.", "I keep my client list small so I can be genuinely useful. Free first call."],
["Send a quick reply and I'll find a time to talk.", "I'm here to give you a real answer, not pass you off to someone else."],
["Reply with the basics and I'll tell you where things stand.", "Free first call. I handle everything personally."],
["Hit reply and let's set something up.", "You'll leave the first call with more clarity than you came in with."],
```


**professional:**
```
["Please reply with a brief summary of your situation and I will respond within one business day.", "Initial consultations are complimentary and strictly confidential. I handle all matters personally."],
["Reply to schedule a complimentary initial consultation.", "I will confirm timing within one business day. All discussions are confidential."],
["To arrange a consultation, please reply with your availability.", "I will confirm within one business day. I handle every file personally. All discussions are confidential."],
["Please reply with context on your situation and preferred contact times.", "I respond within one business day. All initial consultations are complimentary and confidential."],
["Reply to request a complimentary initial consultation.", "I respond to all inquiries within one business day. All information remains strictly confidential."],
```

### community

**bold:**
```
["Reply 'YES' and I'll add you to the volunteer list!", "We need people like you."],
["Hit reply and tell me how you want to get involved.", "Every kind of help matters."],
["Reply and I'll send you the details on how to sign up.", "Easy to do, takes two minutes."],
["Reply and I'll find you the right role.", "Tell me how you want to help and I'll match you with the best fit."],
["Hit reply and I'll walk you through how to get involved.", "Volunteer, donate, or advocate. All of it matters."],
["Reply and I'll connect you with the right program.", "We need people like you. It's easy to start."],
["Reply and let's get you matched with the right opportunity.", "Tell me what you care about and I'll find the fit."],
```

**friendly:**
```
["Reply with how you'd like to help and we'll find the right fit.", "There's something for everyone."],
["Hit reply and we'll walk you through the ways you can get involved.", "No commitment required to ask questions."],
["Reply and let us know you're interested. We'll send more details.", "We're always glad to hear from people who want to help."],
["Hit reply and tell me how you want to help.", "There's a place for everyone here. I'll find yours."],
["Reply and I'll walk you through the ways you can get involved.", "No experience needed. Just a desire to show up."],
["Reply and I'll connect you with the right opportunity.", "We'd love to have you with us."],
["Tell me what you care about and I'll help you find the right fit.", "Reply and we'll figure it out together."],
["Reply and we'll find the best way for you to get involved.", "No commitment required to ask questions."],
```

**professional:**
```
["Please reply with your interest. We'll follow up with options in two days.", "All inquiries welcome."],
["Reply to this email for ways to get involved.", "We will respond with available programs and next steps."],
["To get involved, please reply with your interest area and availability.", "We match contributors with the right programs."],
["Reply to express your interest in volunteering or giving.", "We will follow up with program details and match you with the appropriate opportunity."],
["To explore involvement options, please reply with your interest area and availability.", "We match contributors with programs that fit their time and capacity."],
```

---

## Goal: `lead_gen`



### community

```
["Reply and tell me how you want to help.", "I'll match you with the right role and walk you through it."],
["Tell me you're interested. I'll take it from there.", "Volunteer, donate, or advocate. Every kind of help matters."],
["Reply with how you'd like to get involved.", "I'll find the right fit and make it easy to start."],
["Hit reply and I'll tell you what's possible.", "We have roles for all kinds of people and all kinds of availability."],
["Reply and I'll match you with the right program.", "Tell me what you care about. I'll find the fit."],
["Tell me you're in and I'll connect you with the team.", "There's a place for you in this work."],
["Reply and I'll walk you through the ways to help.", "Every contribution matters. Let's find yours."],
["Hit reply and let's figure out how you can be part of this.", "Volunteer, give, or show up. We'll find what makes sense."],
["Reply and tell me a bit about how you'd like to get involved.", "There's something for everyone here. I'll help you find the right fit."],
["Hit reply and let's figure out the best way for you to help.", "No prior experience needed. Just tell me what you're up for."],
["Reply with what you care about and I'll find the right match.", "We'd love to have you with us."],
["Tell me what you're up for and I'll walk you through the options.", "We make it easy to find a role that fits your life."],
["Send a reply and we'll talk through the ways you can get involved.", "No commitment required. Just a conversation."],
["Reply and I'll share what the work actually looks like.", "Then we'll figure out the best way for you to be part of it."],
["Hit reply and tell me how much time you have.", "We'll find a role that fits, and we'd genuinely love to have you."],
["Reply and I'll connect you with the right person on our team.", "We make getting involved as easy as we can."],
["Please reply with your area of interest and availability.", "We will respond within two business days with program details and next steps."],
["Reply to inquire about volunteer or donor programs.", "We will match you with the appropriate program and follow up within two business days."],
["To request information on involvement opportunities, please reply with your interests and capacity.", "All inquiries receive a personal response within two business days."],
["Please reply with your area of interest.", "We will respond with available programs and a recommended starting point."],
["Reply to this email to initiate a volunteer or partnership inquiry.", "We will respond within two business days with available options."],
["To explore how you or your organization can get involved, please reply with relevant context.", "We match contributors with programs by fit and capacity."],
["Please reply with your name, interest area, and preferred involvement type.", "We will follow up within two business days to discuss the right program."],
["Reply with your interest in volunteering, giving, or organizational partnership.", "We respond to all inquiries within two business days and provide a clear outline of next steps."],
```

---

### retail_maker

```
["Reply with your order size and timeline. I'll have a quote to you in two days.", "Custom work and bulk orders welcome."],
["Want something made to spec? Reply with the details.", "I'll tell you if we can make it and what it'll cost within two business days."],
["Trade buyer? Reply with your shop and what you're looking for.", "We work with a small number of wholesale accounts."],
["Reply with your custom or bulk order inquiry. Quote in two days.", "No commitment required to ask."],
["Wholesale or corporate gift inquiry? Reply and I'll get back to you fast.", "Pricing, minimums, and lead times included."],
["Custom piece? Reply with the brief.", "I'll tell you if we can make it and what it'll cost."],
["Want to place a larger order? Reply with what you need.", "Bulk and trade pricing available. I'll send the details."],
["Reply with your specs and I'll put together a quote.", "Two-day turnaround on all custom and bulk inquiries."],
["Have a custom idea you want to make real? Reply and tell me about it.", "We love making things that aren't in the shop yet."],
["Looking to stock our work in your shop? Hit reply.", "We work with small retailers we believe in. Happy to talk terms."],
["Got a gift idea that needs to be made from scratch? Reply with the details.", "Tell me who it's for and what they love. I'll take it from there."],
["Need a larger order than what's in the shop? Reply and I'll figure out the pricing.", "We're happy to work with you on bulk or custom orders."],
["Want something custom? Reply and tell me what you're thinking.", "We make things that don't exist yet all the time. Send the idea."],
["Interested in wholesale? Hit reply and we'll have a conversation.", "We're selective but always open to hearing from the right retailers."],
["Reply if you have a custom commission or bulk order in mind.", "No brief too early. We love talking through ideas before they're fully formed."],
["Tell me what you're looking for. If we can make it, we will.", "Reply with the idea and I'll get back to you personally."],
["Please reply with your inquiry details and we will respond with pricing and lead times within two business days.", "Custom work and wholesale pricing available. No commitment required to inquire."],
["To initiate a custom or wholesale order, please reply with your specifications.", "We will respond with feasibility, pricing, and production timelines within two business days."],
["Reply to request trade or wholesale pricing.", "Volume discounts and net-30 terms available to qualifying retailers."],
["Please reply with your product inquiry for corporate gifting or branded commissions.", "We accommodate quantities of 25 and above. Lead times vary by product."],
["To discuss a custom order, please reply with a brief description of your requirements.", "All custom work is quoted in writing before production begins."],
["Reply to request information on bulk pricing and production minimums.", "We work with commercial buyers and trade accounts. Response in two business days."],
["For wholesale or volume inquiries, please reply with your business name and product interests.", "We match trade buyers with the right program and pricing tier."],
["Please reply with your specifications and required timeline.", "We will confirm feasibility and provide a written quote within two business days."],
```

---
**narrator: product_led**

**bold:**
```
["Reply with your wholesale or trade inquiry.", "We supply boutiques and gift shops. Quote within two business days."],
["Interested in stocking our products? Reply with your details.", "We work with a select number of retail partners."],
["Reply with your custom or bulk order requirements.", "We produce to spec and quote within two business days."],
["Wholesale or corporate gifting? Reply now.", "We design and produce handmade products at volume. Quote in two days."],
["Reply with your trade inquiry.", "We work with boutiques, gift shops, and corporate gifting programs."],
```


**friendly:**
```
["Reply and tell us about your shop or event.", "We love working with independent retailers and finding the right wholesale partners."],
["Hit reply and let's talk wholesale.", "We work with a small number of retail partners we really believe in."],
["Reply if you'd like to stock our products in your shop.", "We'd love to find the right home for our collection."],
["Reply with your trade or wholesale inquiry and we'll figure out if it's a fit.", "We work with retailers, corporate gifting programs, and interior designers."],
["Tell us about the project in a reply.", "Custom orders, bulk production, or wholesale. We handle all of it in our studio."],
```


**professional:**
```
["Please reply with your wholesale or trade requirements and we will respond within two business days.", "Volume discounts and net-30 terms available to qualifying retailers."],
["Reply to request wholesale pricing and minimum order information.", "We will respond within two business days with our wholesale terms."],
["To initiate a wholesale or custom inquiry, please reply with your business details and requirements.", "We respond to all trade inquiries within two business days."],
["Please reply with your inquiry details and we will respond with pricing and lead times within two business days.", "We accommodate custom specifications from 25 units."],
["Reply with your wholesale or corporate gifting inquiry.", "We will respond within two business days with pricing, minimums, and production timelines."],
```

### trades_home

**bold:**
```
["Reply with what needs fixing. We'll reply with next steps.", "Free quote, no site visit required."],
["Describe the job and I'll give you a ballpark by end of day.", "No strings."],
["Send me the details and I'll put together a quote.", "One business day turnaround."],
["Snap a photo and hit reply. I'll have a number back to you by end of day.", "No visit needed for a ballpark."],
["Tell me what you've got. Quote in 24 hours.", "Written, no commitment."],
["Reply with the job. I'll reply with a price.", "Same day when you send before noon."],
["What's the problem? Describe it in one line and I'll put a quote together.", "Fast, free, no visit required."],
["Send the brief. Written quote within one business day.", "Detailed, ready to act on."],
```

**friendly:**
```
["Reply with what's going on and I'll give you an honest read.", "If it sounds like a fit, I'll send a free quote."],
["Tell me a bit about the project and we'll figure out next steps together.", "No pressure."],
["Hit reply with the job details and I'll put together a free estimate.", "No visit required for a ballpark. Just tell me what you've got."],
["Not sure exactly what needs doing? That's what I'm here for.", "Tell me what you've seen and I'll help you figure out the job."],
["Reach out about the job, even if it's still fuzzy.", "We'll talk it through and I'll put a quote together."],
["Tell me what's going on at the property.", "I'll give you an honest read on what makes sense and what it'll cost."],
["Drop me a note about what you're dealing with.", "I'll reply with a quote or a couple quick questions to get there."],
```

**professional:**
```
["Reply with a project summary and we'll follow up with next steps in one day.", "All estimates provided at no charge."],
["Please reply with your project details and preferred timeline.", "We'll contact you with scope and a written quote."],
["Please reply with the work type and property address to begin the estimate.", "We respond to all inquiries within one business day."],
["Reply with a brief description of the scope and we will provide next steps within one business day.", "Estimates are complimentary and provided in writing."],
["Send your inquiry by reply and we will respond with a formal next step within one business day.", "All preliminary assessments are provided at no charge."],
["Reply with your project scope and preferred contact method.", "We will respond with a written estimate or schedule a call at your convenience."],
["To begin the estimate process, please reply with a project description.", "We respond within one business day with a scope assessment and preliminary pricing."],
```

---
**narrator: local_team**

**bold:**
```
["Reply with the job details. Our team will get back to you today.", "Free quote. We cover the whole area."],
["Describe the job and our team will put together a quote.", "We respond to all inquiries within one business day."],
["Reply now. Our team will have a quote to you by tomorrow.", "No site visit required for most jobs."],
["Send the details. Our team will assess the scope and reply with a quote.", "Same-day response on most inquiries."],
["Reply with what needs doing. Our estimators will get back to you today.", "Free quote, no strings."],
```


**friendly:**
```
["Reply and our team will give you an honest read on the job.", "We cover the whole area and respond fast."],
["Tell us what's going on and we'll figure out the right crew to send.", "Reply with as much detail as you have."],
["Reply with the details. Our team will help figure out exactly what needs doing.", "We take the time to explain the scope before quoting."],
["Hit reply and we'll talk through the job.", "Our team knows the area and the work. We'll give you a straight answer."],
["Reply with what you're dealing with and we'll work out the scope.", "We respond to every inquiry within one business day."],
```


**professional:**
```
["Please reply with your project summary. Our team will respond within one business day with next steps.", "All estimates are provided at no charge and include a written scope."],
["Reply with your project details and our team will confirm next steps within one business day.", "We provide written quotes for all inquiries."],
["Please reply with project scope and preferred timeline. Our team will respond within one business day.", "All quotes are written, itemized, and free of charge."],
["Reply with a brief description of the work required.", "Our team will confirm scope and schedule a site visit within one business day."],
["To begin the estimate process, please reply with project details and your availability.", "We respond to all inquiries within one business day."],
```

### food_hospitality

**bold:**
```
["Planning an event? Reply with the date and headcount and I'll build the menu.", "Groups of 10 to 200."],
["Reply with your event details and I'll get back to you today.", "We handle everything from corporate lunches to weddings."],
["Tell me the occasion and I'll tell you what we can do.", "Reply to start planning."],
["Hosting something? Hit reply.", "Tell me the headcount and the occasion and I'll put together options."],
["Reply with the date and the vibe.", "I'll come back with a menu and a plan."],
["Event coming up? Reply with the basics.", "Date, headcount, what you're celebrating. I'll build the menu around that."],
["Need catering for something that matters? Reply today.", "I'll have ideas back to you by end of day."],
["Corporate or personal, big or small. Reply with the details.", "Same-day response on all event inquiries."],
```

**friendly:**
```
["Planning something? Hit reply and tell me about it.", "We love putting together menus for special occasions."],
["Send the details: date, size, vibe. I'll put together some options.", "We're flexible and we make it easy."],
["Reply with what you're thinking and we'll figure out the rest together.", "Private events and catering are our specialty."],
["Something special coming up? Tell me about it.", "I love designing menus around what makes the occasion."],
["Hit reply with the occasion and who's coming.", "We'll build something around what makes it special."],
["Planning a celebration? Let's talk.", "Tell me the details, even if it's still early, and I'll put some ideas together."],
["Catering or private dining, reach out and we'll figure it out together.", "I'll reply with some options that match what you're thinking."],
["Got an event on the horizon? Hit reply.", "Tell me the vibe and the guest count and I'll get excited about it with you."],
```

**professional:**
```
["Please reply with your event date, expected guest count, and any dietary requirements.", "Our events team will respond within one business day with a proposal."],
["To request a catering or private event proposal, please reply with relevant details.", "We accommodate all group sizes and dietary needs."],
["Reply with your event inquiry and we'll discuss menus and pricing in one day.", "References available on request."],
["For catering or private dining inquiries, please reply with your event date and guest count.", "Our events coordinator will provide a proposal within one business day."],
["To arrange catering or a private dining experience, please reply with the relevant details.", "We accommodate groups from 10 to 200 and respond within one business day."],
["For events of any size, please reply with the date, occasion, and guest count.", "Our team will respond with a customized proposal within one business day."],
```

---
**narrator: solo_maker**

**bold:**
```
["Reply with the date and headcount. I'll build the menu.", "Private dinners and event catering. Fast reply."],
["Planning a private event? Reply with the details.", "I'll get back to you today with a menu concept."],
["Reply with the occasion and the guest count. I'll take it from there.", "I cook everything personally for private groups and events."],
["Private event or catering? Reply now.", "Tell me the date and I'll put together a menu concept."],
["Reply with the basics: date, size, occasion. I'll do the rest.", "Private catering for groups of 6 to 50."],
```


**friendly:**
```
["Reply and tell me about the event.", "I love putting together something special. Tell me the date and what you're thinking."],
["Hit reply with the details.", "Private dinner or catering. I'd love to hear what you have in mind."],
["Tell me about the occasion in a reply.", "I design the menu around the moment. Send me the details."],
["Reply with the vibe and the headcount.", "I'll put together a menu concept that fits."],
["Reply and let's figure out the menu together.", "I do private dinners and events. Tell me what you're after."],
```


**professional:**
```
["Please reply with your event date, guest count, and any dietary requirements.", "I will respond within one business day with a custom menu proposal."],
["Reply to request a catering or private dining proposal.", "I will follow up within one business day with availability and a menu concept."],
["To initiate an event catering inquiry, please reply with relevant details.", "I respond to all inquiries within one business day. All preparation handled personally."],
["Please reply with your event details and I will respond with a proposal within one business day.", "All catering is prepared personally. Custom menus for groups of 6 to 50."],
["Reply with your event requirements and I will respond within one business day.", "Custom proposals for private dining and event catering. Prepared entirely by me."],
```

### health_wellness

**bold:**
```
["Reply 'INTRO' and I'll send the link for a free first session.", "No commitment."],
["Reply with what you're working on and I'll suggest the right starting point.", "Free consult, your call."],
["Hit reply and I'll send you the intake form. Takes five minutes.", "We'll go from there."],
["Reply and I'll set up a free consult.", "Tell me what you're working toward. First conversation is on me."],
["Reply with your goal and I'll tell you where to start.", "Free intro. Straight answer."],
["Not sure where to start? That's fine. Reply and we'll figure it out.", "Free consult, no commitment."],
["Reply and I'll get you set up with a free first session.", "We'll figure out what you need and build from there."],
["Reply with two lines about what you're after.", "I'll tell you honestly if we're the right fit."],
```

**friendly:**
```
["Reply with what you're hoping to work on and I'll suggest the best start.", "First conversation is always free."],
["Hit reply and I'll send the link to book a free intro session.", "We'll figure out if it's a good fit."],
["Reply with your goals and I'll share an honest read on how we can help.", "No sales pitch, just a conversation."],
["Reply and I'll set us up for a free conversation.", "Tell me a bit about what you're dealing with and we'll go from there."],
["Not sure what to ask? Just reply with where you're at.", "I'll ask the questions. Free intro, no pressure."],
["Hit reply and tell me a little about what's going on.", "Free intro. Just a conversation, no sales pitch."],
["Reply and I'll send you the link for a free intro session.", "Completely free. No commitment. Just a conversation."],
```

**professional:**
```
["Please reply with a brief summary of your goals. Focused next step in one day.", "Initial consultations are complimentary."],
["Reply to request a complimentary consultation.", "Available times and intake details."],
["To begin the process, please reply with your goals and current situation.", "We respond to all new client inquiries within one business day."],
["To begin the inquiry process, please reply with a description of what you are looking to address.", "All initial consultations are complimentary and private."],
["Reply with a brief description of what you would like to address.", "We offer complimentary initial consultations for all new inquiries."],
```

---
**narrator: local_team**

**bold:**
```
["Reply and our team will set up a free consult.", "We'll match you with the right person and figure out the best starting point."],
["Reply to book a free intro session with our team.", "Same-week slots available. We'll match you with the right practitioner."],
["Reply and we'll get you in for a free consult.", "Our team will assess your situation and recommend the right next step."],
["Hit reply. Our team will book you in for a free intro.", "We'll match you with the right practitioner. No commitment."],
["Reply to start. Our team will take it from there.", "Free first session. We'll figure out the right fit."],
```


**friendly:**
```
["Reply and we'll set up a free conversation with the right person on our team.", "Tell us a bit about what you're working on."],
["Hit reply with a bit about your situation.", "Our team will figure out who's the right fit and set up a free intro."],
["Reply and we'll match you with the right practitioner for a free intro.", "No commitment. Just a good first conversation."],
["Hit reply and tell us what you're hoping to work on.", "Our team will do the matching. Free first session."],
["Reply and we'll figure out the best place to start.", "Free intro session. Our team will find the right fit."],
```


**professional:**
```
["Please reply with a summary of your goals and our team will respond with recommended next steps within one business day.", "Initial consultations are complimentary."],
["Reply to request a complimentary consultation with our team.", "We will match you with the appropriate practitioner and confirm timing within one business day."],
["Please reply with a brief description of what you are looking to address.", "Our team will respond within one business day with a recommended practitioner and available consultation times."],
["Reply to initiate a complimentary consultation.", "Our team will review your inquiry and confirm the right practitioner within one business day."],
["Please reply with your goals and any relevant background.", "Our team will respond within one business day with recommended next steps and available practitioners."],
```

### creative_pro

**bold:**
```
["Reply with the brief. We'll reply with timing and pricing.", "Two-day turnaround on all proposals."],
["Send the scope and I'll get back to you tomorrow.", "Currently booking new projects."],
["Reply with the overview and I'll take it from there.", "Quick response, always."],
["Send the scope, even rough, and I'll reply with an honest assessment.", "Two-day turnaround on all project replies."],
["Reply with what you need. I'll tell you if we're a fit.", "Clear answer, fast reply."],
["Tell me about the project and I'll get back to you today.", "Currently taking on new work. Quick response guaranteed."],
["Send the project details and I'll reply with a proposal or an honest redirect.", "We take time to give you a real read, not a generic pitch."],
```

**friendly:**
```
["Reply with a bit about the project, even if it's still early.", "We love talking through ideas before they're fully formed."],
["Hit reply with the basics and we'll see if we're a good fit.", "No formal brief required, just tell us what you're building."],
["Send a reply with what you need and I'll get back to you within a day.", "Happy to answer early questions. Next step in one day."],
["Reply with what you're working on and I'll see how I can help.", "Early-stage ideas are especially welcome. Send what you have."],
["Hit reply with a short description of the project.", "I'll read it today and get back to you with an honest take."],
["Tell me about the project, even just a sentence or two.", "We reply personally to every inquiry."],
["Send a quick reply and I'll tell you if we're a good fit.", "No formal brief required. Just tell me what you're building."],
["Reply with what you need and I'll take it from there.", "Happy to talk through ideas before they're fully formed."],
```

**professional:**
```
["Please reply with your scope and timeline. We'll respond with written proposal in two days.", "Proposals include scope, timeline, and a fixed fee."],
["Reply to initiate a project inquiry.", "We'll schedule a discovery call."],
["Send project details by reply and we'll follow up with a written proposal.", "We provide clear scope and pricing before any engagement begins."],
["Reply to request a written proposal.", "We respond to all project inquiries within two business days."],
["To initiate a project inquiry, please reply with relevant scope and timeline details.", "We follow up to schedule a discovery call and provide a written proposal."],
["Reply to begin the inquiry process.", "We will confirm receipt and schedule a discovery call within two business days."],
```

---
**narrator: solo_expert**

**bold:**
```
["Reply with the brief. Honest read by tomorrow.", "I'm booking new projects now."],
["Send the scope and I'll tell you if I'm the right fit.", "Two-day turnaround on every project inquiry."],
["Reply with what you need. I'll tell you if it's a fit.", "Clear answer, fast reply."],
["Tell me about the project and I'll get back to you today.", "Currently taking on new work."],
["Send the details and I'll give you an honest read.", "I take my time to give you a real assessment, not a generic pitch."],
```


**friendly:**
```
["Reply with what you're working on and I'll see how I can help.", "Early-stage ideas are especially welcome."],
["Hit reply with a short description of the project.", "I'll read it today and get back to you with an honest take."],
["Tell me about the project, even just a sentence or two.", "I reply personally to every inquiry."],
["Send a quick reply and I'll tell you if I'm a good fit.", "No formal brief required. Just tell me what you're building."],
["Reply with what you need and I'll take it from there.", "Happy to talk through ideas before they're fully formed."],
```


**professional:**
```
["Please reply with your project scope and timeline. I will respond with a written proposal within two business days.", "All proposals include scope, timeline, and a fixed fee."],
["Reply to request a written proposal.", "I respond to all project inquiries within two business days."],
["To initiate a project inquiry, please reply with scope and timeline details.", "I follow up with a discovery call and written proposal within two business days."],
["Please reply with your project overview and I will respond within two business days.", "I take on a limited number of new engagements each quarter."],
["Reply to begin the inquiry process.", "I will confirm receipt and follow up with a discovery call within two business days."],
```

### professional_svc

**bold:**
```
["Reply with your situation in plain terms and I'll tell you what I'd do.", "First conversation is free."],
["Hit reply and I'll set up a call. We'll sort it out.", "Clear answers, fast."],
["Send the overview and I'll get back to you with next steps.", "No jargon in return."],
["Reply and I'll set up a free call.", "Tell me what's going on. I'll tell you exactly where you stand."],
["Tell me the situation. I'll tell you the options.", "Reply now. I'll get back to you the same day."],
```

**friendly:**
```
["Reply with what's going on and I'll share an honest read on what makes sense.", "No obligation."],
["Hit reply with the basics, even if you're not sure where to start.", "We'll talk it through and figure out next steps together."],
["Send a quick reply and we'll set up a call.", "Free initial conversation, always."],
["Hit reply and tell me a bit about your situation.", "I'll reply with what I'd actually do. Free first call."],
["Send a quick note and we'll set up a time to talk.", "Free initial conversation. We give straight answers."],
["Reply with the basics. Even if you don't know what to ask.", "We'll figure out what you need and go from there."],
["Just reply and I'll get back to you.", "We love helping people understand their situation clearly."],
```

**professional:**
```
["Please reply with a brief summary of your situation. Focused next step in one day.", "Initial consultations are complimentary and strictly confidential."],
["Reply to schedule a complimentary consultation.", "We'll confirm timing in one day."],
["To initiate the process, please reply with relevant context and your preferred contact times.", "All info stays confidential."],
["Reply to request a complimentary initial consultation.", "We will confirm timing within one business day."],
["To initiate the inquiry process, please reply with relevant context.", "All initial consultations are complimentary. Strict confidentiality maintained."],
```

---
**narrator: solo_expert**

**bold:**
```
["Reply with your situation in plain terms and I'll give you my honest read.", "I practice independently. First call is free."],
["Hit reply and I'll get back to you today.", "Clear answers, fast. I handle every matter personally."],
["Send the overview and I'll reply with next steps.", "I give real answers. I practice on my own."],
["Reply and I'll set up a free call.", "Tell me what's going on. I'll tell you exactly where you stand."],
["Tell me the situation. I'll tell you the options.", "I practice independently. Same-day reply."],
```


**friendly:**
```
["Reply with what's going on and I'll share my honest read.", "Free first call. I deal with every client personally."],
["Hit reply and tell me a bit about your situation.", "I'll reply with what I'd actually do. Free first call."],
["Send a quick note and I'll find a time to talk.", "I give straight answers. Free initial conversation."],
["Reply with the basics.", "I'll figure out what you need and take it from there. Free first call."],
["Just reply and I'll get back to you.", "I practice independently. I'm here to help you understand your situation clearly."],
```


**professional:**
```
["Please reply with a brief summary of your situation and I will respond with recommended next steps within one business day.", "All initial consultations are complimentary. I maintain strict confidentiality on every matter."],
["Reply to request a complimentary initial consultation.", "I will confirm timing within one business day. Strict confidentiality throughout."],
["To initiate an inquiry, please reply with relevant context.", "I practice independently and handle every file personally. All initial consultations are complimentary."],
["Please reply with a description of your situation and preferred contact times.", "I will respond within one business day with available consultation times. All information is confidential."],
["Reply to schedule a complimentary consultation.", "I provide clear guidance on next steps at no obligation. I handle every matter personally. All discussions are confidential."],
```

## Goal: `audience_growth` — Email

### trades_home

```
["Reply 'YES' and I'll add you to our project update list.", "One email a month: before-and-afters, tips, and seasonal reminders."],
["Want to stay updated on local projects and maintenance tips? Reply 'IN'.", "Short, useful updates without a sales pitch."],
["Reply to subscribe. We send one practical update per month.", "Real jobs, honest advice."],
["Reply 'LIST' and I'll add you.", "One email a month: finished jobs, seasonal reminders, and one useful tip."],
["Want a heads-up before peak season? Reply 'IN' and I'll add you.", "One short update per month, nothing more."],
["Reply 'UPDATES' and I'll send you our monthly round-up.", "Real project photos, honest advice. That's it."],
["Reply and I'll add you to the list before the next one goes out.", "Before-and-afters from a local job. The kind you'll recognize from around the neighborhood."],
["Reply 'IN' if you want the honest version of what trades work actually costs in this area.", "One email a month. No spin."],
```

### food_hospitality

```
["Reply 'YES' and I'll add you to the weekly specials list.", "First to know about events and menu changes."],
["Want our weekly update? Reply 'IN' and you're on the list.", "Events, specials, and the occasional behind-the-scenes."],
["Reply to get the weekly update: what's new, what's on, what's good.", "One email a week, always worth opening."],
["Reply 'ON' and I'll add you to our weekly update.", "New specials, event announcements, and the occasional recipe."],
["Want to know what's on before you make plans? Reply 'LIST'.", "I send one short email per week, usually Monday morning."],
["Reply 'MENU' and I'll send you the weekly specials every week.", "First to know when the menu changes."],
["Reply and I'll add you before the next specials email goes out.", "This week's menu will help you decide where to eat."],
["Reply 'IN' and I'll send you what's new this week.", "We update more than most people realize: new dishes, seasonal notes, upcoming events."],
["Reply to subscribe. One short email a week, always about something real.", "What's on, what's changed, and what to order."],
```

### retail_maker

```
["Reply 'YES' and I'll add you to the early-access list.", "First to see new drops before they go live."],
["Want early access to new releases? Reply 'IN'.", "Small batches. Being on the list matters."],
["Reply to get early notification on new collections.", "We send one email per drop, promise."],
["Reply 'IN' and I'll add you to the early-access list.", "One email per drop, before anything goes live. That's it."],
["Want to see what's in the works before it hits the shop? Reply 'YES'.", "Process shots, sourcing stories, and launch dates before they're public."],
["Reply to get on the list.", "One short email per collection, every time."],
["Reply and I'll add you to the early-access list before the next drop.", "Small batch. Being on the list is the best way to not miss it."],
["Reply 'IN' and you'll get a note the moment the next collection goes live.", "I send one email per drop. No more."],
```

### health_wellness

```
["Reply 'YES' and I'll add you to the weekly tips list.", "One short, useful email a week."],
["Want practical weekly guidance? Reply 'IN'.", "No upsell, just useful."],
["Reply to subscribe to our weekly newsletter.", "Evidence-based, plainly written, one issue per week."],
["Reply 'IN' and I'll add you to the weekly guidance list.", "One short, useful email a week. No hard sell, ever."],
["Want one practical thing per week? Reply 'YES'.", "I write the kind of guidance I wish more people had access to."],
["Reply to get on the list.", "Weekly guidance from our team. Evidence-based, plainly written."],
["Reply and I'll add you before this week's email goes out.", "This week's topic is one we get asked about constantly."],
["Reply 'IN' for one useful update a week.", "We write about what actually works. No supplements pitch, no productivity hacks."],
```

### creative_pro

```
["Reply 'YES' and I'll add you to the studio newsletter.", "Project reveals, process notes, and occasional industry perspective."],
["Want to follow the work? Reply 'IN' and I'll add you.", "One email per project cycle, promise."],
["Reply to subscribe to our newsletter.", "Case studies, process notes, project reveals."],
["Reply 'IN' and I'll add you to the studio newsletter.", "Case studies, process notes, and project launches. One issue per cycle."],
["Want to see the work as it develops? Reply 'YES'.", "Behind-the-scenes and process updates for subscribers only."],
["Reply to get on the list.", "One issue per project cycle. The case study, the launch, and what happened after."],
["Reply and I'll add you before the next project reveal email goes out.", "It's one of the better projects this quarter."],
["Reply 'IN' for case studies that actually show how decisions got made.", "Not just the final look. The full process, including the parts that didn't work."],
```

### professional_svc

```
["Reply 'YES' and I'll add you to our monthly update.", "Plain-language coverage of issues that affect you."],
["Want regular practical guidance on things that matter? Reply 'IN'.", "One email a month, no promotional content."],
["Reply to subscribe to our newsletter.", "Practical updates on what matters."],
["Reply 'IN' and I'll add you to the monthly update.", "Plain-language coverage of what's changing and what it means for you."],
["Want practical guidance that actually helps you make decisions? Reply 'YES'.", "One email a month. We write it like we're talking to a smart friend."],
["Reply to get on the list.", "Monthly update on the things that affect people like you. No jargon."],
["Reply and I'll add you before the next monthly update goes out.", "This month covers a change that's affecting a lot of people right now."],
["Reply 'IN' for plain-language updates on what matters.", "We write what we wish more people understood. No jargon, no agenda."],
```

### community

```
["Reply 'YES' and I'll add you to our community update.", "Impact stories, events, and ways to help monthly."],
["Want to stay close to the work? Reply 'IN'.", "We share what's happening on the ground."],
["Reply to subscribe to our monthly update.", "Stories, events, and ways to help."],
["Reply 'IN' and I'll add you to the community update.", "Monthly: what's happening, what's working, and how people are making a difference."],
["Reply to get on the list.", "Monthly updates on the work. Honest, real, and always personal."],
["Reply and I'll add you before the next community update goes out.", "Real updates from the ground this month. One of the better ones."],
["Reply 'IN' and stay close to the work.", "We write when something real has happened, and that's been a lot lately."],
```

---

## Goal: `retention` — Email

### trades_home

```
["Been a while since we've worked together? Reply and let's talk about what's next.", "We keep your job history on file."],
["Seasonal maintenance coming up? Reply and I'll get you on the schedule.", "Past clients get priority booking."],
["Ready for the next phase of the project? Reply and we'll pick it up.", "We remember the job. Just tell us what you need."],
["Something come up at the property? Hit reply.", "We'll know the layout from last time and can move fast."],
["Due for your annual check-in? Reply and I'll get you on the schedule.", "Past clients always get priority."],
["We haven't worked together in a while.", "If you've got something coming up, reply and let's sort it out."],
["Something nagging at you around the house? Reply and we'll talk through whether it needs attention.", "Honest read, no obligation."],
["Have a second phase from last time? Reply and we'll get it back on the list.", "We still have your job notes on file."],
```

### food_hospitality

```
["Been a while? Come back and see what's changed.", "Reply to make a reservation or order online."],
["We've added some new things to the menu since you last visited.", "Reply to see what's on or to book a table."],
["We miss you. Come in this week.", "Reply and I'll hold a table."],
["It's been too long.", "Reply and I'll save you a table. The menu has changed."],
["We've updated the menu since you were last in.", "Reply and I'll send you what's new."],
["Come back this week.", "I'll hold you a spot. We'd love to see you."],
["The menu has changed since your last visit.", "Reply to make a reservation and we'll take care of the rest."],
["It's been a while. Come back this week and try something new.", "Reply and I'll hold a table for you."],
["A few new dishes have landed since your last visit.", "Reply if you'd like to come in. I'll hold a table."],
```

### retail_maker

```
["New things have arrived since your last order.", "Reply to see what's new or to reorder."],
["Ready to reorder? Reply and I'll set it up.", "Same product, still made by hand."],
["Something new has landed that you might like based on your last purchase.", "Reply and I'll send the details."],
["New things have landed since your last order.", "Reply to see what's in the shop now. Some of the best work we've done."],
["The shop looks different since you were last here.", "Reply if you'd like to see what's new."],
["It's been a while since your last order. A lot has changed.", "Reply and I'll share what's new."],
["New pieces have arrived since your last order.", "Reply to see what's back and what's new."],
["We restocked a few things that have been requested.", "Reply if you'd like details before they go live to everyone."],
["Since your last order, we've added a few things you might recognize.", "Reply and I'll send you a preview."],
```

### health_wellness

```
["Ready to book your next appointment? Reply and I'll check availability.", "We'll pick up right where we left off."],
["Time for a check-in? Reply with a few days that work.", "Your history is on file, no need to start over."],
["It's been a while. Ready to get back on track? Reply and we'll find time.", "New slots just opened up."],
["It's a good time to come back in.", "Reply and I'll find you a slot. New openings this week."],
["New practitioners and programs have been added since your last visit.", "Reply if you'd like to know what's available now."],
["It's easy to fall off track. Ready to get back on a schedule? Reply with a day or two that works.", "We'll make it work."],
```

### creative_pro

```
["Working on something new? Reply with the brief.", "Existing clients get priority on timeline."],
["Ready for the next project? Reply and let's pick it up.", "We keep all past files for continuity."],
["Something new on the horizon? Reply and let's talk.", "We make it easy to continue."],
["Something new in the pipeline? Reply with the brief.", "We keep all previous work on file. Easy to get started quickly."],
["Have a new project coming up? Reach out early.", "We work best when there's time to do it right."],
["Have something in the pipeline? Reply with the brief.", "We keep your past files. No need to start from scratch."],
["Something been sitting on your list? This might be the time to move it.", "Reply and I'll get back to you within 24 hours."],
["If there's a new project taking shape, I'd love to hear about it early.", "Reply with what you have. Rough is fine."],
```

### professional_svc

```
["Something changed in your situation? Reply and we'll set up a quick call.", "A 20-minute check-in is usually enough."],
["Ready to take the next step? Reply and I'll pull up your file.", "We'll review where things stand and map out what's next."],
["Time for a review? Reply to schedule a short call.", "Your records are up to date, no restart needed."],
["Something has changed? Reply and we'll set up a check-in.", "A 20-minute call is usually enough to get current."],
["Time for an annual review? Reply and we'll schedule a call.", "Your records are up to date. No need to start from scratch."],
["Something change recently? A short call gets you current.", "Reply and I'll pull your file before we talk."],
["Annual review is a good habit. Reply to schedule a short check-in.", "We'll look at what's shifted and map out what's next."],
["If your situation has changed since we last spoke, reach out.", "Reply and I'll find time to connect."],
```

### community

```
["Ready to get back involved? Reply and we'll find the right fit.", "New programs have launched since you last joined us."],
["We'd love to have you back. Reply and we'll reconnect.", "There's always more to do."],
["Miss being part of it? Reply and we'll figure out the best way to re-engage.", "Every return matters as much as the first time."],
["We'd love to reconnect. Reply when you're ready.", "New programs have launched. There's more to be part of than before."],
["Still believe in the work? Reply and let's talk.", "We'll find the best way to bring you back in."],
["We've launched new programs since you were last involved.", "Reply and we'll match you to the right one."],
["Even a small contribution makes a difference right now.", "Reply and we'll find a way back in that fits your schedule."],
["Your history with us means we know where you can make the biggest impact.", "Reply and we'll figure out the best next step together."],
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
["Tap the link to book your free estimate.", "Same-week slots open."],
["DM a photo and what you need done. I'll get back to you with a price.", "Same-day response."],
["Comment your postcode and I'll let you know if we cover your area.", "Free quote, no visit needed for most jobs."],
["DM us the job. A photo and a few words is enough.", "Quote comes back fast."],
```

**friendly:**
```
["DM us the details and we'll put together a free estimate.", "We get back to everyone fast."],
["Tap the link in bio to book, or just DM us.", "Happy to answer questions in comments too."],
["Drop a comment or DM if you want a quote.", "We're local and we respond quickly."],
["Drop a DM and we'll take a look at the job.", "We'll give you an honest read on what it needs."],
["Tap the link to see our availability and pick a time.", "We work around your schedule."],
["DM us a photo to get started.", "We'll come back with next steps and a number."],
```

---
**narrator: local_team**

**bold:**
```
["Get a quote from our team. Link in bio.", "We cover the whole area and respond within one business day."],
["Tap the link to book a free estimate.", "Our team is available most weeks. See open slots."],
["Comment 'QUOTE' and our team will reach out.", "Same-day response. No obligation."],
["Tap the link to request a quote from our team.", "Licensed, insured, and local. We cover the whole area."],
["Book a free site visit. Our team will assess and quote.", "Tap the link in bio."],
```


**friendly:**
```
["Tap the link and book a free estimate with our team.", "We're local, we respond fast, and we give straight quotes."],
["DM us the details. Our team will get back to you.", "We cover the whole area."],
["Drop a DM. Our team will sort out the next step.", "We work around your schedule."],
["Tap the link to book a site visit with our team.", "A good honest look at the job. No obligation."],
["Contact us and we'll have someone out this week.", "DM or tap the link in bio."],
```

### food_hospitality

**bold:**
```
["Order online. Link in bio.", "Ready in 20 minutes."],
["Tap to reserve your table.", "Booking fast for this weekend."],
["Link in bio to order or reserve.", "Come see us."],
["Tap to reserve or order now.", "We're ready when you are."],
["Order online or book your table. Link in bio.", "Ready in 20. Open every day."],
["Book your table for this weekend. Link in bio.", "Spots are going fast."],
["DM 'TABLE' and I'll sort the reservation.", "Any size, any day this week."],
["Tap the link. Order or reserve in two taps.", "Come hungry. We've got you."],
```

**friendly:**
```
["Order online or reserve a table. Link in bio.", "We'd love to see you."],
["Tap the link to book a table or order ahead for tonight.", "We'd love to see you."],
["Come in or order from home. The link in bio has everything.", "Open every day."],
["Hungry? Tap the link in bio and order or book.", "We'd love to see you."],
["DM us and we'll hold a table.", "Just tell us when and how many."],
["Tap the link in bio and see the menu before you decide.", "Come in or order from home."],
["Tap to reserve. Come eat well.", "We'll have a table ready."],
```

---
**narrator: solo_maker**

**bold:**
```
["Book a seat at my next dinner. Link in bio.", "Limited seats. First come, first served."],
["Tap the link to see my next date and book.", "Small group. Made entirely by me."],
["Comment 'BOOK' and I'll DM you the link.", "Limited seats. Don't wait."],
["Tap to see my schedule and book a spot.", "Pop-up dinners and private events. I only take a small number at a time."],
["My next date is live. Tap the link to book.", "I cook for small groups. Seats go fast."],
```


**friendly:**
```
["Come find me at my next pop-up.", "Tap the link to see dates and book a spot."],
["Tap the link to see my schedule.", "I host small dinners. Everything cooked by me, from scratch."],
["DM me if you want a spot at my next dinner.", "Small groups. Limited availability."],
["Tap the link for my next date.", "I cook for small groups and private events."],
["Come sit at my table.", "Tap the link to see my next pop-up date and reserve a spot."],
```

### retail_maker

**bold:**
```
["Tap the link in bio to shop!", "Ships in three days, handmade."],
["Comment 'WANT IT' and I'll DM the link!", "Small batch. Grab it while it's here."],
["Link in bio to shop the drop.", "Selling fast."],
["Comment 'MINE' and I'll DM you the link.", "Small batch. Once it's gone, that's it."],
["DM 'WANT' and I'll send the direct link.", "Sells out every time."],
["Tap the link. These won't be here at the end of the week.", "New drop, small batch."],
["Comment below if you want one. I'll DM the link.", "Made by hand, shipping this week."],
```

**friendly:**
```
["Shop the collection. Link in bio.", "Handmade with care, shipped with love."],
["Tap the link and grab one while they're here.", "Small batches, won't be around forever."],
["Link in bio to shop. New pieces just landed.", "Everything made by hand."],
["Tap the link in bio and grab yours before they're gone.", "Made by hand in small batches."],
["DM us if you want one set aside.", "We do that for people who ask."],
["Tap the link and come find your new favorite thing.", "Made by hand, gone before you know it."],
["Shop through the link in bio. New things just landed.", "Made with care, sold in small batches. Get yours."],
```

---
**narrator: product_led**

**bold:**
```
["New collection is live. Tap the link to shop.", "Handmade, limited run. Order now."],
["New drop. Link in bio.", "Designed and made in our studio. Ships fast."],
["Shop the new collection. Link in bio.", "Handmade in small batches. Get yours before it's gone."],
["Tap to shop the drop.", "New pieces from our studio. Limited run."],
["The new collection is here. Tap the link.", "Handmade and ready to ship."],
```


**friendly:**
```
["Tap the link to shop the new collection.", "Everything designed and made by our team. New pieces every season."],
["New pieces from our studio just landed in the shop.", "Tap the link to browse. Small run. Get yours before they're gone."],
["Come take a look at the new collection.", "Tap the link. Handmade, built to last."],
["Shop our latest. Link in bio.", "Handmade in small batches. Something new in every collection."],
["New additions to the collection just dropped.", "Tap the link. Everything made by our team, ships within three days."],
```

### health_wellness

**bold:**
```
["Book online. Link in bio.", "Same-week slots for new clients."],
["Tap to book. Same-week slots open.", "New and returning clients welcome."],
["Link in bio to book your appointment.", "Evening and weekend slots available."],
["Comment 'BOOK' and I'll DM the scheduling link.", "Same-week slots available."],
["Tap the link in bio to book your next session.", "New clients welcome. Evening and weekend slots open."],
["DM 'APPT' and I'll check availability for you.", "Same-week openings available."],
["Tap to book. We have availability this week.", "New and returning clients welcome."],
["Book through the link in bio.", "Takes 60 seconds. We'll send a confirmation."],
```

**friendly:**
```
["Book your appointment through the bio link.", "New clients welcome. We're glad you're here."],
["Tap the link and pick a time that works for you.", "We'll take care of the rest."],
["Ready to book? Link is in our bio.", "We send a day-before reminder."],
["DM us if you have questions before booking.", "Happy to answer questions first."],
["Tap the link to find a time.", "We'll send a reminder the day before and take it from there."],
["Ready when you are. Tap the link and find a time.", "New and returning clients welcome."],
```

---
**narrator: local_team**

**bold:**
```
["Book with our team. Link in bio.", "We match you with the right practitioner. Same-week slots available."],
["Tap to book. Our team has openings this week.", "Multiple disciplines. New clients welcome."],
["Comment 'BOOK' and we'll DM you the link.", "Our team covers morning, afternoon, and evening."],
["Tap the link to book with our team.", "We'll match you with the right practitioner for what you're working on."],
["Book online. Our team is ready.", "Same-week slots. New and returning clients welcome."],
```


**friendly:**
```
["Tap the link and book with our team.", "We'll match you with the right person. New clients always welcome."],
["Book your appointment with our team through the link in bio.", "Morning, afternoon, and evening available."],
["Drop a DM if you have questions before booking.", "Happy to answer questions first."],
["Tap the link and find a time that works.", "Our team will take care of the rest, including matching you with the right practitioner."],
["Book with us. Tap the link.", "Our team covers a range of specialties and days. We'll find the right fit."],
```

### creative_pro

**bold:**
```
["DM to start a project.", "Taking new clients now."],
["Tap the link to see the work and get in touch.", "Quick responses, always."],
["DM with your brief and I'll respond today.", "New projects welcome."],
["DM the brief. I'll get back to you today.", "Currently booking new projects."],
["DM 'BRIEF' and I'll reach out.", "Taking on new clients now."],
["Comment below and I'll DM you the portfolio link.", "Tell me about the project."],
["DM with the overview. I'll give you an honest read.", "Fast response, no pitch."],
```

**friendly:**
```
["DM us and tell us about the project.", "We love early-stage ideas."],
["Tap the link to see the portfolio. DM if something resonates.", "We reply to every message personally."],
["Send us a DM if you're working on something and want to talk it through.", "No formal brief required."],
["DM us about the project. Early stage is fine.", "We love conversations before the brief is nailed down."],
["Drop a DM and tell us what you're building.", "We reply personally to everything."],
["DM us and we'll see if we're the right fit.", "We take on a small number of new projects at a time."],
["Comment below if you have a project you want to talk through.", "We'll DM you and set up a quick conversation."],
```

---
**narrator: solo_expert**

**bold:**
```
["See my work. DM if you want to talk.", "I take a small number of projects at a time. Currently booking."],
["My portfolio is live. DM with the brief.", "I respond to every message personally."],
["DM me to start a project.", "I'm taking on new clients now. I reply to every message."],
["Tap the link to see my portfolio. DM if it looks right.", "I work with a limited number of clients per quarter."],
["DM 'PROJECT' and I'll reach out.", "Taking new work. I reply to every inquiry."],
```


**friendly:**
```
["DM me about the project. Early stage is fine.", "I love conversations before the brief is nailed down."],
["Tap the link to see my portfolio. DM if something clicks.", "I reply personally to everything."],
["Drop a DM and tell me what you're building.", "I take on a small number of projects at a time."],
["DM me and we'll see if I'm the right fit.", "I keep my client list small so I can do the work properly."],
["Comment below if you have a project you want to talk about.", "I'll DM you and we'll have a quick conversation."],
```

### professional_svc

**bold:**
```
["DM 'CONSULT' for a free consultation.", "Plain answers, fast."],
["Tap the link to book a free call.", "First consultation is on us."],
["Link in bio to schedule a free consult.", "Clear guidance, no jargon."],
["Comment 'CALL' and I'll DM my availability.", "First consultation is free."],
["DM your situation in two sentences and I'll give you my honest read.", "No jargon, no runaround."],
["DM 'QUESTION' and I'll reach out.", "Real answers. Free first call."],
["Tap the link in bio for a free consultation.", "Clear guidance. No obligation."],
```

**friendly:**
```
["DM us and we'll set up a free call.", "No pressure, just a conversation."],
["Tap the link to book a free consult.", "We answer every question honestly."],
["Send a DM if you have questions.", "Happy to talk before you commit."],
["Drop a DM if you have questions you can't get a straight answer to.", "That's what we're here for."],
["Tap the link in bio and book your free consultation.", "We're the people who actually explain things clearly."],
["DM us. We give honest answers and we don't make it complicated.", "Free first call."],
```

---
**narrator: solo_expert**

**bold:**
```
["Book a free call with me. Link in bio.", "I practice independently. You deal with me directly. No associates."],
["Comment 'CALL' and I'll DM my availability.", "First consultation is free."],
["DM 'CONSULT' for a free call.", "I practice on my own. Straight answers, no runaround."],
["Tap the link to book a free consult with me.", "I work independently. You get me on the phone."],
["DM me. I give straight answers.", "Free first call. I practice independently."],
```


**friendly:**
```
["DM me and we'll set up a free call.", "I practice independently. You'll deal with me directly."],
["Tap the link to book a free consult.", "I'm a one-person practice. You'll get my full attention."],
["Drop a DM if you have questions.", "Happy to have a conversation. Free first call."],
["Tap the link in bio and book your free consultation with me.", "I work independently. Clear explanations, no jargon."],
["DM me. I give honest answers and I don't make it complicated.", "Free first call. I practice on my own."],
```

### community

**bold:**
```
["Tap the link to get involved!", "Every contribution matters."],
["DM us to volunteer.", "We need you."],
["Link in bio to sign up!", "Takes 30 seconds."],
["Tap the link in bio and find your role.", "There's a place for everyone in this work."],
["DM 'IN' and I'll connect you with the right program.", "Every kind of contribution matters."],
["Comment 'HELP' and we'll DM you the details.", "Volunteer, donate, or show up. All of it counts."],
["Tap the link to see how you can be part of this.", "The work needs people like you."],
["DM us and tell us how you want to help.", "We'll find the right fit."],
```

**friendly:**
```
["Tap the link to see how you can help.", "There's something for everyone."],
["DM us if you want to get involved. We'll find the right fit.", "No experience needed."],
["Link in bio to join us.", "We'd love to have you."],
["Tap the link in bio to see how you can get involved.", "There's a place for everyone here."],
["Drop a DM and let's figure out how you can help.", "No experience required."],
["Tap the link to find your way in.", "Every person who shows up makes the work more possible."],
["DM us and we'll walk you through the ways to get involved.", "We're glad you're here."],
```

---

## Goal: `lead_gen` — Social Casual


### retail_maker

```
["DM 'CUSTOM' and I'll reach out about your order.", "We make things that aren't in the shop."],
["Comment 'WHOLESALE' and I'll DM you our pricing.", "We work with boutiques, gift shops, and interior designers."],
["DM the idea. I'll tell you if we can make it.", "Custom commissions open."],
["Tap the link to submit a custom or wholesale inquiry.", "Quote in two business days."],
["DM 'BULK' and I'll send pricing and minimums.", "Corporate gifts and large orders welcome."],
["Comment below if you want something custom.", "I'll DM you and we'll work through the idea together."],
["DM the idea, even rough. I'll tell you if we can make it work.", "Custom is our favorite kind of order."],
["Tap the link in bio for wholesale or custom inquiries.", "We respond to every inquiry within two days."],
["DM us about a custom piece, even if the idea is still rough.", "We love making things that don't exist yet."],
["Drop a DM if you'd like to stock our work in your shop.", "We work with a small number of retailers we really believe in."],
["DM us your custom idea. We'll tell you what's possible.", "Custom commissions are open."],
["Tap the link to send us your wholesale or custom inquiry.", "We'll come back with pricing and a timeline."],
["Comment below and we'll DM you about custom options.", "We love hearing what people have in mind."],
["Got a gift idea that needs to be made? Drop a DM.", "Tell us who it's for and we'll figure out the rest."],
["DM us and we'll talk through the idea.", "Custom work is a big part of what we do."],
["Tap the link for custom and wholesale inquiries.", "We reply to every message personally."],
```

---
**narrator: product_led**

**bold:**
```
["DM 'WHOLESALE' and we'll send our pricing.", "We supply boutiques and gift shops."],
["Interested in stocking our products? DM us.", "We work with a select number of retail partners."],
["Comment 'WHOLESALE' and we'll DM our terms.", "We work with boutiques, gift shops, and interior designers."],
["DM us about wholesale or corporate gifting.", "We produce handmade products at volume. We reply within one business day."],
["Wholesale or trade inquiry? DM 'TRADE' and we'll reach out.", "Quote in two business days."],
```


**friendly:**
```
["DM us if you'd like to carry our products in your shop.", "We love finding the right retail home for our collection."],
["Interested in wholesale? Drop a DM.", "We work with independent retailers we really believe in."],
["DM us about wholesale or a custom order.", "We produce handmade goods at volume. Happy to talk through what works."],
["Want to stock our collection in your space?", "DM us and let's talk terms."],
["Drop a DM about wholesale or trade pricing.", "We work with boutiques, gift shops, and gifting programs."],
```

### trades_home

**bold:**
```
["DM your address and what needs doing. I'll get you a quote.", "Same-day response."],
["Comment 'QUOTE' and I'll reach out.", "Free estimate, no visit required."],
["DM us the job details.", "Quote in 24 hours."],
["DM a photo and what you need done. I'll get back to you with a price.", "Same-day response."],
["DM us the job. A photo and a few words is enough.", "Quote in 24 hours."],
["Tap the link in bio and submit the details. Quote comes back fast.", "Free, no strings."],
["Comment your suburb and I'll DM you if we cover your area.", "Free estimate. No visit needed for most jobs."],
```

**friendly:**
```
["DM us the details and we'll put together a free estimate.", "We get back to everyone within a day."],
["Tell us what's going on in a DM. We'll figure out the right next step.", "No pressure."],
["Drop a DM with the project details.", "We'll give you an honest number."],
["DM a photo and tell us what's going on.", "We'll give you an honest read on what it needs."],
["Comment below and we'll DM you.", "Happy to answer questions first."],
["Tap the link in bio and send us the details.", "We'll come back with a clear picture of what's involved."],
["DM us a photo to get started.", "We'll reply with next steps."],
```

---
**narrator: local_team**

**bold:**
```
["DM us about the job. Our team will reply with a quote.", "Free estimate. We cover the whole area."],
["Comment 'QUOTE' and our team will reach out today.", "Free estimate. No site visit required for most jobs."],
["Tap the link to submit your job details.", "Our team responds within one business day with a quote."],
["DM us the details. Our team responds fast.", "Free quote, no strings."],
["DM us about the job. Our team will get a quote back to you.", "A photo and a few words is all we need to get started."],
```


**friendly:**
```
["DM us and our team will take it from there.", "We cover the whole area and respond fast."],
["Tell us about the job in a DM.", "Our team will give you an honest read on what it involves."],
["Drop a DM with the details.", "Our team will figure out the right scope and get back to you."],
["Tap the link and send us your job details.", "Our team will come back with next steps and a number."],
["DM us. Our team responds to every inquiry and gives straight quotes.", "Free quote, same-day response."],
```

### food_hospitality

**bold:**
```
["DM 'EVENT' and I'll send the catering menu.", "Groups from 10 to 200."],
["Planning an event? DM the details.", "Quick response, custom menus."],
["Comment 'CATERING' for menu details.", "Built around your group."],
["DM the date and headcount. I'll build the menu.", "Groups of 10 to 200. Every occasion."],
["Comment 'PRIVATE' and I'll reach out with event options.", "Corporate lunches, weddings, everything in between."],
["Tap the link to submit an event inquiry.", "Fast turnaround on proposals."],
["DM the details: date, guest count, occasion. We'll take it from there.", "We make events easy."],
```

**friendly:**
```
["DM us about your event and we'll see what we can put together.", "We love a good reason to cook."],
["Tell us about the occasion in a DM.", "We'll come back with options."],
["Drop a DM with the basics: date, headcount, occasion. We'll take it from there.", "Private events are our specialty."],
["DM us and we'll figure out the menu together.", "We love putting together something special for the right occasion."],
["Planning something? Drop a DM and we'll talk it through.", "Big or small, we make it good."],
["Tap the link to send us your event details.", "We get back to everyone within one day."],
["DM us the basics: what, when, and how many.", "We'll handle the rest."],
```

---
**narrator: solo_maker**

**bold:**
```
["Private event or catering? DM me the details.", "I build the menu around your occasion."],
["Comment 'CATERING' and I'll reach out.", "Private dinners and events. I cook everything myself."],
["DM the date and headcount. I'll put together a menu.", "Private groups of 6 to 50. Everything cooked by me."],
["Planning something? DM me.", "I do private dinners and event catering. I'll get back to you today."],
["DM 'EVENT' and I'll get back to you today.", "I build the menu around the occasion."],
```


**friendly:**
```
["DM me about your event and I'll put together a menu.", "Private dinners and catering. I love doing something special."],
["Planning a private dinner or event? Drop me a DM.", "Tell me the vibe and the headcount. I'll take it from there."],
["DM me the details and we'll figure out the menu together.", "I cook everything personally for private groups and events."],
["Tell me about the occasion in a DM.", "I design menus around the moment. Let's make it good."],
["Drop a DM about your event.", "Private catering, small dinners, pop-ups. I do it all personally."],
```

### health_wellness

**bold:**
```
["DM 'START' for a free intro session!", "No commitment needed."],
["Comment 'CONSULT' and I'll reach out.", "Free first conversation."],
["DM us to book a free intro.", "New clients always welcome."],
["Comment 'FREE' and I'll DM you the intro session link.", "First session is on us."],
["DM 'START' and I'll set up your free intro.", "No commitment. Just a conversation."],
["Tap the link to book your free first session.", "New clients always welcome."],
["DM us and tell us what you're hoping to work on.", "We'll figure out the right place to start."],
["Comment below and I'll DM you the link for a free consult.", "No hard sell, ever."],
```

**friendly:**
```
["DM us and tell us what you're working on.", "We'll figure out the best place to start."],
["Send a DM about what you're hoping to achieve.", "Free intro session to see if we're a fit."],
["Drop a DM. We'll set up a free conversation.", "No hard sell, just a good chat."],
["Drop a DM and tell us what you're working on.", "We'll set up a free chat and go from there."],
["DM us, even if you're not sure where to start.", "That's what the first conversation is for."],
["Tap the link to book a free intro session.", "New clients always welcome."],
["DM us about your goals.", "We'll give you a straight answer on where to start."],
```

---
**narrator: local_team**

**bold:**
```
["Comment 'FREE' and we'll DM the intro session link.", "First session complimentary. Our team will match you with the right person."],
["DM 'START' and our team will reach out.", "Free first session. We'll figure out the right fit."],
["Tap the link to book a free intro with our team.", "We match you with the right practitioner. No commitment."],
["DM us and our team will set up a free intro.", "We cover multiple disciplines. We'll find the right fit."],
["Comment below and we'll DM the intro link.", "Free first session with our team."],
```


**friendly:**
```
["DM us about what you're hoping to work on.", "Our team will figure out the best starting point and set up a free chat."],
["Drop a DM and we'll set up a free intro.", "Our team covers a range of specialties. We'll find the right fit."],
["Tap the link to book a free intro session with our team.", "New clients welcome. We'll do the matching."],
["DM us and we'll walk you through the options.", "Our team works across multiple disciplines."],
["Drop a DM. Our team will set up a free first session.", "We'll find the right practitioner for what you're working on."],
```

### creative_pro

**bold:**
```
["DM the brief and I'll get back to you today.", "Taking new projects now."],
["Send the scope in a DM.", "Quick turnaround on all proposals."],
["DM with the overview.", "Fast, honest, personal response."],
["DM the brief. I'll get back to you by tomorrow.", "Currently taking new projects."],
["Comment 'BRIEF' and I'll reach out.", "Quick response. Honest assessment."],
["Tap the link to see the portfolio, then DM the scope.", "Two-day turnaround on proposals."],
["DM with the project overview.", "I'll tell you if we're the right fit and what it would cost."],
["Send a DM with what you need. I'll come back with a real answer.", "No pitch. Just the truth about fit and timing."],
```

**friendly:**
```
["DM us about the project, even if it's still early.", "We love conversations before the brief is finalized."],
["Tell us what you're building in a DM.", "We reply personally to everything."],
["Send a DM with the basics and we'll pick it up from there.", "No brief required. Just tell us what you're working on."],
["Drop a DM and tell us what you're working on.", "We reply personally to every message."],
["DM with the overview and we'll take it from there.", "No formal brief needed to start a conversation."],
["Tap the link to see our work. DM if it feels right.", "We make it easy to start a project."],
```

---
**narrator: solo_expert**

**bold:**
```
["DM the brief and I'll get back to you by tomorrow.", "Taking new projects now."],
["Comment 'PROJECT' and I'll reach out.", "Quick response. Honest read."],
["Tap the link to see my work, then DM the scope.", "Two-day turnaround on all proposals."],
["DM with the project overview.", "I'll tell you if I'm the right fit and what it would cost."],
["Send a DM with what you need. I'll come back with a real answer.", "No pitch. Just the truth about fit and timing."],
```


**friendly:**
```
["DM me about the project, even just a sentence.", "I love early-stage conversations."],
["Drop a DM and tell me what you're working on.", "I reply personally to every message."],
["DM with the overview and I'll take it from there.", "No formal brief needed to start a conversation."],
["Tell me what you're building in a DM.", "If it sounds like a fit, I'll get back to you the same day."],
["Tap the link to see my work. DM if it feels right.", "I make it easy to start a project."],
```

### professional_svc

**bold:**
```
["DM the situation and I'll give you my honest read.", "First conversation is free."],
["Comment 'CALL' and I'll set up a free consult.", "No jargon, straight answers."],
["DM us for a free initial conversation.", "We'll tell you what we actually think."],
["DM your situation and I'll give you a straight read.", "Free. Fast. No jargon."],
["Tap the link to book a free call.", "We give real answers, not qualified maybes."],
["DM us in plain terms. We'll come back in plain terms.", "First conversation is always free."],
["Drop a DM with the situation.", "We'll tell you exactly what we'd do."],
```

**friendly:**
```
["DM us with your situation and we'll help you figure out the next step.", "Free, no obligation."],
["Send a DM and we'll set up a free call.", "Happy to answer questions before you commit to anything."],
["Drop a DM and let's talk it through.", "Free first conversation, always."],
["DM us and we'll have a real conversation about it.", "Free first call. No obligation."],
["Drop a DM with what's going on.", "We'll talk you through it and figure out the next step."],
["Tap the link to book a free consultation.", "We explain things like we're talking to a smart friend."],
["DM us, even if you're not sure what to ask.", "We ask the right questions. You don't have to have it figured out."],
```

---
**narrator: solo_expert**

**bold:**
```
["DM your situation and I'll give you a straight read.", "Free. Fast. I practice independently."],
["Comment 'CALL' and I'll DM my availability.", "First consultation is on me."],
["Tap the link to book a free call with me.", "I give real answers, not qualified maybes."],
["DM me in plain terms. I'll come back in plain terms.", "First conversation is always free."],
["Drop a DM with the situation.", "I'll tell you exactly what I'd do."],
```


**friendly:**
```
["DM me and we'll have a real conversation about it.", "Free first call. I practice independently."],
["Drop a DM with what's going on.", "I'll talk you through it and figure out the next step."],
["Tap the link to book a free consultation with me.", "I explain things clearly. One-on-one, the whole way through."],
["DM me, even if you're not sure what to ask.", "I'll ask the right questions. You don't have to have it figured out."],
["Send a DM and I'll set up a free call.", "Honest answers. I practice independently."],
```

### community

**bold:**
```
["DM to volunteer and say hi.", "We match you to a role."],
["Comment 'HELP' and we'll reach out.", "Every form of support matters."],
["DM and tell us how you want to get involved.", "We make it easy."],
["Comment 'IN' and we'll DM you the details.", "We'll find the right fit."],
["Tap the link to see how to get involved.", "There's always a place for the right person."],
["DM 'VOLUNTEER' and I'll reach out.", "We'll match you with something that matters."],
["Comment below if you want to be part of this.", "We'll DM you with next steps."],
["DM us and tell us you're ready to help.", "We'll find the right fit and walk you through it."],
```

**friendly:**
```
["DM us and let's figure out how you can help.", "No experience required."],
["Send a DM and we'll walk you through the options.", "There's something for everyone."],
["Drop a DM and we'll find the right fit together.", "We're glad you're here."],
["Drop a DM and tell us you want to get involved.", "We'll figure out the best way together."],
["DM us and we'll walk you through the ways you can help.", "No experience needed."],
["Tap the link to see all the ways to get involved.", "There's something here for everyone."],
["DM us and we'll find the right role for where you are now.", "There's a place for you in this work."],
["Drop a DM and let's figure out the best way for you to be part of it.", "We'd love to have you."],
```

---

## Goal: `audience_growth` — Social Casual

### trades_home

**bold:**
```
["Follow for before-and-afters, tips, and local project updates.", "New posts a few times a week."],
["Save this and follow the account.", "We post jobs we're proud of."],
["Follow along for real work, real results.", "Posted as projects finish."],
["Follow to see what a proper job looks like.", "No shortcuts. No filler. Just the work, posted as it finishes."],
["If you own a home, this account earns its follow.", "We post what it actually costs, what it takes, and how it turns out."],
["Share this with someone who has a project on their list.", "Then both follow. You'll know who to call when the time comes."],
```

**friendly:**
```
["Follow along for project updates and honest tips from the field.", "We post a few times a week."],
["Save this post and follow us, we share before-and-afters you'll actually want to see.", "The jobs we're proud of, shared honestly."],
["Follow the account. We show our work and talk about what we actually do.", "Real people, real jobs."],
["Follow along. You'll learn something useful whether you hire us or not.", "Honest trade content from real jobs."],
["Tag someone who's been putting off a project.", "Then follow so you both catch the tips."],
```

---

### food_hospitality

**bold:**
```
["Follow for daily specials, events, and behind-the-scenes!", "We post every day we're open."],
["Follow the kitchen for daily posts.", "New dishes, real food, daily."],
["Save this post and follow for what's on next.", "We share the good stuff."],
["Follow so you always know what's fresh before you decide where to eat.", "We post the specials before they sell out."],
["Share this with someone who'd love it here.", "Then both follow. We post something good every day we're open."],
["If you eat out more than twice a week, this account earns its follow.", "Daily food, posted honestly."],
```

**friendly:**
```
["Follow along and see what we're cooking up.", "New menu items, events, and the occasional recipe."],
["Follow us if you want to know what's on before you arrive.", "We post daily specials every morning."],
["Save this and follow for more. New things posted every week.", "We love sharing what's on."],
["Follow along and let us help you decide where to eat this week.", "New things to try, posted every morning."],
["Tag someone who loves a good meal.", "Follow so you both see what's on."],
["Follow for the kind of food content that actually makes you hungry.", "Real food, posted the way it is."],
```

---

### retail_maker

**bold:**
```
["Follow so you don't miss the next drop!", "Small batches, they go fast."],
["Follow for new drops, process shots, and the occasional discount!", "First to know, first to shop."],
["Save this and follow.", "New things every week, everything made by hand."],
["Follow before the next drop goes live.", "Small batches go fast. Early followers get first look."],
["Share this with someone who appreciates handmade.", "Then both follow. New drops land more often than you'd think."],
["Follow the shop to see new pieces as they're finished.", "I make everything myself. You'll see the whole process."],
```

**friendly:**
```
["Follow along for new product drops, behind-the-scenes, and the occasional discount.", "We post a few times a week."],
["Save this post, follow for more like it.", "New pieces land often. Shared here first."],
["Follow the shop. We share process, new pieces, and the stories behind them.", "Made with care, posted with love."],
["Follow and you'll see how it's made, not just what it looks like.", "Behind-the-scenes on every collection."],
["Tag a friend who'd love this.", "Follow so you both catch the next drop."],
["Follow the account. More is coming and you don't want to miss it.", "Small runs, honestly made."],
```

---

### health_wellness

**bold:**
```
["Follow for one practical tip a week.", "No fluff, just what works."],
["Follow along for routines, advice, and real results.", "Posted three times a week."],
["Save this post, follow for more like it.", "We share what's actually useful."],
["Follow for the tips your doctor probably didn't have time to explain.", "Practical. Evidence-based. Posted weekly."],
["Share this with someone trying to make a change.", "Then both follow. Weekly content that actually moves the needle."],
["Follow for one piece of useful guidance a week.", "Not hacks. Not trends. Just what works."],
```

**friendly:**
```
["Follow for weekly tips you can actually use.", "We keep it practical and down to earth."],
["Save this and follow. More coming every week.", "Real advice, no hard sell."],
["Follow along. We share what's working for the people we work with.", "Honest, practical, worth your time."],
["Follow along. Even one tip a week adds up.", "We post what we use ourselves."],
["Tag someone who's been meaning to make a change.", "Follow so you're both showing up for it."],
["Follow the account and let us be part of your routine.", "Weekly content. Practical, short, honest."],
```

---

### creative_pro

**bold:**
```
["Follow for project reveals, process shots, and the occasional tip.", "New work posted as it ships."],
["Follow the studio: work, process, lessons learned.", "New posts every week or so."],
["Save this post and follow for more.", "We post when it's worth seeing."],
["Follow to see how the work actually gets made.", "Not just the hero shot. The full process."],
["Share this with someone who appreciates craft.", "Then both follow. New work posts as it ships."],
["Follow before the next project reveal.", "We document everything and show it all."],
```

**friendly:**
```
["Follow for the work and everything behind it.", "Process, reveals, and outtakes too."],
["Save and follow. New work weekly, with the full story.", "Always the process, not just the hero shot."],
["Follow the studio. We're building something and we like showing how.", "New posts every week or so."],
["Follow along and watch the work come together from brief to final.", "We show the process, not just the result."],
["Tag someone who'd appreciate seeing how this kind of work is done.", "Follow so you both catch the reveals."],
["Follow the account. We share the project, the mistakes, and what we'd do differently.", "Real studio content, posted honestly."],
```

---

### professional_svc

**bold:**
```
["Follow for plain-language takes on the things that affect you.", "No jargon, no upsell."],
["Follow along for practical guidance you can actually use.", "Posted a few times a week."],
["Save this, follow for more.", "Plain writing on what matters."],
["Follow for the straight version of things most people don't explain clearly.", "One post. One useful thing. Posted regularly."],
["Share this with someone navigating something tricky.", "Then both follow. We explain things in plain language."],
["Follow for the kind of content that saves you a call.", "We answer the questions people are afraid to ask."],
```

**friendly:**
```
["Follow along for content that actually helps you make decisions.", "Practical posts in plain language."],
["Save this and follow, we write a few times a week on things that matter.", "Real guidance, plain language."],
["Follow the account, we cover the stuff nobody explains clearly.", "We hope it saves you time and stress."],
["Follow along. We write the things we wish more people knew.", "Plain language, no sales pitch."],
["Tag someone going through something complicated.", "Following costs nothing. It might save them a lot."],
```

---

### community

**bold:**
```
["Follow for impact stories, events, and ways to get involved!", "Posted regularly."],
["Follow along and see the work we do together!", "Real updates from the ground."],
["Save this and follow the account.", "Updates and ways to help."],
["Follow to see the work from the ground level.", "Real projects, real impact, real people doing it."],
["Share this with someone who cares about this too.", "Then both follow. We post every time something happens."],
["Follow before the next event.", "We post details and behind-the-scenes before, during, and after."],
```

**friendly:**
```
["Follow along. We share what we're building and the people who make it possible.", "Real work, real community."],
["Save this and follow for more.", "Updates, stories, ways to get involved."],
["Follow us and see what's possible when people show up for each other.", "New posts every week."],
["Follow along and see what's possible when a community decides to show up.", "Real updates, every week."],
["Tag someone who cares about this.", "Follow so you're both closer to the work."],
["Follow the account. We share the wins, the setbacks, and the people who make it happen.", "Honest updates from the work."],
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








### community

```
["New programs have launched since you were last involved.", "Tap the link to see what's happening."],
["A lot has happened since you last checked in.", "Come back and see what's been built. Link in bio."],
["Ready to get back in?", "Tap the link to see current programs and ways to help."],
["Our biggest events of the year are coming up.", "Tap the link to get involved."],
```

---

### professional_svc

```
["Something shift in your situation since we last talked?", "DM or tap the link to book a quick call."],
["Annual check-in. Always a good idea.", "Tap the link to schedule a short call."],
["Things have changed in this space since we spoke.", "A short call gets you current. Link in bio."],
["We're here when you need us.", "DM or tap the link to get back in touch."],
```

---

### creative_pro

```
["Something new taking shape?", "DM us or tap the link to start a conversation."],
["Existing clients get priority on new project slots.", "DM when you're ready."],
["New work has shipped since you last checked in.", "Tap the link to see recent projects."],
["Time for the next one?", "DM or tap the link to get the conversation going."],
```

---

### health_wellness

```
["Ready to get back on a schedule?", "Same-week slots available. Tap the link to book."],
["New practitioners and programs added since you were last in.", "Tap to see what's available."],
["New season. A good time to restart.", "Tap the link to book."],
["We've added new services since you were last in.", "Link in bio to see what's available."],
```

---

### retail_maker

```
["New pieces have landed since your last order.", "Tap the link to see what's in."],
["The collection looks different this season.", "Link in bio to browse."],
["Something you had your eye on is back in stock.", "Tap to check."],
["Limited run just released. You know the quality.", "Link in bio."],
```

---

### food_hospitality

```
["The menu's changed since you were last in.", "Tap the link to see what's new and reserve."],
["New events and specials coming up this month.", "Link in bio for what's on."],
["Celebrating something?", "Tap to reserve and we'll make sure it's right."],
["We make room for regulars.", "Link in bio to book."],
```

---

### trades_home

```
["Spring maintenance season coming up?", "Tap to book before the schedule fills."],
["Ready for the next phase of the project?", "Tap the link to get back on the schedule."],
["New crew and expanded availability since your last job.", "Link in bio to see what's open."],
["Past clients get priority booking.", "Tap the link to schedule."],
```

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
["Need a specialty trade or subcontractor for a time-sensitive job? Connect and message with the job details.", "We maintain capacity for priority projects. Response within one business day."],
```

### food_hospitality

```
["Planning a corporate event or team lunch? DM us to discuss catering.", "We handle groups and tailor menus to the event."],
["Need catering for an office event or client dinner? Connect with details.", "We provide custom proposals for corporate clients."],
["Corporate catering and private dining available. DM with your event details.", "We'll have a proposal back to you within one business day."],
["Looking for a regular caterer for recurring office events or client entertainment? Connect and let's build a program.", "We set up ongoing catering arrangements for businesses of any size."],
```

### retail_maker

```
["Interested in wholesale or B2B purchasing? DM to discuss terms.", "We work with boutiques, gift shops, and corporate gifting programs."],
["Looking for a craft supplier or maker for your retail business? Connect and let's talk.", "Wholesale pricing available for qualifying buyers."],
["We supply independent retailers and corporate gifting programs. DM with your buying volume and product category.", "Trade pricing and minimums available on request."],
["Interested in co-production, licensing, or a white-label arrangement? DM and let's talk through what you have in mind.", "We take on a small number of confidential B2B production arrangements. Response within two business days."],
```

### health_wellness

```
["Exploring corporate wellness options for your team? DM with your team size and what you're hoping to improve.", "We work with HR and wellness leads to tailor programs."],
["Looking for a wellness provider for your team or workplace? Connect and let's talk.", "We customize programs for groups of any size."],
["Corporate wellness partnerships available. DM with your organization's needs.", "We'll put together a program proposal at no charge."],
["Looking to add a wellness benefit or mental health resource to your employee package? Connect and let's talk through the options.", "We work with HR and benefits leads to design and implement programs."],
```

### creative_pro

```
["Working on a project and need a creative partner? Connect and send the brief.", "We respond to all inquiries within two business days."],
["Need a creative studio for brand, campaign, or content work? DM your scope.", "We provide written proposals for all new engagements."],
["We take limited new engagements each quarter. Planning something? Connect now.", "DM with project details and timeline."],
["Overflow or white-label creative work available for agencies and in-house teams. DM with what your team is working through.", "We take on a small number of confidential B2B arrangements. Response within two business days."],
```

### professional_svc

```
["Looking for guidance on something in our area of practice? Connect and send a message.", "Initial conversations are complimentary and confidential."],
["Working through a situation that needs professional input? DM and we'll set up a call.", "Free initial consultation for LinkedIn connections."],
["If you're navigating something complex and want a straight answer, connect and send the details.", "We respond to all professional inquiries within one business day."],
["Company navigating a regulatory change, contract dispute, or compliance question? Connect and let's set up a call.", "Free initial consultation for LinkedIn connections. Confidential."],
```

### community

```
["Looking to partner with a mission-driven organization? Connect and let's discuss alignment.", "We welcome organizational partners, donors, and advocates."],
["If your company has a community investment focus, DM to explore partnership.", "We offer structured partnership programs for businesses of all sizes."],
["Interested in corporate volunteering or sponsorship? Connect and we'll send the details.", "We have programs that fit a range of organizational commitments."],
["Looking to sponsor or co-present at a community event or public program? Connect and let's explore the fit.", "We run public programs throughout the year and welcome aligned organizational partners."],
```

---

## Goal: `audience_growth` — LinkedIn

### trades_home

```
["Follow this page for project updates, before-and-afters, and trade insights.", "We post weekly."],
["Follow along for a ground-level view of the construction and trades industry.", "Real projects, honest commentary."],
["If you work in property management, construction, or facilities, this page is worth following.", "We post practical content on a weekly basis."],
["If you source contractors, manage facilities, or purchase trade services, this page is relevant to your work.", "Project updates and trade insights published weekly."],
```

### food_hospitality

```
["Follow for updates on our catering programs, seasonal menus, and events.", "Content published weekly."],
["If you manage corporate events or work in hospitality, follow this page for practical guidance.", "We post regularly on catering, private dining, and event production."],
["Follow for updates on our menu, events, and catering capabilities.", "New content every week."],
["If you plan corporate events, book caterers, or manage dining programs, this page is for you.", "Menu updates, event notes, and hospitality industry commentary posted regularly."],
```

### creative_pro

```
["Follow for case studies, process breakdowns, and perspective on the creative industry.", "New content published regularly."],
["If you work with creative agencies or manage brand projects, this page is worth following.", "We share work, process, and honest industry perspective."],
["Follow this page for project reveals, methodology, and creative industry commentary.", "We publish when we have something substantive to say."],
["If you oversee brand, creative, or marketing, follow for perspective on what makes projects succeed.", "Case studies, process breakdowns, and honest takes on briefs published regularly."],
```

### professional_svc

```
["Follow for plain-language analysis of issues that affect businesses and individuals.", "Published weekly."],
["If you deal with the kinds of challenges we cover, this page will be useful.", "We write what we wish more people understood."],
["Follow for regular updates on regulatory changes, practical guidance, and industry perspective.", "One publication per week."],
["If you run a business and deal with the issues we cover, this page saves you time.", "Clear, actionable content published every week."],
```

### health_wellness / retail_maker / community

```
["Follow this page for updates on our programs, work, and practical guidance.", "Content published weekly."],
["If our work is relevant to what you do, follow along.", "We post when we have something to say."],
["Follow for updates on our work and how it helps you.", "New content every week."],
```

---

---

# SURFACE: DIRECTORY — Google Business (`directory_post_offer_v1`)

Short, action-verb led. Native vocabulary: Call, Message, Get Directions, Request info.
No exclamation marks in this section (any industry or tone).

---

## Goal: `direct_sales`





### community

**bold:**
```
["Get involved. Tap 'Request info' to start.", "We welcome volunteers, donors, and partners."],
["Call or message to ask how you can help.", "Every contribution makes a real difference."],
["Message us about volunteering or donating.", "We match every supporter to the right role."],
["Request information on our programs via the contact button.", "Response within one business day."],
```

---


**friendly:**
```
["Call or message to find out how to get involved.", "There's a role for everyone who wants to help."],
["Reach out and tell us how you'd like to contribute.", "We find the right fit for every supporter."],
["Tap 'Request info' and let us know how you'd like to help.", "We'd love to have you."],
["Call or message about volunteering, donating, or partnering.", "Response within one business day."],
```


**professional:**
```
["Submit a partnership or volunteer inquiry via the contact button.", "We respond to all organizational and individual inquiries within one business day."],
["Call or message to discuss volunteering, donation programs, or organizational partnership.", "We provide structured programs for all levels of engagement."],
["Request information on our volunteer and partnership programs.", "Response within one business day with available options and next steps."],
["Use the contact button to initiate a partnership or program inquiry.", "We welcome corporate volunteers, major donors, and program partners."],
```

### retail_maker

**bold:**
```
["Call or message about wholesale pricing.", "We supply boutiques, gift shops, and gifting programs."],
["Request wholesale terms via the contact button.", "Response within one business day."],
["Call to place a bulk or custom order.", "We produce handmade items at volume. Quote in two business days."],
["Message with your wholesale or custom inquiry.", "We respond within one business day."],
```

---


**friendly:**
```
["Call or message about wholesale or a custom order.", "Happy to talk through the options."],
["Reach out about stocking our products or a bulk order.", "We work with boutiques and gifting programs."],
["Call or message with your inquiry.", "We respond to all trade inquiries within one business day."],
["Tap 'Request info' about wholesale or custom production.", "We'll find an arrangement that works."],
```


**professional:**
```
["Request wholesale pricing or trade terms via the contact button.", "We supply qualifying retailers and gifting programs. Response within two business days."],
["Submit a wholesale or custom production inquiry.", "Response within two business days with pricing, minimums, and lead times."],
["Call or message to request our trade pricing and catalog.", "Wholesale and bulk pricing available to qualifying buyers."],
["Use the contact button to inquire about wholesale or bulk production.", "We accommodate orders from 25 units. Response within two business days."],
```

### professional_svc

**bold:**
```
["Call for a free consultation.", "Straight answers, no runaround."],
["Book your free first call.", "I practice independently. You'll deal with me directly."],
["Message with your situation.", "Free initial call. Response within one business day."],
["Tap 'Request info' to get started.", "Free first consultation. Response within one business day."],
```

---


**friendly:**
```
["Call or message to set up a free first conversation.", "Happy to answer a question before you commit."],
["Reach out and let's talk it through.", "First call is always free."],
["Call with your question or to set up your first consultation.", "I practice independently. You'll deal with me directly."],
["Tap 'Request info' and we'll set up a time.", "Free first consultation. Confidential."],
```


**professional:**
```
["Schedule a complimentary consultation via the contact button.", "All consultations are strictly confidential. Response within one business day."],
["Call or message to request an initial consultation.", "Complimentary. Confidential. Response within one business day."],
["Request a complimentary consultation.", "I handle every matter personally. No associates, no hand-offs."],
["Use the contact button to initiate a consultation inquiry.", "Strictly confidential. Response within one business day."],
```

### creative_pro

**bold:**
```
["Request a project consultation.", "Currently taking new clients. Response within two business days."],
["Message with your project scope.", "Fixed-fee proposals for all engagements."],
["Call or message to discuss the brief.", "Two-business-day response."],
["Tap 'Request info' with the project overview.", "Limited capacity each quarter. Currently booking."],
```

---


**friendly:**
```
["Reach out and tell me what you're building.", "No formal brief needed to start."],
["Message with the overview and let's see if it's a good fit.", "I reply personally to every inquiry."],
["Call or message whenever the timing is right.", "Happy to have an early-stage conversation."],
["Tap 'Request info' with a bit about the project.", "I respond to all messages within two business days."],
```


**professional:**
```
["Request a project consultation via the contact button.", "I provide written proposals for all new engagements. Response within two business days."],
["Submit a project inquiry.", "Fixed-fee proposals with full scope, timeline, and pricing. Response within two business days."],
["Call or message to initiate a project discussion.", "All new project conversations are confidential."],
["Use the contact button to request a consultation.", "I respond within two business days with a written assessment."],
```

### trades_home

**bold:**
```
["Call to schedule your free estimate.", "We come to you. Same-week availability."],
["Request a quote and we'll get back to you same day.", "Free, no obligation."],
["Message us the job details. Quote in 24 hours.", "Local, licensed, insured."],
["Get on the schedule before it fills. Busy season is here.", "Free estimate, no site visit required for most jobs."],
["Text us a photo and we'll give you a number the same day.", "Local crew, fast response."],
["Check our reviews, then call. We do what we say.", "Free estimate within 24 hours."],
```

**friendly:**
```
["Give us a call and we'll set up a free estimate.", "We're local and usually available quickly."],
["Message us what you need and we'll put together a quote.", "No pressure, no obligation."],
["Call or message. We're happy to help with an estimate.", "Usually available within the week."],
["Take a look at our recent jobs and give us a call when you're ready.", "No pressure, no obligation."],
["Call or message and tell us what's going on. We'll give you a straight answer.", "We're local and we know the area."],
["Something needs doing? Give us a call. We'll figure out the right approach together.", "Same-week visits usually available."],
```

**professional:**
```
["Call us to schedule a complimentary on-site assessment.", "Written estimates provided within one business day."],
["Request an estimate using the contact button.", "Response within one business day."],
["Call or message to discuss your project.", "We provide written estimates at no charge."],
["Call to discuss your project. We provide itemized written estimates at no charge.", "Our team is fully licensed and insured."],
["Request a complimentary on-site assessment. We respond within one business day.", "All assessments include a full written scope."],
["Use the contact button to request information on service areas and availability.", "We accommodate residential and commercial projects."],
```

---

### food_hospitality

**bold:**
```
["Call to reserve your table.", "Or book online."],
["Order online or call ahead.", "Ready in 20 minutes."],
["Reserve your spot. We fill up fast.", "Call or use the booking link."],
["Reserve online now. Tables book out fast on weekends.", "Or call. We answer."],
["Order ahead and skip the wait.", "Ready when you are."],
["Call to hear tonight's specials and reserve a table.", "Fresh daily, limited seats."],
```

**friendly:**
```
["Call to make a reservation or order ahead.", "We love having you."],
["Give us a call or tap the website link to reserve.", "Walk-ins welcome when we have room."],
["Call ahead or order online. Either way, we're ready for you.", "Open every day."],
["Call to lock in your table. They fill up fast.", "Quick to book, easy to change."],
["Bringing a group? Call ahead and we'll get it sorted.", "We handle groups well. Just give us a heads-up."],
["Eating out tonight? Call ahead and we'll have a spot for you.", "Open every day. Easy to book, easy to change."],
```

**professional:**
```
["Call to make a reservation or inquire about private dining.", "We accept reservations up to 30 days in advance."],
["Contact us to reserve a table or discuss catering options.", "We respond to all inquiries within one business day."],
["Call or message to arrange a reservation or catering inquiry.", "Group reservations require 48 hours notice."],
["Call to reserve your table or inquire about private dining availability.", "We recommend booking at least two days in advance for groups."],
["Request your reservation through the contact button.", "We confirm all reservations within one business day."],
["Contact us to discuss group dining or specific dietary requirements.", "We tailor menus for private events on request."],
```

---

### health_wellness

**bold:**
```
["Call to book your appointment today.", "New clients welcome, same-week availability."],
["Request an appointment online.", "Confirmation in one day."],
["Call and we'll get you on the schedule.", "Evening and weekend slots available."],
["Call to check same-day availability.", "We keep slots open for last-minute bookings."],
["Tap 'Message' and tell us what you're working on.", "We'll match you with the right person and get you on the schedule."],
```

**friendly:**
```
["Give us a call and we'll find a time that works.", "New clients always welcome."],
["Call or message to book your appointment.", "We make booking easy."],
["Reach out and we'll get something on the books.", "Morning, afternoon, and evening availability."],
["Call and we'll find a time that works for you this week.", "New clients are always welcome."],
["Check what we offer online, then call or message to book.", "Booking is straightforward. We make it easy."],
["Message us and we'll figure out the best starting point.", "No intake form until you're ready."],
```

**professional:**
```
["Call to schedule your appointment.", "Morning, afternoon, and evening slots."],
["Request an appointment through the contact button.", "We will confirm within one business day."],
["Call or message to arrange your first visit.", "New patient paperwork can be completed in advance."],
["Call to discuss your situation and schedule a complimentary initial consultation.", "We respond to all new client inquiries within one business day."],
["Message us with your goals and we will follow up with our recommended approach within one business day.", "All initial consultations are complimentary."],
```

---

### all other industries

```
["Call for a free consultation.", "Response within one business day."],
["Message us with your question.", "No obligation to ask questions."],
["Request information via the contact button.", "Follow-up within one business day."],
["Call or message with what you need. We respond within one business day.", "Consultations are free to start."],
["Use the contact button to get in touch.", "We follow up with a clear next step within one business day."],
["Call or message to ask a question before committing.", "Happy to help you figure out if we're the right fit."],
```

---

## Goal: `lead_gen` — Google Business Directory

### trades_home

```
["Need a specialty trade or subcontractor for a time-sensitive job? Connect and message with the job details.", "We maintain capacity for priority projects. Response within one business day."],
```

### food_hospitality

```
["Looking for a regular caterer for recurring office events or client entertainment? Connect and let's build a program.", "We set up ongoing catering arrangements for businesses of any size."],
```

### retail_maker

```
["Interested in co-production, licensing, or a white-label arrangement? DM and let's talk through what you have in mind.", "We take on a small number of confidential B2B production arrangements. Response within two business days."],
```

### health_wellness

```
["Looking to add a wellness benefit or mental health resource to your employee package? Connect and let's talk through the options.", "We work with HR and benefits leads to design and implement programs."],
```

### creative_pro

```
["Overflow or white-label creative work available for agencies and in-house teams. DM with what your team is working through.", "We take on a small number of confidential B2B arrangements. Response within two business days."],
```

### professional_svc

```
["Company navigating a regulatory change, contract dispute, or compliance question? Connect and let's set up a call.", "Free initial consultation for LinkedIn connections. Confidential."],
```

### community

```
["Looking to sponsor or co-present at a community event or public program? Connect and let's explore the fit.", "We run public programs throughout the year and welcome aligned organizational partners."],
```

### all other industries (catch-all — unmapped industries only)

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




### community

```
["Check our page and call or message to get involved.", "We welcome volunteers, donors, and organizational partners."],
["Check our page and call or message about volunteering or supporting our work.", "Everyone who wants to help has a role here."],
["Check our profile and tap 'Call' or 'Website' to learn about our programs.", "Response within one business day."],
["Check our page and call or message about partnering with us.", "We have structured programs for every level of involvement."],
```

---

### professional_svc

```
["Check our reviews and call to schedule a free consultation.", "Confidential. Response within one business day."],
["Check our reviews and call with your question.", "Free first conversation. I practice independently."],
["Tap 'Call' to get started.", "First consultation is always free."],
["Check our profile and call when you're ready.", "Free initial consultation. Confidential."],
```

---

### creative_pro

```
["See our work. Tap 'Website' for the portfolio.", "Call or message to discuss a project. Response within two business days."],
["Check our portfolio and call or message with the project details.", "Written proposals for all new engagements."],
["Tap 'Website' to browse the portfolio.", "Call or message when you're ready to talk."],
["Browse our work and get in touch when something resonates.", "We respond to all inquiries within two business days."],
```

---

### retail_maker

**bold:**
```
["Add to cart. Ships in three days, made by hand.", ""],
["Shop the collection. Everything is in stock.", "Ships within three business days."],
["Grab yours. Small batch. When it's gone, it's gone.", "Free shipping over $75."],
["Add to cart before this run sells out.", "Ships in three days. Made by hand."],
["Every piece in this listing is in stock and ready to ship.", "Small batch. Order now."],
["Tap 'Add to cart'. Handmade, in stock, ships within three days.", "Limited quantity available."],
["Browse the shop and call or message with questions.", "We're happy to help before you buy."],
["Check our profile and message about wholesale or custom orders.", "Response within one business day."],
["Review our products and tap 'Website' to see the full catalog.", "We ship within three days of every order."],
["Check our reviews and call or message about a custom or bulk order.", "We work with boutiques, events, and gifting programs."],
```

**friendly:**
```
["Add to cart and we'll have it on its way to you quickly.", "Made with care, every single one."],
["Shop the collection and find something you'll actually keep.", "Small batches, made with intention."],
["See the full shop. You might want more than one piece.", "We ship within a few days of every order."],
["Find something you love and it'll be with you within the week.", "Every piece made by hand."],
["Tap 'Add to cart'. It's easy to order and we take care of everything after.", "Ships fast. Packed carefully. Made with care."],
```

**professional:**
```
["Add to cart and complete your purchase with secure checkout.", "All orders ship within three to five business days."],
["Browse the collection and place your order.", "Returns accepted within 30 days of delivery."],
["Purchase directly from the listing.", "Wholesale welcome. Message the shop."],
["Purchase from the listing. We confirm and ship within three to five business days.", "Wholesale and trade inquiries welcome via shop message."],
["Select your quantity and add to cart. Secure checkout and tracked shipping included.", "We confirm all orders within one business day."],
```

---

## Goal: `lead_gen` — Marketplace

### retail_maker

```
["Message the shop for custom orders or bulk pricing.", "We respond within one business day."],
["Questions about sizing, materials, or custom options? Message us.", "We're happy to help before you buy."],
["Looking for something specific? Message the shop. We may be able to make it.", "Custom orders welcome."],
["Custom or bulk order for an event or business? Message the shop.", "We produce handmade items at volume. Response within one business day."],
```

### trades_home

```
["Message the shop with your project details.", "We'll confirm what's available and provide pricing."],
["Questions about the product or installation? Message us.", "We reply within one business day."],
["Custom orders and bulk pricing available. Message the shop for details.", "We work with contractors and property managers."],
["Ongoing project or recurring supply need? Message the shop to discuss volume pricing.", "We work with contractors and property managers on repeat orders."],
```

---

## Goal: `audience_growth` — Marketplace

Etsy and similar marketplaces support shop follows. Frame the follow as discovery of future drops and small-batch craft, not a generic mailing-list opt-in. Native vocabulary: "follow the shop," "favorite the shop," "first to see new drops."

### retail_maker

**bold:**
```
["Follow the shop before the next batch drops.", "Small runs go fast. Followers are always the first to know."],
["Favorite the shop and get notified on new releases.", "New pieces every season. First come, first served."],
["Follow before the next drop goes live.", "I add pieces in small batches. Followers see them first."],
["Tap 'Follow' and you'll know the moment the next batch is ready.", "Small runs move fast. Followers see them before they're gone."],
```


**friendly:**
```
["Follow the shop and be the first to see what's coming next.", "New handmade pieces added regularly. I'd love to have you along."],
["Favorite the shop for updates on new drops and restocks.", "Made in small batches, so things move faster than you'd expect."],
["Follow along and see new pieces as they're finished.", "I share new work and behind-the-scenes as I make it."],
["Tap 'Follow' so you don't miss the next collection.", "Everything is made by hand in small runs. The easiest way to stay in the loop."],
```

## Goal: `retention` — Marketplace

Re-purchase mechanic. Past customers returning to the shop. No urgency or scarcity language. Native vocabulary: "reorder," "back in stock," "since your last order," "loyalty discount if applicable."

### retail_maker

```
["We add new pieces every few weeks.", "Come see what's arrived since your last order."],
["Ready to reorder? The shop has been updated since your last visit.", "Still made by hand. Ships within three days."],
["A new collection just landed in the shop.", "Come see what's been added since you were last here."],
["One of your past favorites is back in stock.", "Head to the shop and grab yours again."],
["A new season's worth of work is in the shop.", "Something different this time. Still all made by hand."],
["Something in the new collection might be exactly what you were looking for last time.", "Come back and take a look."],
```

### trades_home

```
["Ready to reorder? The same products are in stock and ready to ship.", "We confirm orders within one business day."],
["Running low? The materials from your last order are still available.", "Message the shop for bulk or contractor pricing."],
["Time to restock. Same reliable products, ready now.", "We ship within two business days of every order."],
["Your last order worked out? The shop is ready for another.", "Message us for contractor or recurring-order pricing."],
["New inventory just arrived. Come back and see what's in stock.", "Same quality, same delivery window."],
["Need more of the same? Reorder directly from the listing.", "Message us if your specs or quantities have changed."],
```

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
**retail_maker, friendly:** `["Browse what's new in the shop.", "Find something you'll actually keep.", "Order and it'll be on its way within the week."]`
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

**health_wellness, bold:** `["Book a free intro session.", "Tell us your goals.", "No commitment required."]`
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

**trades_home, any:** ["Book the next phase.", "Seasonal maintenance? Tap the link.", "Back on the schedule when you're ready."]
**food_hospitality, any:** ["Come back and try what's new.", "The menu's changed since you were last in.", "Tap the link to see what's on and reserve."]
**retail_maker, any:** ["See what's new in the shop.", "New pieces since your last order.", "Something you had your eye on is back in stock."]
**health_wellness, any:** ["Get back on a schedule.", "New services and slots available.", "Book through the link in bio."]
**creative_pro, any:** ["Ready for the next project?", "New client slots available.", "DM or tap the link to get started."]
**professional_svc, any:** ["Time for a check-in?", "Things have changed. A short call gets you current.", "Schedule a quick review call."]
**community, any:** ["Get back in.", "New programs have launched.", "Tap the link to see what's happening."]

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
