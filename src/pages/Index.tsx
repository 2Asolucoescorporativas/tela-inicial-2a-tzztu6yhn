import { useNavigate } from 'react-router-dom'
import { LogIn, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useSession } from '@/stores/session'
import { Logo2A } from '@/components/Logo2A'
import { useToast } from '@/hooks/use-toast'
import { primaryButtonStyle, secondaryButtonStyle } from '@/lib/button-styles'

export default function Index() {
  const navigate = useNavigate()
  const { isAuthenticated, signOut } = useAuth()
  const { activeProperty, clearSession } = useSession()
  const { toast } = useToast()

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

  const handleSair = () => {
    signOut()
    clearSession()
    try {
      window.close()
    } catch (e) {
      // ignore
    }
    toast({
      title: 'Sessão encerrada',
      description: 'Você saiu do aplicativo. Se a janela não fechou, feche-a manualmente.',
    })
  }

  return (
    <div className="h-full min-h-full w-full bg-[#071C33] flex flex-col items-center justify-between p-6 select-none relative overflow-hidden">
      {/* Background radial glow effect */}
      <div className="absolute inset-0 bg-radial from-[#0e2a4a]/50 via-transparent to-transparent pointer-events-none" />

      {/* Top spacer */}
      <div className="w-full pt-4" />

      {/* Centered official 2A RURAL logo */}
      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center my-auto animate-fade-in">
        <Logo2A size="xl" showTagline={true} />
      </div>

      {/* Action buttons matching design image */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center pb-6 space-y-3.5 animate-fade-in-up">
        {/* Solid Gold/Tan "Entrar" Button */}
        <button
          onClick={handleEntrar}
          type="button"
          className="w-full flex items-center justify-center space-x-2.5 shadow-md hover:brightness-105 active:scale-95 transition-all duration-150 cursor-pointer"
          style={primaryButtonStyle}
        >
          <LogIn className="w-5 h-5 text-white" />
          <span>Entrar</span>
        </button>

        {/* Outlined Gold/Blue "Sair do aplicativo" Button */}
        <button
          onClick={handleSair}
          type="button"
          className="w-full flex items-center justify-center space-x-2.5 hover:bg-[#C89B51]/10 active:scale-95 transition-all duration-150 cursor-pointer"
          style={secondaryButtonStyle}
        >
          <LogOut className="w-5 h-5 text-[#D0A85C]" />
          <span>Sair do aplicativo</span>
        </button>
      </div>
    </div>
  )
}
