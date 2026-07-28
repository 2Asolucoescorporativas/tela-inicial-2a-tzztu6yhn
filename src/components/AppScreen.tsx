import { ReactNode } from 'react'
import { AppHeader } from '@/components/AppHeader'
import { ScreenTitle } from '@/components/ScreenTitle'
import { cn } from '@/lib/utils'

interface AppScreenProps {
  titulo?: string
  etapaAtual?: number
  totalEtapas?: number
  exibirPropriedade?: boolean
  exibirBotaoVoltar?: boolean
  acaoVoltar?: () => void
  permitirRolagem?: boolean
  children: ReactNode
  contentClassName?: string
  footer?: ReactNode
  nomeUsuario?: string
  nomePropriedade?: string
  cadPro?: string
}

export function AppScreen({
  titulo,
  permitirRolagem = true,
  children,
  contentClassName,
  footer,
}: AppScreenProps) {
  return (
    <div className="app-shell">
      <AppHeader />
      <div className="main-content">
        {titulo && <ScreenTitle>{titulo}</ScreenTitle>}
        <div
          className={cn(
            permitirRolagem ? 'screen-scroll-area' : 'screen-content-static',
            contentClassName,
          )}
        >
          {children}
        </div>
      </div>
      {footer && <div className="flex-shrink-0">{footer}</div>}
    </div>
  )
}
