import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSession } from '@/stores/session'
import { useToast } from '@/hooks/use-toast'

const FISCAL_ROUTES = ['/emitir-nf', '/emitir-leite', '/emitir-gado']
const LAST_ROUTE_KEY = '2a_rural_last_route'
const EXCLUDED_ROUTES = ['/login', '/forgot-password', '/register']

function isFiscalPath(pathname: string): boolean {
  return FISCAL_ROUTES.some((r) => pathname.startsWith(r))
}

function shouldSaveRoute(pathname: string): boolean {
  return !EXCLUDED_ROUTES.some((r) => pathname.startsWith(r))
}

export function useNativeNavigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { draftInvoice } = useSession()
  const { toast } = useToast()

  const stateRef = useRef({ pathname: location.pathname, inProgress: !!draftInvoice })
  stateRef.current = { pathname: location.pathname, inProgress: !!draftInvoice }

  const operationEndedRecently = useRef(false)
  const prevInProgress = useRef(!!draftInvoice)

  useEffect(() => {
    if (shouldSaveRoute(location.pathname)) {
      try {
        localStorage.setItem(LAST_ROUTE_KEY, location.pathname + location.search)
      } catch {
        // ignore storage errors
      }
    }
  }, [location.pathname, location.search])

  useEffect(() => {
    if (prevInProgress.current && !draftInvoice) {
      operationEndedRecently.current = true
      const timer = setTimeout(() => {
        operationEndedRecently.current = false
      }, 10000)
      prevInProgress.current = !!draftInvoice
      return () => clearTimeout(timer)
    }
    prevInProgress.current = !!draftInvoice
  }, [draftInvoice])

  useEffect(() => {
    const handlePopState = () => {
      const { pathname, inProgress } = stateRef.current
      const fiscal = isFiscalPath(pathname)
      if (fiscal && inProgress) {
        window.history.pushState(
          { ...window.history.state, fiscalOperation: true },
          '',
          pathname + location.search,
        )
        navigate(pathname, { replace: true })
        toast({
          title: 'Operação em andamento',
          description: 'Finalize ou cancele a operação atual antes de sair.',
        })
      } else if (fiscal && operationEndedRecently.current) {
        operationEndedRecently.current = false
        navigate('/dashboard', { replace: true })
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [navigate, toast, location.search])

  useEffect(() => {
    if (isFiscalPath(location.pathname) && draftInvoice) {
      window.history.replaceState(
        { ...window.history.state, fiscalOperation: true },
        '',
        location.pathname + location.search,
      )
    }
  }, [location.pathname, location.search, draftInvoice])
}
