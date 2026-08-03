export interface GadoSuboperacao {
  id: string
  label: string
}

export interface GadoOperacao {
  id: string
  label: string
  suboperacoes: GadoSuboperacao[]
}

export interface GadoTipoAnimal {
  id: string
  label: string
}

export const GADO_OPERACOES: GadoOperacao[] = [
  {
    id: 'VENDA',
    label: 'Venda',
    suboperacoes: [],
  },
  {
    id: 'TRANSFERENCIA_PROPRIEDADE',
    label: 'Transferência de Propriedade',
    suboperacoes: [
      { id: 'REMESSA', label: 'Remessa' },
      { id: 'RETORNO', label: 'Retorno' },
    ],
  },
  {
    id: 'LEILAO',
    label: 'Leilão',
    suboperacoes: [
      { id: 'REMESSA', label: 'Remessa' },
      { id: 'RETORNO', label: 'Retorno' },
      { id: 'VENDA', label: 'Venda' },
    ],
  },
  {
    id: 'EXPOSICAO',
    label: 'Exposição',
    suboperacoes: [
      { id: 'REMESSA', label: 'Remessa' },
      { id: 'RETORNO', label: 'Retorno' },
    ],
  },
]

export const GADO_TIPOS_ANIMAL: GadoTipoAnimal[] = [
  { id: 'BOVINO_MACHO', label: 'Bovino Macho' },
  { id: 'BOVINO_FEMEA', label: 'Bovino Fêmea' },
]

export function getOperacaoById(id: string): GadoOperacao | undefined {
  return GADO_OPERACOES.find((op) => op.id === id)
}

export function hasSuboperacoes(opId: string): boolean {
  const op = getOperacaoById(opId)
  return !!op && op.suboperacoes.length > 0
}
