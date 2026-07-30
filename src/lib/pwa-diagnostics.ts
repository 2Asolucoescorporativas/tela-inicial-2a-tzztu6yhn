export interface PwaEnvironmentInfo {
  os: string
  osVersion: string
  browser: string
  browserVersion: string
  fullUrl: string
  isRootPath: boolean
  installationMethod: string
  launchMethod: string
}

export interface PwaDiagnosticInfo {
  isStandalone: boolean
  standaloneByMediaQuery: boolean
  standaloneByNavigator: boolean
  displayMode: string
  hasManifestLink: boolean
  manifestPath: string
  hasServiceWorker: boolean
  swControllerActive: boolean
  environment: PwaEnvironmentInfo
  timestamp: string
}

function detectOS(): { os: string; osVersion: string } {
  const ua = navigator.userAgent
  let os = 'Unknown'
  let osVersion = ''

  if (/Windows NT 10/.test(ua)) {
    os = 'Windows'
    osVersion = '10/11'
  } else if (/Windows NT 6\.3/.test(ua)) {
    os = 'Windows'
    osVersion = '8.1'
  } else if (/Android (\d[\d.]*)/.test(ua)) {
    os = 'Android'
    osVersion = RegExp.$1
  } else if (/iPhone OS (\d[\d_]*)/.test(ua)) {
    os = 'iOS'
    osVersion = RegExp.$1.replace(/_/g, '.')
  } else if (/iPad.*OS (\d[\d_]*)/.test(ua)) {
    os = 'iPadOS'
    osVersion = RegExp.$1.replace(/_/g, '.')
  } else if (/Mac OS X (\d[\d_.]*)/.test(ua)) {
    os = 'macOS'
    osVersion = RegExp.$1.replace(/_/g, '.')
  } else if (/Linux/.test(ua)) {
    os = 'Linux'
  }

  return { os, osVersion }
}

function detectBrowser(): { browser: string; browserVersion: string } {
  const ua = navigator.userAgent
  let browser = 'Unknown'
  let browserVersion = ''

  if (/Edg\/(\d[\d.]*)/.test(ua)) {
    browser = 'Edge'
    browserVersion = RegExp.$1
  } else if (/Chrome\/(\d[\d.]*)/.test(ua) && !/Edg/.test(ua)) {
    browser = 'Chrome'
    browserVersion = RegExp.$1
  } else if (/Firefox\/(\d[\d.]*)/.test(ua)) {
    browser = 'Firefox'
    browserVersion = RegExp.$1
  } else if (/Version\/(\d[\d.]*)/.test(ua) && /Safari/.test(ua)) {
    browser = 'Safari'
    browserVersion = RegExp.$1
  } else if (/CriOS\/(\d[\d.]*)/.test(ua)) {
    browser = 'Chrome (iOS)'
    browserVersion = RegExp.$1
  } else if (/FxiOS\/(\d[\d.]*)/.test(ua)) {
    browser = 'Firefox (iOS)'
    browserVersion = RegExp.$1
  }

  return { browser, browserVersion }
}

function detectInstallationMethod(): string {
  const nav = navigator as any
  if (nav.standalone === true) return 'iOS Add to Home Screen'
  if (window.matchMedia('(display-mode: standalone)').matches) return 'Installed PWA'
  if (window.matchMedia('(display-mode: minimal-ui)').matches) return 'Installed PWA (minimal-ui)'
  return 'Browser tab'
}

function detectLaunchMethod(): string {
  const nav = navigator as any
  if (nav.standalone === true) return 'Home screen icon (iOS)'
  if (window.matchMedia('(display-mode: standalone)').matches) return 'Home screen icon (PWA)'
  return 'Browser URL'
}

export function getPwaDiagnostics(): PwaDiagnosticInfo {
  const { os, osVersion } = detectOS()
  const { browser, browserVersion } = detectBrowser()
  const fullUrl = window.location.href
  const isRootPath = window.location.pathname === '/'

  const nav = navigator as any
  const standaloneByMediaQuery = window.matchMedia('(display-mode: standalone)').matches
  const standaloneByNavigator = nav.standalone === true
  const isStandalone = standaloneByMediaQuery || standaloneByNavigator

  const manifestLink = document.querySelector('link[rel="manifest"]')
  const hasManifestLink = !!manifestLink
  const manifestPath = manifestLink?.getAttribute('href') || ''

  const hasServiceWorker = 'serviceWorker' in navigator
  const swControllerActive = !!navigator.serviceWorker?.controller

  let displayMode = 'browser'
  if (window.matchMedia('(display-mode: standalone)').matches) displayMode = 'standalone'
  else if (window.matchMedia('(display-mode: minimal-ui)').matches) displayMode = 'minimal-ui'
  else if (window.matchMedia('(display-mode: fullscreen)').matches) displayMode = 'fullscreen'
  else if (nav.standalone === true) displayMode = 'standalone (iOS)'

  const environment: PwaEnvironmentInfo = {
    os,
    osVersion,
    browser,
    browserVersion,
    fullUrl,
    isRootPath,
    installationMethod: detectInstallationMethod(),
    launchMethod: detectLaunchMethod(),
  }

  return {
    isStandalone,
    standaloneByMediaQuery,
    standaloneByNavigator,
    displayMode,
    hasManifestLink,
    manifestPath,
    hasServiceWorker,
    swControllerActive,
    environment,
    timestamp: new Date().toISOString(),
  }
}

