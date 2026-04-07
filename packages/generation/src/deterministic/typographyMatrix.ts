import type { TypographyContext } from './brandProfile.js'

/** Section lead before specimens (no existing typeface). Keyed by typography context × Step 6 style id. */
export const typographySectionLeads: Record<TypographyContext, Record<string, string>> = {
  physical_and_digital: {
    clean_minimal:
      'Unless you already have brand fonts, Inter and Source Serif 4 can work as your starting pair—from business cards and signage to your website and social posts. Each block below shows your business name in regular, bold, and italic so you can see how they hold up before you commit.',
    bold_graphic:
      'This direction usually works best with one bolder font for headlines and another simpler font for longer reading. The blocks below use Inter and Source Serif 4 as stand-ins so you can compare regular, bold, and italic before you choose your final pair.',
    organic_natural:
      'This direction usually feels best with a friendlier everyday font plus a second font for more expressive headings. Below, Inter and Source Serif 4 stand in for that split; each block shows your name in regular, bold, and italic so you can compare the roles before choosing final files.',
    luxe_refined:
      'Unless you already have brand fonts, Source Serif 4 and Inter suit elevated physical and digital touchpoints—from packaging and menus to your site. Each block renders your business name in regular, bold, and italic so hierarchy is visible before you commit.',
  },
  social_and_packaging: {
    clean_minimal:
      'Your brand name needs to work on a product label, a grid post, and a profile photo. The two faces below show your name in regular, bold, and italic—the bold row is often how your name reads at its most recognizable in tight spaces.',
    bold_graphic:
      'Bold display sans usually own headlines in this direction; Inter and Source Serif 4 below are stand-ins showing regular, bold, and italic. Use the same hierarchy on listings, labels, and posts once you pick your production fonts.',
    organic_natural:
      'A friendlier everyday font plus a warmer heading font fits makers and product brands well. Inter and Source Serif 4 below show that rhythm with your name in regular, bold, and italic—swap in Nunito Sans, Fraunces, or Lora when you choose final files.',
    luxe_refined:
      'Source Serif 4 and Inter below show how a more elegant heading font can work with a clean everyday font on packaging and social. Each block uses your business name in regular, bold, and italic so you can judge weight before printing or posting.',
  },
  professional_and_digital: {
    clean_minimal:
      'Unless you already have brand fonts, Inter and Source Serif 4 pair well for proposals, your website, email, and LinkedIn. Each block below shows your business name in regular, bold, and italic so you can compare weights before committing.',
    bold_graphic:
      'Headlines and CTAs usually sit in a stronger geometric sans; long copy stays neutral. Inter and Source Serif 4 below are stand-ins—your name in regular, bold, and italic shows the quiet hierarchy to mirror with Space Grotesk, Archivo, or similar.',
    organic_natural:
      'A warmer everyday font plus a more expressive heading font suits this direction for decks, sites, and email. Below, Inter and Source Serif 4 stand in with your name in regular, bold, and italic; match the same roles with Nunito Sans, Fraunces, or Lora in production.',
    luxe_refined:
      'Source Serif 4 and Inter fit polished client-facing materials—proposals, decks, and your site. Each block shows your business name in regular, bold, and italic at a restrained scale.',
  },
  community_and_local: {
    clean_minimal:
      'These faces cover flyers, email newsletters, and social posts for local and community brands. Each block shows your business name in regular, bold, and italic—bold is often what people notice first on printed pieces.',
    bold_graphic:
      'High-contrast layouts work for events, fundraisers, and local campaigns. Inter and Source Serif 4 below are embedded stand-ins; your name in regular, bold, and italic shows the hierarchy to echo with a bolder display sans where headlines need punch.',
    organic_natural:
      'Warm, human typography fits community storytelling. Inter and Source Serif 4 below stand in for a friendlier everyday font and a warmer heading font; each block shows your name in regular, bold, and italic for flyers, posts, and mailings.',
    luxe_refined:
      'Refined serif display with a clean sans supports mission-driven brands that still want polish. Source Serif 4 and Inter below render your name in regular, bold, and italic for headers, appeals, and announcements.',
  },
  social_and_digital: {
    clean_minimal:
      'Unless you already have brand fonts, this pair works across your website, social templates, and email. Each block shows your business name in regular, bold, and italic so contrast is easy to see on screen.',
    bold_graphic:
      'In this direction, the louder font usually carries headlines while the simpler font handles captions and detail. Inter and Source Serif 4 below are stand-ins with your name in regular, bold, and italic—mirror that split with your chosen headline font later.',
    organic_natural:
      'A more approachable everyday font plus a more expressive heading font fits feeds and product pages. Below, Inter and Source Serif 4 illustrate that pairing with your name in regular, bold, and italic; swap in rounded and warm alternatives when you choose final files.',
    luxe_refined:
      'Source Serif 4 and Inter support a premium digital presence—site heroes, campaign graphics, and email. Each block shows your business name in regular, bold, and italic at a restrained scale.',
  },
}

/**
 * Per-face specimen blurbs: tuple order matches typographySpecimenPlans[style] slot order
 * (clean_minimal / bold_graphic / organic: inter then serif; luxe_refined: serif then inter).
 */
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

export function typographyLogoClosingParagraph(isEstablishedStage: boolean): string {
  if (isEstablishedStage) {
    return 'If you do not have a finalized mark yet, your name in your primary typeface is a strong, versatile starting point—especially while you standardize touchpoints. When you invest in something custom, bring this Style Guide so your designer sees palette, type, and direction in one place.'
  }
  return 'You do not need a custom logo mark to have a professional brand. Your business name set consistently in your primary typeface functions as a wordmark and is often more legible at the sizes small businesses actually print and post. When you work with a designer later, this Style Guide gives them your palette, type, and direction in one place.'
}

/** Shown under the three weight rows on the primary (first) specimen only. */
export function typographyWordmarkBoldRowNote(ctx: TypographyContext): string | null {
  if (ctx === 'social_and_packaging') {
    return 'The bold row is a practical wordmark starting point—your name at its clearest. A custom symbol can wait until the rest of the system is consistent.'
  }
  if (ctx === 'physical_and_digital') {
    return 'At large sizes, your primary face in bold is a readable wordmark starting point—test your business name big before adding complexity.'
  }
  return null
}

export function showTypographyLogoClosing(ctx: TypographyContext): boolean {
  return ctx === 'physical_and_digital' || ctx === 'social_and_packaging'
}
