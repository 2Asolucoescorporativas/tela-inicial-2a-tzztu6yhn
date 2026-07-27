import { useNavigate } from 'react-router-dom'
import { FileText, Settings } from 'lucide-react'
import { AppScreen } from '@/components/AppScreen'
import { AppButton } from '@/components/AppButton'

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <AppScreen
      exibirBotaoVoltar={false}
      permitirRolagem={false}
      contentClassName="items-center justify-center px-5 menu-gap animate-fade-in"
    >
      <AppButton variant="primary" onClick={() => navigate('/nota-fiscal')}>
        <div className="p-2 rounded-xl bg-[#A8914E]/10 flex-shrink-0">
          <FileText className="w-6 h-6 text-[#A8914E]" />
        </div>
        <span className="tracking-wide">NOTA FISCAL</span>
      </AppButton>
      <AppButton variant="primary" onClick={() => navigate('/configuracoes')}>
        <div className="p-2 rounded-xl bg-[#A8914E]/10 flex-shrink-0">
          <Settings className="w-6 h-6 text-[#A8914E]" />
        </div>
        <span className="tracking-wide">CONFIGURAÇÕES</span>
      </AppButton>
    </AppScreen>
  )
}
