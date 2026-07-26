import pb from '@/lib/pocketbase/client'

export interface Propriedade {
  inscricao_estadual: string
  uf: string
  ativa: boolean
  tipo_ie: string
  situacao_cadastral: string
  situacao_ie?: string
  data_status: string
  municipio: string
  codigo_municipio_ibge: string
  codigo_ibge?: string
  logradouro: string
  endereco?: string
  numero: string
  bairro: string
  cep: string
  elegivel_cadastro: boolean
  motivo_inegibilidade: string | null
}

export interface DebugInfo {
  response_keys: string[]
  record_count: number
  field_names: string[]
}

export interface ConsultaPropriedadesResponse {
  success: boolean
  consulta_id?: string
  cpf?: string
  nome?: string
  uf_consultada?: string
  origem?: string
  origem_cache?: boolean
  is_cache?: boolean
  quantidade_encontrada?: number
  quantidade_elegivel?: number
  propriedades?: Propriedade[]
  ja_cadastrado?: boolean
  message?: string
  error?: string
  debug_info?: DebugInfo
}

export interface ConcluirCadastroRequest {
  consulta_id: string
  cpf: string
  senha: string
  confirmacao_senha: string
  propriedades: {
    inscricao_estadual: string
    nome: string
  }[]
}

export interface ConcluirCadastroResponse {
  success: boolean
  message?: string
  error?: string
  quantidade_propriedades?: number
}

export async function consultarPropriedades(cpf: string): Promise<ConsultaPropriedadesResponse> {
  return pb.send('/backend/v1/cadastro/consultar-propriedades', {
    method: 'POST',
    body: JSON.stringify({ cpf }),
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function concluirCadastro(
  data: ConcluirCadastroRequest,
): Promise<ConcluirCadastroResponse> {
  return pb.send('/backend/v1/cadastro/concluir-cadastro', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })
}
