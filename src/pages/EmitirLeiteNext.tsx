import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useSession } from '@/stores/session'
import { Logo2A } from '@/components/Logo2A'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/decimal-utils'
import { maskDocumentByType } from '@/lib/client-utils'
import { generateNfe } from '@/lib/nfe-generator'
import { getNextInvoiceNumber } from '@/services/invoices'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Check, FileCode2, Loader2, Download, AlertCircle } from 'lucide-react'

export default function EmitirLeiteNext() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const { draftInvoice, setDraftInvoice, selectedClient, activeProperty } = useSession()

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [generatedXml, setGeneratedXml] = useState('')

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
      const nNFResult: any = await getNextInvoiceNumber()
      const nNFStr = String(
        typeof nNFResult === 'object' && nNFResult !== null
          ? (nNFResult.number ?? nNFResult.nNF ?? '')
          : nNFResult,
      )
      const result = generateNfe({
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
      setDraftInvoice({ ...draftInvoice!, nNF: nNFStr, nfeXml: result.xml, nfeObject: result.data })
      setGeneratedXml(result.xml)
      setSuccess(true)
      toast({
        title: 'NF-e gerada com sucesso!',
        description: 'O XML foi gerado e está pronto para download.',
      })
    } catch {
      toast({
        title: 'Erro ao gerar NF-e',
        description: 'Não foi possível gerar o XML. Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadXml = () => {
    const blob = new Blob([generatedXml], { type: 'application/xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `nfe-${draftInvoice?.nNF || 'rascunho'}.xml`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

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
        ) : success ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 animate-fade-in">
            <div className="inline-flex p-4 bg-[#A8914E]/10 rounded-2xl mb-2">
              <Check className="w-10 h-10 text-[#A8914E]" />
            </div>
            <h2 className="text-xl font-bold text-white">NF-e Gerada com Sucesso!</h2>
            <p className="text-sm text-white/60 max-w-xs">
              O XML da Nota Fiscal foi gerado.
              {draftInvoice?.nNF ? ` Número: ${draftInvoice.nNF}` : ''}
            </p>
            <div className="w-full space-y-3 mt-4">
              <button
                onClick={handleDownloadXml}
                className="w-full rounded-xl py-4 px-6 font-bold text-lg bg-white border-2 border-[#A8914E] text-[#002C45] hover:brightness-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" /> Baixar XML
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full rounded-xl py-4 px-6 font-bold text-lg bg-white/10 border-2 border-white/20 text-white hover:bg-white/15 transition-all"
              >
                Ir para o Dashboard
              </button>
            </div>
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
              O XML será gerado ao clicar em "Emitir Nota Fiscal".
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
                    <Loader2 className="w-5 h-5 animate-spin" /> Gerando NF-e...
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
    </div>
  )
}
