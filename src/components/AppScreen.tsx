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
  etapaAtual,
  totalEtapas,
  exibirPropriedade = true,
  exibirBotaoVoltar = true,
  acaoVoltar,
  permitirRolagem = true,
  children,
  contentClassName,
  footer,
  nomeUsuario,
  nomePropriedade,
  cadPro,
}: AppScreenProps) {
  return (
    <div className="app-shell">
      <AppHeader
        exibirPropriedade={exibirPropriedade}
        exibirBotaoVoltar={exibirBotaoVoltar}
        acaoVoltar={acaoVoltar}
        etapaAtual={etapaAtual}
        totalEtapas={totalEtapas}
        nomeUsuario={nomeUsuario}
        nomePropriedade={nomePropriedade}
        cadPro={cadPro}
      />
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
