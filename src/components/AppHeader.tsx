import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useSession } from '@/stores/session'
import { cn } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'

interface AppHeaderProps {
  nomeUsuario?: string
  nomePropriedade?: string
  cadPro?: string
  etapaAtual?: number
  totalEtapas?: number
  exibirPropriedade?: boolean
  exibirBotaoVoltar?: boolean
  acaoVoltar?: () => void
}

export function AppHeader({
  nomeUsuario,
  nomePropriedade,
  cadPro,
  etapaAtual,
  totalEtapas,
  exibirPropriedade = true,
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
    <header
      className={cn(
        'app-header safe-area-pt',
        exibirPropriedade ? 'app-header--with-property' : 'app-header--no-property',
      )}
    >
      <div className="app-header__inner">
        <div className="app-header__info">
          <p className="app-header__line">
            <span className="app-header__label">Usuário:</span>
            <span className="app-header__value">{userName}</span>
          </p>
          {exibirPropriedade && (
            <>
              <p className="app-header__line">
                <span className="app-header__label">Propriedade Selecionada:</span>
                <span className="app-header__value">{propertyName}</span>
              </p>
              <p className="app-header__line app-header__line--gold">
                <span className="app-header__label">CAD/PRO:</span>
                <span className="app-header__value">{cadProValue}</span>
              </p>
            </>
          )}
        </div>
        <div className="app-header__nav">
          {exibirBotaoVoltar ? (
            <button onClick={handleBack} className="app-header__back">
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
          ) : (
            <span />
          )}
          {showStep && (
            <span className="app-header__step">
              Etapa {etapaAtual} de {totalEtapas}
            </span>
          )}
        </div>
      </div>
    </header>
  )
}
