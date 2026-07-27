import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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
}

const STORAGE_KEY_PROPERTY = '2a_rural_active_property'

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export const useSession = () => {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [activeProperty, setActivePropertyState] = useState<SessionProperty | null>(null)
  const [selectedClient, setSelectedClient] = useState<SelectedClient | null>(null)
  const [operationType, setOperationType] = useState<OperationType | null>(null)
  const [draftInvoice, setDraftInvoice] = useState<DraftInvoice | null>(null)
  const [isLoadingSession, setIsLoadingSession] = useState(true)

  useEffect(() => {
    try {
      const storedProp = localStorage.getItem(STORAGE_KEY_PROPERTY)
      if (storedProp) {
        const parsed = JSON.parse(storedProp)
        if (parsed && typeof parsed === 'object' && parsed.id) {
          setActivePropertyState(parsed)
        }
      }
    } catch (e) {
      console.error('Error restoring session property:', e)
    } finally {
      setIsLoadingSession(false)
    }
  }, [])

  const setActiveProperty = (property: SessionProperty | null) => {
    setActivePropertyState(property)
    try {
      if (property) {
        localStorage.setItem(STORAGE_KEY_PROPERTY, JSON.stringify(property))
      } else {
        localStorage.removeItem(STORAGE_KEY_PROPERTY)
      }
    } catch (e) {
      console.error('Error saving active property to localStorage:', e)
    }
  }

  const clearSession = () => {
    setActivePropertyState(null)
    setSelectedClient(null)
    setOperationType(null)
    setDraftInvoice(null)
    try {
      localStorage.removeItem(STORAGE_KEY_PROPERTY)
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
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}
