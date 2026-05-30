import { z } from 'zod'

export const MoodboardRankerPickSchema = z
  .object({
    slotId: z.string().min(1),
    imageId: z.string().min(1),
    reasoning: z.string().max(120),
  })
  .strict()

export const MoodboardRankerSchema = z
  .object({
    picks: z.array(MoodboardRankerPickSchema).min(6).max(9),
  })
  .strict()

export type MoodboardRankerPick = z.infer<typeof MoodboardRankerPickSchema>
export type MoodboardRankerOutput = z.infer<typeof MoodboardRankerSchema>
