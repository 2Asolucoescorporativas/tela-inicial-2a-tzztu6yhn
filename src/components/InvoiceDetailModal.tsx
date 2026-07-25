import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { InvoiceRecord } from '@/services/invoices'
import { Download, Printer, CheckCircle, FileText, Share2 } from 'lucide-react'

interface InvoiceDetailModalProps {
  invoice: InvoiceRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InvoiceDetailModal({ invoice, open, onOpenChange }: InvoiceDetailModalProps) {
  if (!invoice) return null

  const handleSimulateDownload = () => {
    alert(`Download do XML/PDF da NFe nº ${invoice.number} iniciado!`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#002C45] text-white border-white/10 max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-[#F9E27D] flex items-center justify-between">
            <span>NFe Nº {invoice.number}</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Autorizada SEFAZ
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-xs mt-1">
          <div className="bg-[#001f31] p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-[#F9E27D] font-medium block">Chave de Acesso NFe</span>
            <p className="font-mono text-[11px] text-white/80 break-all select-all">
              {invoice.chavenfe || '35260712345678900019055001000001204198273645'}
            </p>
          </div>

          <div className="bg-[#001f31]/60 p-3 rounded-xl border border-white/10 space-y-2">
            <div className="flex justify-between border-b border-white/10 pb-1.5">
              <span className="text-white/60">Emitente:</span>
              <span className="font-medium text-white text-right">{invoice.producer_name}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-1.5">
              <span className="text-white/60">Inscrição Estadual:</span>
              <span className="font-medium text-white">{invoice.ie_number || '209/0123456'}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-1.5">
              <span className="text-white/60">Destinatário:</span>
              <span className="font-medium text-white text-right">{invoice.recipient_name}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-1.5">
              <span className="text-white/60">Documento:</span>
              <span className="font-medium text-white">{invoice.recipient_document}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-white/60">Valor Total:</span>
              <span className="text-base font-bold text-[#F9E27D]">
                R$ {invoice.total_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="bg-[#001f31]/60 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-white/60 block">Produtos / Serviços:</span>
            <p className="text-white/90 leading-relaxed">
              {invoice.items_summary || 'Produto Agrícola In Natura'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button
              onClick={handleSimulateDownload}
              className="bg-[#001f31] hover:bg-[#00263f] text-white border border-white/15 h-10 flex items-center justify-center gap-1.5 rounded-xl"
            >
              <Download className="w-4 h-4 text-[#F9E27D]" />
              <span>Baixar PDF</span>
            </Button>
            <Button
              onClick={handleSimulateDownload}
              className="bg-gold-gradient text-[#002C45] font-bold h-10 flex items-center justify-center gap-1.5 rounded-xl"
            >
              <Share2 className="w-4 h-4" />
              <span>Compartilhar</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
