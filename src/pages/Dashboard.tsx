import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useSession } from '@/stores/session'
import { Logo2A } from '@/components/Logo2A'
import { FileText, Settings, LogOut, RefreshCw } from 'lucide-react'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { activeProperty, clearActiveProperty } = useSession()

  const handleTrocarPropriedade = () => {
    clearActiveProperty()
    navigate('/selecionar-propriedade')
  }

  const handleSair = () => {
    signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#002C45] text-white flex flex-col max-w-md mx-auto sm:max-w-xl">
      <div className="p-5 flex items-center justify-between border-b border-white/10 bg-[#001f31]/60 backdrop-blur-md sticky top-0 z-30">
        <Logo2A size="xs" showTagline={false} linkTo="/dashboard" />
      </div>

      <div className="flex-1 flex flex-col px-5 pt-8 pb-10 animate-fade-in">
        <div className="text-center space-y-1 mb-8">
          <h2 className="text-base font-semibold text-white/80 tracking-wide">
            {user?.name || 'Usuário'}
          </h2>
          <h1 className="text-2xl font-extrabold text-white leading-tight">
            {activeProperty?.nome || 'Propriedade'}
          </h1>
          <p className="text-sm text-[#A8914E] font-medium">
            CAD/PRO: {activeProperty?.inscricao_estadual || '—'}
          </p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <button
              onClick={handleTrocarPropriedade}
              className="text-xs text-white/60 hover:text-[#A8914E] transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Trocar propriedade
            </button>
            <span className="text-white/20">|</span>
            <button
              onClick={handleSair}
              className="text-xs text-white/60 hover:text-red-300 transition-colors flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              Sair
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <button
            onClick={() => navigate('/nota-fiscal')}
            className="w-[85%] max-w-[400px] bg-white border-2 border-[#A8914E] text-[#002C45] font-bold text-lg rounded-2xl py-6 px-6 flex items-center gap-4 shadow-md hover:brightness-95 active:scale-[0.98] transition-all"
          >
            <div className="p-2.5 bg-[#A8914E]/10 rounded-xl">
              <FileText className="w-7 h-7 text-[#A8914E]" />
            </div>
            <span className="tracking-wide">NOTA FISCAL</span>
          </button>

          <button
            onClick={() => navigate('/configuracoes')}
            className="w-[85%] max-w-[400px] bg-white border-2 border-[#A8914E] text-[#002C45] font-bold text-lg rounded-2xl py-6 px-6 flex items-center gap-4 shadow-md hover:brightness-95 active:scale-[0.98] transition-all"
          >
            <div className="p-2.5 bg-[#A8914E]/10 rounded-xl">
              <Settings className="w-7 h-7 text-[#A8914E]" />
            </div>
            <span className="tracking-wide">CONFIGURAÇÕES</span>
          </button>
        </div>
      </div>
    </div>
  )
}
