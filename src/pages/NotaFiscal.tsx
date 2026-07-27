import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useSession } from '@/stores/session'
import { AppHeader } from '@/components/AppHeader'
import { FilePlus2, Search } from 'lucide-react'
import { MenuPageLayout } from '@/components/MenuPageLayout'

export default function NotaFiscal() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { activeProperty } = useSession()

  return (
    <MenuPageLayout className="text-white">
      <AppHeader />

      <div className="menu-page__content px-5 menu-page-pad animate-fade-in">
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
          <h2 className="text-lg font-bold text-white">Nota Fiscal</h2>
          <p className="text-xs text-white/60 mt-0.5">Selecione a operação desejada.</p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center menu-gap min-h-0">
          <button
            onClick={() => navigate('/emitir-nf')}
            className="menu-btn bg-white border-2 border-[#A8914E] text-[#002C45] font-bold rounded-2xl shadow-md hover:brightness-95 active:scale-[0.98] transition-all"
          >
            <div className="menu-btn-icon-wrap bg-[#A8914E]/10">
              <FilePlus2 className="menu-btn-icon text-[#A8914E]" />
            </div>
            <span className="menu-btn-text tracking-wide">EMITIR</span>
          </button>

          <button
            onClick={() => navigate('/consultar-nf')}
            className="menu-btn bg-white border-2 border-[#A8914E] text-[#002C45] font-bold rounded-2xl shadow-md hover:brightness-95 active:scale-[0.98] transition-all"
          >
            <div className="menu-btn-icon-wrap bg-[#A8914E]/10">
              <Search className="menu-btn-icon text-[#A8914E]" />
            </div>
            <span className="menu-btn-text tracking-wide">CONSULTAR</span>
          </button>
        </div>
      </div>
    </MenuPageLayout>
  )
}
