import pb from '@/lib/pocketbase/client'
import { unmaskDocument, type ClientFormData } from '@/lib/client-utils'

export interface ClienteRecord {
  id: string
  user_id: string
  tipo_pessoa: 'FISICA' | 'JURIDICA'
  cpf_cnpj: string
  nome_razao_social: string
  nome_fantasia: string
  indicador_ie: string
  inscricao_estadual: string
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
  created: string
  updated: string
}

function sanitizePayload(data: Partial<ClientFormData>) {
  const payload: Record<string, unknown> = { ...data }
  if (payload.cpf_cnpj) payload.cpf_cnpj = unmaskDocument(payload.cpf_cnpj as string)
  if (payload.cep) payload.cep = unmaskDocument(payload.cep as string)
  return payload
}

export async function getClientes(): Promise<ClienteRecord[]> {
  return pb.collection('clientes').getFullList<ClienteRecord>({
    filter: pb.filter('user_id = {:userId}', { userId: pb.authStore.record?.id }),
    sort: 'nome_razao_social',
  })
}

export async function createCliente(data: ClientFormData): Promise<ClienteRecord> {
  return pb.collection('clientes').create<ClienteRecord>({
    ...sanitizePayload(data),
    user_id: pb.authStore.record?.id,
  })
}

export async function updateCliente(
  id: string,
  data: Partial<ClientFormData>,
): Promise<ClienteRecord> {
  return pb.collection('clientes').update<ClienteRecord>(id, sanitizePayload(data))
}

export async function deleteCliente(id: string): Promise<void> {
  return pb.collection('clientes').delete(id)
}

export async function checkDuplicateCpfCnpj(cpfCnpj: string, excludeId?: string): Promise<boolean> {
  const clean = unmaskDocument(cpfCnpj)
  if (!clean) return false
  const filter = excludeId
    ? pb.filter('user_id = {:userId} && cpf_cnpj = {:doc} && id != {:excludeId}', {
        userId: pb.authStore.record?.id,
        doc: clean,
        excludeId,
      })
    : pb.filter('user_id = {:userId} && cpf_cnpj = {:doc}', {
        userId: pb.authStore.record?.id,
        doc: clean,
      })
  const results = await pb.collection('clientes').getList(1, 1, { filter })
  return results.items.length > 0
}
