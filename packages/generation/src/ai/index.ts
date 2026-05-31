export { callClaude, CALL_CLASS_DEFAULTS, resetAnthropicClientForTests } from './client.js'
export type { CallClaudeOpts, CallClaudeResult, CallClass, UserBlock } from './client.js'
export {
  SafetyRefusalError,
  TruncationError,
  EmptyResponseError,
  SchemaParseError,
  AnthropicConfigError,
  AnthropicAuthError,
  AnthropicRateLimitError,
  AnthropicOverloadedError,
} from './errors.js'
export { scaffoldAndRefine } from './dispatcher.js'
export type { ScaffoldSource, ScaffoldAndRefineResult } from './dispatcher.js'
export { buildPromptContext } from './prompts/buildPromptContext.js'
export { buildSystemPrompt } from './prompts/buildSystemPrompt.js'
export { rewriteBriefIdealCustomer } from './sections/briefIdealCustomer.js'
export type { BriefIdealCustomerRewriteResult } from './sections/briefIdealCustomer.js'
export { runBrandAuditWhatWeSawSmoke } from './sections/brandAuditWhatWeSawSmoke.js'
export type { BrandAuditWhatWeSawSmokeResult } from './sections/brandAuditWhatWeSawSmoke.js'
export { extractReferenceVisionProfile, runMoodboardRanker } from './sections/moodboardRanker.js'
export type { MoodboardRankerRunResult, ReferenceVisionExtractResult } from './sections/moodboardRanker.js'
export { runMoodboardCaption } from './sections/moodboardCaption.js'
export type { MoodboardCaptionRunResult } from './sections/moodboardCaption.js'
export { buildVisualReferenceShortlist, assignDeterministicRankerPicks, layoutIdFromShortlistLength } from '../image-bank/visualReferencePipeline.js'
export {
  resolveStyleGuideVisualReferenceModel,
  VISUAL_REFERENCE_MIN_PHOTO_PICKS,
} from '../image-bank/resolveStyleGuideVisualReferenceModel.js'
export type { ResolveStyleGuideVisualReferenceOptions } from '../image-bank/resolveStyleGuideVisualReferenceModel.js'
