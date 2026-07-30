import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider, useAuth } from '@/hooks/use-auth'
import { SessionProvider, useSession } from '@/stores/session'
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
import InvoiceDetail from './pages/InvoiceDetail'
import Configuracoes from './pages/Configuracoes'
import Estatistica from './pages/Estatistica'
import CadastrarCliente from './pages/CadastrarCliente'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import ProtectedLayout from './components/ProtectedLayout'
import { NativeAppShell } from '@/components/NativeAppShell'

function SplashLoader() {
  return <div className="fixed inset-0 z-50 bg-[#002C45]" />
}

function ProtectedRoute({ children }: { children: React.JSX.Element }) {
  const { isAuthenticated, loading } = useAuth()
  const { isLoadingSession } = useSession()

  if (loading || isLoadingSession) {
    return <SplashLoader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

function RequireProperty({ children }: { children: React.JSX.Element }) {
  const { isAuthenticated, loading } = useAuth()
  const { activeProperty, isLoadingSession } = useSession()

  if (loading || isLoadingSession) {
    return <SplashLoader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!activeProperty) {
    return <Navigate to="/selecionar-propriedade" replace />
  }

  return children
}

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <SessionProvider>
        <NativeAppShell>
          <TooltipProvider>
            <Toaster /> <Sonner />
            <Routes>
              <Route path="/" element={<Login />} />
              <Route element={<Layout />}>
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
              </Route>
              <Route element={<ProtectedLayout />}>
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
                  path="/estatistica"
                  element={
                    <RequireProperty>
                      <Estatistica />
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
                  path="/consultar-nf/:invoiceId"
                  element={
                    <RequireProperty>
                      <InvoiceDetail />
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
        </NativeAppShell>
      </SessionProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
