import { useState, useEffect } from 'react'

export function useOrientationLock() {
  const [isLandscape, setIsLandscape] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(orientation: landscape)').matches
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(orientation: landscape)')
    const handler = (e: MediaQueryListEvent) => setIsLandscape(e.matches)
    mediaQuery.addEventListener('change', handler)

    try {
      const orientation = screen.orientation as any
      if (orientation && typeof orientation.lock === 'function') {
        orientation.lock('portrait').catch(() => {})
      }
    } catch (_) {
      // Orientation lock not supported
    }

    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return { isLandscape }
}
