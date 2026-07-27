import { useNavigate } from 'react-router-dom'
import { FileText, Settings } from 'lucide-react'

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="flex-1 flex flex-col px-5 pt-8 pb-10 max-w-md mx-auto sm:max-w-xl animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <button
          onClick={() => navigate('/nota-fiscal')}
          className="w-[85%] max-w-[400px] bg-white border-2 border-[#A8914E] text-[#002C45] font-bold text-lg rounded-2xl py-6 px-6 flex items-center gap-4 shadow-md hover:brightness-95 active:scale-[0.98] transition-all"
        >
          <div className="p-2.5 bg-[#A8914E]/10 rounded-xl">
            <FileText className="w-7 h-7 text-[#A8914E]" />
          </div>
          <span className="tracking-wide">NOTA FISCAL</span>
        </button>

        <button
          onClick={() => navigate('/configuracoes')}
          className="w-[85%] max-w-[400px] bg-white border-2 border-[#A8914E] text-[#002C45] font-bold text-lg rounded-2xl py-6 px-6 flex items-center gap-4 shadow-md hover:brightness-95 active:scale-[0.98] transition-all"
        >
          <div className="p-2.5 bg-[#A8914E]/10 rounded-xl">
            <Settings className="w-7 h-7 text-[#A8914E]" />
          </div>
          <span className="tracking-wide">CONFIGURAÇÕES</span>
        </button>
      </div>
    </div>
  )
}
