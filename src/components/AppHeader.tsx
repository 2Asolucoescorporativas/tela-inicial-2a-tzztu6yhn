import { useAuth } from '@/hooks/use-auth'
import { maskCpf } from '@/lib/cpf-utils'
import logoImage from '@/assets/chatgpt-image-27-de-jul-de-2026-202036-6ec94.png'

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

export function AppHeader({ nomeUsuario }: AppHeaderProps) {
  const { user } = useAuth()

  const userName = nomeUsuario ?? user?.name ?? 'João da Silva'
  const userCpf = maskCpf(user?.cpf || '00000000000')

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
        </div>
        <img src={logoImage} alt="2A RURAL" className="app-header__logo" />
      </div>
    </header>
  )
}
