import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { getInvoices, InvoiceRecord } from '@/services/invoices'
import { useRealtime } from '@/hooks/use-realtime'
import { BottomNav } from '@/components/BottomNav'
import { NewInvoiceModal } from '@/components/NewInvoiceModal'
import { InvoiceDetailModal } from '@/components/InvoiceDetailModal'
import {
  FileText,
  PlusCircle,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowUpRight,
  Award,
  LogOut,
} from 'lucide-react'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([])
  const [loading, setLoading] = useState(true)

  const [newModalOpen, setNewModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)

  const loadData = async () => {
    try {
      const data = await getInvoices()
      setInvoices(data)
    } catch (err) {
      console.error(err)
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

  const totalEmitido = invoices.reduce((acc, curr) => acc + curr.total_value, 0)

  return (
    <div className="min-h-screen bg-[#002C45] text-white pb-24 max-w-md mx-auto sm:max-w-xl md:max-w-2xl relative">
      <div className="p-5 flex items-center justify-between border-b border-white/10 bg-[#001f31]/60 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold-gradient text-[#002C45] font-bold flex items-center justify-center text-lg shadow-sm">
            {user?.name ? user.name[0] : 'A'}
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">
              Olá, {user?.name || 'Alexandre'}
            </h2>
            <span className="text-[11px] text-[#F9E27D] font-medium">
              Produtor Rural • IE: 209/0123456
            </span>
          </div>
        </div>

        <button
          onClick={signOut}
          className="text-white/60 hover:text-red-300 p-2 rounded-lg hover:bg-white/5 transition-colors"
          title="Sair"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <div className="p-5 space-y-5 animate-fade-in">
        <div className="bg-gradient-to-br from-[#001f31] to-[#002f4a] p-4 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-white/60 font-medium uppercase tracking-wider">
                Volume Emitido (Mês)
              </span>
              <h3 className="text-2xl font-extrabold text-[#F9E27D] mt-1">
                R$ {totalEmitido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> SEFAZ Ativo
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-white/10 text-xs">
            <div>
              <span className="text-white/50 block">Notas Emitidas:</span>
              <span className="text-white font-bold text-sm">{invoices.length} NFes</span>
            </div>
            <div>
              <span className="text-white/50 block">Propriedade:</span>
              <span className="text-white font-bold text-sm truncate block">
                Fazenda Santa Luzia
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setNewModalOpen(true)}
          className="w-full bg-gold-gradient text-[#002C45] p-4 rounded-2xl font-bold flex items-center justify-between shadow-md hover:brightness-105 active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#002C45]/15 rounded-xl">
              <PlusCircle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="text-left">
              <span className="text-base block leading-tight">EMITIR NOVA NOTA FISCAL</span>
              <span className="text-xs font-medium text-[#002C45]/80">NFe Produtor Eletrônica</span>
            </div>
          </div>
          <ArrowUpRight className="w-6 h-6" />
        </button>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#F9E27D]" /> Notas Recentes
            </h3>
            <span className="text-xs text-[#F9E27D] font-medium">Tempo real</span>
          </div>

          {loading ? (
            <div className="py-8 text-center text-white/50 text-xs">
              Carregando notas fiscais...
            </div>
          ) : invoices.length === 0 ? (
            <div className="p-6 bg-[#001f31] rounded-2xl border border-white/10 text-center space-y-2">
              <p className="text-xs text-white/60">Nenhuma nota emitida ainda.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => {
                    setSelectedInvoice(inv)
                    setDetailModalOpen(true)
                  }}
                  className="bg-[#001f31] hover:bg-[#00283d] p-3.5 rounded-xl border border-white/10 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="space-y-1 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">NFe {inv.number}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                        {inv.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-white/80 line-clamp-1">{inv.recipient_name}</p>
                    <p className="text-[11px] text-white/50 line-clamp-1">{inv.items_summary}</p>
                  </div>

                  <div className="text-right min-w-[90px]">
                    <span className="text-xs font-bold text-[#F9E27D] block">
                      R$ {inv.total_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-white/40 block mt-0.5">
                      {new Date(inv.created).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <InvoiceDetailModal
        invoice={selectedInvoice}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
      />

      <NewInvoiceModal open={newModalOpen} onOpenChange={setNewModalOpen} onSuccess={loadData} />

      <BottomNav onNewInvoiceClick={() => setNewModalOpen(true)} />
    </div>
  )
}
