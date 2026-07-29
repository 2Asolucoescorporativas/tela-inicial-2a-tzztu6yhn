import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, LogOut, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useSession } from '@/stores/session'
import { useLogout } from '@/hooks/use-logout'
import { Logo2A } from '@/components/Logo2A'
import { primaryButtonStyle, secondaryButtonStyle } from '@/lib/button-styles'
import { ConfirmationDialog } from '@/components/ConfirmationDialog'

export default function Index() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { activeProperty } = useSession()
  const { logout } = useLogout()
  const [showExitAppDialog, setShowExitAppDialog] = useState(false)
  const [sessionEnded, setSessionEnded] = useState(false)
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current)
    }
  }, [])

  const handleEntrar = () => {
    if (isAuthenticated) {
      if (activeProperty) {
        navigate('/dashboard')
      } else {
        navigate('/selecionar-propriedade')
      }
    } else {
      navigate('/login')
    }
  }

  const handleSairClick = () => {
    setShowExitAppDialog(true)
  }

  const handleConfirmExitApp = () => {
    setShowExitAppDialog(false)
    logout()
    setSessionEnded(false)
    try {
      window.close()
    } catch {
      /* intentionally ignored */
    }
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current)
    exitTimerRef.current = setTimeout(() => {
      if (!window.closed) {
        setSessionEnded(true)
      }
    }, 300)
  }

  return (
    <div className="h-full min-h-full w-full bg-[#071C33] flex flex-col items-center justify-between p-6 select-none relative overflow-hidden">
      <div className="absolute inset-0 bg-radial from-[#0e2a4a]/50 via-transparent to-transparent pointer-events-none" />
      <div className="w-full pt-4" />
      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center my-auto animate-fade-in">
        <Logo2A size="xl" showTagline={true} />
      </div>
      {sessionEnded && (
        <div className="relative z-10 w-full max-w-sm mb-3 animate-fade-in">
          <div className="flex items-center gap-2 rounded-lg bg-green-500/15 border border-green-500/30 px-4 py-3 text-green-400 text-sm">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Sessão encerrada com sucesso.</span>
          </div>
        </div>
      )}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center pb-6 space-y-3.5 animate-fade-in-up">
        <button
          onClick={handleEntrar}
          type="button"
          className="w-full flex items-center justify-center space-x-2.5 shadow-md hover:brightness-105 active:scale-95 transition-all duration-150 cursor-pointer"
          style={primaryButtonStyle}
        >
          <LogIn className="w-5 h-5 text-white" />
          <span>Entrar</span>
        </button>
        <button
          onClick={handleSairClick}
          type="button"
          className="w-full flex items-center justify-center space-x-2.5 hover:bg-[#C89B51]/10 active:scale-95 transition-all duration-150 cursor-pointer"
          style={secondaryButtonStyle}
        >
          <LogOut className="w-5 h-5 text-[#D0A85C]" />
          <span>Sair do Aplicativo</span>
        </button>
      </div>
      <ConfirmationDialog
        open={showExitAppDialog}
        title="Sair do Aplicativo"
        message="Tem certeza de que deseja encerrar a sessão e fechar o aplicativo?"
        cancelLabel="Não, continuar"
        confirmLabel="Sim, sair"
        onConfirm={handleConfirmExitApp}
        onCancel={() => setShowExitAppDialog(false)}
      />
    </div>
  )
}
