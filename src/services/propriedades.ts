import pb from '@/lib/pocketbase/client'

export interface PropriedadeRecord {
  id: string
  nome: string
  nome_normalizado: string
  inscricao_estadual: string
  situacao_ie: string
  tipo_ie: string
  municipio: string
  codigo_ibge: string
  uf: string
  endereco: string
  numero: string
  bairro: string
  cep: string
  cnae: string
  tipo_produtor: string
  ativo: boolean
  created: string
  updated: string
}

export async function getPropriedades(): Promise<PropriedadeRecord[]> {
  return pb.collection('propriedades').getFullList({
    filter: pb.filter('usuario_id = {:userId}', { userId: pb.authStore.record?.id }),
    sort: 'nome',
  })
}
