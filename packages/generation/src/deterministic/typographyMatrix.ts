import type { TypographyContext } from './brandProfile.js'

/** Section lead before specimens (no existing typeface). Keyed by typography context × Step 6 style id. */
export const typographySectionLeads: Record<TypographyContext, Record<string, string>> = {
  physical_and_digital: {
    clean_minimal:
      'Unless you already have brand fonts, Source Serif 4 and Inter can work as your starting pair, from business cards and signage to your website and social posts.',
    bold_graphic:
      'This direction usually works best with one bolder display face and a simpler everyday face for long reading. Source Serif 4 and Inter show that hierarchy so you can compare weights before you choose your final pair.',
    organic_natural:
      'Source Serif 4 carries display and hero lines, and Inter carries longer reading, labels, and UI. That split feels natural for warm, organic systems.',
    luxe_refined:
      'Unless you already have brand fonts, Source Serif 4 and Inter suit elevated physical and digital touchpoints, from packaging and menus to your site.',
  },
  social_and_packaging: {
    clean_minimal:
      'Your brand name needs to work on a product label, a grid post, and a profile photo. The bold row is often how your name reads at its most recognizable in tight spaces.',
    bold_graphic:
      'Bold display sans usually own headlines in this direction; Source Serif 4 and Inter sketch the headline-and-body split for listings, labels, and posts until you pick production fonts.',
    organic_natural:
      'Source Serif 4 and Inter suit makers and product brands, with characterful display and calmer everyday reading. Nunito Sans, Fraunces, or Lora are common swaps once you license.',
    luxe_refined:
      'Source Serif 4 and Inter show how a more elegant heading serif can pair with a clean everyday sans on packaging and social.',
  },
  professional_and_digital: {
    clean_minimal:
      'Unless you already have brand fonts, Source Serif 4 and Inter pair well for proposals, your website, email, and LinkedIn.',
    bold_graphic:
      'Headlines and CTAs usually sit in a stronger geometric sans; long copy stays neutral. Source Serif 4 and Inter mirror that quiet hierarchy, and Space Grotesk, Archivo, or similar can take those roles in production.',
    organic_natural:
      'Source Serif 4 and Inter suit this direction for decks, sites, and email: a warmer display serif and a calmer everyday sans for body. Nunito Sans, Fraunces, or Lora are common production swaps.',
    luxe_refined:
      'Source Serif 4 and Inter fit polished client-facing materials like proposals, decks, and your site.',
  },
  community_and_local: {
    clean_minimal:
      'These faces cover flyers, email newsletters, and social posts for local and community brands. Bold is often what people notice first on printed pieces.',
    bold_graphic:
      'High-contrast layouts work for events, fundraisers, and local campaigns. Source Serif 4 and Inter give you a display-and-body ladder you can echo with your real headline sans in print and digital.',
    organic_natural:
      'Warm, human typography fits community storytelling. Source Serif 4 and Inter map display warmth and calmer reading on flyers, posts, and mailings.',
    luxe_refined:
      'Refined serif display with a clean sans supports mission-driven brands. Source Serif 4 and Inter give you that pairing for headers, appeals, and announcements.',
  },
  social_and_digital: {
    clean_minimal:
      'Unless you already have brand fonts, this pair works across your website, social templates, and email.',
    bold_graphic:
      'In this direction, the louder face usually carries headlines while the simpler face handles captions and detail. Source Serif 4 and Inter track those roles until you swap in your headline face.',
    organic_natural:
      'A warmer, more expressive heading serif plus a calmer everyday sans fits feeds and product pages; Source Serif 4 and Inter track those roles. Rounded, warm alternatives work well once you choose final files.',
    luxe_refined:
      'Source Serif 4 and Inter support a premium digital presence, including site heroes, campaign graphics, and email.',
  },
}

