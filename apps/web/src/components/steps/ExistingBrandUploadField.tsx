import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'

const BYTES_PER_MEGABYTE = 1024 * 1024
const MAX_FILE_SIZE_BYTES = 4 * BYTES_PER_MEGABYTE

export type ExistingBrandUploadAssetType = 'logo' | 'referenceImage'

/**
 * In-memory cache of selected `File` objects, keyed by sessionId + assetType, so
 * the thumbnail / filename survive Back-navigation remounts within a page
 * session. We intentionally do NOT persist to storage — `File` objects are not
 * serializable, and the form already holds the placeholder path + extracted
 * colors that downstream needs. This cache only hydrates the in-session preview
 * UI when the upload field remounts (e.g. after Continue → Back). On full page
 * reload the cache is empty and the field falls back to the "Uploaded"
 * placeholder branch using `storedRef`.
 */
const pendingFileCache = new Map<string, File>()

function pendingFileCacheKey(sessionId: string, assetType: ExistingBrandUploadAssetType) {
  return `${sessionId}:${assetType}`
}

interface ExistingBrandUploadFieldProps {
  id: string
  label: string
  description: string
  assetType: ExistingBrandUploadAssetType
  /**
   * Path string already stored on the form (placeholder or real). Empty when nothing is set.
   * Triggers the "uploaded" preview state when present alongside `pendingFile`.
   */
  storedRef: string
  /**
   * Called with the selected `File` and the placeholder path string the form should hold
   * until Pro-E lands. The parent owns running color extraction and writing the form.
   */
  onSelect: (file: File, placeholderPath: string) => void
  onClear: () => void
  /** SessionId used to scope the placeholder path. */
  sessionId: string
  error?: string
}

const MIME_ALLOWLIST: Record<ExistingBrandUploadAssetType, string[]> = {
  logo: ['image/png', 'image/jpeg', 'image/svg+xml'],
  referenceImage: ['image/png', 'image/jpeg'],
}

const ACCEPT_ATTR: Record<ExistingBrandUploadAssetType, string> = {
  logo: 'image/png,image/jpeg,image/svg+xml',
  referenceImage: 'image/png,image/jpeg',
}

const ALLOW_LABEL: Record<ExistingBrandUploadAssetType, string> = {
  logo: 'PNG, JPG, or SVG, up to 4MB.',
  referenceImage: 'PNG or JPG, up to 4MB.',
}

function placeholderPathFor(sessionId: string, assetType: ExistingBrandUploadAssetType, file: File) {
  const ext = (() => {
    const parts = file.name.split('.')
    if (parts.length > 1) return parts.pop()!.toLowerCase()
    if (file.type === 'image/png') return 'png'
    if (file.type === 'image/jpeg') return 'jpg'
    if (file.type === 'image/svg+xml') return 'svg'
    return 'bin'
  })()
  return `pending:${sessionId}/${assetType}.${ext}`
}

/**
 * Existing-brand upload field for logos and reference images.
 *
 * During the Pro-D ship the file never actually leaves the browser — the
 * `/uploads/sign` flow lands in Pro-E (see OUTPUT_TRANSLATION_SPEC §5.6.0 scope
 * note). We hold the `File` locally so we can run `color-thief` and show a
 * preview, and we write a `pending:` placeholder path into the form so review /
 * resume / fulfillment plumbing already looks correct.
 */
export function ExistingBrandUploadField({
  id,
  label,
  description,
  assetType,
  storedRef,
  onSelect,
  onClear,
  sessionId,
  error,
}: ExistingBrandUploadFieldProps) {
  const cacheKey = pendingFileCacheKey(sessionId, assetType)
  const [pendingFile, setPendingFile] = useState<File | null>(
    () => pendingFileCache.get(cacheKey) ?? null,
  )
  const [localError, setLocalError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const previewUrl = useMemo(
    () => (pendingFile ? URL.createObjectURL(pendingFile) : null),
    [pendingFile],
  )

  useEffect(() => {
    if (!previewUrl) return
    return () => URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const allowed = MIME_ALLOWLIST[assetType]
    if (!allowed.includes(file.type)) {
      setLocalError(`Use ${ALLOW_LABEL[assetType]}`)
      return
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setLocalError('File is larger than 4MB. Try a smaller version.')
      return
    }

    setLocalError(null)
    setPendingFile(file)
    pendingFileCache.set(cacheKey, file)
    onSelect(file, placeholderPathFor(sessionId, assetType, file))
  }

  const handleClear = () => {
    setPendingFile(null)
    pendingFileCache.delete(cacheKey)
    setLocalError(null)
    onClear()
    if (inputRef.current) inputRef.current.value = ''
  }

  const hasFile = !!pendingFile || !!storedRef
  const displayError = error ?? localError ?? undefined

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-900" htmlFor={id}>
        {label}
      </label>
      <p className="text-xs leading-snug text-gray-600">{description}</p>
      <div
        className={`flex flex-col gap-3 rounded-xl border px-3 py-3 transition ${
          displayError ? 'border-red-400' : 'border-gray-300'
        }`}
      >
        <div className="flex items-center gap-3">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt=""
              className="h-14 w-14 rounded-lg border border-gray-200 object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-dashed border-gray-300 text-xs text-gray-400">
              {assetType === 'logo' ? 'Logo' : 'Image'}
            </div>
          )}
          <div className="flex-1 text-sm text-gray-700">
            {pendingFile ? (
              <span className="font-medium">{pendingFile.name}</span>
            ) : storedRef ? (
              <span className="font-medium">Uploaded</span>
            ) : (
              <span className="text-gray-500">No file selected.</span>
            )}
            <p className="mt-0.5 text-xs text-gray-500">{ALLOW_LABEL[assetType]}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={inputRef}
            id={id}
            type="file"
            accept={ACCEPT_ATTR[assetType]}
            onChange={handleFileChange}
            className="sr-only"
          />
          <label
            htmlFor={id}
            className="inline-flex cursor-pointer items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50"
          >
            {hasFile ? 'Replace file' : 'Choose file'}
          </label>
          {hasFile ? (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center rounded-lg border border-transparent px-2 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900"
            >
              Remove
            </button>
          ) : null}
        </div>
      </div>
      {displayError ? <p className="text-xs text-red-600">{displayError}</p> : null}
    </div>
  )
}
