import { Button } from '../ui/Button'

import type { Tier } from '../../types'

interface ConfirmScreenProps {
  tier: Tier | null
  onRestart: () => void
  generatedFiles?: Array<{ id: string; title: string; fileName: string; downloadUrl: string }>
}

export function ConfirmScreen({ tier, onRestart, generatedFiles }: ConfirmScreenProps) {
  const pdfCount = tier === 'pro' ? 5 : 4
  const hasGeneratedFiles = Boolean(generatedFiles && generatedFiles.length > 0)
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-3 sm:px-6">
      <section className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white px-4 py-8 sm:p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">Delivery Confirmed</p>
        <h1 className="mt-2 font-serif text-3xl font-normal tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
          Your Identity Kit is on the way
        </h1>
        <p className="mt-3 text-sm font-light leading-relaxed text-gray-500 sm:text-base">
          {hasGeneratedFiles
            ? `Your ${pdfCount} branded PDF documents are ready to download below.`
            : `We emailed your ${pdfCount} branded PDF documents. If you do not see them within a few minutes, check your spam/promotions folder.`}
        </p>
        <p className="mt-2 text-xs text-gray-500">Need help? Contact support@brandalchemyllc.com</p>
        {hasGeneratedFiles ? (
          <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-3">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">Downloads</p>
            <ul className="mt-3 space-y-2">
              {generatedFiles?.map((file) => (
                <li key={file.id}>
                  <a
                    className="inline-flex items-center text-sm font-medium text-gray-900 underline decoration-gray-300 underline-offset-4 hover:decoration-gray-600"
                    href={file.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    download={file.fileName}
                  >
                    {file.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-6">
          <Button onClick={onRestart}>Start New Kit</Button>
        </div>
      </section>
    </main>
  )
}