/** Legacy per-face blurbs (not wired into current PDF specimens; PDF specimens use role band + stepped weight samples only). */
export const typographySpecimenBlurbs: Record<TypographyContext, Record<string, [string, string]>> = {
  physical_and_digital: {
    clean_minimal: [
      'Inter carries everyday reading—signage copy, labels, captions, and digital body text. Use regular for paragraphs, bold for short headlines and wayfinding, italic sparingly for quotes or emphasis. If you need one face from sign to social, bold Inter usually holds up best at distance and small sizes.',
      'Source Serif 4 adds calm editorial presence on menus, packaging headers, and story-driven lines. Prefer regular on display, bold only for small accents, italic for gentle emphasis. If you keep one serif moment, use it where the story lives—not on every label line.',
    ],
    bold_graphic: [
      'Inter (or your neutral) should carry long labels, ingredient text, and fine print. The weight ladder below shows how the quiet voice behaves; your real display sans should own large headlines and posters in production.',
      'Source Serif 4 can warm pull quotes, packaging callouts, or softer moments beside a loud geometric sans. Keep it out of competition with your primary display face on the same layout.',
    ],
    organic_natural: [
      'Inter stands in for a rounded everyday sans—signage detail, captions, and product copy. Regular for most surfaces, bold for friendly headers, italic when you want warmth without switching families.',
      'Source Serif 4 (or Fraunces / Lora) fits hero lines on packaging and storytelling posts. Use regular/bold/italic as a ladder; avoid heavy serif at very small print sizes where it can clog.',
    ],
    luxe_refined: [
      'Source Serif 4 carries elevated headlines on menus, gift boxes, and campaign lines. Stay mostly regular; use bold and italic sparingly so the voice stays refined.',
      'Inter covers functional type—body, captions, forms, and digital UI beside physical pieces. Use regular, bold, and italic for hierarchy without adding another family.',
    ],
  },
  social_and_packaging: {
    clean_minimal: [
      'Inter keeps listing copy, ingredients, and captions readable at thumbnail scale. Bold is often the clearest cut for your name on a label or profile—compare the three rows before you lock a wordmark.',
      'Source Serif 4 gives crafted products a deliberate headline voice on packaging and hero posts. Regular for story lines, bold for short display, italic for quotes; keep serif moments focused so the grid does not feel busy.',
    ],
    bold_graphic: [
      'Let your production display sans own loud moments; Inter below shows how neutral weight reads for detail copy, stickers, and captions.',
      'Use Source Serif 4 for optional editorial warmth on packaging sides or carousel text—not to fight your primary display face on the same tile.',
    ],
    organic_natural: [
      'Inter substitutes for a friendly sans on everyday packaging lines, DMs, and listing bodies. Bold for approachable headers; italic for a little personality.',
      'Source Serif 4 (or Fraunces / Lora) belongs on hero packaging shots and founder-story posts. Treat the specimen ladder as your hierarchy guide.',
    ],
    luxe_refined: [
      'Source Serif 4 signals premium on labels, unboxing cards, and campaign stills—mostly regular, bold and italic used with restraint.',
      'Inter handles SKU detail, shipping inserts, and on-screen product copy so the serif can stay special.',
    ],
  },
  professional_and_digital: {
    clean_minimal: [
      'Inter is your workhorse for proposals, email, site body copy, and LinkedIn. Regular for reading, bold for subheads and emphasis, italic for quotes or light stress.',
      'Source Serif 4 steps in for section titles, case-study headers, and moments that need a quieter serif than a loud display face. Prefer regular on display, bold for small accents only.',
    ],
    bold_graphic: [
      'Inter (or similar) should hold paragraphs, footnotes, and dense slides while your display sans carries titles and CTAs in production.',
      'Source Serif 4 can soften testimonials, sidebar quotes, or editorial asides without competing with a geometric headline face.',
    ],
    organic_natural: [
      'Inter stands in for a rounded sans on client emails, decks, and site UI. Regular/bold/italic give you hierarchy without extra families.',
      'Source Serif 4 (or Fraunces / Lora) suits about pages, long-form headers, and narrative decks—use the ladder below as your guide.',
    ],
    luxe_refined: [
      'Source Serif 4 leads proposals and premium site heroes; keep weight changes minimal so the system feels expensive.',
      'Inter covers the functional layer—appendices, captions, forms—so hierarchy stays obvious.',
    ],
  },
  community_and_local: {
    clean_minimal: [
      'Inter works for flyer body copy, newsletter text, and social captions. Bold for headers and calls to action people skim on paper or phone screens.',
      'Source Serif 4 adds gravity to appeals, event titles, and mission lines. Regular on display, italic for quotes, bold only in short bursts.',
    ],
    bold_graphic: [
      'Inter keeps event details and donation copy readable when your display face handles the poster headline in production.',
      'Source Serif 4 can humanize pull quotes or impact stories next to a strong sans campaign look.',
    ],
    organic_natural: [
      'Inter substitutes for a warm everyday sans on volunteer updates, community posts, and email blasts.',
      'Source Serif 4 (or Fraunces / Lora) fits storytelling headers on mailers and social carousels.',
    ],
    luxe_refined: [
      'Source Serif 4 elevates gala materials, annual reports, and flagship announcements with restraint.',
      'Inter keeps registration forms, FAQs, and everyday email legible and consistent.',
    ],
  },
  social_and_digital: {
    clean_minimal: [
      'Inter anchors site body, email, and social captions in one voice. Regular for reading, bold for in-feed headers, italic sparingly.',
      'Source Serif 4 differentiates hero lines, blog titles, and campaign landing headers without cluttering the grid.',
    ],
    bold_graphic: [
      'Inter shows how neutral type behaves in captions, product detail, and fine print while your display sans owns hooks in production.',
      'Source Serif 4 offers optional editorial contrast on long-scroll pages or story highlights.',
    ],
    organic_natural: [
      'Inter stands in for a rounded sans across templates, stories, and product modules.',
      'Source Serif 4 (or Fraunces / Lora) carries founder and craft narratives in feed and on site.',
    ],
    luxe_refined: [
      'Source Serif 4 leads premium campaign art and site heroes; keep italic and bold rare.',
      'Inter supports commerce flows, account email, and UI text beneath the display layer.',
    ],
  },
}

/** One neutral line for the Style Guide PDF + block body — not legal advice, points readers to the source. */
export const typographyLicensingDisclaimer =
  "Read the distributor's full terms and conditions for licensing."

export const typographyLicensingLines: Record<TypographyContext, string> = {
  physical_and_digital: typographyLicensingDisclaimer,
  social_and_packaging: typographyLicensingDisclaimer,
  professional_and_digital: typographyLicensingDisclaimer,
  community_and_local: typographyLicensingDisclaimer,
  social_and_digital: typographyLicensingDisclaimer,
}

/** Shown under the three weight rows on the primary (first) specimen only — layout/legibility only; logo strategy lives in Visual direction. */
export function typographyWordmarkBoldRowNote(ctx: TypographyContext): string | null {
  if (ctx === 'social_and_packaging') {
    return 'Use the bold row to judge how your business name reads at headline weight before you lock in display sizes.'
  }
  if (ctx === 'physical_and_digital') {
    return 'At large sizes, check your business name in bold for legibility and spacing before you finalize signage or hero type.'
  }
  return null
}
