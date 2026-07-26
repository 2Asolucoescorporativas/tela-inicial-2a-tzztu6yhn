import { createContext, useContext, useState, ReactNode } from 'react'

const STORAGE_KEY = '2a-rural-active-property'
const DRAFT_KEY = '2a-rural-draft-invoice'
const RECIPIENT_KEY = '2a-rural-recipient'

export type OperationType = 'VENDA_LEITE' | 'VENDA_GADO'

export interface SessionProperty {
  id: string
  nome: string
  inscricao_estadual: string
  municipio: string
  uf: string
  codigo_ibge?: string
  endereco?: string
  numero?: string
  bairro?: string
  cep?: string
}

export interface SessionRecipient {
  cnpj: string
  razaoSocial: string
  ie: string
  logradouro: string
  numero: string
  bairro: string
  municipio: string
  uf: string
  cMun: string
}

export interface SelectedClient {
  id: string
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
}

export interface DraftInvoice {
  tipoOperacao: OperationType
  descricaoProduto: string
  unidadeComercial: string
  quantidade: number
  valorUnitario: number
  valorTotal: number
  userId: string
  cpf: string
  propertyId: string
  propertyName: string
  cadastroPro: string
  municipio: string
  uf: string
  clienteId?: string
  nNF?: string
  serie?: number
  nfeXml?: string
  nfeObject?: Record<string, unknown>
}

const DEFAULT_RECIPIENT: SessionRecipient = {
  cnpj: '12345678000190',
  razaoSocial: 'LATICÍNIOS BOA SORTE LTDA',
  ie: '123456789',
  logradouro: 'Rodovia BR-153',
  numero: 'Km 42',
  bairro: 'Zona Rural',
  municipio: 'Goiânia',
  uf: 'GO',
  cMun: '5208707',
}

interface SessionContextType {
  activeProperty: SessionProperty | null
  setActiveProperty: (prop: SessionProperty) => void
  clearActiveProperty: () => void
  operationType: OperationType | null
  setOperationType: (op: OperationType) => void
  clearOperationType: () => void
  draftInvoice: DraftInvoice | null
  setDraftInvoice: (draft: DraftInvoice) => void
  clearDraftInvoice: () => void
  recipient: SessionRecipient | null
  setRecipient: (r: SessionRecipient) => void
  clearRecipient: () => void
  selectedClient: SelectedClient | null
  setSelectedClient: (client: SelectedClient) => void
  clearSelectedClient: () => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used within SessionProvider')
  return ctx
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [activeProperty, setActivePropertyState] = useState<SessionProperty | null>(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      return stored ? (JSON.parse(stored) as SessionProperty) : null
    } catch {
      return null
    }
  })
  const [operationType, setOperationTypeState] = useState<OperationType | null>(null)
  const [draftInvoice, setDraftInvoiceState] = useState<DraftInvoice | null>(() => {
    try {
      const stored = sessionStorage.getItem(DRAFT_KEY)
      return stored ? (JSON.parse(stored) as DraftInvoice) : null
    } catch {
      return null
    }
  })
  const [recipient, setRecipientState] = useState<SessionRecipient | null>(() => {
    try {
      const stored = sessionStorage.getItem(RECIPIENT_KEY)
      return stored ? (JSON.parse(stored) as SessionRecipient) : DEFAULT_RECIPIENT
    } catch {
      return DEFAULT_RECIPIENT
    }
  })
  const [selectedClient, setSelectedClientState] = useState<SelectedClient | null>(() => {
    try {
      const stored = sessionStorage.getItem('2a-rural-selected-client')
      return stored ? (JSON.parse(stored) as SelectedClient) : null
    } catch {
      return null
    }
  })

  const setActiveProperty = (prop: SessionProperty) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(prop))
    setActivePropertyState(prop)
  }
  const clearActiveProperty = () => {
    sessionStorage.removeItem(STORAGE_KEY)
    setActivePropertyState(null)
  }
  const setOperationType = (op: OperationType) => setOperationTypeState(op)
  const clearOperationType = () => setOperationTypeState(null)
  const setDraftInvoice = (draft: DraftInvoice) => {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    setDraftInvoiceState(draft)
  }
  const clearDraftInvoice = () => {
    sessionStorage.removeItem(DRAFT_KEY)
    setDraftInvoiceState(null)
  }
  const setRecipient = (r: SessionRecipient) => {
    sessionStorage.setItem(RECIPIENT_KEY, JSON.stringify(r))
    setRecipientState(r)
  }
  const clearRecipient = () => {
    sessionStorage.removeItem(RECIPIENT_KEY)
    setRecipientState(null)
  }
  const setSelectedClient = (client: SelectedClient) => {
    sessionStorage.setItem('2a-rural-selected-client', JSON.stringify(client))
    setSelectedClientState(client)
  }
  const clearSelectedClient = () => {
    sessionStorage.removeItem('2a-rural-selected-client')
    setSelectedClientState(null)
  }

  return (
    <SessionContext.Provider
      value={{
        activeProperty,
        setActiveProperty,
        clearActiveProperty,
        operationType,
        setOperationType,
        clearOperationType,
        draftInvoice,
        setDraftInvoice,
        clearDraftInvoice,
        recipient,
        setRecipient,
        clearRecipient,
        selectedClient,
        setSelectedClient,
        clearSelectedClient,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}
