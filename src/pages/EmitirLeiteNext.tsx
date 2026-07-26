import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '@/stores/session'
import { Logo2A } from '@/components/Logo2A'
import { formatCurrency } from '@/lib/decimal-utils'
import { ArrowLeft, Copy, Check, FileCode2 } from 'lucide-react'

export default function EmitirLeiteNext() {
  const navigate = useNavigate()
  const { draftInvoice, recipient, activeProperty } = useSession()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!draftInvoice?.nfeXml) return
    try {
      await navigator.clipboard.writeText(draftInvoice.nfeXml)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* noop */
    }
  }

  const hasXml = !!draftInvoice?.nfeXml

  return (
    <div className="min-h-screen bg-[#002C45] text-white flex flex-col max-w-md mx-auto sm:max-w-xl">
      <div className="p-5 flex items-center gap-3 border-b border-white/10 bg-[#001f31]/60 backdrop-blur-md sticky top-0 z-30">
        <button
          onClick={() => navigate('/emitir-leite')}
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
        {!hasXml ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
            <FileCode2 className="w-12 h-12 text-white/30" />
            <p className="text-sm text-white/60">
              Nenhum XML gerado. Volte e preencha os dados do produto.
            </p>
            <button
              onClick={() => navigate('/emitir-leite')}
              className="bg-white text-[#002C45] rounded-xl px-6 py-3 font-bold hover:brightness-95 transition-all"
            >
              Voltar para o formulário
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-[#A8914E]/10 rounded-2xl mb-3">
                <Check className="w-8 h-8 text-[#A8914E]" />
              </div>
              <h1 className="text-xl font-bold text-white">XML Gerado com Sucesso</h1>
              <p className="text-xs text-[#A8914E] mt-2 font-medium">
                Etapa 2 – XML NF-e (não assinado)
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Número NF</span>
                <span className="text-white font-semibold">{draftInvoice.nNF}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Série</span>
                <span className="text-white font-semibold">{draftInvoice.serie}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Valor Total</span>
                <span className="text-[#A8914E] font-bold">
                  {formatCurrency(draftInvoice.valorTotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Emitente</span>
                <span className="text-white font-semibold text-right max-w-[60%] truncate">
                  {activeProperty?.nome || draftInvoice.propertyName}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Destinatário</span>
                <span className="text-white font-semibold text-right max-w-[60%] truncate">
                  {recipient?.razaoSocial || '—'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white/80">Preview do XML</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 rounded-lg px-3 py-1.5 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" /> Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copiar
                  </>
                )}
              </button>
            </div>

            <pre className="bg-[#001f31] border border-white/10 rounded-xl p-4 text-xs text-green-300/90 font-mono overflow-x-auto max-h-80 overflow-y-auto whitespace-pre-wrap break-all">
              {draftInvoice.nfeXml}
            </pre>

            <p className="text-xs text-white/40 mt-3 text-center">
              O XML ainda não foi assinado nem transmitido para a SEFAZ.
            </p>

            <div className="mt-auto pt-6">
              <button
                onClick={() => navigate('/emitir-leite')}
                className="w-full rounded-xl py-4 px-6 font-bold text-lg bg-white/10 border-2 border-white/20 text-white hover:bg-white/15 transition-all"
              >
                Voltar para editar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
