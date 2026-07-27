import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useSession } from '@/stores/session'
import { AppHeader } from '@/components/AppHeader'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/decimal-utils'
import { maskDocumentByType } from '@/lib/client-utils'
import { generateNfe } from '@/lib/nfe-generator'
import { generateChaveNFe } from '@/lib/nfe-chave'
import { FISCAL_CONFIG } from '@/lib/fiscal-config'
import { getNextInvoiceNumber, createInvoice } from '@/services/invoices'
import { useToast } from '@/hooks/use-toast'
import { Check, FileCode2, Loader2, AlertCircle } from 'lucide-react'
import { FormPageLayout } from '@/components/FormPageLayout'

export default function EmitirLeiteNext() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const { draftInvoice, setDraftInvoice, selectedClient, activeProperty } = useSession()

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [savedNumber, setSavedNumber] = useState('')

  const hasData = !!draftInvoice && !!selectedClient

  const missingFields: string[] = []
  if (!activeProperty) missingFields.push('Propriedade')
  if (!selectedClient) missingFields.push('Cliente')
  if (!draftInvoice || draftInvoice.quantidade <= 0) missingFields.push('Quantidade')
  if (!draftInvoice || draftInvoice.valorUnitario <= 0) missingFields.push('Valor unitário')
  if (!user?.cpf) missingFields.push('CPF do produtor')
  if (!user?.name) missingFields.push('Nome do produtor')

  const handleEmitir = async () => {
    if (missingFields.length > 0) {
      toast({
        title: 'Dados incompletos',
        description: `Verifique: ${missingFields.join(', ')}`,
        variant: 'destructive',
      })
      return
    }
    setLoading(true)
    try {
      const nNFResult = await getNextInvoiceNumber()
      const nNFStr = nNFResult.number
      const seriesStr = nNFResult.series

      const chave = generateChaveNFe({
        uf: activeProperty!.uf || 'GO',
        cpfCnpj: user!.cpf,
        nNF: nNFStr,
        serie: FISCAL_CONFIG.serie,
        mod: FISCAL_CONFIG.mod,
      })

      generateNfe({
        userCpf: user!.cpf,
        userName: user!.name,
        property: {
          inscricao_estadual: activeProperty!.inscricao_estadual,
          municipio: activeProperty!.municipio,
          uf: activeProperty!.uf,
          codigo_ibge: activeProperty!.codigo_ibge,
          endereco: activeProperty!.endereco,
          numero: activeProperty!.numero,
          bairro: activeProperty!.bairro,
          cep: activeProperty!.cep,
        },
        recipient: {
          cnpj: selectedClient!.cpf_cnpj,
          razaoSocial: selectedClient!.nome_razao_social,
          ie: selectedClient!.inscricao_estadual || 'ISENTO',
          logradouro: selectedClient!.logradouro || 'Não informado',
          numero: selectedClient!.numero || 'S/N',
          bairro: selectedClient!.bairro || 'Centro',
          municipio: selectedClient!.municipio,
          uf: selectedClient!.uf,
          cMun: selectedClient!.codigo_ibge || '',
        },
        quantidade: draftInvoice!.quantidade,
        valorUnitario: draftInvoice!.valorUnitario,
        valorTotal: draftInvoice!.valorTotal,
        nNF: nNFStr,
      })

      const formattedQty = draftInvoice!.quantidade.toLocaleString('pt-BR', {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      })
      const itemsSummary = `${FISCAL_CONFIG.xProd} – ${formattedQty} ${draftInvoice!.unidadeComercial}`

      await createInvoice({
        user_id: user!.id,
        number: nNFStr,
        series: seriesStr,
        producer_name: activeProperty!.nome || draftInvoice!.propertyName,
        cpf_cnpj: user!.cpf,
        ie_number: activeProperty!.inscricao_estadual || draftInvoice!.cadastroPro,
        recipient_name: selectedClient!.nome_razao_social,
        recipient_document: selectedClient!.cpf_cnpj,
        operation_type: 'saida',
        total_value: draftInvoice!.valorTotal,
        status: 'emitida',
        chavenfe: chave,
        items_summary: itemsSummary,
      })

      setSavedNumber(nNFStr)
      setDraftInvoice(null)
      setSuccess(true)
      toast({
        title: 'Nota fiscal emitida com sucesso!',
        description: `NF-e ${nNFStr} foi gerada e salva.`,
      })
    } catch {
      toast({
        title: 'Erro ao emitir NF-e',
        description: 'Não foi possível emitir a nota fiscal. Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormPageLayout className="text-white">
      <AppHeader />

      <div className="flex-1 flex flex-col px-5 pt-6 pb-8 animate-fade-in">
        {success ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 animate-fade-in">
            <div className="inline-flex p-4 bg-[#A8914E]/10 rounded-2xl mb-2">
              <Check className="w-10 h-10 text-[#A8914E]" />
            </div>
            <h2 className="text-xl font-bold text-white">Nota Fiscal Emitida!</h2>
            <p className="text-sm text-white/60 max-w-xs">
              Sua NF-e foi gerada e salva com sucesso.
              {savedNumber ? ` Número: ${savedNumber}` : ''}
            </p>
            <div className="w-full space-y-3 mt-4">
              <button
                onClick={() => navigate('/consultar-nf')}
                className="w-full rounded-xl py-4 px-6 font-bold text-lg bg-white border-2 border-[#A8914E] text-[#002C45] hover:brightness-95 active:scale-[0.98] transition-all"
              >
                Ver Notas Fiscais
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full rounded-xl py-4 px-6 font-bold text-lg bg-white/10 border-2 border-white/20 text-white hover:bg-white/15 transition-all"
              >
                Ir para o Dashboard
              </button>
            </div>
          </div>
        ) : !hasData ? (
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

            {missingFields.length > 0 && (
              <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-4 py-3 flex items-start gap-2 mb-4">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-300">
                  Dados incompletos para emissão: {missingFields.join(', ')}.
                </p>
              </div>
            )}

            <p className="text-xs text-white/40 mb-3 text-center">
              A nota fiscal será gerada e salva ao clicar em "Emitir Nota Fiscal".
            </p>

            <div className="mt-auto pt-6 space-y-3">
              <button
                onClick={handleEmitir}
                disabled={loading || missingFields.length > 0}
                className={cn(
                  'w-full rounded-xl py-4 px-6 font-bold text-lg transition-all flex items-center justify-center gap-2',
                  loading || missingFields.length > 0
                    ? 'bg-white/10 border-2 border-white/20 text-white/30 cursor-not-allowed'
                    : 'bg-white border-2 border-[#A8914E] text-[#002C45] hover:brightness-95 active:scale-[0.98]',
                )}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Emitindo...
                  </>
                ) : (
                  'Emitir Nota Fiscal'
                )}
              </button>
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
    </FormPageLayout>
  )
}
