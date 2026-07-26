import { createContext, useContext, useState, ReactNode } from 'react'

const STORAGE_KEY = '2a-rural-active-property'
const DRAFT_KEY = '2a-rural-draft-invoice'

export type OperationType = 'VENDA_LEITE' | 'VENDA_GADO'

export interface SessionProperty {
  id: string
  nome: string
  inscricao_estadual: string
  municipio: string
  uf: string
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

  const setActiveProperty = (prop: SessionProperty) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(prop))
    setActivePropertyState(prop)
  }

  const clearActiveProperty = () => {
    sessionStorage.removeItem(STORAGE_KEY)
    setActivePropertyState(null)
  }

  const setOperationType = (op: OperationType) => {
    setOperationTypeState(op)
  }

  const clearOperationType = () => {
    setOperationTypeState(null)
  }

  const setDraftInvoice = (draft: DraftInvoice) => {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    setDraftInvoiceState(draft)
  }

  const clearDraftInvoice = () => {
    sessionStorage.removeItem(DRAFT_KEY)
    setDraftInvoiceState(null)
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
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}
