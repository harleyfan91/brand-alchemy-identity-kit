import type { IdentityKitForm, StepErrors } from '../../types'
import { TextArea } from '../ui/TextArea'

interface Step4ValuesProps {
  form: IdentityKitForm
  isPro: boolean
  errors: StepErrors
  onValuesChange: (values: string[]) => void
  onMissionChange: (value: string) => void
}

const valueOptions = [
  {
    value: 'integrity',
    label: 'Integrity',
    subtitle: 'Trust and honesty first',
    icon: '◌',
  },
  {
    value: 'creativity',
    label: 'Creativity',
    subtitle: 'Fresh and expressive ideas',
    icon: '✦',
  },
  {
    value: 'clarity',
    label: 'Clarity',
    subtitle: 'Simple, direct communication',
    icon: '◎',
  },
  {
    value: 'craftsmanship',
    label: 'Craftsmanship',
    subtitle: 'Detail and quality in delivery',
    icon: '◇',
  },
  {
    value: 'inclusion',
    label: 'Inclusion',
    subtitle: 'Welcoming and accessible',
    icon: '◍',
  },
  {
    value: 'growth',
    label: 'Growth',
    subtitle: 'Always improving and evolving',
    icon: '↗',
  },
  {
    value: 'innovation',
    label: 'Innovation',
    subtitle: 'Forward-thinking mindset',
    icon: '△',
  },
  {
    value: 'authenticity',
    label: 'Authenticity',
    subtitle: 'Human and real voice',
    icon: '☉',
  },
]

export function Step4Values({
  form,
  isPro,
  errors,
  onValuesChange,
  onMissionChange,
}: Step4ValuesProps) {
  return (
    <>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-zinc-900">
          Select your core values
          <span className="ml-2 text-xs text-zinc-500">Select 2-4</span>
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {valueOptions.map((option) => {
            const selected = form.step4.values.includes(option.value)
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  if (selected) {
                    onValuesChange(form.step4.values.filter((value) => value !== option.value))
                    return
                  }
                  if (form.step4.values.length >= 4) return
                  onValuesChange([...form.step4.values, option.value])
                }}
                className={`flex min-h-[44px] items-start gap-2 rounded-xl border px-2.5 py-2 text-left transition sm:px-3 sm:py-2.5 ${
                  selected ? 'border-zinc-900 bg-zinc-100' : 'border-zinc-200 bg-white hover:border-zinc-400'
                }`}
              >
                <span className="shrink-0 text-sm leading-none text-zinc-700">{option.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold leading-snug text-zinc-900">{option.label}</span>
                  {selected ? (
                    <span className="mt-0.5 block text-[11px] leading-snug text-zinc-600 sm:text-xs">
                      {option.subtitle}
                    </span>
                  ) : null}
                </span>
              </button>
            )
          })}
        </div>
        {errors['step4.values'] ? <p className="text-xs text-red-600">{errors['step4.values']}</p> : null}
      </fieldset>
      {isPro ? (
        <TextArea
          id="missionStatement"
          label="Optional: mission statement"
          value={form.step4.missionStatement ?? ''}
          onChange={onMissionChange}
          placeholder="What are you here to change for your customers?"
        />
      ) : null}
    </>
  )
}
