import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider, useAuth } from '@/hooks/use-auth'
import { SessionProvider, useSession } from '@/stores/session'

import Index from './pages/Index'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import InvoiceHistory from './pages/InvoiceHistory'
import ProducerProfile from './pages/ProducerProfile'
import ForgotPassword from './pages/ForgotPassword'
import Register from './pages/Register'
import RegisterResultados from './pages/RegisterResultados'
import RegisterPropriedades from './pages/RegisterPropriedades'
import RegisterSenha from './pages/RegisterSenha'
import RegisterRevisao from './pages/RegisterRevisao'
import SelectProperty from './pages/SelectProperty'
import NotaFiscal from './pages/NotaFiscal'
import EmitirNF from './pages/EmitirNF'
import SelectClient from './pages/SelectClient'
import EmitirLeite from './pages/EmitirLeite'
import EmitirGado from './pages/EmitirGado'
import EmitirLeiteNext from './pages/EmitirLeiteNext'
import ConsultarNF from './pages/ConsultarNF'
import Configuracoes from './pages/Configuracoes'
import CadastrarCliente from './pages/CadastrarCliente'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'

function ProtectedRoute({ children }: { children: React.JSX.Element }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

function RequireProperty({ children }: { children: React.JSX.Element }) {
  const { isAuthenticated, loading } = useAuth()
  const { activeProperty } = useSession()
  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!activeProperty) return <Navigate to="/selecionar-propriedade" replace />
  return children
}

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <SessionProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/register" element={<Register />} />
              <Route path="/register/resultados" element={<RegisterResultados />} />
              <Route path="/register/propriedades" element={<RegisterPropriedades />} />
              <Route path="/register/senha" element={<RegisterSenha />} />
              <Route path="/register/revisao" element={<RegisterRevisao />} />

              <Route
                path="/selecionar-propriedade"
                element={
                  <ProtectedRoute>
                    <SelectProperty />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <RequireProperty>
                    <Dashboard />
                  </RequireProperty>
                }
              />
              <Route
                path="/nota-fiscal"
                element={
                  <RequireProperty>
                    <NotaFiscal />
                  </RequireProperty>
                }
              />
              <Route
                path="/configuracoes"
                element={
                  <RequireProperty>
                    <Configuracoes />
                  </RequireProperty>
                }
              />
              <Route
                path="/cadastrar-cliente"
                element={
                  <RequireProperty>
                    <CadastrarCliente />
                  </RequireProperty>
                }
              />
              <Route
                path="/emitir-nf"
                element={
                  <RequireProperty>
                    <EmitirNF />
                  </RequireProperty>
                }
              />
              <Route
                path="/emitir-leite/selecionar-cliente"
                element={
                  <RequireProperty>
                    <SelectClient />
                  </RequireProperty>
                }
              />
              <Route
                path="/emitir-leite"
                element={
                  <RequireProperty>
                    <EmitirLeite />
                  </RequireProperty>
                }
              />
              <Route
                path="/emitir-leite/next"
                element={
                  <RequireProperty>
                    <EmitirLeiteNext />
                  </RequireProperty>
                }
              />
              <Route
                path="/emitir-gado"
                element={
                  <RequireProperty>
                    <EmitirGado />
                  </RequireProperty>
                }
              />
              <Route
                path="/consultar-nf"
                element={
                  <RequireProperty>
                    <ConsultarNF />
                  </RequireProperty>
                }
              />
              <Route
                path="/historico"
                element={
                  <RequireProperty>
                    <InvoiceHistory />
                  </RequireProperty>
                }
              />
              <Route
                path="/perfil"
                element={
                  <RequireProperty>
                    <ProducerProfile />
                  </RequireProperty>
                }
              />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </SessionProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
