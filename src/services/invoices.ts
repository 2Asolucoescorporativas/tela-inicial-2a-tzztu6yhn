import pb from '@/lib/pocketbase/client'

export interface InvoiceRecord {
  id: string
  user_id: string
  number: string
  series: string
  producer_name: string
  cpf_cnpj: string
  ie_number?: string
  recipient_name: string
  recipient_document: string
  operation_type: 'saida' | 'entrada'
  total_value: number
  status: 'emitida' | 'processando' | 'cancelada' | 'rascunho'
  chavenfe?: string
  items_summary?: string
  created: string
  updated: string
}

export const getInvoices = async () => {
  const userId = pb.authStore.record?.id || ''
  return pb.collection('invoices').getFullList<InvoiceRecord>({
    sort: '-created',
    filter: `user_id = "${userId}"`,
  })
}

export const getInvoice = async (id: string) => {
  return pb.collection('invoices').getOne<InvoiceRecord>(id)
}

export const getNextInvoiceNumber = async (): Promise<{ number: string; series: string }> => {
  try {
    const res = await pb.send('/backend/v1/invoices/next-number', { method: 'GET' })
    return { number: res.nextNumber, series: res.series || '1' }
  } catch (_) {
    return { number: '000.001.206', series: '1' }
  }
}

export const createInvoice = async (data: Omit<InvoiceRecord, 'id' | 'created' | 'updated'>) => {
  return pb.collection('invoices').create<InvoiceRecord>(data)
}

export const updateInvoiceStatus = async (id: string, status: InvoiceRecord['status']) => {
  return pb.collection('invoices').update<InvoiceRecord>(id, { status })
}

export const cancelInvoice = async (id: string) => {
  return updateInvoiceStatus(id, 'cancelada')
}
