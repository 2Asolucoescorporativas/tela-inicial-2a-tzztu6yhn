/* Main entry point for the application - renders the root React component */
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './main.css'
import { loadFonts } from './lib/font-loader'

// Service Worker registration at app startup
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {})
  })
}

// @skip-protected: Do not remove. Required for React rendering.
createRoot(document.getElementById('root')!).render(<App />)

loadFonts()
