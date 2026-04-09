import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { mkdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { renderCoreKitPdfs } from '@identity-kit/generation'
import type { IdentityKitForm } from '@identity-kit/shared'

dotenv.config()

const app = express()
const port = Number(process.env.PORT ?? 8787)
const webAppUrl = process.env.WEB_APP_URL ?? 'http://localhost:5173'
const webAppOrigin = new URL(webAppUrl).origin
const generatedRoot = path.resolve(process.cwd(), 'tmp/generated-kits')
const allowedPdfNames = new Set([
  '01-brand-brief.pdf',
  '02-style-guide.pdf',
  '03-voice-playbook.pdf',
  '04-quick-start.pdf',
])

type CorePdfFile = {
  id: 'brandBrief' | 'styleGuide' | 'voicePlaybook' | 'quickStart'
  title: string
  fileName: string
  downloadUrl: string
}

app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server, curl, and same-origin requests without an Origin header.
      if (!origin) {
        callback(null, true)
        return
      }
      // Keep explicit env override, and allow localhost dev ports used by Vite.
      if (origin === webAppOrigin || /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
        callback(null, true)
        return
      }
      callback(new Error(`Origin not allowed by CORS: ${origin}`))
    },
  }),
)
app.use(express.json())

app.get('/health', (_req, res) => {
  res.status(200).json({
    ok: true,
    service: 'identity-kit-api',
    timestamp: new Date().toISOString(),
  })
})

function sanitizeSessionId(value: string | undefined): string {
  const raw = value?.trim() || `sess_${crypto.randomUUID()}`
  return raw.replace(/[^a-zA-Z0-9_-]/g, '_')
}

function parseCoreForm(payload: unknown): IdentityKitForm | null {
  if (!payload || typeof payload !== 'object') return null
  const form = payload as IdentityKitForm
  if (form.tier !== 'core') return null
  if (!form.sessionId || typeof form.sessionId !== 'string') return null
  return form
}

app.post('/sessions', (_req, res) => {
  res.status(201).json({
    sessionId: `sess_${crypto.randomUUID()}`,
  })
})

app.post('/checkout', (req, res) => {
  const tier = String(req.body?.tier ?? 'core')
  res.status(200).json({
    checkoutUrl: '/payment-placeholder',
    tier,
  })
})

app.get('/fulfillment/:sessionId', (req, res) => {
  const { sessionId } = req.params
  res.status(200).json({
    sessionId,
    status: 'complete',
    outputs: {
      brandBrief: 'Stub brand brief output.',
      styleGuide: 'Stub style guide output.',
      voicePlaybook: 'Stub voice and content playbook output.',
      quickStart: 'Stub 30-day quick start output.',
    },
  })
})

app.post('/generate/core', async (req, res) => {
  const form = parseCoreForm(req.body?.form)
  if (!form) {
    res.status(400).json({
      ok: false,
      error: 'Core generation expects a valid IdentityKitForm payload with tier="core".',
    })
    return
  }

  try {
    const buffers = await renderCoreKitPdfs(form)
    const sessionId = sanitizeSessionId(form.sessionId)
    const sessionDir = path.join(generatedRoot, sessionId)
    await mkdir(sessionDir, { recursive: true })

    const fileEntries: Array<{ id: CorePdfFile['id']; title: string; fileName: string; data: Buffer }> = [
      { id: 'brandBrief', title: 'Brand Brief', fileName: '01-brand-brief.pdf', data: buffers.brandBrief },
      { id: 'styleGuide', title: 'Brand Style Guide', fileName: '02-style-guide.pdf', data: buffers.styleGuide },
      { id: 'voicePlaybook', title: 'Voice & Content Playbook', fileName: '03-voice-playbook.pdf', data: buffers.voicePlaybook },
      { id: 'quickStart', title: '30-Day Quick Start Checklist', fileName: '04-quick-start.pdf', data: buffers.quickStart },
    ]

    await Promise.all(fileEntries.map((entry) => writeFile(path.join(sessionDir, entry.fileName), entry.data)))

    const files: CorePdfFile[] = fileEntries.map((entry) => ({
      id: entry.id,
      title: entry.title,
      fileName: entry.fileName,
      downloadUrl: `${req.protocol}://${req.get('host')}/generated/${sessionId}/${entry.fileName}`,
    }))

    res.status(200).json({
      ok: true,
      sessionId,
      status: 'complete',
      files,
    })
  } catch (error) {
    console.error('Core generation failed', error)
    res.status(500).json({
      ok: false,
      error: 'Core PDF generation failed.',
    })
  }
})

app.get('/generated/:sessionId/:fileName', async (req, res) => {
  const sessionId = sanitizeSessionId(req.params.sessionId)
  const fileName = path.basename(req.params.fileName)

  if (!allowedPdfNames.has(fileName)) {
    res.status(404).json({ ok: false, error: 'File not found.' })
    return
  }

  const filePath = path.join(generatedRoot, sessionId, fileName)
  try {
    await stat(filePath)
    res.download(filePath, fileName)
  } catch {
    res.status(404).json({ ok: false, error: 'File not found.' })
  }
})

app.listen(port, () => {
  console.log(`Identity Kit API listening on port ${port}`)
})
