import { useState, useEffect } from 'react'
import { getInvoices, InvoiceRecord } from '@/services/invoices'
import { BottomNav } from '@/components/BottomNav'
import { InvoiceDetailModal } from '@/components/InvoiceDetailModal'
import { Input } from '@/components/ui/input'
import { Search, Filter, Calendar } from 'lucide-react'
import { FormPageLayout } from '@/components/FormPageLayout'

export default function InvoiceHistory() {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)

  useEffect(() => {
    getInvoices().then(setInvoices)
  }, [])

  const filtered = invoices.filter(
    (inv) =>
      inv.number.includes(searchTerm) ||
      inv.recipient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.items_summary?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <FormPageLayout className="text-white pb-24 md:max-w-2xl relative">
      <div className="p-5 border-b border-white/10 bg-[#001f31]/80 backdrop-blur-md sticky top-0 z-30 space-y-3">
        <h2 className="text-lg font-bold text-[#F9E27D]">Histórico de Notas Fiscais</h2>

        <div className="relative">
          <Search className="w-4 h-4 text-white/50 absolute left-3 top-3.5" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por número, destinatário ou produto..."
            className="bg-[#002C45] border-white/15 text-white pl-9 h-10 text-xs rounded-xl"
          />
        </div>
      </div>

      <div className="p-5 space-y-3 animate-fade-in">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-white/50 text-xs">
            Nenhuma nota fiscal encontrada.
          </div>
        ) : (
          filtered.map((inv) => (
            <div
              key={inv.id}
              onClick={() => {
                setSelectedInvoice(inv)
                setDetailModalOpen(true)
              }}
              className="bg-[#001f31] hover:bg-[#00283d] p-3.5 rounded-xl border border-white/10 flex items-center justify-between cursor-pointer transition-colors"
            >
              <div className="space-y-1">
                <span className="font-bold text-white text-xs block">NFe {inv.number}</span>
                <p className="text-xs text-white/80">{inv.recipient_name}</p>
                <p className="text-[11px] text-white/50">{inv.items_summary}</p>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-[#F9E27D] block">
                  R$ {inv.total_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] text-white/40 block mt-1">
                  {new Date(inv.created).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <InvoiceDetailModal
        invoice={selectedInvoice}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
      />

      <BottomNav />
    </FormPageLayout>
  )
}
