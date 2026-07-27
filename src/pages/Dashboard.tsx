import { useNavigate } from 'react-router-dom'
import { FileText, Settings } from 'lucide-react'

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="flex-1 flex flex-col px-5 menu-page-pad max-w-md mx-auto sm:max-w-xl animate-fade-in min-h-0">
      <div className="flex-1 flex flex-col items-center justify-center menu-gap">
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
    </div>
  )
}
