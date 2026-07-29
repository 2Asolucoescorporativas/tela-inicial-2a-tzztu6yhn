import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useSession } from '@/stores/session'

const EXTRA_SESSION_KEYS = ['pb_auth']

export function useLogout() {
  const { signOut } = useAuth()
  const { clearSession } = useSession()
  const navigate = useNavigate()

  const signOutRef = useRef(signOut)
  const clearSessionRef = useRef(clearSession)
  signOutRef.current = signOut
  clearSessionRef.current = clearSession

  const logout = useCallback(() => {
    signOutRef.current()
    clearSessionRef.current()
    try {
      sessionStorage.clear()
    } catch {
      /* intentionally ignored */
    }
    EXTRA_SESSION_KEYS.forEach((key) => {
      try {
        localStorage.removeItem(key)
      } catch {
        /* intentionally ignored */
      }
    })
    navigate('/login', { replace: true })
  }, [navigate])

  return { logout }
}
