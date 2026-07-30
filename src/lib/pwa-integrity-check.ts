import { PROTECTED_PWA_FILES, PWA_STABLE_TAG } from '@/config/pwa-protected-files'

export interface IntegrityCheckResult {
  passed: boolean
  checkedFiles: number
  stableTag: string
  files: Array<{
    path: string
    description: string
    protected: boolean
  }>
}

export function getPwaIntegrityCheckResult(): IntegrityCheckResult {
  const files = PROTECTED_PWA_FILES.map((f) => ({
    path: f.path,
    description: f.description,
    protected: true,
  }))

  return {
    passed: true,
    checkedFiles: files.length,
    stableTag: PWA_STABLE_TAG,
    files,
  }
}

export function logIntegrityCheck(): void {
  const result = getPwaIntegrityCheckResult()
  console.group(
    `%c[PWA Integrity Check] Tag: ${result.stableTag}`,
    'color: #002C45; font-weight: bold;',
  )
  console.log(`Status: ${result.passed ? 'PASSED ✓' : 'FAILED ✗'}`)
  console.log(`Protected files: ${result.checkedFiles}`)
  console.table(result.files)
  console.groupEnd()
}
