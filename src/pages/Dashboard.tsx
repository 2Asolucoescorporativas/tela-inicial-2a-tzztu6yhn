import { useNavigate } from 'react-router-dom'
import { FileText, Settings } from 'lucide-react'
import { MenuPageLayout } from '@/components/MenuPageLayout'
import { AppHeader } from '@/components/AppHeader'

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <MenuPageLayout>
      <AppHeader />
      <div className="menu-page__content items-center justify-center px-5 menu-page-pad menu-gap animate-fade-in">
        <button
          onClick={() => navigate('/nota-fiscal')}
          className="menu-btn bg-white border-2 border-[#A8914E] text-[#002C45] font-bold rounded-2xl shadow-md hover:brightness-95 active:scale-[0.98] transition-all"
        >
          <div className="menu-btn-icon-wrap bg-[#A8914E]/10">
            <FileText className="menu-btn-icon text-[#A8914E]" />
          </div>
          <span className="menu-btn-text tracking-wide">NOTA FISCAL</span>
        </button>

        <button
          onClick={() => navigate('/configuracoes')}
          className="menu-btn bg-white border-2 border-[#A8914E] text-[#002C45] font-bold rounded-2xl shadow-md hover:brightness-95 active:scale-[0.98] transition-all"
        >
          <div className="menu-btn-icon-wrap bg-[#A8914E]/10">
            <Settings className="menu-btn-icon text-[#A8914E]" />
          </div>
          <span className="menu-btn-text tracking-wide">CONFIGURAÇÕES</span>
        </button>
      </div>
    </MenuPageLayout>
  )
}
