import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type OperationType = 'saida' | 'entrada' | 'leite' | 'gado' | string

export interface SessionProperty {
  id: string
  usuario_id?: string
  nome: string
  nome_normalizado?: string
  inscricao_estadual: string
  situacao_ie?: string
  tipo_ie?: string
  municipio?: string
  codigo_ibge?: string
  uf?: string
  endereco?: string
  cnae?: string
  tipo_produtor?: string
  ativo?: boolean
  numero?: string
  bairro?: string
  cep?: string
}

export interface SelectedClient {
  id: string
  tipo_pessoa: 'FISICA' | 'JURIDICA'
  cpf_cnpj: string
  nome_razao_social: string
  nome_fantasia?: string
  indicador_ie?: string
  inscricao_estadual?: string
  cep?: string
  logradouro?: string
  numero?: string
  complemento?: string
  bairro?: string
  municipio?: string
  codigo_ibge?: string
  uf?: string
  pais?: string
  codigo_pais?: string
  telefone?: string
  email?: string
  tipo_ie?: string
}

export interface DraftInvoice {
  property?: SessionProperty | null
  client?: SelectedClient | null
  operationType?: string
  items?: any[]
  totalValue?: number
  date?: string
  series?: string
  number?: string
  [key: string]: any
}

interface PersistedOperationState {
  draftInvoice: DraftInvoice | null
  selectedClient: SelectedClient | null
  operationType: OperationType | null
  timestamp: number
  status: 'em_andamento' | 'rascunho'
}

interface SessionContextType {
  activeProperty: SessionProperty | null
  setActiveProperty: (property: SessionProperty | null) => void
  selectedClient: SelectedClient | null
  setSelectedClient: (client: SelectedClient | null) => void
  operationType: OperationType | null
  setOperationType: (op: OperationType | null) => void
  draftInvoice: DraftInvoice | null
  setDraftInvoice: (draft: DraftInvoice | null) => void
  clearSession: () => void
  isLoadingSession: boolean
  operationStatus: 'idle' | 'em_andamento'
  pendingRestoration: PersistedOperationState | null
  clearPendingRestoration: () => void
  clearOperationState: () => void
  clearActiveProperty: () => void
  clearDraftInvoice: () => void
  clearSelectedClient: () => void
  clearOperationType: () => void
  clearRecipient: () => void
}

const STORAGE_KEY_PROPERTY = '2a_rural_active_property'
const STORAGE_KEY_OPERATION = '2a_rural_operation_state'
const OPERATION_MAX_AGE = 24 * 60 * 60 * 1000

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export const useSession = () => {
  const context = useContext(SessionContext)
  if (!context) throw new Error('useSession must be used within a SessionProvider')
  return context
}

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [activeProperty, setActivePropertyState] = useState<SessionProperty | null>(null)
  const [selectedClient, setSelectedClient] = useState<SelectedClient | null>(null)
  const [operationType, setOperationType] = useState<OperationType | null>(null)
  const [draftInvoice, setDraftInvoiceState] = useState<DraftInvoice | null>(null)
  const [operationStatus, setOperationStatus] = useState<'idle' | 'em_andamento'>('idle')
  const [pendingRestoration, setPendingRestoration] = useState<PersistedOperationState | null>(null)
  const [isLoadingSession, setIsLoadingSession] = useState(true)

  useEffect(() => {
    try {
      const storedProp = localStorage.getItem(STORAGE_KEY_PROPERTY)
      if (storedProp) {
        const parsed = JSON.parse(storedProp)
        if (parsed && typeof parsed === 'object' && parsed.id) setActivePropertyState(parsed)
      }
    } catch (e) {
      console.error('Error restoring session property:', e)
    }
    try {
      const storedOp = localStorage.getItem(STORAGE_KEY_OPERATION)
      if (storedOp) {
        const parsed: PersistedOperationState = JSON.parse(storedOp)
        if (Date.now() - parsed.timestamp > OPERATION_MAX_AGE || parsed.status !== 'em_andamento') {
          localStorage.removeItem(STORAGE_KEY_OPERATION)
        } else if (parsed.draftInvoice) {
          setDraftInvoiceState(parsed.draftInvoice)
          setSelectedClient(parsed.selectedClient)
          setOperationType(parsed.operationType)
          setOperationStatus('em_andamento')
          setPendingRestoration(parsed)
        }
      }
    } catch (e) {
      console.error('Error restoring operation state:', e)
      try {
        localStorage.removeItem(STORAGE_KEY_OPERATION)
      } catch {
        /* intentionally ignored */
      }
    }
    setIsLoadingSession(false)
  }, [])

  useEffect(() => {
    if (draftInvoice) {
      const state: PersistedOperationState = {
        draftInvoice,
        selectedClient,
        operationType,
        timestamp: Date.now(),
        status: 'em_andamento',
      }
      try {
        localStorage.setItem(STORAGE_KEY_OPERATION, JSON.stringify(state))
      } catch (e) {
        console.error('Error saving operation state:', e)
      }
    } else {
      try {
        localStorage.removeItem(STORAGE_KEY_OPERATION)
      } catch (e) {
        console.error('Error clearing operation state:', e)
      }
    }
  }, [draftInvoice, selectedClient, operationType])

  const setActiveProperty = (property: SessionProperty | null) => {
    setActivePropertyState(property)
    try {
      if (property) localStorage.setItem(STORAGE_KEY_PROPERTY, JSON.stringify(property))
      else localStorage.removeItem(STORAGE_KEY_PROPERTY)
    } catch (e) {
      console.error('Error saving active property:', e)
    }
  }

  const setDraftInvoice = (draft: DraftInvoice | null) => {
    setDraftInvoiceState(draft)
    if (draft === null) {
      setSelectedClient(null)
      setOperationType(null)
      setOperationStatus('idle')
    } else {
      setOperationStatus('em_andamento')
    }
  }

  const clearActiveProperty = () => setActiveProperty(null)
  const clearSelectedClient = () => setSelectedClient(null)
  const clearOperationType = () => setOperationType(null)
  const clearRecipient = () => setSelectedClient(null)
  const clearPendingRestoration = () => setPendingRestoration(null)

  const clearDraftInvoice = () => {
    setDraftInvoiceState(null)
    setSelectedClient(null)
    setOperationType(null)
    setOperationStatus('idle')
  }

  const clearOperationState = () => {
    setDraftInvoiceState(null)
    setSelectedClient(null)
    setOperationType(null)
    setOperationStatus('idle')
    try {
      localStorage.removeItem(STORAGE_KEY_OPERATION)
    } catch (e) {
      console.error('Error clearing operation state:', e)
    }
  }

  const clearSession = () => {
    setActivePropertyState(null)
    setSelectedClient(null)
    setOperationType(null)
    setDraftInvoiceState(null)
    setOperationStatus('idle')
    setPendingRestoration(null)
    try {
      localStorage.removeItem(STORAGE_KEY_PROPERTY)
      localStorage.removeItem(STORAGE_KEY_OPERATION)
    } catch (e) {
      console.error('Error clearing session storage:', e)
    }
  }

  return (
    <SessionContext.Provider
      value={{
        activeProperty,
        setActiveProperty,
        selectedClient,
        setSelectedClient,
        operationType,
        setOperationType,
        draftInvoice,
        setDraftInvoice,
        clearSession,
        isLoadingSession,
        operationStatus,
        pendingRestoration,
        clearPendingRestoration,
        clearOperationState,
        clearActiveProperty,
        clearDraftInvoice,
        clearSelectedClient,
        clearOperationType,
        clearRecipient,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}
