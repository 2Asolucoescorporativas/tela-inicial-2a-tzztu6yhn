import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { getInvoices, cancelInvoice, type InvoiceRecord } from '@/services/invoices'
import { useRealtime } from '@/hooks/use-realtime'
import { Logo2A } from '@/components/Logo2A'
import { InvoiceActionsBar } from '@/components/InvoiceActionsBar'
import { downloadInvoiceXml, printDanfe } from '@/lib/invoice-xml'
import { normalizeForSearch } from '@/lib/search-utils'
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
import { ArrowLeft, Search, FileText, ChevronDown, Plus } from 'lucide-react'

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

const PAGE_SIZE = 20

export default function ConsultarNF() {
  const navigate = useNavigate()
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [loading, setLoading] = useState(true)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [canceling, setCanceling] = useState(false)

  const loadData = async () => {
    try {
      const data = await getInvoices()
      setInvoices(data)
    } catch {
      setInvoices([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useRealtime('invoices', () => {
    loadData()
  })

  useEffect(() => () => setSelectedId(null), [])

  const filtered = useMemo(() => {
    const q = normalizeForSearch(searchTerm)
    const digits = searchTerm.replace(/\D/g, '')
    if (!q) return invoices
    return invoices.filter((inv) => {
      const textMatch =
        normalizeForSearch(inv.number).includes(q) ||
        normalizeForSearch(inv.recipient_name).includes(q) ||
        normalizeForSearch(inv.producer_name).includes(q)
      const digitMatch =
        digits.length > 0 &&
        (inv.recipient_document.replace(/\D/g, '').includes(digits) ||
          inv.cpf_cnpj.replace(/\D/g, '').includes(digits) ||
          inv.number.replace(/\D/g, '').includes(digits))
      return textMatch || digitMatch
    })
  }, [invoices, searchTerm])

  const visible = filtered.slice(0, visibleCount)
  const selectedInvoice = invoices.find((i) => i.id === selectedId) || null

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setSelectedId(null)
    setVisibleCount(PAGE_SIZE)
  }

  const handleCardClick = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id))
  }

  const handleCancel = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!selectedInvoice) return
    setCanceling(true)
    try {
      await cancelInvoice(selectedInvoice.id)
      toast.success('Nota fiscal cancelada com sucesso.')
      setInvoices((prev) =>
        prev.map((i) => (i.id === selectedInvoice.id ? { ...i, status: 'cancelada' as const } : i)),
      )
      setSelectedId(null)
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

  return (
    <div className="min-h-screen bg-[#002C45] text-white flex flex-col max-w-md mx-auto sm:max-w-xl">
      <div className="p-5 flex items-center gap-3 border-b border-white/10 bg-[#001f31]/60 backdrop-blur-md sticky top-0 z-30">
        <button
          onClick={() => navigate('/nota-fiscal')}
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

      <div
        className={cn(
          'flex-1 flex flex-col px-5 pt-6 pb-8 animate-fade-in overflow-y-auto',
          selectedId && 'pb-28',
        )}
      >
        <h1 className="text-xl font-bold text-white text-center mb-1">Consultar Notas Fiscais</h1>
        <p className="text-xs text-white/50 text-center mb-5">
          {filtered.length} {filtered.length === 1 ? 'nota encontrada' : 'notas encontradas'}
        </p>

        <div className="relative mb-5">
          <Search className="w-4 h-4 text-white/50 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Buscar por numero, cliente, CPF/CNPJ..."
            className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-[#A8914E]"
          />
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-white/50">Carregando notas fiscais...</p>
          </div>
        ) : visible.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
            <FileText className="w-12 h-12 text-white/30" />
            <p className="text-sm text-white/60">Nenhuma nota fiscal emitida.</p>
            <button
              onClick={() => navigate('/emitir-nf')}
              className="bg-gold-gradient text-[#002C45] font-bold px-6 py-2.5 rounded-xl text-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Emitir Nota Fiscal
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {visible.map((inv) => (
                <button
                  key={inv.id}
                  onClick={() => handleCardClick(inv.id)}
                  className={cn(
                    'w-full text-left rounded-xl p-4 space-y-2 transition-all duration-150 border',
                    selectedId === inv.id
                      ? 'bg-[#A8914E]/15 border-[#A8914E] ring-1 ring-[#A8914E]'
                      : 'bg-white/5 border-white/10 hover:bg-white/10',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">NFe {inv.number}</span>
                    <span
                      className={cn(
                        'text-[10px] font-semibold px-2 py-0.5 rounded-full border',
                        STATUS_COLORS[inv.status] || STATUS_COLORS.rascunho,
                      )}
                    >
                      {STATUS_LABELS[inv.status] || inv.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Destinatario</span>
                    <span className="text-white font-medium text-right max-w-[60%] truncate">
                      {inv.recipient_name}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Total</span>
                    <span className="text-[#A8914E] font-bold">
                      {formatCurrency(inv.total_value)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs pt-1 border-t border-white/10">
                    <span className="text-white/60">Emissao</span>
                    <span className="text-white/70">
                      {new Date(inv.created).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {visibleCount < filtered.length && (
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="mt-4 w-full rounded-xl py-3 px-6 font-medium text-sm bg-white/10 border border-white/20 text-white hover:bg-white/15 transition-all flex items-center justify-center gap-2"
              >
                <ChevronDown className="w-4 h-4" />
                Carregar mais ({filtered.length - visibleCount} restantes)
              </button>
            )}
          </>
        )}
      </div>

      {selectedInvoice && (
        <InvoiceActionsBar
          invoice={selectedInvoice}
          onDownloadXml={() => downloadInvoiceXml(selectedInvoice)}
          onPrintDanfe={() => printDanfe(selectedInvoice)}
          onSend={handleSend}
          onCancel={() => setCancelOpen(true)}
        />
      )}

      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent className="bg-[#002C45] text-white border-white/10 max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#F9E27D]">Cancelar Nota Fiscal</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Tem certeza que deseja cancelar a NFe {selectedInvoice?.number}? Esta acao nao pode
              ser desfeita.
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
    </div>
  )
}
