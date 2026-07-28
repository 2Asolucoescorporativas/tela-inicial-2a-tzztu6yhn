import { useSession } from '@/stores/session'
import { AppScreen } from '@/components/AppScreen'
import { Beef } from 'lucide-react'

export default function EmitirGado() {
  const { operationType } = useSession()

  return (
    <AppScreen
      titulo="Venda de Gado"
      permitirRolagem={false}
      contentClassName="items-center justify-center px-5 text-center gap-4 animate-fade-in"
    >
      <div className="p-4 bg-[#A8914E]/10 rounded-2xl">
        <Beef className="w-12 h-12 text-[#A8914E]" />
      </div>
      <p className="text-sm text-white/60">Página em construção</p>
      {operationType && <p className="text-xs text-[#A8914E]/60">Operação: {operationType}</p>}
    </AppScreen>
  )
}
