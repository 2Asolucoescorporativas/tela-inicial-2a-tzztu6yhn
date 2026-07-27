import { useNavigate } from 'react-router-dom'
import { AppHeader } from '@/components/AppHeader'
import { Settings } from 'lucide-react'
import { MenuPageLayout } from '@/components/MenuPageLayout'

export default function Configuracoes() {
  const navigate = useNavigate()

  return (
    <MenuPageLayout className="text-white">
      <AppHeader />

      <div className="menu-page__content px-5 py-6 gap-8 animate-fade-in">
        <div className="flex flex-col items-center gap-3 text-center pt-4">
          <div className="p-4 bg-[#A8914E]/10 rounded-2xl">
            <Settings className="w-12 h-12 text-[#A8914E]" />
          </div>
          <h1 className="text-xl font-bold text-white">Configurações</h1>
        </div>
        <div className="space-y-3 max-w-sm mx-auto w-full">
          <button
            onClick={() => navigate('/cadastrar-cliente')}
            className="w-full text-white font-bold text-base rounded-[14px] shadow-md hover:brightness-105 active:scale-95 transition-all"
            style={{ backgroundColor: '#A8914E', height: '52px' }}
          >
            Cadastrar Cliente
          </button>
          <button
            className="w-full text-white font-medium text-base rounded-[14px] border border-white/20 hover:bg-white/5 active:scale-95 transition-all"
            style={{ height: '52px' }}
          >
            Outras Configurações
          </button>
        </div>
      </div>
    </MenuPageLayout>
  )
}
