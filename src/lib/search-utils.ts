export function normalizeForSearch(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function filterClientsBySearch<
  T extends {
    nome_razao_social: string
    nome_fantasia?: string
    cpf_cnpj: string
    municipio?: string
  },
>(clients: T[], query: string): T[] {
  if (!query.trim()) return clients
  const q = normalizeForSearch(query)
  const digits = query.replace(/\D/g, '')
  return clients.filter((c) => {
    const textMatch =
      normalizeForSearch(c.nome_razao_social).includes(q) ||
      normalizeForSearch(c.nome_fantasia || '').includes(q) ||
      normalizeForSearch(c.municipio || '').includes(q)
    const digitMatch = digits.length > 0 && c.cpf_cnpj.replace(/\D/g, '').includes(digits)
    return textMatch || digitMatch
  })
}
