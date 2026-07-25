import pb from '@/lib/pocketbase/client'

export interface InscricaoEstadual {
  ie: string
  situacao_ie: string
  tipo_ie: string
  municipio: string
  uf: string
  codigo_ibge: string
  endereco: string
  bairro: string
  cep: string
  cnae: string
  data_inicio_atividade: string
  data_situacao_cadastral: string
  regime_tributacao: string
  credito_presumido: string
  tipo_produtor: string
}

export interface ConsultaCadastroResponse {
  cpf: string
  nome: string
  situacao_cpf: string
  inscricoes: InscricaoEstadual[]
}

export interface ConsultaCadastroError {
  error: string
  message: string
}

export async function consultarCpf(
  cpf: string,
): Promise<ConsultaCadastroResponse | ConsultaCadastroError> {
  return pb.send('/backend/v1/cadastro/consultar-cpf', {
    method: 'POST',
    body: JSON.stringify({ cpf }),
    headers: { 'Content-Type': 'application/json' },
  })
}
