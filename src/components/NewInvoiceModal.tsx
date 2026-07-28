import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getNextInvoiceNumber, createInvoice } from '@/services/invoices'
import { Loader2, Plus, Trash2, CheckCircle2 } from 'lucide-react'
import { primaryButtonStyle, secondaryButtonStyle } from '@/lib/button-styles'

interface NewInvoiceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

interface ItemRow {
  description: string
  quantity: number
  unit: string
  unitPrice: number
}

export function NewInvoiceModal({ open, onOpenChange, onSuccess }: NewInvoiceModalProps) {
  const [loading, setLoading] = useState(false)
  const [nextNumber, setNextNumber] = useState('000.001.206')
  const [series, setSeries] = useState('1')

  const [recipientName, setRecipientName] = useState('Cooperativa Agropecuária Regional')
  const [recipientDocument, setRecipientDocument] = useState('12.345.678/0001-90')
  const [operationType, setOperationType] = useState<'saida' | 'entrada'>('saida')

  const [items, setItems] = useState<ItemRow[]>([
    { description: 'Milho em Grão Ensacado (60kg)', quantity: 500, unit: 'Saca', unitPrice: 85.0 },
  ])

  useEffect(() => {
    if (open) {
      getNextInvoiceNumber().then((res) => {
        setNextNumber(res.nextNumber)
        setSeries(res.series)
      })
    }
  }, [open])

  const handleAddItem = () => {
    setItems([
      ...items,
      { description: 'Soja em Grão (60kg)', quantity: 100, unit: 'Saca', unitPrice: 125.0 },
    ])
  }

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const handleItemChange = (index: number, field: keyof ItemRow, value: any) => {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }
    setItems(updated)
  }

  const totalValue = items.reduce((acc, curr) => acc + curr.quantity * curr.unitPrice, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const summary = items.map((i) => `${i.quantity} ${i.unit}s de ${i.description}`).join(', ')
      const randomChave = `352607${Math.floor(10000000000000000000000000000000000000 + Math.random() * 90000000000000000000000000000000000000)}`

      await createInvoice({
        user_id: '', // handle by backend user auth or set
        number: nextNumber,
        series: series,
        producer_name: 'Alexandre Silva - Fazenda Santa Luzia',
        cpf_cnpj: '123.456.789-00',
        ie_number: '209/0123456',
        recipient_name: recipientName,
        recipient_document: recipientDocument,
        operation_type: operationType,
        total_value: totalValue,
        status: 'emitida',
        chavenfe: randomChave.slice(0, 44),
        items_summary: summary,
      })

      onSuccess()
      onOpenChange(false)
    } catch (err) {
      console.error('Erro ao emitir nota fiscal:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#002C45] text-white border-white/10 max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#F9E27D] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Emissão de Nota Fiscal de Produtor
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm mt-2">
          <div className="grid grid-cols-2 gap-3 bg-[#001f31] p-3 rounded-xl border border-white/10">
            <div>
              <Label className="text-xs text-white/60">Número NFe</Label>
              <Input
                value={nextNumber}
                readOnly
                className="bg-transparent border-none text-[#F9E27D] font-bold text-base p-0 h-auto focus-visible:ring-0"
              />
            </div>
            <div>
              <Label className="text-xs text-white/60">Série</Label>
              <Input
                value={series}
                readOnly
                className="bg-transparent border-none text-white font-semibold text-base p-0 h-auto focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-white/80">Tipo de Operação</Label>
            <Select
              value={operationType}
              onValueChange={(val: 'saida' | 'entrada') => setOperationType(val)}
            >
              <SelectTrigger className="bg-[#001f31] border-white/15 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#001f31] text-white border-white/10">
                <SelectItem value="saida">Saída (Venda / Transferência)</SelectItem>
                <SelectItem value="entrada">Entrada (Devolução / Compra)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 bg-[#001f31]/60 p-3 rounded-xl border border-white/10">
            <h4 className="text-xs font-semibold text-[#F9E27D] uppercase tracking-wider">
              Destinatário
            </h4>
            <div>
              <Label className="text-xs text-white/70">Nome / Razão Social</Label>
              <Input
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                required
                className="bg-[#001f31] border-white/15 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-white/70">CPF / CNPJ</Label>
              <Input
                value={recipientDocument}
                onChange={(e) => setRecipientDocument(e.target.value)}
                required
                className="bg-[#001f31] border-white/15 text-white mt-1"
              />
            </div>
          </div>

          <div className="space-y-3 bg-[#001f31]/60 p-3 rounded-xl border border-white/10">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-[#F9E27D] uppercase tracking-wider">
                Produtos Rurais
              </h4>
              <Button
                type="button"
                size="sm"
                onClick={handleAddItem}
                className="hover:bg-[#C89B51]/10 transition-colors flex items-center gap-1"
                style={{
                  ...secondaryButtonStyle,
                  height: 'auto',
                  minHeight: '32px',
                  fontSize: '12px',
                  padding: '0 12px',
                }}
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar
              </Button>
            </div>

            {items.map((item, index) => (
              <div
                key={index}
                className="space-y-2 bg-[#001f31] p-2.5 rounded-lg border border-white/10"
              >
                <div className="flex items-center justify-between gap-2">
                  <Input
                    placeholder="Descrição do produto (ex: Milho, Soja, Leite)"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    required
                    className="bg-[#002C45] border-white/15 text-xs text-white h-8"
                  />
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-[10px] text-white/60">Qtd.</Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)
                      }
                      required
                      className="bg-[#002C45] border-white/15 text-xs text-white h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-white/60">Unidade</Label>
                    <Input
                      value={item.unit}
                      onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                      required
                      className="bg-[#002C45] border-white/15 text-xs text-white h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-white/60">Valor Un. (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)
                      }
                      required
                      className="bg-[#002C45] border-white/15 text-xs text-white h-8"
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-2 border-t border-white/10">
              <span className="text-xs text-white/70">Valor Total da Nota:</span>
              <span className="text-lg font-bold text-[#F9E27D]">
                R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full hover:brightness-105 active:scale-95 transition-all"
            style={primaryButtonStyle}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Processando NFe na SEFAZ...
              </span>
            ) : (
              'TRANSMITIR E EMITIR NOTA'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
