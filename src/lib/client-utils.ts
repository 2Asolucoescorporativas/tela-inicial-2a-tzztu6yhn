import type { SintegraData } from '@/services/clientes'

export interface ClientFormData {
  tipo_pessoa: 'FISICA' | 'JURIDICA'
  cpf_cnpj: string
  nome_razao_social: string
  nome_fantasia: string
  indicador_ie: '' | '1' | '2' | '9'
  inscricao_estadual: string
  tipo_ie: string
  cep: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  municipio: string
  codigo_ibge: string
  uf: string
  pais: string
  codigo_pais: string
  telefone: string
  email: string
}

export function maskCnpj(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 14)
  return d
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

export function maskCep(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 8)
  if (d.length <= 5) return d
  return d.slice(0, 5) + '-' + d.slice(5)
}

export function unmaskDocument(value: string): string {
  return value.replace(/\D/g, '')
}

export function maskDocumentByType(value: string, tipo: 'FISICA' | 'JURIDICA'): string {
  const d = unmaskDocument(value)
  if (tipo === 'FISICA') {
    return d
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d{1,2})$/, '$1-$2')
  }
  return maskCnpj(d)
}

export function isValidCnpj(value: string): boolean {
  const cnpj = unmaskDocument(value)
  if (cnpj.length !== 14) return false
  if (/^(\d)\1{13}$/.test(cnpj)) return false

  const calc = (slice: string, weights: number[]): number => {
    let sum = 0
    for (let i = 0; i < slice.length; i++) {
      sum += parseInt(slice[i], 10) * weights[i]
    }
    const rest = sum % 11
    return rest < 2 ? 0 : 11 - rest
  }

  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const d1 = calc(cnpj.slice(0, 12), w1)
  const d2 = calc(cnpj.slice(0, 12) + String(d1), w2)
  return cnpj === cnpj.slice(0, 12) + String(d1) + String(d2)
}

export function sintegraToForm(data: SintegraData): ClientFormData {
  const end = data.endereco
  const ie = Array.isArray(data.inscricao_estadual)
    ? data.inscricao_estadual[0] || ''
    : data.inscricao_estadual || ''

  return {
    tipo_pessoa: 'JURIDICA',
    cpf_cnpj: data.cnpj || '',
    nome_razao_social: data.razao_social || '',
    nome_fantasia: '',
    indicador_ie: data.ativa ? '1' : '9',
    inscricao_estadual: ie,
    tipo_ie: data.tipo_ie || '',
    cep: end?.cep || '',
    logradouro: end?.logradouro || '',
    numero: end?.numero || '',
    complemento: end?.complemento || '',
    bairro: end?.bairro || '',
    municipio: end?.municipio || '',
    codigo_ibge: end?.codigo_ibge || '',
    uf: end?.uf || '',
    pais: end?.pais || 'Brasil',
    codigo_pais: end?.codigo_pais || '1058',
    telefone: '',
    email: '',
  }
}

export function recordToForm(r: Record<string, unknown>): ClientFormData {
  return {
    tipo_pessoa: (r.tipo_pessoa as 'FISICA' | 'JURIDICA') || 'JURIDICA',
    cpf_cnpj: (r.cpf_cnpj as string) || '',
    nome_razao_social: (r.nome_razao_social as string) || '',
    nome_fantasia: (r.nome_fantasia as string) || '',
    indicador_ie: (r.indicador_ie as '' | '1' | '2' | '9') || '',
    inscricao_estadual: (r.inscricao_estadual as string) || '',
    tipo_ie: (r.tipo_ie as string) || '',
    cep: (r.cep as string) || '',
    logradouro: (r.logradouro as string) || '',
    numero: (r.numero as string) || '',
    complemento: (r.complemento as string) || '',
    bairro: (r.bairro as string) || '',
    municipio: (r.municipio as string) || '',
    codigo_ibge: (r.codigo_ibge as string) || '',
    uf: (r.uf as string) || '',
    pais: (r.pais as string) || 'Brasil',
    codigo_pais: (r.codigo_pais as string) || '1058',
    telefone: (r.telefone as string) || '',
    email: (r.email as string) || '',
  }
}

export function getDefaultClientForm(): ClientFormData {
  return {
    tipo_pessoa: 'JURIDICA',
    cpf_cnpj: '',
    nome_razao_social: '',
    nome_fantasia: '',
    indicador_ie: '',
    inscricao_estadual: '',
    tipo_ie: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    municipio: '',
    codigo_ibge: '',
    uf: '',
    pais: 'Brasil',
    codigo_pais: '1058',
    telefone: '',
    email: '',
  }
}

export function validateClientForm(form: ClientFormData): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!form.nome_razao_social?.trim()) errors.nome_razao_social = 'Nome/Razão social é obrigatório'
  if (!form.cpf_cnpj?.trim()) errors.cpf_cnpj = 'CNPJ é obrigatório'
  if (form.indicador_ie !== '9' && !form.inscricao_estadual?.trim())
    errors.inscricao_estadual = 'Inscrição estadual é obrigatória para contribuintes'
  if (!form.cep?.trim()) errors.cep = 'CEP é obrigatório'
  if (!form.logradouro?.trim()) errors.logradouro = 'Logradouro é obrigatório'
  if (!form.numero?.trim()) errors.numero = 'Número é obrigatório'
  if (!form.bairro?.trim()) errors.bairro = 'Bairro é obrigatório'
  if (!form.municipio?.trim()) errors.municipio = 'Município é obrigatório'
  if (!form.uf?.trim()) errors.uf = 'UF é obrigatório'
  if (!form.codigo_ibge?.trim()) errors.codigo_ibge = 'Código IBGE é obrigatório'

  return errors
}
