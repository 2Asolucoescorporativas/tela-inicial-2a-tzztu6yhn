import { useNavigate, Navigate } from 'react-router-dom'
import { useSession } from '@/stores/session'
import { AppScaffold } from '@/components/AppScaffold'
import { SafeContent } from '@/components/SafeContent'
import { AppHeader } from '@/components/AppHeader'
import { ScreenTitle } from '@/components/ScreenTitle'
import { ScreenContent } from '@/components/ScreenContent'
import { PrimaryButton } from '@/components/PrimaryButton'
import { getOperacaoById, GADO_TIPOS_ANIMAL } from '@/lib/gado-config'
import { Beef } from 'lucide-react'

const goldLineStyle = { backgroundColor: '#A8914E' }
const footerStyle = { paddingTop: '24px', paddingBottom: '24px', gap: '16px' }

export default function EmitirGadoNext() {
  const navigate = useNavigate()
  const { draftInvoice, activeProperty, setDraftInvoice } = useSession()

  if (!draftInvoice || draftInvoice.tipoOperacao !== 'VENDA_GADO') {
    return <Navigate to="/emitir-gado" replace />
  }

  const operacao = getOperacaoById(draftInvoice.operacao_principal)
  const sub = operacao?.suboperacoes.find((s) => s.id === draftInvoice.suboperacao)
  const animal = GADO_TIPOS_ANIMAL.find((a) => a.id === draftInvoice.tipo_animal)

  return (
    <AppScaffold>
      <SafeContent className="overflow-hidden">
        <AppHeader exibirCpf exibirCadPro />
        <div className="flex-shrink-0 h-[2px] w-full" style={goldLineStyle} />
        <ScreenTitle>CONFIRMAÇÃO</ScreenTitle>
        <div className="flex-shrink-0 h-[2px] w-full" style={goldLineStyle} />
        <ScreenContent className="flex-1 min-h-0 overflow-y-auto px-5 py-6">
          <div className="flex flex-col items-center justify-center text-center gap-4 py-8 animate-fade-in">
            <div className="p-4 bg-[#A8914E]/10 rounded-2xl">
              <Beef className="w-12 h-12 text-[#A8914E]" />
            </div>
            <h2 className="text-xl font-bold text-white">Seleção Confirmada</h2>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2 w-full text-left">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Operação</span>
                <span className="text-white font-semibold">{operacao?.label}</span>
              </div>
              {sub && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Suboperação</span>
                  <span className="text-white font-semibold">{sub.label}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Tipo de Animal</span>
                <span className="text-white font-semibold">{animal?.label}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Propriedade</span>
                <span className="text-white font-semibold text-right max-w-[60%] truncate">
                  {activeProperty?.nome}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">CAD/PRO</span>
                <span className="text-white font-semibold">{draftInvoice.cadpro}</span>
              </div>
            </div>
            <p className="text-sm text-white/40">
              Próxima etapa: formulário de emissão (em desenvolvimento)
            </p>
          </div>
        </ScreenContent>
        <div className="flex-shrink-0">
          <div className="h-[2px] w-full" style={goldLineStyle} />
          <div className="px-5 flex flex-col" style={footerStyle}>
            <PrimaryButton onClick={() => navigate('/dashboard', { replace: true })}>
              Voltar para o Início
            </PrimaryButton>
            <PrimaryButton
              variant="secondary"
              onClick={() => {
                setDraftInvoice(null)
                navigate('/emitir-gado', { replace: true })
              }}
            >
              Nova Emissão
            </PrimaryButton>
          </div>
        </div>
      </SafeContent>
    </AppScaffold>
  )
}
