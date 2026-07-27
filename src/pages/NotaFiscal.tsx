import { useNavigate } from 'react-router-dom'
import { AppScreen } from '@/components/AppScreen'
import { AppButton } from '@/components/AppButton'
import { FilePlus2, Search } from 'lucide-react'

export default function NotaFiscal() {
  const navigate = useNavigate()

  return (
    <AppScreen
      titulo="Nota Fiscal"
      permitirRolagem={false}
      contentClassName="items-center justify-center px-5 menu-gap animate-fade-in"
    >
      <p className="text-xs text-white/60 text-center">Selecione a operação desejada.</p>
      <AppButton variant="primary" onClick={() => navigate('/emitir-nf')}>
        <div className="p-2 rounded-xl bg-[#A8914E]/10 flex-shrink-0">
          <FilePlus2 className="w-6 h-6 text-[#A8914E]" />
        </div>
        <span className="tracking-wide">EMITIR</span>
      </AppButton>
      <AppButton variant="primary" onClick={() => navigate('/consultar-nf')}>
        <div className="p-2 rounded-xl bg-[#A8914E]/10 flex-shrink-0">
          <Search className="w-6 h-6 text-[#A8914E]" />
        </div>
        <span className="tracking-wide">CONSULTAR</span>
      </AppButton>
    </AppScreen>
  )
}
