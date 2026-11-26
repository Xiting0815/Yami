import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { initServiceWorker } from './app/UpdateBanner'
import './styles.css'

initServiceWorker()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
