/**
 * Weight/style rows for the Brand Identity Guide typeface specimen.
 * Each row must match a face actually registered in `registerCoreKitPdfFonts`;
 * otherwise react-pdf falls back to the nearest file and every line looks the same.
 */

export type TypefaceSpecimenLadderRow = {
  label: string
  fontWeight: 300 | 400 | 500 | 600 | 700
  fontStyle: 'normal' | 'italic'
}

/** Default when the family ships multiple upright weights in our PDF bundle. */
const DEFAULT_LADDER: ReadonlyArray<TypefaceSpecimenLadderRow> = [
  { label: 'Light', fontWeight: 300, fontStyle: 'normal' },
  { label: 'Regular', fontWeight: 400, fontStyle: 'normal' },
  { label: 'SemiBold', fontWeight: 600, fontStyle: 'normal' },
  { label: 'Bold', fontWeight: 700, fontStyle: 'normal' },
  { label: 'Italic', fontWeight: 400, fontStyle: 'italic' },
]

/**
 * Google Fonts "DM Serif Display" is a single-master display cut: only 400
 * upright + 400 italic exist in @fontsource. No Light / SemiBold / Bold files.
 */
const DM_SERIF_DISPLAY_LADDER: ReadonlyArray<TypefaceSpecimenLadderRow> = [
  { label: 'Regular', fontWeight: 400, fontStyle: 'normal' },
  { label: 'Italic', fontWeight: 400, fontStyle: 'italic' },
]

const LADDER_BY_FAMILY: Record<string, ReadonlyArray<TypefaceSpecimenLadderRow>> = {
  'DM Serif Display': DM_SERIF_DISPLAY_LADDER,
}

export function typefaceSpecimenLadderForPdfFamily(pdfFamily: string): ReadonlyArray<TypefaceSpecimenLadderRow> {
  return LADDER_BY_FAMILY[pdfFamily] ?? DEFAULT_LADDER
}
