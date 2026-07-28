import { useNavigate } from 'react-router-dom'
import { FileText, Settings } from 'lucide-react'
import { AppScaffold } from '@/components/AppScaffold'
import { SafeContent } from '@/components/SafeContent'
import { AppHeader } from '@/components/AppHeader'
import { ScreenContent } from '@/components/ScreenContent'
import { PrimaryButton } from '@/components/PrimaryButton'
import { useSession } from '@/stores/session'

export default function Dashboard() {
  const navigate = useNavigate()
  const { activeProperty } = useSession()

  return (
    <AppScaffold>
      <SafeContent className="overflow-hidden">
        <AppHeader exibirPropriedade={true} exibirBotaoVoltar={false} exibirCpf />

        <div className="flex-shrink-0 h-[2px] w-full" style={{ backgroundColor: '#A8914E' }} />

        <div className="flex-shrink-0 py-4 px-6 bg-white">
          <p className="text-center font-semibold text-[18px]" style={{ color: '#002C45' }}>
            CAD/PRO: {activeProperty?.inscricao_estadual || '—'}
          </p>
        </div>

        <div className="flex-shrink-0 h-[2px] w-full" style={{ backgroundColor: '#A8914E' }} />

        <ScreenContent className="flex-1 min-h-0 overflow-y-auto px-5 py-6">
          <div className="space-y-4 max-w-sm mx-auto w-full">
            <button
              onClick={() => navigate('/nota-fiscal')}
              className="w-full bg-white rounded-2xl p-5 shadow-md hover:shadow-lg active:scale-95 transition-all duration-150 flex items-center gap-4 text-left cursor-pointer"
            >
              <div className="p-3 rounded-xl bg-[#A8914E]/10 flex-shrink-0">
                <FileText className="w-7 h-7 text-[#A8914E]" />
              </div>
              <div>
                <p className="font-bold text-[#002C45] text-lg">Nota Fiscal</p>
                <p className="text-sm text-gray-500">Emitir ou consultar notas</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/configuracoes')}
              className="w-full bg-white rounded-2xl p-5 shadow-md hover:shadow-lg active:scale-95 transition-all duration-150 flex items-center gap-4 text-left cursor-pointer"
            >
              <div className="p-3 rounded-xl bg-[#A8914E]/10 flex-shrink-0">
                <Settings className="w-7 h-7 text-[#A8914E]" />
              </div>
              <div>
                <p className="font-bold text-[#002C45] text-lg">Configurações</p>
                <p className="text-sm text-gray-500">Gerenciar clientes e ajustes</p>
              </div>
            </button>
          </div>
        </ScreenContent>

        <div className="flex-shrink-0">
          <div className="h-[2px] w-full" style={{ backgroundColor: '#A8914E' }} />
          <div
            className="px-5 flex flex-col"
            style={{ paddingTop: '24px', paddingBottom: '24px', gap: '16px' }}
          >
            <PrimaryButton onClick={() => navigate('/selecionar-propriedade')}>
              Cancelar
            </PrimaryButton>
            <PrimaryButton variant="secondary" onClick={() => navigate('/selecionar-propriedade')}>
              Alterar Propriedade
            </PrimaryButton>
          </div>
        </div>
      </SafeContent>
    </AppScaffold>
  )
}
