import { useState, useEffect } from 'react'
import { Info, X, ChevronDown, ChevronUp, Smartphone } from 'lucide-react'
import {
  getPwaDiagnostics,
  logPwaEnvironment,
  generatePwaReport,
  type PwaDiagnosticInfo,
} from '@/lib/pwa-diagnostics'

export function PwaDiagnosticOverlay() {
  const [info, setInfo] = useState<PwaDiagnosticInfo | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('pwa-debug-dismissed') === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    logPwaEnvironment()
    setInfo(getPwaDiagnostics())

    const checkSw = async () => {
      if ('serviceWorker' in navigator) {
        try {
          await navigator.serviceWorker.ready
          setInfo(getPwaDiagnostics())
        } catch {
          // SW not ready yet
        }
      }
    }
    checkSw()
  }, [])

  if (dismissed || !info) {
    return (
      <button
        onClick={() => {
          setDismissed(false)
          try {
            sessionStorage.removeItem('pwa-debug-dismissed')
          } catch {
            /* ignore */
          }
        }}
        className="fixed bottom-2 right-2 z-[9999] w-9 h-9 rounded-full bg-[#A8914E] flex items-center justify-center shadow-lg opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Show PWA diagnostics"
      >
        <Info className="w-4 h-4 text-white" />
      </button>
    )
  }

  const handleDismiss = () => {
    setDismissed(true)
    setExpanded(false)
    try {
      sessionStorage.setItem('pwa-debug-dismissed', 'true')
    } catch {
      /* ignore */
    }
  }

  const handleReport = () => {
    const report = generatePwaReport()
    console.log(report)
    try {
      navigator.clipboard?.writeText(report)
    } catch {
      /* ignore */
    }
  }

  const isStandalone = info.isStandalone

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[9999] safe-area-pt shadow-2xl transition-colors duration-300 ${
        isStandalone ? 'bg-green-600/95' : 'bg-red-600/95'
      }`}
    >
      <div className="max-w-[28rem] mx-auto px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Smartphone className="w-4 h-4 text-white flex-shrink-0" />
            <span className="text-xs font-bold text-white font-mont">
              Modo standalone: {isStandalone ? 'true' : 'false'}
            </span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-7 h-7 flex items-center justify-center rounded text-white/80 hover:bg-white/20 transition-colors"
              aria-label="Toggle details"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button
              onClick={handleDismiss}
              className="w-7 h-7 flex items-center justify-center rounded text-white/80 hover:bg-white/20 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="text-[10px] text-white/70 font-mont mt-0.5">
          Display: {info.displayMode} · SW: {info.swControllerActive ? 'Active' : 'Inactive'}
        </div>

        {expanded && (
          <div className="mt-2 space-y-1 text-[11px] text-white/90 font-mont max-h-[40vh] overflow-y-auto">
            <div className="font-semibold text-white text-xs mb-1">Environment</div>
            <div>
              OS: {info.environment.os} {info.environment.osVersion}
            </div>
            <div>
              Browser: {info.environment.browser} {info.environment.browserVersion}
            </div>
            <div>URL: {info.environment.fullUrl}</div>
            <div>Root path: {info.environment.isRootPath ? 'Yes' : 'No'}</div>
            <div>Install: {info.environment.installationMethod}</div>
            <div>Launch: {info.environment.launchMethod}</div>

            <div className="font-semibold text-white text-xs mb-1 mt-2">Standalone Detection</div>
            <div>matchMedia: {info.standaloneByMediaQuery ? 'true' : 'false'}</div>
            <div>navigator.standalone: {info.standaloneByNavigator ? 'true' : 'false'}</div>
            <div>Display mode: {info.displayMode}</div>

            <div className="font-semibold text-white text-xs mb-1 mt-2">Manifest & SW</div>
            <div>
              Manifest link: {info.hasManifestLink ? 'Yes' : 'No'} ({info.manifestPath})
            </div>
            <div>SW supported: {info.hasServiceWorker ? 'Yes' : 'No'}</div>
            <div>SW controller: {info.swControllerActive ? 'Active' : 'Inactive'}</div>

            <button
              onClick={handleReport}
              className="mt-2 w-full py-1.5 rounded bg-white/20 text-white text-xs font-semibold hover:bg-white/30 transition-colors"
            >
              Generate Report (console)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
