import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import pb from '@/lib/pocketbase/client'

interface AuthUser {
  id: string
  email: string
  name?: string
  avatar?: string
  cpf?: string
}

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signInWithCpf: (cpf: string, password: string) => Promise<{ error: any }>
  signOut: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(
    pb.authStore.isValid ? (pb.authStore.record as unknown as AuthUser) : null,
  )
  const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange((_token, record) => {
      setUser(pb.authStore.isValid ? (record as unknown as AuthUser) : null)
      setIsAuthenticated(pb.authStore.isValid)
    })

    if (pb.authStore.isValid) {
      pb.collection('users')
        .authRefresh()
        .catch(() => pb.authStore.clear())
        .finally(() => setLoading(false))
    } else {
      if (pb.authStore.record) pb.authStore.clear()
      setLoading(false)
    }

    return () => {
      unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string) => {
    try {
      await pb.collection('users').create({ email, password, passwordConfirm: password })
      await pb.collection('users').authWithPassword(email, password)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      await pb.collection('users').authWithPassword(email, password)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signInWithCpf = async (cpf: string, password: string) => {
    try {
      const cleanCpf = cpf.replace(/\D/g, '')
      const result = await pb.send('/backend/v1/auth/cpf', {
        method: 'POST',
        body: JSON.stringify({ cpf: cleanCpf, password }),
        headers: { 'Content-Type': 'application/json' },
      })
      pb.authStore.save(result.token, result.record)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signOut = () => {
    sessionStorage.removeItem('2a-rural-active-property')
    pb.authStore.clear()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        signUp,
        signIn,
        signInWithCpf,
        signOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
