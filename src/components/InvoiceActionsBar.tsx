import { InvoiceRecord } from '@/services/invoices'
import { Download, Printer, Send, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InvoiceActionsBarProps {
  invoice: InvoiceRecord
  onDownloadXml: () => void
  onPrintDanfe: () => void
  onSend: () => void
  onCancel: () => void
}

export function InvoiceActionsBar({
  invoice,
  onDownloadXml,
  onPrintDanfe,
  onSend,
  onCancel,
}: InvoiceActionsBarProps) {
  const canDownloadXml = invoice.status === 'emitida' || invoice.status === 'cancelada'
  const canPrintDanfe = invoice.status === 'emitida' || invoice.status === 'cancelada'
  const canSend = invoice.status === 'rascunho' || invoice.status === 'processando'
  const canCancel = invoice.status === 'emitida'

  const actions = [
    { label: 'Baixar XML', icon: Download, onClick: onDownloadXml, enabled: canDownloadXml },
    { label: 'DANFE', icon: Printer, onClick: onPrintDanfe, enabled: canPrintDanfe },
    { label: 'Enviar', icon: Send, onClick: onSend, enabled: canSend },
    { label: 'Cancelar', icon: XCircle, onClick: onCancel, enabled: canCancel },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#001f31]/95 backdrop-blur-md border-t border-white/10 px-4 py-3 max-w-md mx-auto sm:max-w-xl animate-fade-in-up">
      <div className="grid grid-cols-4 gap-2">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.label}
              onClick={action.onClick}
              disabled={!action.enabled}
              className={cn(
                'flex flex-col items-center gap-1 py-2 rounded-xl transition-all duration-150',
                action.enabled
                  ? 'bg-white/10 text-white hover:bg-white/20 active:scale-95'
                  : 'bg-white/5 text-white/25 cursor-not-allowed',
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{action.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
