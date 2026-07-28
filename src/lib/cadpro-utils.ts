export function maskCadPro(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  if (digits.length <= 8) return digits
  return `${digits.slice(0, 8)}-${digits.slice(8)}`
}

export function unmaskCadPro(value: string): string {
  return value.replace(/\D/g, '')
}
