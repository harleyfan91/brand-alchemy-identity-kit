import { z } from 'zod'

export const MoodboardCaptionSchema = z
  .object({
    caption: z.string().max(600),
    fieldsCited: z.array(z.string().min(1)).min(1),
  })
  .strict()

export type MoodboardCaptionOutput = z.infer<typeof MoodboardCaptionSchema>
