import { useNavigate } from 'react-router-dom'
import { useSession, type OperationType } from '@/stores/session'
import { Milk, Beef } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { AppScaffold } from '@/components/AppScaffold'
import { SafeContent } from '@/components/SafeContent'
import { AppHeader } from '@/components/AppHeader'
import { ScreenTitle } from '@/components/ScreenTitle'
import { ScreenContent } from '@/components/ScreenContent'
import { PrimaryButton } from '@/components/PrimaryButton'

interface OperationOption {
  id: OperationType
  label: string
  description: string
  icon: LucideIcon
  route: string
}

const OPERATION_OPTIONS: OperationOption[] = [
  {
    id: 'VENDA_LEITE',
    label: 'Venda de Leite',
    description: 'Emitir nota de venda de leite',
    icon: Milk,
    route: '/emitir-leite/selecionar-cliente',
  },
  {
    id: 'VENDA_GADO',
    label: 'Venda de Gado',
    description: 'Emitir nota de venda de gado',
    icon: Beef,
    route: '/emitir-gado',
  },
]

export default function EmitirNF() {
  const navigate = useNavigate()
  const { setOperationType } = useSession()

  const handleSelect = (op: OperationOption) => {
    setOperationType(op.id)
    navigate(op.route, { replace: true })
  }

  return (
    <AppScaffold>
      <SafeContent className="overflow-hidden">
        <AppHeader exibirBotaoVoltar={false} exibirCpf exibirCadPro />

        <div className="flex-shrink-0 h-[2px] w-full" style={{ backgroundColor: '#A8914E' }} />

        <ScreenTitle>Selecione a Operação</ScreenTitle>

        <div className="flex-shrink-0 h-[2px] w-full" style={{ backgroundColor: '#A8914E' }} />

        <ScreenContent className="flex-1 min-h-0 overflow-y-auto px-5 py-6">
          <div className="space-y-4 max-w-sm mx-auto w-full">
            {OPERATION_OPTIONS.map((op) => {
              const Icon = op.icon
              return (
                <button
                  key={op.id}
                  onClick={() => handleSelect(op)}
                  className="w-full bg-white rounded-2xl p-5 shadow-md hover:shadow-lg active:scale-95 transition-all duration-150 flex items-center gap-4 text-left cursor-pointer"
                >
                  <div className="p-3 rounded-xl bg-[#A8914E]/10 flex-shrink-0">
                    <Icon className="w-7 h-7 text-[#A8914E]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#002C45] text-lg">{op.label}</p>
                    <p className="text-sm text-gray-500">{op.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </ScreenContent>

        <div className="flex-shrink-0">
          <div className="h-[2px] w-full" style={{ backgroundColor: '#A8914E' }} />
          <div
            className="px-5 flex flex-col"
            style={{ paddingTop: '24px', paddingBottom: '24px', gap: '16px' }}
          >
            <PrimaryButton onClick={() => navigate('/dashboard')}>Cancelar</PrimaryButton>
          </div>
        </div>
      </SafeContent>
    </AppScaffold>
  )
}
