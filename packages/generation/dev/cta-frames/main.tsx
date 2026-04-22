import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { registerExplorerFonts } from './registerExplorerFonts'
import { App } from './App'

registerExplorerFonts()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
