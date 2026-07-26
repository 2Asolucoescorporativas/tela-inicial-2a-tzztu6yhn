import { useNavigate } from 'react-router-dom'
import { useSession } from '@/stores/session'
import { Logo2A } from '@/components/Logo2A'
import { formatCurrency } from '@/lib/decimal-utils'
import { maskDocumentByType } from '@/lib/client-utils'
import { ArrowLeft, Check, FileCode2 } from 'lucide-react'

export default function EmitirLeiteNext() {
  const navigate = useNavigate()
  const { draftInvoice, selectedClient, activeProperty } = useSession()

  const hasData = !!draftInvoice && !!selectedClient

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
        {!hasData ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
            <FileCode2 className="w-12 h-12 text-white/30" />
            <p className="text-sm text-white/60">
              Nenhum dado de emissão encontrado. Volte e preencha os dados.
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
              <h1 className="text-xl font-bold text-white">Dados da Emissão</h1>
              <p className="text-xs text-[#A8914E] mt-2 font-medium">Etapa 2 – Revisão dos dados</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 mb-4">
              <p className="text-sm font-semibold text-[#A8914E] uppercase tracking-wide">
                Cliente
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Nome</span>
                <span className="text-white font-semibold text-right max-w-[60%] truncate">
                  {selectedClient!.nome_razao_social}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">
                  {selectedClient!.tipo_pessoa === 'FISICA' ? 'CPF' : 'CNPJ'}
                </span>
                <span className="text-white font-semibold">
                  {maskDocumentByType(selectedClient!.cpf_cnpj, selectedClient!.tipo_pessoa)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Município/UF</span>
                <span className="text-white font-semibold">
                  {selectedClient!.municipio}/{selectedClient!.uf}
                </span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 mb-4">
              <p className="text-sm font-semibold text-[#A8914E] uppercase tracking-wide">
                Produto
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Descrição</span>
                <span className="text-white font-semibold">{draftInvoice!.descricaoProduto}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Quantidade</span>
                <span className="text-white font-semibold">
                  {draftInvoice!.quantidade} {draftInvoice!.unidadeComercial}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Valor Unitário</span>
                <span className="text-white font-semibold">
                  {formatCurrency(draftInvoice!.valorUnitario)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Valor Total</span>
                <span className="text-[#A8914E] font-bold">
                  {formatCurrency(draftInvoice!.valorTotal)}
                </span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 mb-4">
              <p className="text-sm font-semibold text-[#A8914E] uppercase tracking-wide">
                Emitente
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Propriedade</span>
                <span className="text-white font-semibold text-right max-w-[60%] truncate">
                  {activeProperty?.nome || draftInvoice!.propertyName}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">CAD/PRO</span>
                <span className="text-white font-semibold">{draftInvoice!.cadastroPro}</span>
              </div>
            </div>

            <p className="text-xs text-white/40 mt-3 text-center">
              O XML será gerado na próxima etapa (revisão final).
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
