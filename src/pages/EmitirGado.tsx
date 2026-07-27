import { AppHeader } from '@/components/AppHeader'
import { useSession } from '@/stores/session'
import { Beef } from 'lucide-react'
import { MenuPageLayout } from '@/components/MenuPageLayout'

export default function EmitirGado() {
  const { operationType } = useSession()

  return (
    <MenuPageLayout className="text-white">
      <AppHeader />
      <div className="menu-page__content items-center justify-center px-5 text-center gap-4 animate-fade-in">
        <div className="p-4 bg-[#A8914E]/10 rounded-2xl">
          <Beef className="w-12 h-12 text-[#A8914E]" />
        </div>
        <h1 className="text-xl font-bold text-white">Venda de Gado</h1>
        <p className="text-sm text-white/60">Página em construção</p>
        {operationType && <p className="text-xs text-[#A8914E]/60">Operação: {operationType}</p>}
      </div>
    </MenuPageLayout>
  )
}
