import { useEffect } from 'react'
import { logIntegrityCheck } from '@/lib/pwa-integrity-check'
import { PROTECTED_PWA_FILES, PWA_STABLE_TAG } from '@/config/pwa-protected-files'

export function PwaIntegrityGuard() {
  useEffect(() => {
    logIntegrityCheck()
  }, [])

  return null
}

export { PROTECTED_PWA_FILES, PWA_STABLE_TAG }
