export interface ProtectedFile {
  path: string
  description: string
  stableTag: string
}

export interface ChangeRequestReport {
  fileName: string
  reason: string
  proposedChange: string
  riskAssessment: string
  rollbackPlan: string
  requestedBy: string
  date: string
  status: 'pending' | 'approved' | 'rejected'
}

export const PWA_STABLE_TAG = 'v1.0-pwa-estavel'

export const PROTECTED_PWA_FILES: readonly ProtectedFile[] = [
  {
    path: 'public/manifest.json',
    description: 'PWA manifest — start_url, scope, icons, display mode, theme colors',
    stableTag: PWA_STABLE_TAG,
  },
  {
    path: 'public/sw.js',
    description: 'Service worker — caching strategy, navigation fallback, offline support',
    stableTag: PWA_STABLE_TAG,
  },
  {
    path: 'public/2ARural192x192.png',
    description: 'PWA icon 192x192 — installability and home screen icon',
    stableTag: PWA_STABLE_TAG,
  },
  {
    path: 'public/2ARural512x512.png',
    description: 'PWA icon 512x512 — splash screen and high-res icon',
    stableTag: PWA_STABLE_TAG,
  },
  {
    path: 'public/favicon.ico',
    description: 'Browser tab favicon',
    stableTag: PWA_STABLE_TAG,
  },
  {
    path: 'index.html',
    description: 'App entry point — meta tags, SW registration, splash screen, icon links',
    stableTag: PWA_STABLE_TAG,
  },
] as const

export const PROTECTED_PATHS: readonly string[] = PROTECTED_PWA_FILES.map((f) => f.path)

export function isProtectedFile(filePath: string): boolean {
  return PROTECTED_PATHS.includes(filePath)
}

export function createChangeRequest(params: {
  fileName: string
  reason: string
  proposedChange: string
  riskAssessment: string
  rollbackPlan: string
  requestedBy: string
}): ChangeRequestReport {
  return {
    ...params,
    date: new Date().toISOString(),
    status: 'pending',
  }
}

export function formatChangeRequest(report: ChangeRequestReport): string {
  const lines = [
    '=== PWA PROTECTED FILE CHANGE REQUEST ===',
    '',
    `File:           ${report.fileName}`,
    `Requested by:   ${report.requestedBy}`,
    `Date:           ${report.date}`,
    `Status:         ${report.status}`,
    '',
    'Reason:',
    `  ${report.reason}`,
    '',
    'Proposed Change:',
    `  ${report.proposedChange}`,
    '',
    'Risk Assessment:',
    `  ${report.riskAssessment}`,
    '',
    'Rollback Plan:',
    `  ${report.rollbackPlan}`,
    '',
    '=== END OF REQUEST ===',
  ]
  return lines.join('\n')
}
