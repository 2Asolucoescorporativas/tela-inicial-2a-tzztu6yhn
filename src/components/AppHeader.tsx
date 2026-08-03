import { useAuth } from '@/hooks/use-auth'
import { useSession } from '@/stores/session'
import { maskCpf } from '@/lib/cpf-utils'
import logoImage from '@/assets/chatgpt-image-27-de-jul.de-2026-202036-6ec94.png'

interface AppHeaderProps {
  nomeUsuario?: string
  nomePropriedade?: string
  cadPro?: string
  etapaAtual?: number
  totalEtapas?: number
  exibirPropriedade?: boolean
  exibirBotaoVoltar?: boolean
  exibirCpf?: boolean
  exibirCadPro?: boolean
  acaoVoltar?: () => void
}

export function AppHeader({
  nomeUsuario,
  nomePropriedade,
  exibirPropriedade,
  exibirCadPro,
  cadPro,
}: AppHeaderProps) {
  const { user } = useAuth()
  const { activeProperty } = useSession()

  const userName = nomeUsuario ?? user?.name ?? 'João da Silva'
  const userCpf = maskCpf(user?.cpf || '00000000000')
  const propertyName = nomePropriedade ?? activeProperty?.nome ?? ''
  const showPropertyLine = exibirPropriedade !== false && propertyName.length > 0
  const cadProValue = cadPro || activeProperty?.inscricao_estadual || ''
  const showCadProLine = exibirCadPro && cadProValue.length > 0

  return (
    <header className="app-header safe-area-pt">
      <div className="app-header__inner">
        <div className="app-header__info">
          <p className="app-header__line">
            <span className="app-header__label">NOME:</span>
            <span className="app-header__value">{userName}</span>
          </p>
          <p className="app-header__line">
            <span className="app-header__label">CPF:</span>
            <span className="app-header__value">{userCpf}</span>
          </p>
          {showPropertyLine && (
            <p className="app-header__line">
              <span className="app-header__label">PROPRIEDADE:</span>
              <span className="app-header__value">{propertyName}</span>
            </p>
          )}
          {showCadProLine && (
            <p className="app-header__line">
              <span className="app-header__label">CAD/PRO:</span>
              <span className="app-header__value">{cadProValue}</span>
            </p>
          )}
        </div>
        <img src={logoImage} alt="2A RURAL" className="app-header__logo" />
      </div>
    </header>
  )
}
