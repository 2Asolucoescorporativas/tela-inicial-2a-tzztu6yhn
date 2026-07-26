export function parseCommaDecimal(value: string): number {
  if (!value || value.trim() === '') return NaN
  const normalized = value.replace(/\./g, '').replace(',', '.')
  const num = parseFloat(normalized)
  return isNaN(num) ? NaN : num
}

export function calculateTotal(quantity: number, unitPrice: number): number {
  const product = quantity * unitPrice
  return Math.round(product * 100) / 100
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function numberToCommaString(num: number): string {
  return num.toString().replace('.', ',')
}

export function sanitizeNumericInput(value: string, maxDecimals?: number): string {
  let v = value.replace(/\./g, ',').replace(/[^\d,]/g, '')
  const commaIndex = v.indexOf(',')
  if (commaIndex !== -1) {
    v = v.substring(0, commaIndex + 1) + v.substring(commaIndex + 1).replace(/,/g, '')
  }
  v = v.replace(/^0+(?=\d)/, '')
  if (maxDecimals !== undefined && commaIndex !== -1) {
    const parts = v.split(',')
    if (parts[1] && parts[1].length > maxDecimals) {
      v = parts[0] + ',' + parts[1].substring(0, maxDecimals)
    }
  }
  return v
}
