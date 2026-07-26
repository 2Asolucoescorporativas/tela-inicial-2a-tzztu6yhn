import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useSession, type DraftInvoice } from '@/stores/session'
import { Logo2A } from '@/components/Logo2A'
import { cn } from '@/lib/utils'
import {
  parseCommaDecimal,
  calculateTotal,
  formatCurrency,
  numberToCommaString,
  sanitizeNumericInput,
} from '@/lib/decimal-utils'
import { ArrowLeft } from 'lucide-react'

export default function EmitirLeite() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { activeProperty, draftInvoice, setDraftInvoice } = useSession()

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

  const qtyNum = parseCommaDecimal(quantidade)
  const priceNum = parseCommaDecimal(valorUnitario)
  const isFormValid = !isNaN(qtyNum) && qtyNum > 0 && !isNaN(priceNum) && priceNum > 0
  const total = isFormValid ? calculateTotal(qtyNum, priceNum) : 0

  const qtyValue = quantidade.replace(/,/g, '').trim()
  const qtyError = touched.quantidade
    ? !qtyValue
      ? 'Informe a quantidade de leite.'
      : qtyNum <= 0
        ? 'A quantidade deve ser maior que zero.'
        : undefined
    : undefined

  const priceValue = valorUnitario.replace(/,/g, '').trim()
  const priceError = touched.valorUnitario
    ? !priceValue
      ? 'Informe o valor unitário do leite.'
      : priceNum <= 0
        ? 'O valor unitário deve ser maior que zero.'
        : undefined
    : undefined

  const handleContinuar = () => {
    if (!isFormValid || !user || !activeProperty) return
    const draft: DraftInvoice = {
      tipoOperacao: 'VENDA_LEITE',
      descricaoProduto: 'LEITE CRU',
      unidadeComercial: 'L',
      quantidade: qtyNum,
      valorUnitario: priceNum,
      valorTotal: total,
      userId: user.id,
      cpf: user.cpf || '',
      propertyId: activeProperty.id,
      propertyName: activeProperty.nome,
      cadastroPro: activeProperty.inscricao_estadual,
      municipio: activeProperty.municipio,
      uf: activeProperty.uf,
    }
    setDraftInvoice(draft)
    navigate('/emitir-leite/next')
  }

  return (
    <div className="min-h-screen bg-[#002C45] text-white flex flex-col max-w-md mx-auto sm:max-w-xl">
      <div className="p-5 flex items-center gap-3 border-b border-white/10 bg-[#001f31]/60 backdrop-blur-md sticky top-0 z-30">
        <button
          onClick={() => navigate('/emitir-nf')}
          className="flex items-center gap-1 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Voltar</span>
        </button>
        <div className="flex-1 flex justify-center">
          <Logo2A size="xs" showTagline={false} linkTo="/dashboard" />
        </div>
        <div className="w-[60px]" />
      </div>

      <div className="flex-1 flex flex-col px-5 pt-6 pb-8 animate-fade-in overflow-y-auto">
        <div className="text-center space-y-1 mb-6">
          <h2 className="text-base font-semibold text-white/80">{user?.name || 'Usuário'}</h2>
          <h1 className="text-2xl font-extrabold text-white leading-tight">
            {activeProperty?.nome || 'Propriedade'}
          </h1>
          <p className="text-sm text-[#A8914E] font-medium">
            CAD/PRO: {activeProperty?.inscricao_estadual || '—'}
          </p>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-white">VENDA DE LEITE</h2>
          <p className="text-sm text-white/60 mt-1">Informe os dados do produto.</p>
          <p className="text-xs text-[#A8914E] mt-2 font-medium">Etapa 1 – Produto</p>
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

        <div className="mt-auto pt-6">
          <button
            onClick={handleContinuar}
            disabled={!isFormValid}
            className={cn(
              'w-full rounded-xl py-4 px-6 font-bold text-lg transition-all',
              isFormValid
                ? 'bg-white border-2 border-[#A8914E] text-[#002C45] hover:brightness-95 active:scale-[0.98]'
                : 'bg-white/10 border-2 border-white/20 text-white/30 cursor-not-allowed',
            )}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  )
}
