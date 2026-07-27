import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useSession } from '@/stores/session'
import { ArrowLeft } from 'lucide-react'

interface AppHeaderProps {
  nomeUsuario?: string
  nomePropriedade?: string
  cadPro?: string
  etapaAtual?: number
  totalEtapas?: number
  exibirBotaoVoltar?: boolean
  acaoVoltar?: () => void
}

export function AppHeader({
  nomeUsuario,
  nomePropriedade,
  cadPro,
  etapaAtual,
  totalEtapas,
  exibirBotaoVoltar = true,
  acaoVoltar,
}: AppHeaderProps) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { activeProperty } = useSession()

  const userName = nomeUsuario ?? user?.name ?? '—'
  const propertyName = nomePropriedade ?? activeProperty?.nome ?? '—'
  const cadProValue = cadPro ?? activeProperty?.inscricao_estadual ?? '—'
  const showStep = etapaAtual != null && totalEtapas != null

  const handleBack = acaoVoltar ?? (() => navigate(-1))

  return (
    <header className="bg-[#002C45] border-b border-white/10 sticky top-0 z-30 safe-area-pt flex-shrink-0">
      <div className="max-w-md mx-auto sm:max-w-xl px-5 py-2.5">
        <div className="flex flex-col gap-0.5 min-w-0">
          <p className="text-xs text-white/60 font-mont">
            Usuário: <span className="text-white font-medium">{userName}</span>
          </p>
          <p className="text-xs text-white/60 font-mont flex min-w-0">
            <span className="flex-shrink-0">Propriedade Selecionada:</span>
            <span className="text-white font-medium truncate ml-1">{propertyName}</span>
          </p>
          <p className="text-xs text-[#A8914E] font-mont font-medium whitespace-nowrap">
            CAD/PRO: {cadProValue}
          </p>
        </div>
        <div className="mt-1.5 flex items-center justify-between">
          {exibirBotaoVoltar ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-sm text-white/80 hover:text-[#F9E27D] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-mont font-medium">Voltar</span>
            </button>
          ) : (
            <span />
          )}
          {showStep && (
            <span className="text-xs text-[#A8914E] font-mont font-medium">
              Etapa {etapaAtual} de {totalEtapas}
            </span>
          )}
        </div>
      </div>
    </header>
  )
}
