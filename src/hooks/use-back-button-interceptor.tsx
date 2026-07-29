import { useState, useEffect, useCallback, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useLogout } from '@/hooks/use-logout'
import { useSession } from '@/stores/session'

const FISCAL_ROUTES = ['/emitir-nf', '/emitir-leite', '/emitir-gado']
const TIMEOUT_MS = 3000

function isFiscalPath(pathname: string): boolean {
  return FISCAL_ROUTES.some((r) => pathname.startsWith(r))
}

export function useBackButtonInterceptor(enabled: boolean = true) {
  const location = useLocation()
  const { logout } = useLogout()
  const { draftInvoice } = useSession()

  const [showExitModal, setShowExitModal] = useState(false)
  const showModalRef = useRef(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const currentPathRef = useRef(location.pathname)
  const draftRef = useRef(!!draftInvoice)

  currentPathRef.current = location.pathname
  draftRef.current = !!draftInvoice

  const setModal = useCallback((value: boolean) => {
    showModalRef.current = value
    setShowExitModal(value)
  }, [])

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const performExit = useCallback(() => {
    clearTimer()
    setModal(false)
    logout()
    window.location.replace('/')
  }, [clearTimer, setModal, logout])

  const handlePopState = useCallback(() => {
    if (isFiscalPath(currentPathRef.current) && draftRef.current) {
      return
    }

    window.history.pushState(null, '', window.location.href)

    if (!showModalRef.current) {
      setModal(true)
      clearTimer()
      timeoutRef.current = setTimeout(() => {
        setModal(false)
      }, TIMEOUT_MS)
    } else {
      performExit()
    }
  }, [clearTimer, setModal, performExit])

  useEffect(() => {
    if (!enabled) {
      setModal(false)
      clearTimer()
      return
    }
    setModal(false)
    clearTimer()
    window.history.pushState(null, '', window.location.href)
  }, [enabled, location.pathname, location.search, setModal, clearTimer])

  useEffect(() => {
    if (!enabled) return
    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
      clearTimer()
    }
  }, [enabled, handlePopState, clearTimer])

  return { showExitModal, setModal, performExit }
}
