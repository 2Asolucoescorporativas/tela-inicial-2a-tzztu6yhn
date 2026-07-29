import { useEffect, useRef, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useSession } from '@/stores/session'
import { useOrientationLock } from '@/hooks/use-orientation-lock'
import { useNativeNavigation } from '@/hooks/use-native-navigation'
import { OrientationLockOverlay } from '@/components/OrientationLockOverlay'

const FISCAL_ROUTES = ['/emitir-nf', '/emitir-leite', '/emitir-gado']

function isFiscalPath(pathname: string): boolean {
  return FISCAL_ROUTES.some((r) => pathname.startsWith(r))
}

export function NativeAppShell({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { pendingRestoration, clearPendingRestoration, isLoadingSession } = useSession()
  const location = useLocation()
  const navigate = useNavigate()
  const { isLandscape } = useOrientationLock()

  useNativeNavigation()

  const restorationHandled = useRef(false)

  useEffect(() => {
    if (restorationHandled.current) return
    if (!pendingRestoration || !isAuthenticated || authLoading || isLoadingSession) return

    restorationHandled.current = true

    const currentPath = location.pathname
    if (!isFiscalPath(currentPath)) {
      const draft = pendingRestoration.draftInvoice
      if (draft?.tipoOperacao === 'VENDA_LEITE') {
        if (draft.quantidade > 0 && draft.valorUnitario > 0) {
          navigate('/emitir-leite/next', { replace: true })
        } else if (pendingRestoration.selectedClient) {
          navigate('/emitir-leite', { replace: true })
        } else {
          navigate('/emitir-leite/selecionar-cliente', { replace: true })
        }
      } else if (draft?.tipoOperacao === 'VENDA_GADO') {
        navigate('/emitir-gado', { replace: true })
      } else {
        navigate('/emitir-nf', { replace: true })
      }
    }

    clearPendingRestoration()
  }, [
    pendingRestoration,
    isAuthenticated,
    authLoading,
    isLoadingSession,
    location.pathname,
    navigate,
    clearPendingRestoration,
  ])

  const routeRestorationHandled = useRef(false)

  useEffect(() => {
    if (routeRestorationHandled.current) return
    if (!isAuthenticated || authLoading || isLoadingSession) return
    if (pendingRestoration || restorationHandled.current) {
      routeRestorationHandled.current = true
      return
    }

    routeRestorationHandled.current = true

    if (location.pathname === '/') {
      try {
        const lastRoute = localStorage.getItem('2a_rural_last_route')
        if (lastRoute && lastRoute !== '/') {
          navigate(lastRoute, { replace: true })
        }
      } catch {
        // ignore
      }
    }
  }, [
    isAuthenticated,
    authLoading,
    isLoadingSession,
    pendingRestoration,
    location.pathname,
    navigate,
  ])

  return (
    <>
      {children}
      {isLandscape && <OrientationLockOverlay />}
    </>
  )
}
