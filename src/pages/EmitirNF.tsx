import { useNavigate } from 'react-router-dom'
import { useSession, type OperationType } from '@/stores/session'
import { AppScreen } from '@/components/AppScreen'
import { AppButton } from '@/components/AppButton'
import { Milk, Beef } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface OperationOption {
  id: OperationType
  label: string
  icon: LucideIcon
  route: string
}

const OPERATION_OPTIONS: OperationOption[] = [
  {
    id: 'VENDA_LEITE',
    label: 'VENDA DE LEITE',
    icon: Milk,
    route: '/emitir-leite/selecionar-cliente',
  },
  { id: 'VENDA_GADO', label: 'VENDA DE GADO', icon: Beef, route: '/emitir-gado' },
]

export default function EmitirNF() {
  const navigate = useNavigate()
  const { setOperationType } = useSession()

  const handleSelect = (op: OperationOption) => {
    setOperationType(op.id)
    navigate(op.route)
  }

  return (
    <AppScreen
      titulo="Emitir Nota Fiscal"
      permitirRolagem={false}
      contentClassName="items-center justify-center px-5 menu-gap animate-fade-in"
    >
      <p className="text-xs text-white/60 text-center">Selecione o tipo de operação.</p>
      {OPERATION_OPTIONS.map((op) => {
        const Icon = op.icon
        return (
          <AppButton key={op.id} variant="primary" onClick={() => handleSelect(op)}>
            <div className="p-2 rounded-xl bg-[#A8914E]/10 flex-shrink-0">
              <Icon className="w-6 h-6 text-[#A8914E]" />
            </div>
            <span className="tracking-wide">{op.label}</span>
          </AppButton>
        )
      })}
    </AppScreen>
  )
}
