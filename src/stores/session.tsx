import { createContext, useContext, useState, ReactNode } from 'react'

const STORAGE_KEY = '2a-rural-active-property'

export interface SessionProperty {
  id: string
  nome: string
  inscricao_estadual: string
  municipio: string
  uf: string
}

interface SessionContextType {
  activeProperty: SessionProperty | null
  setActiveProperty: (prop: SessionProperty) => void
  clearActiveProperty: () => void
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

  const setActiveProperty = (prop: SessionProperty) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(prop))
    setActivePropertyState(prop)
  }

  const clearActiveProperty = () => {
    sessionStorage.removeItem(STORAGE_KEY)
    setActivePropertyState(null)
  }

  return (
    <SessionContext.Provider value={{ activeProperty, setActiveProperty, clearActiveProperty }}>
      {children}
    </SessionContext.Provider>
  )
}
