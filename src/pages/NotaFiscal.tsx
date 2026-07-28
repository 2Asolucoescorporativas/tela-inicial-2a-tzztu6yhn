import { useNavigate } from 'react-router-dom'
import { FilePlus2, Search } from 'lucide-react'
import { AppScaffold } from '@/components/AppScaffold'
import { SafeContent } from '@/components/SafeContent'
import { AppHeader } from '@/components/AppHeader'
import { ScreenTitle } from '@/components/ScreenTitle'
import { ScreenContent } from '@/components/ScreenContent'
import { PrimaryButton } from '@/components/PrimaryButton'

export default function NotaFiscal() {
  const navigate = useNavigate()

  return (
    <AppScaffold>
      <SafeContent className="overflow-hidden">
        <AppHeader exibirBotaoVoltar={false} exibirCpf exibirCadPro />

        <div className="flex-shrink-0 h-[2px] w-full" style={{ backgroundColor: '#A8914E' }} />

        <ScreenTitle>Nota Fiscal</ScreenTitle>

        <div className="flex-shrink-0 h-[2px] w-full" style={{ backgroundColor: '#A8914E' }} />

        <ScreenContent className="flex-1 min-h-0 overflow-y-auto px-5 py-6">
          <div className="space-y-4 max-w-sm mx-auto w-full">
            <button
              onClick={() => navigate('/emitir-nf')}
              className="w-full bg-white rounded-2xl p-5 shadow-md hover:shadow-lg active:scale-95 transition-all duration-150 flex items-center gap-4 text-left cursor-pointer"
            >
              <div className="p-3 rounded-xl bg-[#A8914E]/10 flex-shrink-0">
                <FilePlus2 className="w-7 h-7 text-[#A8914E]" />
              </div>
              <div>
                <p className="font-bold text-[#002C45] text-lg">Emitir</p>
                <p className="text-sm text-gray-500">Emitir nova nota fiscal</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/consultar-nf')}
              className="w-full bg-white rounded-2xl p-5 shadow-md hover:shadow-lg active:scale-95 transition-all duration-150 flex items-center gap-4 text-left cursor-pointer"
            >
              <div className="p-3 rounded-xl bg-[#A8914E]/10 flex-shrink-0">
                <Search className="w-7 h-7 text-[#A8914E]" />
              </div>
              <div>
                <p className="font-bold text-[#002C45] text-lg">Consultar</p>
                <p className="text-sm text-gray-500">Consultar notas emitidas</p>
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
            <PrimaryButton onClick={() => navigate('/dashboard')}>Cancelar</PrimaryButton>
          </div>
        </div>
      </SafeContent>
    </AppScaffold>
  )
}
