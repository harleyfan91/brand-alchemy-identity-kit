import {
  canonicalPaletteId,
  defaultPhotoColorRelationship,
  formatPaletteGuideHeader,
  type IdentityKitForm,
  type PhotoColorRelationship,
} from '@identity-kit/shared'

type CaptionKey = `${string}:${PhotoColorRelationship}`

const CAPTION_BANK: Partial<Record<CaptionKey, string>> = {
  'clean_minimal:echo-brand-colors':
    'These references lean into calm, uncluttered scenes whose color temperature sits close to your palette — muted neutrals, controlled light, and compositions with room to breathe. They support a clean register without shouting for attention. Your swatch rules on folio 01 still govern logo and UI color; the photographs echo that discipline in how they handle hue and contrast.',
  'clean_minimal:neutral-backdrops':
    'The photographs stay restrained — soft neutrals, natural light, and environments that do not compete with your brand color. Color carries in your logo, type, and interface instead. That separation keeps layouts readable while the images add texture and credibility. Folio 01 remains the source of truth for palette application.',
  'clean_minimal:natural-full-color':
    'Full natural color appears in these scenes even when it diverges from your swatches — sky, foliage, skin tone, and material truth stay intact. Your palette still anchors logo and UI work on folio 01; the references show how lively photography can coexist with a minimal brand system without forcing every frame to match a hex code.',

  'bold_graphic:echo-brand-colors':
    'These images share your palette’s energy — saturated accents, strong contrast, and compositions that read quickly at a glance. They reinforce a bold graphic register without adding ornamental clutter. Logo and UI color rules stay on folio 01; the photographs carry the same decisive color character in camera-facing work.',
  'bold_graphic:neutral-backdrops':
    'Photography stays graphic and high-contrast while hue stays mostly neutral — think monochrome environments, sharp light, and shapes that hold their own. Brand color lands in your mark and layouts instead. Folio 01 defines swatch usage; these references supply structure and punch without re-coloring every scene.',
  'bold_graphic:natural-full-color':
    'Vivid, real-world color fills these frames — even when it pushes past your swatch set — while composition stays bold and legible. Your palette still governs identity touchpoints on folio 01; the references show how full chroma in photos can pair with a graphic brand without flattening the world to brand hex alone.',

  'organic_natural:echo-brand-colors':
    'Warm, tactile scenes whose tones harmonize with your palette — wood, fiber, soil, and soft daylight that feel belonging to the same color family. They support an organic register: imperfect textures, human scale, and calm rhythm. Swatch rules on folio 01 apply to identity surfaces; these images extend that warmth into photography.',
  'organic_natural:neutral-backdrops':
    'Natural textures and soft light, with color held mostly in material rather than artificial saturation — stone, linen, greenery in muted range. Brand hue concentrates in logo and UI per folio 01 while photos stay earthy and credible. The split keeps identity color intentional and environments honest.',
  'organic_natural:natural-full-color':
    'Living color in these references — green, amber, sky, food, and skin — reflects the real world even when it wanders from your swatches. Folio 01 still anchors identity color; the photographs show how an organic brand can embrace full chroma outdoors and in craft contexts without forcing every leaf to match a palette chip.',

  'luxe_refined:echo-brand-colors':
    'Refined scenes whose color notes align with your palette — controlled highlights, deep shadows, and restrained saturation that feel gallery-calm. They support a luxe register: generous space, precise light, and materials that reward a second look. Identity color rules on folio 01 carry in logo and UI; photography whispers rather than shouts in the same family.',
  'luxe_refined:neutral-backdrops':
    'Photography favors neutral grounds — stone, paper, soft grey light — so brand color reads precisely in your mark and layouts. The images add atmosphere and craft without introducing competing hues. Folio 01 remains authoritative for swatches; these references supply quiet backdrop and material depth.',
  'luxe_refined:natural-full-color':
    'Selective natural color appears in these frames — botanicals, wine, metal, evening light — while overall treatment stays refined. Your palette still defines identity on folio 01; the references show how full chroma in small doses can elevate a luxe system without breaking its reserve.',
}

function captionKey(form: IdentityKitForm): CaptionKey {
  const style = form.step6.selectedStyle || 'clean_minimal'
  const relationship =
    form.step6.photoColorRelationship ?? defaultPhotoColorRelationship(form.step6.selectedStyle)
  return `${style}:${relationship}`
}

/**
 * Deterministic moodboard caption when AI is off or fails.
 * Keyed on selectedStyle × photoColorRelationship per OUTPUT_TRANSLATION_SPEC §5.8.1 step 3.
 */
export function composeDeterministicVisualReferenceCaption(form: IdentityKitForm): string {
  const keyed = CAPTION_BANK[captionKey(form)]
  if (keyed) return keyed

  const paletteName = formatPaletteGuideHeader(canonicalPaletteId(form.step6.selectedPalette)).replace(
    /^Palette: /,
    '',
  )
  const style = form.step6.selectedStyle.replace(/_/g, ' ')
  const moods = form.step6.moodAdjectives?.filter(Boolean) ?? []
  const moodClause = moods.length > 0 ? moods.join(', ') : 'your intake mood'
  return `These references were chosen to match a ${style} visual register and ${moodClause} tone for ${form.step1.businessName.trim() || 'your brand'}. ${paletteName} informs identity color on folio 01; the photographs show how camera-facing work can support that direction without repeating swatch rules here.`
}
