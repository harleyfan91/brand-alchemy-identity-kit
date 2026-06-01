import { Image, Line, StyleSheet, Svg, Text, View } from '@react-pdf/renderer'

const SLASH_STROKE = '#D8DEE6'
const SLASH_WIDTH = 0.75

const styles = StyleSheet.create({
  tile: {
    backgroundColor: '#EEF1F5',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    position: 'relative',
  },
  tileSkeleton: {
    borderWidth: 0.75,
    borderColor: '#D8DEE6',
  },
  slashLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  placeholderLabel: {
    fontSize: 6.5,
    fontWeight: 600,
    letterSpacing: 0.8,
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 4,
    backgroundColor: '#EEF1F5',
  },
})

/** Gap along the diagonal sized to clear the placeholder label. */
function slashGapLengthPt(label: string, width: number): number {
  const charEstimate = label.length * 3.4 + 10
  return Math.min(width * 0.62, Math.max(26, charEstimate))
}

/** Top-right → bottom-left slash with a center gap for label text. */
function PlaceholderSlash({
  width,
  height,
  label,
}: {
  width: number
  height: number
  label: string
}) {
  const diag = Math.hypot(width, height)
  const halfGapT = Math.min(0.4, slashGapLengthPt(label, width) / (2 * diag))
  const t1 = 0.5 - halfGapT
  const t2 = 0.5 + halfGapT
  const x1 = width * (1 - t1)
  const y1 = height * t1
  const x2 = width * (1 - t2)
  const y2 = height * t2

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={styles.slashLayer}>
      <Line x1={width} y1={0} x2={x1} y2={y1} stroke={SLASH_STROKE} strokeWidth={SLASH_WIDTH} />
      <Line x1={x2} y1={y2} x2={0} y2={height} stroke={SLASH_STROKE} strokeWidth={SLASH_WIDTH} />
    </Svg>
  )
}

/** Empty-state media slot — shared by Brand Brief starting assets and Style Guide logo slot. */
export function KitMediaPlaceholderTile({
  width,
  height,
  imageSrc,
  placeholderLabel,
  imageFit = 'cover',
}: {
  width: number
  height: number
  imageSrc: string | null
  placeholderLabel: string
  imageFit?: 'cover' | 'contain'
}) {
  return (
    <View style={[styles.tile, !imageSrc ? styles.tileSkeleton : {}, { width, height }]}>
      {imageSrc ? (
        <Image
          src={imageSrc}
          style={{ width, height, objectFit: imageFit, objectPosition: 'center' }}
        />
      ) : (
        <>
          <PlaceholderSlash width={width} height={height} label={placeholderLabel} />
          <Text style={styles.placeholderLabel}>{placeholderLabel}</Text>
        </>
      )}
    </View>
  )
}
