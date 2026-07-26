import pb from '@/lib/pocketbase/client'

export interface Propriedade {
  inscricao_estadual: string
  uf: string
  ativa: boolean
  tipo_ie: string
  situacao_cadastral: string
  data_status: string
  municipio: string
  codigo_municipio_ibge: string
  logradouro: string
  numero: string
  bairro: string
  cep: string
  elegivel_cadastro: boolean
  motivo_inelegibilidade: string | null
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
}

export interface ConcluirCadastroRequest {
  consulta_id: string
  cpf: string
  senha: string
  confirmacao_senha: string
  propriedades: { inscricao_estadual: string; nome: string }[]
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
  return pb.send('/backend/v1/cadastro/concluir', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })
}