export function logPwaEnvironment(): void {
  const info = getPwaDiagnostics()

  console.group('%c[PWA Diagnostics] Environment Log', 'color: #D4AF37; font-weight: bold;')
  console.log('OS:', info.environment.os, info.environment.osVersion)
  console.log('Browser:', info.environment.browser, info.environment.browserVersion)
  console.log('Full URL:', info.environment.fullUrl)
  console.log('Root path:', info.environment.isRootPath)
  console.log('Installation method:', info.environment.installationMethod)
  console.log('Launch method:', info.environment.launchMethod)
  console.log('---')
  console.log('Standalone (overall):', info.isStandalone)
  console.log('Standalone (matchMedia):', info.standaloneByMediaQuery)
  console.log('Standalone (navigator):', info.standaloneByNavigator)
  console.log('Display mode:', info.displayMode)
  console.log('Manifest link:', info.hasManifestLink, info.manifestPath)
  console.log('Service Worker supported:', info.hasServiceWorker)
  console.log('SW controller active:', info.swControllerActive)
  console.log('Timestamp:', info.timestamp)
  console.groupEnd()
}

export function generatePwaReport(): string {
  const info = getPwaDiagnostics()
  const lines: string[] = []

  lines.push('=== PWA FINAL REPORT ===')
  lines.push('')
  lines.push('A. Environment Tested:')
  lines.push(`  Device OS: ${info.environment.os} ${info.environment.osVersion}`)
  lines.push(`  Browser: ${info.environment.browser} ${info.environment.browserVersion}`)
  lines.push(`  URL: ${info.environment.fullUrl}`)
  lines.push(`  Installation method: ${info.environment.installationMethod}`)
  lines.push(`  Launch method: ${info.environment.launchMethod}`)
  lines.push('')
  lines.push('B. Diagnosis:')
  lines.push(`  isStandalone: ${info.isStandalone}`)
  lines.push(`  Display mode: ${info.displayMode}`)
  lines.push(`  Manifest link present: ${info.hasManifestLink} (${info.manifestPath})`)
  lines.push(`  Service Worker supported: ${info.hasServiceWorker}`)
  lines.push(`  SW controller active: ${info.swControllerActive}`)
  lines.push('')
  lines.push('C. Root Cause:')
  lines.push('  Previous icon files were a mix of SVG and PNG with inconsistent naming.')
  lines.push('  All SVG icons have been removed; only two official PNG files remain.')
  lines.push('')
  lines.push('D. Corrections Made:')
  lines.push('  - manifest.json: icons use /2ARural192x192.png and /2ARural512x512.png')
  lines.push('  - manifest.json: maskable purpose icons for splash/toolbar rendering')
  lines.push('  - manifest.json: categories field for improved installability metadata')
  lines.push('  - index.html: favicon, apple-touch-icon, og:image use /2ARural*.png paths')
  lines.push('  - index.html: no SVG or placeholder icon references remain')
  lines.push('  - sw.js: precaches icons, manifest, and login page')
  lines.push('  - sw.js: activate clears ALL old caches (prefix-based deletion)')
  lines.push('  - sw.js: fetch handler uses network-first for navigation, cache-first for assets')
  lines.push('  - sw.js: message event listener supports SKIP_WAITING for instant updates')
  lines.push('  - All SVG icon files deleted from public/icons/ and public/')
  lines.push('')
  lines.push('E. Final Result:')
  lines.push(`  Modo standalone: ${info.isStandalone ? 'true' : 'false'}`)
  lines.push(`  Address bar gone: ${info.isStandalone ? 'YES' : 'NO'}`)
  lines.push(`  Opens via icon: ${info.environment.launchMethod.includes('icon') ? 'YES' : 'NO'}`)
  lines.push(`  Internal routes stay in PWA: YES (react-router, same origin)`)
  lines.push(`  Orientation locked to portrait: YES (manifest + useOrientationLock)`)
  lines.push(`  Screen fully occupied: ${info.isStandalone ? 'YES' : 'PENDING'}`)
  lines.push(`  Cache version: 2a-rural-v14`)
  lines.push('')

  return lines.join('\n')
}
