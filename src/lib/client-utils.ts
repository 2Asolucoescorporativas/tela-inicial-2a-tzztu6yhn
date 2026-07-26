import { isValidCpf, maskCpf } from '@/lib/cpf-utils'
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
  if (d.length <= 2) return d
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`
}

export function maskCep(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 8)
  return d.length <= 5 ? d : `${d.slice(0, 5)}-${d.slice(5)}`
}

export function unmaskDocument(value: string): string {
  return value.replace(/\D/g, '')
}

export function maskDocumentByType(value: string, tipo: 'FISICA' | 'JURIDICA'): string {
  return tipo === 'FISICA' ? maskCpf(value) : maskCnpj(value)
}

export function isValidCnpj(value: string): boolean {
  const d = unmaskDocument(value)
  if (d.length !== 14) return false
  if (/^(\d)\1{13}$/.test(d)) return false
  const calc = (weights: number[]) => {
    let sum = 0
    for (let i = 0; i < weights.length; i++) sum += parseInt(d[i]) * weights[i]
    const rest = sum % 11
    return rest < 2 ? 0 : 11 - rest
  }
  if (calc([5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) !== parseInt(d[12])) return false
  if (calc([6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) !== parseInt(d[13])) return false
  return true
}

export function sintegraToForm(data: SintegraData): ClientFormData {
  const ies = data.inscricoes_ativas || []
  let inscricaoEstadual = ''
  let tipoIe = ''
  let indicadorIe: ClientFormData['indicador_ie'] = '9'

  if (ies.length === 1) {
    inscricaoEstadual = ies[0].inscricao_estadual
    tipoIe = ies[0].tipo_ie
    indicadorIe = '1'
  } else if (ies.length > 1) {
    indicadorIe = '1'
  } else if (typeof data.inscricao_estadual === 'string' && data.inscricao_estadual) {
    inscricaoEstadual = data.inscricao_estadual
    tipoIe = data.tipo_ie || ''
    indicadorIe = '1'
  }

  return {
    tipo_pessoa: 'JURIDICA',
    cpf_cnpj: maskCnpj(unmaskDocument(data.cnpj)),
    nome_razao_social: data.razao_social || '',
    nome_fantasia: '',
    indicador_ie: indicadorIe,
    inscricao_estadual: inscricaoEstadual,
    tipo_ie: tipoIe,
    cep: maskCep(data.endereco?.cep || ''),
    logradouro: data.endereco?.logradouro || '',
    numero: data.endereco?.numero || '',
    complemento: data.endereco?.complemento || '',
    bairro: data.endereco?.bairro || '',
    municipio: data.endereco?.municipio || '',
    codigo_ibge: data.endereco?.codigo_ibge || '',
    uf: data.endereco?.uf || data.uf || '',
    pais: data.endereco?.pais || 'Brasil',
    codigo_pais: data.endereco?.codigo_pais || '1058',
    telefone: '',
    email: '',
  }
}

export function recordToForm(r: Record<string, unknown>): ClientFormData {
  return {
    tipo_pessoa: (r.tipo_pessoa as 'FISICA' | 'JURIDICA') || 'JURIDICA',
    cpf_cnpj: maskCnpj((r.cpf_cnpj as string) || ''),
    nome_razao_social: (r.nome_razao_social as string) || '',
    nome_fantasia: (r.nome_fantasia as string) || '',
    indicador_ie: ((r.indicador_ie as string) || '') as ClientFormData['indicador_ie'],
    inscricao_estadual: (r.inscricao_estadual as string) || '',
    tipo_ie: (r.tipo_ie as string) || '',
    cep: maskCep((r.cep as string) || ''),
    logradouro: (r.logradouro as string) || '',
    numero: (r.numero as string) || '',
    complemento: (r.complemento as string) || '',
    bairro: (r.bairro as string) || '',
    municipio: (r.municipio as string) || '',
    codigo_ibge: String(r.codigo_ibge ?? ''),
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
  const docDigits = unmaskDocument(form.cpf_cnpj)
  if (!docDigits) {
    errors.cpf_cnpj = 'CPF ou CNPJ é obrigatório'
  } else if (form.tipo_pessoa === 'FISICA' && !isValidCpf(form.cpf_cnpj)) {
    errors.cpf_cnpj = 'CPF inválido'
  } else if (form.tipo_pessoa === 'JURIDICA' && !isValidCnpj(form.cpf_cnpj)) {
    errors.cpf_cnpj = 'CNPJ inválido'
  }
  if (!form.nome_razao_social.trim())
    errors.nome_razao_social = 'Nome ou Razão Social é obrigatório'
  if (!form.indicador_ie) errors.indicador_ie = 'Selecione uma opção'
  if (form.indicador_ie === '1' && !form.inscricao_estadual.trim()) {
    errors.inscricao_estadual = 'Inscrição Estadual é obrigatória para contribuinte do ICMS'
  }
  const cepDigits = unmaskDocument(form.cep)
  if (cepDigits && cepDigits.length !== 8) errors.cep = 'CEP deve ter 8 dígitos'
  if (!form.logradouro.trim()) errors.logradouro = 'Logradouro é obrigatório'
  if (!form.numero.trim()) errors.numero = 'Número é obrigatório'
  if (!form.bairro.trim()) errors.bairro = 'Bairro é obrigatório'
  if (!form.municipio.trim()) errors.municipio = 'Município é obrigatório'
  const codigoIbgeStr =
    typeof form.codigo_ibge === 'string' ? form.codigo_ibge : String(form.codigo_ibge ?? '')
  if (!codigoIbgeStr.trim()) errors.codigo_ibge = 'Código IBGE é obrigatório'
  if (!form.uf.trim()) errors.uf = 'UF é obrigatório'
  return errors
}
