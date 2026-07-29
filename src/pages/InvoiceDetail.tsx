import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { getInvoice, cancelInvoice, type InvoiceRecord } from '@/services/invoices'
import { useRealtime } from '@/hooks/use-realtime'
import { AppHeader } from '@/components/AppHeader'
import { downloadInvoiceXml, printDanfe } from '@/lib/invoice-xml'
import { formatCurrency } from '@/lib/decimal-utils'
import { cn } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Download,
  Printer,
  Send,
  XCircle,
  FileText,
  MapPin,
  Building2,
  Calendar,
  Hash,
  FileCheck,
} from 'lucide-react'
import { FormPageLayout } from '@/components/FormPageLayout'

const STATUS_LABELS: Record<string, string> = {
  emitida: 'Emitida',
  processando: 'Processando',
  cancelada: 'Cancelada',
  rascunho: 'Rascunho',
}

const STATUS_COLORS: Record<string, string> = {
  emitida: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  processando: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  cancelada: 'bg-red-500/20 text-red-300 border-red-500/30',
  rascunho: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
}

export default function InvoiceDetail() {
  const { invoiceId } = useParams<{ invoiceId: string }>()
  const navigate = useNavigate()
  const [invoice, setInvoice] = useState<InvoiceRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [canceling, setCanceling] = useState(false)

  useEffect(() => {
    if (!invoiceId) {
      navigate('/consultar-nf', { replace: true })
      return
    }
    getInvoice(invoiceId)
      .then((data) => setInvoice(data))
      .catch(() => {
        toast.error('Nota fiscal nao encontrada.')
        navigate('/consultar-nf', { replace: true })
      })
      .finally(() => setLoading(false))
  }, [invoiceId, navigate])

  useRealtime('invoices', (e) => {
    if (invoice && e.record.id === invoice.id) {
      setInvoice({ ...invoice, ...e.record } as InvoiceRecord)
    }
  })

  if (loading) {
    return (
      <div className="h-full bg-[#002C45] text-white flex items-center justify-center max-w-md mx-auto sm:max-w-xl">
        <p className="text-sm text-white/50">Carregando nota fiscal...</p>
      </div>
    )
  }

  if (!invoice) return null

  const canDownloadXml = invoice.status === 'emitida' || invoice.status === 'cancelada'
  const canPrintDanfe = invoice.status === 'emitida' || invoice.status === 'cancelada'
  const canSend = invoice.status === 'rascunho' || invoice.status === 'processando'
  const canCancel = invoice.status === 'emitida'

  const handleCancel = async () => {
    if (!invoice) return
    setCanceling(true)
    try {
      await cancelInvoice(invoice.id)
      toast.success('Nota fiscal cancelada com sucesso.')
      setInvoice({ ...invoice, status: 'cancelada' })
      setCancelOpen(false)
    } catch {
      toast.error('Erro ao cancelar nota fiscal.')
    } finally {
      setCanceling(false)
    }
  }

  const handleSend = () => {
    toast.info('Transmissao para SEFAZ sera implementada em breve.')
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })

  return (
    <FormPageLayout className="text-white">
      <AppHeader />

      <div className="form-page__content px-5 pt-6 pb-8 animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-bold text-white">Detalhes da NFe</h1>
          <span
            className={cn(
              'text-xs font-semibold px-3 py-1 rounded-full border',
              STATUS_COLORS[invoice.status] || STATUS_COLORS.rascunho,
            )}
          >
            {STATUS_LABELS[invoice.status] || invoice.status}
          </span>
        </div>

        <div className="bg-[#001f31]/60 rounded-2xl border border-white/10 p-4 space-y-3 mb-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <Hash className="w-4 h-4 text-[#A8914E] shrink-0" />
            <div className="flex-1 flex justify-between">
              <span className="text-xs text-white/60">Numero / Serie</span>
              <span className="text-sm font-bold text-white">
                {invoice.number} / {invoice.series}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <Calendar className="w-4 h-4 text-[#A8914E] shrink-0" />
            <div className="flex-1 flex justify-between">
              <span className="text-xs text-white/60">Data de Emissao</span>
              <span className="text-sm text-white/90">{formatDate(invoice.created)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <FileCheck className="w-4 h-4 text-[#A8914E] shrink-0" />
            <div className="flex-1 flex justify-between">
              <span className="text-xs text-white/60">Valor Total</span>
              <span className="text-base font-bold text-[#F9E27D]">
                {formatCurrency(invoice.total_value)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <Building2 className="w-4 h-4 text-[#A8914E] shrink-0" />
            <div className="flex-1 flex justify-between">
              <span className="text-xs text-white/60">Destinatario</span>
              <span className="text-sm font-medium text-white text-right max-w-[60%] truncate">
                {invoice.recipient_name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <FileText className="w-4 h-4 text-[#A8914E] shrink-0" />
            <div className="flex-1 flex justify-between">
              <span className="text-xs text-white/60">CNPJ / CPF</span>
              <span className="text-sm text-white/90">{invoice.recipient_document}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#A8914E] shrink-0" />
            <div className="flex-1 flex justify-between">
              <span className="text-xs text-white/60">Municipio</span>
              <span className="text-sm text-white/90">{invoice.municipio || '-'}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#001f31]/60 rounded-2xl border border-white/10 p-4 space-y-3 mb-4">
          <span className="text-xs font-semibold text-[#A8914E] uppercase tracking-wide">
            Emitente
          </span>
          <div className="flex justify-between text-xs">
            <span className="text-white/60">Nome</span>
            <span className="text-white font-medium text-right max-w-[60%] truncate">
              {invoice.producer_name}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-white/60">CPF / CNPJ</span>
            <span className="text-white/90">{invoice.cpf_cnpj}</span>
          </div>
          {invoice.ie_number && (
            <div className="flex justify-between text-xs">
              <span className="text-white/60">Inscricao Estadual</span>
              <span className="text-white/90">{invoice.ie_number}</span>
            </div>
          )}
        </div>

        {invoice.chavenfe && (
          <div className="bg-[#001f31]/60 rounded-2xl border border-white/10 p-4 space-y-1 mb-4">
            <span className="text-xs font-semibold text-[#A8914E] uppercase tracking-wide">
              Chave de Acesso
            </span>
            <p className="font-mono text-[11px] text-white/80 break-all select-all leading-relaxed">
              {invoice.chavenfe}
            </p>
          </div>
        )}

        {invoice.items_summary && (
          <div className="bg-[#001f31]/60 rounded-2xl border border-white/10 p-4 space-y-1 mb-6">
            <span className="text-xs font-semibold text-[#A8914E] uppercase tracking-wide">
              Produtos / Servicos
            </span>
            <p className="text-sm text-white/90 leading-relaxed">{invoice.items_summary}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mt-2">
          <button
            onClick={() => downloadInvoiceXml(invoice)}
            disabled={!canDownloadXml}
            className={cn(
              'flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all duration-150',
              canDownloadXml
                ? 'bg-white/10 text-white hover:bg-white/20 active:scale-95'
                : 'bg-white/5 text-white/25 cursor-not-allowed',
            )}
          >
            <Download className="w-5 h-5" />
            <span className="text-xs font-medium">Baixar XML</span>
          </button>

          <button
            onClick={() => printDanfe(invoice)}
            disabled={!canPrintDanfe}
            className={cn(
              'flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all duration-150',
              canPrintDanfe
                ? 'bg-white/10 text-white hover:bg-white/20 active:scale-95'
                : 'bg-white/5 text-white/25 cursor-not-allowed',
            )}
          >
            <Printer className="w-5 h-5" />
            <span className="text-xs font-medium">DANFE</span>
          </button>

          <button
            onClick={handleSend}
            disabled={!canSend}
            className={cn(
              'flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all duration-150',
              canSend
                ? 'bg-white/10 text-white hover:bg-white/20 active:scale-95'
                : 'bg-white/5 text-white/25 cursor-not-allowed',
            )}
          >
            <Send className="w-5 h-5" />
            <span className="text-xs font-medium">Enviar</span>
          </button>

          <button
            onClick={() => setCancelOpen(true)}
            disabled={!canCancel}
            className={cn(
              'flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all duration-150',
              canCancel
                ? 'bg-red-500/15 text-red-300 hover:bg-red-500/25 active:scale-95'
                : 'bg-white/5 text-white/25 cursor-not-allowed',
            )}
          >
            <XCircle className="w-5 h-5" />
            <span className="text-xs font-medium">Cancelar Nota</span>
          </button>
        </div>

        <button
          onClick={() => navigate('/consultar-nf')}
          className="mt-4 w-full rounded-xl py-3 px-6 font-medium text-sm bg-white/10 border border-white/20 text-white hover:bg-white/15 transition-all flex items-center justify-center gap-2"
        >
          <XCircle className="w-4 h-4" />
          Cancelar
        </button>
      </div>

      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent className="bg-[#002C45] text-white border-white/10 max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#F9E27D]">Cancelar Nota Fiscal</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Tem certeza que deseja cancelar a NFe {invoice.number}? Esta acao nao pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              disabled={canceling}
            >
              Voltar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              disabled={canceling}
              className="bg-red-500 hover:bg-red-600 text-white border-0"
            >
              {canceling ? 'Cancelando...' : 'Confirmar Cancelamento'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </FormPageLayout>
  )
}
