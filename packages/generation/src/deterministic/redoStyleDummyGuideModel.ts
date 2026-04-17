export type RedoGuideNavItem = {
  number: string
  title: string
}

export type RedoGuideTripletItem = {
  label: string
  value: string
}

export type RedoGuideCopySpecimen = {
  headline: string
  body: string
}

export type RedoGuideLogoLockup = {
  label: string
  caption: string
}

export type RedoGuideColorSwatch = {
  name: string
  hex: string
}

export type RedoGuideGradientSwatch = {
  name: string
  from: string
  to: string
}

export type RedoGuideTypeScale = {
  sizeRange: string
  leading: string
  tracking: string
  headline: string
  body: string
}

export type RedoGuideArtDirectionTheme = {
  title: string
  description: string
}

/** One landscape page worth of content, keyed for nav highlighting. */
export type RedoGuideSpread =
  | {
      kind: 'cover'
      subtitle: string
      introParagraphs: string[]
    }
  | {
      kind: 'strategy'
      number: string
      title: string
      intro: string[]
      mainColumn: string[]
      asideQuote: string
    }
  | {
      kind: 'personality'
      number: string
      title: string
      intro: string[]
      tripletHeading: string
      tripletItems: RedoGuideTripletItem[]
      sampleHeading: string
      samples: RedoGuideCopySpecimen[]
    }
  | {
      kind: 'logo'
      number: string
      title: string
      intro: string[]
      narrative: string[]
      primaryLockup: RedoGuideLogoLockup
      clearspace: string
      secondaryLockups: RedoGuideLogoLockup[]
      incorrectUsage: string[]
      partnerships: string
    }
  | {
      kind: 'color'
      number: string
      title: string
      intro: string[]
      narrative: string[]
      primary: RedoGuideColorSwatch[]
      secondary: RedoGuideColorSwatch[]
      gradients: RedoGuideGradientSwatch[]
    }
  | {
      kind: 'typography'
      number: string
      title: string
      intro: string[]
      narrative: string[]
      primaryTypeface: string
      secondaryTypeface: string
      specimenParagraph: string
      specimenHeadline: string
      scales: RedoGuideTypeScale[]
    }
  | {
      kind: 'artDirection'
      number: string
      title: string
      intro: string[]
      narrative: string[]
      themes: RedoGuideArtDirectionTheme[]
    }

export interface RedoStyleDummyGuideModel {
  brandName: string
  bookTitle: string
  nav: RedoGuideNavItem[]
  /** Shown in the top bar; keep short so it does not fight the layout. */
  headerUtilityLine: string
  footerMeta: string
  spreads: RedoGuideSpread[]
}

/** Stable PDF named destination id for nav `Link src={...}` (matches @react-pdf internal `#name` links). */
export function redoNavAnchorIdFromTitle(title: string): string {
  return `redo-sec-${title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')}`
}

export function redoSpreadAnchorId(spread: RedoGuideSpread): string {
  if (spread.kind === 'cover') return 'redo-cover'
  return redoNavAnchorIdFromTitle(spread.title)
}

