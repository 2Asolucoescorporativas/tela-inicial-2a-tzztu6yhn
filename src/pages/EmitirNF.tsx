import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useSession, type OperationType } from '@/stores/session'
import { Logo2A } from '@/components/Logo2A'
import { ArrowLeft, Milk, Beef } from 'lucide-react'
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
  const { user } = useAuth()
  const { activeProperty, setOperationType } = useSession()

  const handleSelect = (op: OperationOption) => {
    setOperationType(op.id)
    navigate(op.route)
  }

  return (
    <div className="min-h-screen bg-[#002C45] text-white flex flex-col max-w-md mx-auto sm:max-w-xl">
      <div className="p-5 flex items-center gap-3 border-b border-white/10 bg-[#001f31]/60 backdrop-blur-md sticky top-0 z-30">
        <button
          onClick={() => navigate('/nota-fiscal')}
          className="flex items-center gap-1 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Voltar</span>
        </button>
        <div className="flex-1 flex justify-center">
          <Logo2A size="xs" showTagline={false} linkTo="/dashboard" />
        </div>
        <div className="w-[60px]" />
      </div>

      <div className="flex-1 flex flex-col px-5 pt-8 pb-10 animate-fade-in">
        <div className="text-center space-y-1 mb-8">
          <h2 className="text-base font-semibold text-white/80 tracking-wide">
            {user?.name || 'Usuário'}
          </h2>
          <h1 className="text-2xl font-extrabold text-white leading-tight">
            {activeProperty?.nome || 'Propriedade'}
          </h1>
          <p className="text-sm text-[#A8914E] font-medium">
            CAD/PRO: {activeProperty?.inscricao_estadual || '—'}
          </p>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-white">Emitir Nota Fiscal</h2>
          <p className="text-sm text-white/60 mt-1">Selecione o tipo de operação.</p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          {OPERATION_OPTIONS.map((op) => {
            const Icon = op.icon
            return (
              <button
                key={op.id}
                onClick={() => handleSelect(op)}
                className="w-[85%] max-w-[400px] bg-white border-2 border-[#A8914E] text-[#002C45] font-bold text-lg rounded-2xl py-6 px-6 flex items-center gap-4 shadow-md hover:brightness-95 active:scale-[0.98] transition-all"
              >
                <div className="p-2.5 bg-[#A8914E]/10 rounded-xl">
                  <Icon className="w-7 h-7 text-[#A8914E]" />
                </div>
                <span className="tracking-wide">{op.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
