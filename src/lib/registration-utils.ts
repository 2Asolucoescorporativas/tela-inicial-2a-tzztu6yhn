import type { Cadastro } from '@/services/cadastro'

export function isPropertyEligible(cadastro: Cadastro): boolean {
  return cadastro.situacao_ie === 'Habilitado' && cadastro.tipo_ie === 'IE de Produtor Rural'
}

export function getIneligibilityReason(cadastro: Cadastro): string | null {
  if (cadastro.situacao_ie !== 'Habilitado') {
    return 'Esta inscrição não está habilitada.'
  }
  if (cadastro.tipo_ie !== 'IE de Produtor Rural') {
    return 'Esta inscrição não é classificada como IE de Produtor Rural.'
  }
  return null
}

export function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, ' ').toLowerCase()
}

export function validatePropertyName(name: string): string | null {
  const trimmed = name.trim()
  if (!trimmed) return 'O nome é obrigatório.'
  if (trimmed.length < 3) return 'O nome deve ter pelo menos 3 caracteres.'
  if (trimmed.length > 50) return 'O nome deve ter no máximo 50 caracteres.'
  if (!/^[a-zA-Z0-9À-ÿ\s]+$/.test(trimmed)) return 'Use apenas letras, números e espaços.'
  if (/^\d+$/.test(trimmed.replace(/\s/g, ''))) return 'O nome não pode conter apenas números.'
  if (trimmed.replace(/\s/g, '').length === 0) return 'O nome não pode conter apenas espaços.'
  return null
}

export function isAllSameDigits(password: string): boolean {
  return /^(\d)\1{5}$/.test(password)
}

export function isSimpleSequence(password: string): boolean {
  const ascending = '0123456789'
  const descending = '9876543210'
  return ascending.includes(password) || descending.includes(password)
}

export function isCpfSequence(password: string, cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '')
  if (digits.length < 11) return false
  return password === digits.slice(0, 6) || password === digits.slice(5, 11)
}

export function validatePassword(password: string, cpf: string): string | null {
  if (!password) return null
  if (!/^\d{6}$/.test(password)) return 'A senha deve possuir exatamente 6 dígitos numéricos.'
  if (isAllSameDigits(password) || isSimpleSequence(password) || isCpfSequence(password, cpf)) {
    return 'Crie uma senha numérica de 6 dígitos que não seja uma sequência simples ou repetida.'
  }
  return null
}

export function maskCpfPartial(cpf: string): string {
  const digits = cpf.replace(/\D/g, '')
  if (digits.length !== 11) return cpf
  return `***.***.***-${digits.slice(9)}`
}

export interface RegistrationFlowState {
  consulta_id: string
  cpf: string
  nomeUsuario: string
  selectedCadastros: Cadastro[]
  isMock: boolean
  propriedadeNomes?: { inscricao_estadual: string; nome: string }[]
  senha?: string
}