export function buildRedoStyleDummyGuideModel(): RedoStyleDummyGuideModel {
  const nav: RedoGuideNavItem[] = [
    { number: '01', title: 'Brand Strategy' },
    { number: '02', title: 'Personality' },
    { number: '03', title: 'Logo' },
    { number: '04', title: 'Color' },
    { number: '05', title: 'Typography' },
    { number: '06', title: 'Art Direction' },
  ]

  const spreads: RedoGuideSpread[] = [
    {
      kind: 'cover',
      subtitle:
        'This guide defines the visual language, communication patterns, and reference standards that keep the brand clear across every touchpoint.',
      introParagraphs: [
        'At its core, Northstar Ledger is about calm clarity for ambitious founders. We turn financial complexity into something readable, trustworthy, and actionable without making the business feel clinical.',
        'These guidelines outline positioning, voice, logo behavior, color, typography, and imagery so every touchpoint feels consistent, modern, and steady.',
      ],
    },
    {
      kind: 'strategy',
      number: '01',
      title: 'Brand Strategy',
      intro: [
        'In founder-led businesses, the biggest problem is rarely effort. It is inconsistency. The offer evolves, the audience shifts, and the story gets harder to explain every time someone new has to describe it.',
        'Northstar Ledger exists to give service businesses a financial brand that feels steadier than the day-to-day noise. The brand should feel precise without feeling cold, and organized without becoming corporate.',
      ],
      mainColumn: [
        'The strategic role of the brand is to reduce friction before a conversation starts. A client should understand what the business does, who it is for, and why it feels dependable before they ever book a call.',
        'That means the identity needs to do more than look professional. It needs to create confidence. Clear language, measured visuals, and consistent signals should make the business feel prepared, thoughtful, and easy to trust.',
      ],
      asideQuote:
        'When the story is easy to repeat, the brand is easier to trust. Strategy here is not theory. It is the operating story the rest of the system reinforces.',
    },
    {
      kind: 'personality',
      number: '02',
      title: 'Personality',
      /* No chapter intro — triplet + sample grid carry the section (editorial variety). */
      intro: [],
      tripletHeading: 'Tone & Voice',
      tripletItems: [
        { label: 'Our Vision', value: 'A business world where clear numbers lead to clear decisions.' },
        { label: 'Our Mission', value: 'Help founders make confident financial moves with calm, structured guidance.' },
        { label: 'Our Promise', value: 'Bring clarity, not overwhelm, to every financial touchpoint.' },
      ],
      sampleHeading: 'Sample Copy',
      samples: [
        {
          headline: 'Clear numbers make better next moves',
          body: 'Northstar Ledger gives founders a simple financial picture so they can make decisions with more confidence and less guesswork.',
        },
        {
          headline: 'A calmer way to stay on top of the business',
          body: 'From monthly reporting to day-to-day cash visibility, we help the business feel more readable and less reactive.',
        },
        {
          headline: 'Financial clarity without the jargon cloud',
          body: 'The brand should feel precise and intelligent, but never dense. We explain what matters, show what changed, and keep the next action obvious.',
        },
        {
          headline: 'See something unclear? Lead with reassurance',
          body: 'Short lines should sound human and direct, without alarmist language or dense compliance tone unless the context truly requires it.',
        },
      ],
    },
    {
      kind: 'logo',
      number: '03',
      title: 'Logo',
      /* Open on narrative; first paragraph replaces a repeating “subtitle” block. */
      intro: [],
      narrative: [
        'The Northstar Ledger mark is built around direction, balance, and forward motion. It should feel exact, anchored, and highly legible at every scale. The primary lockup combines the wordmark and compass symbol into the most recognizable expression of the brand. It is the default choice for branded surfaces, proposals, and primary marketing assets.',
        'Secondary lockups exist for narrower layouts and lighter applications, but the visual relationship between symbol and wordmark should always feel deliberate and stable.',
      ],
      primaryLockup: {
        label: 'Primary Lockup',
        caption: 'Use on primary brand surfaces, covers, landing pages, and documents where the full identity should carry the composition.',
      },
      clearspace:
        'Keep at least one symbol-width of clearspace around the full lockup. The mark should never feel crowded by UI, copy, or container edges.',
      secondaryLockups: [
        {
          label: 'Stacked Lockup',
          caption: 'Use for square spaces, social thumbnails, and applications where vertical balance matters more than width.',
        },
        {
          label: 'Symbol Only',
          caption: 'Use sparingly for favicons, small stamps, or moments where the brand is already clearly established nearby.',
        },
      ],
      incorrectUsage: [
        'Do not rotate the symbol or change its axis.',
        'Do not separate the symbol from the wordmark in the primary lockup.',
        'Do not apply gradients, shadows, or outlines to the mark.',
        'Do not stretch, condense, or alter the proportions.',
        'Do not place the mark on low-contrast backgrounds.',
        'Do not use the symbol-only version as the default lockup.',
      ],
      partnerships:
        'For partner marks, align to the cap height of the wordmark and keep equal visual weight between both brands.',
    },
    {
      kind: 'color',
      number: '04',
      title: 'Color',
      /* Lead with the palette story in narrative instead of a second intro band. */
      intro: [],
      narrative: [
        'The color system is designed to feel grounded, dependable, and contemporary. Dark ink tones carry authority, warm neutrals keep the system approachable, and the accent is used for moments that need direction.',
        'The primary palette should do most of the work. Supporting tones add depth, while the accent should appear with restraint so it keeps its value as a signal.',
      ],
      primary: [
        { name: 'Deep Ink', hex: '#101828' },
        { name: 'Slate', hex: '#344054' },
        { name: 'Warm Sand', hex: '#EDE7DD' },
        { name: 'Paper', hex: '#FCFAF7' },
      ],
      secondary: [
        { name: 'Steel Blue', hex: '#667085' },
        { name: 'Mist', hex: '#D0D5DD' },
        { name: 'Pine Accent', hex: '#1F7A65' },
        { name: 'Soft Olive', hex: '#C7D3C0' },
        { name: 'Clay', hex: '#B87A56' },
        { name: 'Black', hex: '#000000' },
      ],
      gradients: [
        { name: 'Gradient 1', from: '#101828', to: '#344054' },
        { name: 'Gradient 2', from: '#344054', to: '#D0D5DD' },
        { name: 'Gradient 3', from: '#1F7A65', to: '#C7D3C0' },
        { name: 'Gradient 4', from: '#B87A56', to: '#EDE7DD' },
      ],
    },
    {
      kind: 'typography',
      number: '05',
      title: 'Typography',
      intro: [],
      narrative: [
        'The typography system balances confidence and readability. A modern sans-serif handles the day-to-day work, while the serif introduces authority and contrast in larger statements. The primary sans-serif is used for interface copy, service details, and all functional reading.',
        'The secondary serif appears in headings, pull quotes, and narrative moments that need more editorial presence.',
      ],
      primaryTypeface: 'Inter',
      secondaryTypeface: 'Source Serif 4',
      specimenParagraph:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      specimenHeadline: 'Clear Up Confusion, Gain Peace of Mind',
      scales: [
        {
          sizeRange: '> 72 pt / px',
          leading: '100%',
          tracking: '-2%',
          headline: 'Steady numbers, clearer decisions',
          body: 'Use the largest scale for keynote statements, covers, and short campaign headlines that need immediate presence.',
        },
        {
          sizeRange: '55 - 72 pt / px',
          leading: '110%',
          tracking: '-1%',
          headline: 'Financial clarity should feel calm, not clinical',
          body: 'This range works best for section openers, narrative pull quotes, and elevated web hero copy.',
        },
        {
          sizeRange: '24 - 55 pt / px',
          leading: '120%',
          tracking: '-1%',
          headline: 'Use this range for confident mid-scale headlines',
          body: 'This is the core editorial workhorse for landing pages, proposals, and structured marketing layouts.',
        },
        {
          sizeRange: '0 - 24 pt / px',
          leading: '130%',
          tracking: '0%',
          headline: 'Body copy and UI text',
          body: 'Default reading copy should always favor comfort, clarity, and even rhythm over visual flourish.',
        },
      ],
    },
    {
      kind: 'artDirection',
      number: '06',
      title: 'Art Direction',
      intro: [],
      narrative: [
        'Imagery should reinforce the same promise as the rest of the system: clarity, steadiness, and capable guidance. The visual world should feel composed rather than noisy.',
        'Use photography and supporting textures to make the brand feel modern and real, not abstract or overly polished.',
      ],
      themes: [
        {
          title: 'Clean Working Surfaces',
          description:
            'Show tidy desks, printed financial documents, notebooks, and restrained digital interfaces. The frame should feel organized, spacious, and intentional.',
        },
        {
          title: 'People With Focus',
          description:
            'Choose moments of concentration, collaboration, or review. Expressions should feel confident and grounded, not performative or overly corporate.',
        },
        {
          title: 'Measured Technology',
          description:
            'When screens appear, keep them legible and minimal. Dashboards, spreadsheets, or reporting views should support the story without becoming busy hero graphics.',
        },
        {
          title: 'Quiet Material Contrast',
          description:
            'Favor matte paper, soft shadow, subtle grain, and natural light. Texture should support depth and warmth without making the brand feel rustic.',
        },
      ],
    },
  ]

  return {
    brandName: 'Northstar Ledger',
    bookTitle: 'Brand Guidelines',
    nav,
    headerUtilityLine: 'Download Kit · Contact Us · Back to the top',
    footerMeta: '© Northstar Ledger · Legal · Privacy · All Rights Reserved',
    spreads,
  }
}
