import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useSession } from '@/stores/session'
import { Logo2A } from '@/components/Logo2A'
import { ArrowLeft, Search } from 'lucide-react'

export default function ConsultarNF() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { activeProperty } = useSession()

  return (
    <div className="min-h-screen bg-[#002C45] text-white flex flex-col max-w-md mx-auto sm:max-w-xl">
      <div className="p-5 flex items-center gap-3 border-b border-white/10 bg-[#001f31]/60 backdrop-blur-md sticky top-0 z-30">
        <button
          onClick={() => navigate('/nota-fiscal')}
          className="flex items-center gap-1 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Voltar</span>
        </button>
        <div className="flex-1 flex justify-center">
          <Logo2A size="xs" showTagline={false} linkTo="/dashboard" />
        </div>
        <div className="w-[60px]" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5 text-center gap-4 animate-fade-in">
        <div className="p-4 bg-[#A8914E]/10 rounded-2xl">
          <Search className="w-12 h-12 text-[#A8914E]" />
        </div>
        <h1 className="text-xl font-bold text-white">Consultar Notas Fiscais</h1>
        <p className="text-sm text-white/60">Página em construção</p>
        {activeProperty && (
          <p className="text-xs text-white/40">
            {activeProperty.nome} • CAD/PRO: {activeProperty.inscricao_estadual}
          </p>
        )}
      </div>
    </div>
  )
}
