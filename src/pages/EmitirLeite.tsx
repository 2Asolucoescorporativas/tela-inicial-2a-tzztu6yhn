import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useSession, type DraftInvoice } from '@/stores/session'
import { AppHeader } from '@/components/AppHeader'
import { cn } from '@/lib/utils'
import {
  parseCommaDecimal,
  calculateTotal,
  formatCurrency,
  numberToCommaString,
  sanitizeNumericInput,
} from '@/lib/decimal-utils'
import { maskDocumentByType } from '@/lib/client-utils'
import { Pencil } from 'lucide-react'
import { FormPageLayout } from '@/components/FormPageLayout'

export default function EmitirLeite() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { activeProperty, draftInvoice, setDraftInvoice, selectedClient } = useSession()

  const [quantidade, setQuantidade] = useState(() =>
    draftInvoice?.tipoOperacao === 'VENDA_LEITE' && draftInvoice.quantidade
      ? numberToCommaString(draftInvoice.quantidade)
      : '',
  )
  const [valorUnitario, setValorUnitario] = useState(() =>
    draftInvoice?.tipoOperacao === 'VENDA_LEITE' && draftInvoice.valorUnitario
      ? numberToCommaString(draftInvoice.valorUnitario)
      : '',
  )
  const [touched, setTouched] = useState({ quantidade: false, valorUnitario: false })

  if (!selectedClient) {
    return <Navigate to="/emitir-leite/selecionar-cliente" replace />
  }

  const qtyNum = parseCommaDecimal(quantidade)
  const priceNum = parseCommaDecimal(valorUnitario)
  const isFormValid = !isNaN(qtyNum) && qtyNum > 0 && !isNaN(priceNum) && priceNum > 0
  const total = isFormValid ? calculateTotal(qtyNum, priceNum) : 0

  const isClientValid = !!(
    selectedClient.cpf_cnpj &&
    selectedClient.nome_razao_social &&
    selectedClient.municipio &&
    selectedClient.uf
  )

  const qtyError = touched.quantidade
    ? !quantidade.replace(/,/g, '').trim()
      ? 'Informe a quantidade de leite.'
      : qtyNum <= 0
        ? 'A quantidade deve ser maior que zero.'
        : undefined
    : undefined
  const priceError = touched.valorUnitario
    ? !valorUnitario.replace(/,/g, '').trim()
      ? 'Informe o valor unitário do leite.'
      : priceNum <= 0
        ? 'O valor unitário deve ser maior que zero.'
        : undefined
    : undefined

  const buildDraft = (): DraftInvoice => ({
    ...draftInvoice,
    tipoOperacao: 'VENDA_LEITE',
    descricaoProduto: 'LEITE CRU',
    unidadeComercial: 'L',
    quantidade: qtyNum,
    valorUnitario: priceNum,
    valorTotal: total,
    userId: user?.id || '',
    cpf: user?.cpf || '',
    propertyId: activeProperty?.id || '',
    propertyName: activeProperty?.nome || '',
    cadastroPro: activeProperty?.inscricao_estadual || '',
    municipio: activeProperty?.municipio || '',
    uf: activeProperty?.uf || '',
    clienteId: selectedClient.id,
  })

  const handleAlterarCliente = () => {
    if (isFormValid) {
      setDraftInvoice(buildDraft())
    }
    navigate('/emitir-leite/selecionar-cliente')
  }

  const handleContinuar = () => {
    if (!isFormValid || !user || !activeProperty || !isClientValid) return
    setDraftInvoice(buildDraft())
    navigate('/emitir-leite/next')
  }

  return (
    <FormPageLayout className="text-white">
      <AppHeader etapaAtual={2} totalEtapas={3} />

      <div className="flex-1 flex flex-col px-5 pt-6 pb-8 animate-fade-in">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-white">VENDA DE LEITE</h2>
          <p className="text-sm text-white/60 mt-1">Informe os dados do produto.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-[#A8914E] uppercase tracking-wide">
              Cliente
            </span>
            <button
              onClick={handleAlterarCliente}
              className="flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 rounded-lg px-3 py-1.5 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              Alterar Cliente
            </button>
          </div>
          <div className="space-y-1">
            <p className="text-white font-semibold text-sm">{selectedClient.nome_razao_social}</p>
            <p className="text-white/60 text-xs">
              {selectedClient.tipo_pessoa === 'FISICA' ? 'CPF' : 'CNPJ'}:{' '}
              {maskDocumentByType(selectedClient.cpf_cnpj, selectedClient.tipo_pessoa)}
            </p>
            <p className="text-white/50 text-xs">
              {selectedClient.municipio}/{selectedClient.uf}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-white/70 mb-1.5 block">Descrição do Produto</label>
            <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white/50 text-base">
              LEITE CRU
            </div>
          </div>
          <div>
            <label className="text-sm text-white/70 mb-1.5 block">Unidade de Medida</label>
            <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white/50 text-base">
              L – Litro
            </div>
          </div>
          <div>
            <label className="text-sm text-white/70 mb-1.5 block">Quantidade (L) *</label>
            <input
              type="text"
              inputMode="decimal"
              value={quantidade}
              onChange={(e) => setQuantidade(sanitizeNumericInput(e.target.value))}
              onBlur={() => setTouched((p) => ({ ...p, quantidade: true }))}
              placeholder="0,00"
              className="w-full bg-white text-[#002C45] rounded-xl px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#A8914E]"
            />
            {qtyError && <p className="text-sm text-red-400 mt-1">{qtyError}</p>}
          </div>
          <div>
            <label className="text-sm text-white/70 mb-1.5 block">Valor Unitário (R$/L) *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#002C45]/60 font-medium pointer-events-none">
                R$
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={valorUnitario}
                onChange={(e) => setValorUnitario(sanitizeNumericInput(e.target.value, 4))}
                onBlur={() => setTouched((p) => ({ ...p, valorUnitario: true }))}
                placeholder="0,0000"
                className="w-full bg-white text-[#002C45] rounded-xl pl-12 pr-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#A8914E]"
              />
            </div>
            {priceError && <p className="text-sm text-red-400 mt-1">{priceError}</p>}
          </div>
          <div className="bg-white rounded-xl border-l-4 border-[#A8914E] px-5 py-4 mt-6">
            <p className="text-sm font-bold text-[#002C45] tracking-wide">VALOR TOTAL</p>
            <p className="text-3xl font-extrabold text-[#002C45] mt-1">{formatCurrency(total)}</p>
          </div>
        </div>

        {!isClientValid && (
          <div className="mt-4 bg-red-500/20 border border-red-500/40 rounded-xl px-4 py-3">
            <p className="text-sm text-red-300">
              O cliente selecionado possui dados incompletos. Selecione outro cliente.
            </p>
          </div>
        )}

        <div className="mt-auto pt-6">
          <button
            onClick={handleContinuar}
            disabled={!isFormValid || !isClientValid}
            className={cn(
              'w-full rounded-xl py-4 px-6 font-bold text-lg transition-all flex items-center justify-center gap-2',
              isFormValid && isClientValid
                ? 'bg-white border-2 border-[#A8914E] text-[#002C45] hover:brightness-95 active:scale-[0.98]'
                : 'bg-white/10 border-2 border-white/20 text-white/30 cursor-not-allowed',
            )}
          >
            Continuar
          </button>
        </div>
      </div>
    </FormPageLayout>
  )
}
