import { useAuth } from '@/hooks/use-auth'
import { BottomNav } from '@/components/BottomNav'
import { User, MapPin, Building, Award, CheckCircle2 } from 'lucide-react'
import { FormPageLayout } from '@/components/FormPageLayout'

export default function ProducerProfile() {
  const { user } = useAuth()

  return (
    <FormPageLayout className="text-white pb-24 md:max-w-2xl relative">
      <div className="p-5 border-b border-white/10 bg-[#001f31]/80 backdrop-blur-md sticky top-0 z-30">
        <h2 className="text-lg font-bold text-[#F9E27D]">Perfil do Produtor Rural</h2>
      </div>

      <div className="p-5 space-y-4 animate-fade-in">
        <div className="bg-[#001f31] p-4 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gold-gradient text-[#002C45] font-bold text-2xl flex items-center justify-center">
            {user?.name ? user.name[0] : 'A'}
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{user?.name || 'Alexandre Silva'}</h3>
            <span className="text-xs text-white/60 block">{user?.email}</span>
            <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Produtor Verificado SEFAZ
            </span>
          </div>
        </div>

        <div className="bg-[#001f31] p-4 rounded-2xl border border-white/10 space-y-3 text-xs">
          <h4 className="text-xs font-bold text-[#F9E27D] uppercase tracking-wider flex items-center gap-1.5">
            <Building className="w-4 h-4" /> Dados Cadastrais
          </h4>

          <div className="space-y-2 text-white/80">
            <div className="flex justify-between border-b border-white/10 pb-1.5">
              <span className="text-white/50">CPF/CNPJ:</span>
              <span className="font-semibold text-white">123.456.789-00</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-1.5">
              <span className="text-white/50">Inscrição Estadual (IE):</span>
              <span className="font-semibold text-white">209/0123456</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-1.5">
              <span className="text-white/50">Regime Tributário:</span>
              <span className="font-semibold text-white">Isento / Diferido (Rural)</span>
            </div>
          </div>
        </div>

        <div className="bg-[#001f31] p-4 rounded-2xl border border-white/10 space-y-3 text-xs">
          <h4 className="text-xs font-bold text-[#F9E27D] uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-4 h-4" /> Propriedade Vinculada
          </h4>

          <div className="p-3 bg-[#002C45] rounded-xl border border-white/10 space-y-1">
            <span className="font-bold text-white block">Fazenda Santa Luzia</span>
            <p className="text-white/60">CAR: SP-3526071-8819283749281</p>
            <p className="text-white/60">Município: Ribeirão Preto - SP</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </FormPageLayout>
  )
}
