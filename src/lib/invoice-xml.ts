import type { InvoiceRecord } from '@/services/invoices'

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function generateInvoiceXml(invoice: InvoiceRecord): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe">
  <NFe>
    <infNFe versao="4.00" Id="${esc(invoice.chavenfe || '')}">
      <ide>
        <nNF>${esc(invoice.number)}</nNF>
        <serie>${esc(invoice.series)}</serie>
        <dhEmi>${invoice.created}</dhEmi>
        <tpNF>${invoice.operation_type === 'saida' ? '1' : '0'}</tpNF>
      </ide>
      <emit>
        <xNome>${esc(invoice.producer_name)}</xNome>
        <CPF>${esc(invoice.cpf_cnpj)}</CPF>
        ${invoice.ie_number ? `<IE>${esc(invoice.ie_number)}</IE>` : ''}
      </emit>
      <dest>
        <xNome>${esc(invoice.recipient_name)}</xNome>
        <CNPJ>${esc(invoice.recipient_document)}</CNPJ>
      </dest>
      <det nItem="1">
        <prod>
          <xProd>${esc(invoice.items_summary || 'Produto Rural')}</xProd>
        </prod>
      </det>
      <total>
        <ICMSTot>
          <vNF>${invoice.total_value.toFixed(2)}</vNF>
        </ICMSTot>
      </total>
    </infNFe>
  </NFe>
</nfeProc>`
}

export function downloadInvoiceXml(invoice: InvoiceRecord): void {
  const xml = generateInvoiceXml(invoice)
  const blob = new Blob([xml], { type: 'application/xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `NFe-${invoice.number}.xml`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function printDanfe(invoice: InvoiceRecord): void {
  const win = window.open('', '_blank', 'width=800,height=600')
  if (!win) return

  const date = new Date(invoice.created).toLocaleDateString('pt-BR')
  const value = invoice.total_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })

  win.document.write(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>DANFE - NFe ${invoice.number}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Courier New', monospace; padding: 20px; font-size: 12px; }
    .header { display: flex; justify-content: space-between; border: 2px solid #000; padding: 10px; margin-bottom: 10px; }
    .section { border: 1px solid #000; padding: 10px; margin-bottom: 5px; }
    .section-title { font-weight: bold; background: #f0f0f0; padding: 3px 5px; margin: -10px -10px 5px; }
    .row { display: flex; justify-content: space-between; margin-bottom: 3px; }
    .total { font-size: 14px; font-weight: bold; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h2>DANFE - DOCUMENTO AUXILIAR DA NFe</h2>
      <p>NFe: ${invoice.number} | Serie: ${invoice.series}</p>
    </div>
    <div style="text-align: right;">
      <p>Status: ${invoice.status.toUpperCase()}</p>
      <p>Emissao: ${date}</p>
    </div>
  </div>
  <div class="section">
    <div class="section-title">EMITENTE</div>
    <div class="row"><span>Nome:</span><span>${invoice.producer_name}</span></div>
    <div class="row"><span>CPF/CNPJ:</span><span>${invoice.cpf_cnpj}</span></div>
    ${invoice.ie_number ? `<div class="row"><span>Insc. Estadual:</span><span>${invoice.ie_number}</span></div>` : ''}
  </div>
  <div class="section">
    <div class="section-title">DESTINATARIO</div>
    <div class="row"><span>Nome/Razao Social:</span><span>${invoice.recipient_name}</span></div>
    <div class="row"><span>CPF/CNPJ:</span><span>${invoice.recipient_document}</span></div>
  </div>
  <div class="section">
    <div class="section-title">PRODUTO</div>
    <div class="row"><span>Descricao:</span><span>${invoice.items_summary || 'Produto Rural'}</span></div>
  </div>
  <div class="section total">
    <div class="row"><span>VALOR TOTAL:</span><span>R$ ${value}</span></div>
  </div>
  ${invoice.chavenfe ? `<div class="section"><div class="section-title">CHAVE DE ACESSO</div><p style="word-break: break-all; font-family: monospace;">${invoice.chavenfe}</p></div>` : ''}
</body>
</html>`)
  win.document.close()
  win.focus()
  setTimeout(() => win.print(), 500)
}
