import pb from '@/lib/pocketbase/client'

export interface Cadastro {
  nome: string
  cpf: string
  inscricao_estadual: string
  situacao_ie: string
  tipo_ie: string
  municipio: string
  codigo_ibge: string
  uf: string
  cnae: string
  regime: string
  tipo_produtor: string
  situacao_cpf: string
  endereco?: string
}

export interface ConsultaCadastroResponse {
  success: boolean
  environment: string
  source: string
  quantidade: number
  cadastros: Cadastro[]
  consulta_id?: string
  ja_cadastrado?: boolean
  message?: string
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

export async function consultarCpf(cpf: string): Promise<ConsultaCadastroResponse> {
  return pb.send('/backend/v1/cadastro/consultar-cpf', {
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
