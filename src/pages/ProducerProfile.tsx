import { useAuth } from '@/hooks/use-auth'
import { useSession } from '@/stores/session'
import { AppHeader } from '@/components/AppHeader'
import { BottomNav } from '@/components/BottomNav'
import { MapPin, Building } from 'lucide-react'
import { FormPageLayout } from '@/components/FormPageLayout'
import { maskCpf } from '@/lib/cpf-utils'

export default function ProducerProfile() {
  const { user } = useAuth()
  const { activeProperty } = useSession()

  return (
    <FormPageLayout className="text-white md:max-w-2xl relative">
      <AppHeader />

      <div className="form-page__content p-5 space-y-4 animate-fade-in pb-24">
        <div className="bg-[#001f31] p-4 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gold-gradient text-[#002C45] font-bold text-2xl flex items-center justify-center">
            {user?.name ? user.name[0] : 'A'}
          </div>
          <div>
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
              <span className="font-semibold text-white">
                {user?.cpf ? maskCpf(user.cpf) : '—'}
              </span>
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
            <p className="text-white/60">
              Município: {activeProperty?.municipio || '—'} - {activeProperty?.uf || '—'}
            </p>
            {activeProperty?.endereco && (
              <p className="text-white/60">Endereço: {activeProperty.endereco}</p>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </FormPageLayout>
  )
}
