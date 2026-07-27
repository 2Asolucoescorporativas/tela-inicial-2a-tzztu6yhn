import { useNavigate } from 'react-router-dom'
import { LogIn, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useSession } from '@/stores/session'
import { Logo2A } from '@/components/Logo2A'
import { useToast } from '@/hooks/use-toast'

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
    toast({
      title: 'Sessão encerrada',
      description: 'Você saiu do aplicativo com sucesso.',
    })
  }

  return (
    <div className="h-[100dvh] min-h-[100dvh] w-full bg-[#071C33] flex flex-col items-center justify-between p-6 select-none relative overflow-hidden">
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
          className="w-full h-14 rounded-xl font-sans font-bold text-lg tracking-wide text-white bg-[#C89B51] hover:bg-[#b88a41] active:scale-[0.98] shadow-lg shadow-[#071C33]/50 transition-all duration-150 flex items-center justify-center space-x-2.5 border border-[#d2a963]/30 cursor-pointer"
        >
          <LogIn className="w-5 h-5 text-white" />
          <span>Entrar</span>
        </button>

        {/* Outlined Gold/Blue "Sair do aplicativo" Button */}
        <button
          onClick={handleSair}
          type="button"
          className="w-full h-14 rounded-xl font-sans font-medium text-base tracking-wide text-[#D0A85C] border border-[#C89B51]/70 bg-[#071C33]/80 hover:bg-[#C89B51]/10 active:scale-[0.98] transition-all duration-150 flex items-center justify-center space-x-2.5 cursor-pointer"
        >
          <LogOut className="w-5 h-5 text-[#D0A85C]" />
          <span>Sair do aplicativo</span>
        </button>
      </div>
    </div>
  )
}
