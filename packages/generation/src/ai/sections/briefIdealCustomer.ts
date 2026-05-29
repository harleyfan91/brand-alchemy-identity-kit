import {
  BriefIdealCustomerRewriteSchema,
  type BriefIdealCustomerRewrite,
  type IdentityKitForm,
} from '@identity-kit/shared'

import { briefIdealCustomerScaffold } from '../../deterministic/coreAssembly.js'
import { callClaude } from '../client.js'
import { scaffoldAndRefine, type ScaffoldAndRefineResult } from '../dispatcher.js'
import { buildSystemPrompt } from '../prompts/buildSystemPrompt.js'
import {
  formatBriefIdealCustomerForPdf,
  idealCustomerSnapshotFromIntake,
} from '../../deterministic/idealCustomerSnapshot.js'

const SECTION_ID = 'brief.idealCustomer'

function buildTaskPrompt(scaffold: string): string {
  return `Per the brand context and voice contracts in your system prompt, rewrite the section identified by ${SECTION_ID} as a **direct audience snapshot** — not a narrative paragraph.

The deterministic scaffold for reference (do not copy its run-on structure):

---
${scaffold}
---

Return JSON with:
- \`summaryLine\`: one sentence naming who they are (role, segment, or situation). Be specific to this business. No filler openers.
- \`traits\`: 2–4 short phrases — concrete identifiers (who decides, what situation they are in, what constraint they face). Not full sentences unless one short sentence is clearer.
- \`caresAbout\`: 2–3 priorities or outcomes in plain language. Pull from painPoints and desiredOutcomes when present.
- \`fieldsCited\`: intake fields you used.

Rules:
- Do NOT write a droning paragraph or scene-setting story.
- Do NOT invent demographics, budgets, or markets absent from intake.
- Anchor every line in at least one intake fact from BRAND CONTEXT.
- Prefer direct labels ("Independent shop owners", "1–2 location retailers") over literary description.`
}

function scaffoldFallback(_scaffold: string, form: IdentityKitForm): BriefIdealCustomerRewrite {
  return idealCustomerSnapshotFromIntake(form)
}

export type BriefIdealCustomerRewriteResult = ScaffoldAndRefineResult<BriefIdealCustomerRewrite> & {
  scaffold: string
  /** Plain-text body for Brand Brief PDF injection. */
  pdfBody: string
}

/**
 * Pro `ai_enhanced` rewrite for Brand Brief — Ideal customer.
 */
export async function rewriteBriefIdealCustomer(
  form: IdentityKitForm,
  kitOrderId: string,
): Promise<BriefIdealCustomerRewriteResult> {
  const scaffold = briefIdealCustomerScaffold(form)
  const system = { text: buildSystemPrompt(form), cacheKey: 'pro-system-v1' }
  const maxTokens = 600

  const result = await scaffoldAndRefine({
    sectionName: SECTION_ID,
    scaffold,
    maxTokens,
    toFallback: () => scaffoldFallback(scaffold, form),
    run: async () => {
      const { data } = await callClaude({
        callClass: 'section_rewrite',
        system,
        userBlocks: [{ type: 'text', text: buildTaskPrompt(scaffold) }],
        schema: BriefIdealCustomerRewriteSchema,
        kitOrderId,
        sectionName: SECTION_ID,
        maxTokens,
      })
      return data
    },
    onTruncationRetry: async (nextMaxTokens) => {
      const { data } = await callClaude({
        callClass: 'section_rewrite',
        system,
        userBlocks: [{ type: 'text', text: buildTaskPrompt(scaffold) }],
        schema: BriefIdealCustomerRewriteSchema,
        kitOrderId,
        sectionName: SECTION_ID,
        maxTokens: nextMaxTokens,
      })
      return data
    },
  })

  return { ...result, scaffold, pdfBody: formatBriefIdealCustomerForPdf(result.data) }
}
