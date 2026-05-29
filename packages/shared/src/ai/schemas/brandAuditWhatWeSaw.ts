import { z } from 'zod'

/** Brand Audit §1 — multimodal observations (Pro smoke + future Pro-F). */
export const BrandAuditWhatWeSawSchema = z
  .object({
    logoObservation: z.string().max(480).optional(),
    referenceImageObservation: z.string().max(480).optional(),
    voiceSamplesObservation: z.string().max(480).optional(),
    websiteObservation: z.string().max(480).optional(),
    fieldsCited: z.array(z.string().max(80)).min(1).max(20),
  })
  .strict()

export type BrandAuditWhatWeSaw = z.infer<typeof BrandAuditWhatWeSawSchema>
