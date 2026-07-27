import { useNavigate } from 'react-router-dom'
import { AppScreen } from '@/components/AppScreen'
import { AppButton } from '@/components/AppButton'
import { Settings } from 'lucide-react'

export default function Configuracoes() {
  const navigate = useNavigate()

  return (
    <AppScreen
      titulo="Configurações"
      permitirRolagem={false}
      contentClassName="px-5 py-6 gap-8 animate-fade-in"
    >
      <div className="flex flex-col items-center gap-3 text-center pt-4">
        <div className="p-4 bg-[#A8914E]/10 rounded-2xl">
          <Settings className="w-12 h-12 text-[#A8914E]" />
        </div>
      </div>
      <div className="app-button-group max-w-sm mx-auto w-full">
        <AppButton variant="gold" onClick={() => navigate('/cadastrar-cliente')}>
          Cadastrar Cliente
        </AppButton>
        <AppButton variant="secondary">Outras Configurações</AppButton>
      </div>
    </AppScreen>
  )
}
