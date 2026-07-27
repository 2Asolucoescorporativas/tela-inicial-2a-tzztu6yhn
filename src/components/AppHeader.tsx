import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useSession } from '@/stores/session'
import { ArrowLeft, ArrowLeftRight } from 'lucide-react'

export function AppHeader() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { activeProperty } = useSession()

  return (
    <header className="bg-[#002C45] border-b border-white/10 sticky top-0 z-30 safe-area-pt flex-shrink-0">
      <div className="max-w-md mx-auto sm:max-w-xl px-5 py-2.5">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-white/80 hover:text-[#F9E27D] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mont font-medium">Voltar</span>
          </button>
          <button
            onClick={() => navigate('/selecionar-propriedade')}
            className="flex items-center gap-1.5 text-xs text-white/80 hover:text-[#F9E27D] bg-white/5 hover:bg-white/10 rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span className="font-mont font-medium">Trocar propriedade</span>
          </button>
        </div>
        <div className="mt-1.5 flex flex-col gap-0.5 min-w-0">
          <span className="font-mont font-bold text-white text-sm truncate">
            {user?.name || '—'}
          </span>
          <span className="font-mont font-normal text-white text-sm truncate">
            {activeProperty?.nome || '—'}
          </span>
          <span className="font-mont text-xs text-[#A8914E] truncate">
            CAD/PRO: {activeProperty?.inscricao_estatual || '—'}
          </span>
        </div>
      </div>
    </header>
  )
}
