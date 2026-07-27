import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useSession, type OperationType } from '@/stores/session'
import { AppHeader } from '@/components/AppHeader'
import { Milk, Beef } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { MenuPageLayout } from '@/components/MenuPageLayout'

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
  const { user } = useAuth()
  const { activeProperty, setOperationType } = useSession()

  const handleSelect = (op: OperationOption) => {
    setOperationType(op.id)
    navigate(op.route)
  }

  return (
    <MenuPageLayout className="text-white">
      <AppHeader />

      <div className="menu-page__content px-5 menu-page-pad animate-fade-in">
        {' '}
        <div className="text-center space-y-0.5 menu-info-gap">
          <h2 className="text-sm font-semibold text-white/80 tracking-wide">
            {user?.name || 'Usuário'}
          </h2>
          <h1 className="text-xl font-extrabold text-white leading-tight">
            {activeProperty?.nome || 'Propriedade'}
          </h1>
          <p className="text-xs text-[#A8914E] font-medium">
            CAD/PRO: {activeProperty?.inscricao_estadual || '—'}
          </p>
        </div>
        <div className="text-center menu-title-gap">
          <h2 className="text-lg font-bold text-white">Emitir Nota Fiscal</h2>
          <p className="text-xs text-white/60 mt-0.5">Selecione o tipo de operação.</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center menu-gap min-h-0">
          {OPERATION_OPTIONS.map((op) => {
            const Icon = op.icon
            return (
              <button
                key={op.id}
                onClick={() => handleSelect(op)}
                className="menu-btn bg-white border-2 border-[#A8914E] text-[#002C45] font-bold rounded-2xl shadow-md hover:brightness-95 active:scale-[0.98] transition-all"
              >
                <div className="menu-btn-icon-wrap bg-[#A8914E]/10">
                  <Icon className="menu-btn-icon text-[#A8914E]" />
                </div>
                <span className="menu-btn-text tracking-wide">{op.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </MenuPageLayout>
  )
}
