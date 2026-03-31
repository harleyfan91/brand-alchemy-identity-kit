import type { IdentityKitForm, StepErrors } from '../../types'
import { InputField } from '../ui/InputField'
import { TextArea } from '../ui/TextArea'

interface Step6AestheticProps {
  form: IdentityKitForm
  errors: StepErrors
  onTextChange: (field: keyof IdentityKitForm['step6'], value: string) => void
  onUploadNameChange: (value: string) => void
}

export function Step6Aesthetic({
  form,
  errors,
  onTextChange,
  onUploadNameChange,
}: Step6AestheticProps) {
  return (
    <>
      <TextArea
        id="colorMoodNotes"
        label="Color and mood preferences"
        value={form.step6.colorMoodNotes}
        onChange={(value) => onTextChange('colorMoodNotes', value)}
        placeholder="Example: modern neutrals with one bold accent."
        error={errors['step6.colorMoodNotes']}
      />
      <TextArea
        id="styleNotes"
        label="Style references"
        value={form.step6.styleNotes}
        onChange={(value) => onTextChange('styleNotes', value)}
        placeholder="Describe style directions, references, or inspiration."
        error={errors['step6.styleNotes']}
      />
      <InputField
        id="referenceUploadName"
        label="Reference upload filename (placeholder for v1)"
        value={form.step6.referenceUploadName ?? ''}
        onChange={onUploadNameChange}
        placeholder="brand-reference.png"
      />
      <p className="text-xs text-zinc-500">
        Upload handling is a Phase 2 integration. This field captures placeholder metadata only.
      </p>
    </>
  )
}
