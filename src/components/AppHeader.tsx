import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useSession } from '@/stores/session'
import { ArrowLeftRight } from 'lucide-react'

export function AppHeader() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { activeProperty } = useSession()

  const handleTrocarPropriedade = () => {
    navigate('/selecionar-propriedade')
  }

  return (
    <header className="bg-[#001f31]/60 backdrop-blur-md border-b border-white/10 sticky top-0 z-30">
      <div className="max-w-md mx-auto sm:max-w-xl px-5 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-mont-medium text-white/70">Produtor Rural:</span>
              <span className="text-mont-semibold text-white truncate">{user?.name || '—'}</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-mont-medium text-white/70">Propriedade:</span>
              <span className="text-mont-semibold-lg text-[#F9E27D] truncate">
                {activeProperty?.nome || '—'}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-mont-medium text-white/70">CAD/PRO:</span>
              <span className="text-mont-semibold text-white">
                {activeProperty?.inscricao_estadual || '—'}
              </span>
            </div>
          </div>
          <button
            onClick={handleTrocarPropriedade}
            className="flex items-center gap-1.5 text-xs text-white/80 hover:text-[#F9E27D] bg-white/5 hover:bg-white/10 rounded-lg px-3 py-2 transition-colors whitespace-nowrap flex-shrink-0 self-start sm:self-auto"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span className="font-mont font-medium">Trocar propriedade</span>
          </button>
        </div>
      </div>
    </header>
  )
}
