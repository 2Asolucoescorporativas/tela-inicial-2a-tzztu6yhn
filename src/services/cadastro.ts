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
}

export interface ConsultaCadastroResponse {
  success: boolean
  environment: string
  source: string
  quantidade: number
  cadastros: Cadastro[]
}

export async function consultarCpf(cpf: string): Promise<ConsultaCadastroResponse> {
  return pb.send('/backend/v1/cadastro/consultar-cpf', {
    method: 'POST',
    body: JSON.stringify({ cpf }),
    headers: { 'Content-Type': 'application/json' },
  })
}
