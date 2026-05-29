import { z } from 'zod'

/** Structured output for `brief.idealCustomer` Pro-A section rewrite. */
export const BriefIdealCustomerRewriteSchema = z
  .object({
    /** One direct sentence: who they are (role + context). No narrative. */
    summaryLine: z.string().min(1).max(200),
    /** 2–4 concrete identifiers: role, situation, constraint, or segment. */
    traits: z.array(z.string().min(1).max(120)).min(2).max(4),
    /** 2–3 priorities or outcomes in the buyer's language. */
    caresAbout: z.array(z.string().min(1).max(120)).min(2).max(3),
    fieldsCited: z.array(z.string().max(80)).min(1).max(20),
  })
  .strict()

export type BriefIdealCustomerRewrite = z.infer<typeof BriefIdealCustomerRewriteSchema>
