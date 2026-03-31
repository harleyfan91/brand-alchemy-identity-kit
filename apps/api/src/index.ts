import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'

dotenv.config()

const app = express()
const port = Number(process.env.PORT ?? 8787)
const webAppUrl = process.env.WEB_APP_URL ?? 'http://localhost:5173'

app.use(cors({ origin: webAppUrl }))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.status(200).json({
    ok: true,
    service: 'identity-kit-api',
    timestamp: new Date().toISOString(),
  })
})

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

app.listen(port, () => {
  console.log(`Identity Kit API listening on port ${port}`)
})
