import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getInvoices, type InvoiceRecord } from '@/services/invoices'
import { useRealtime } from '@/hooks/use-realtime'
import { Logo2A } from '@/components/Logo2A'
import { normalizeForSearch } from '@/lib/search-utils'
import { formatCurrency } from '@/lib/decimal-utils'
import { cn } from '@/lib/utils'
import { ArrowLeft, Search, FileText, ChevronDown, Plus, MapPin, Building2 } from 'lucide-react'
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

const PAGE_SIZE = 20

export default function ConsultarNF() {
  const navigate = useNavigate()
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [loading, setLoading] = useState(true)

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

  const filtered = useMemo(() => {
    const q = normalizeForSearch(searchTerm)
    const digits = searchTerm.replace(/\D/g, '')
    if (!q) return invoices
    return invoices.filter((inv) => {
      const textMatch =
        normalizeForSearch(inv.number).includes(q) ||
        normalizeForSearch(inv.recipient_name).includes(q) ||
        normalizeForSearch(inv.producer_name).includes(q) ||
        normalizeForSearch(inv.municipio || '').includes(q)
      const digitMatch =
        digits.length > 0 &&
        (inv.recipient_document.replace(/\D/g, '').includes(digits) ||
          inv.cpf_cnpj.replace(/\D/g, '').includes(digits) ||
          inv.number.replace(/\D/g, '').includes(digits))
      return textMatch || digitMatch
    })
  }, [invoices, searchTerm])

  const visible = filtered.slice(0, visibleCount)

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setVisibleCount(PAGE_SIZE)
  }

  const handleCardClick = (id: string) => {
    navigate(`/consultar-nf/${id}`)
  }

  return (
    <FormPageLayout className="text-white">
      <div className="p-5 flex items-center gap-3 border-b border-white/10 bg-[#001f31]/60 backdrop-blur-md sticky top-0 z-30 flex-shrink-0">
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

      <div className="flex-1 flex flex-col px-5 pt-6 pb-8 animate-fade-in">
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
            <p className="text-sm text-white/60">Nenhuma nota fiscal encontrada.</p>
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
                  className="w-full text-left rounded-xl p-4 space-y-2 transition-all duration-150 border bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-[0.98]"
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
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60 flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      Destinatario
                    </span>
                    <span className="text-white font-medium text-right max-w-[55%] truncate">
                      {inv.recipient_name}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">CNPJ</span>
                    <span className="text-white/80">{inv.recipient_document}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Municipio
                    </span>
                    <span className="text-white/80 text-right max-w-[55%] truncate">
                      {inv.municipio || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs pt-1 border-t border-white/10">
                    <span className="text-white/60">Total</span>
                    <span className="text-[#A8914E] font-bold">
                      {formatCurrency(inv.total_value)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
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
    </FormPageLayout>
  )
}
