import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider, useAuth } from '@/hooks/use-auth'
import { SessionProvider, useSession } from '@/stores/session'
import Login from './pages/Login'
import Layout from './components/Layout'
import ProtectedLayout from './components/ProtectedLayout'
import { NativeAppShell } from '@/components/NativeAppShell'
import { PwaIntegrityGuard } from '@/components/PwaIntegrityGuard'
import { Loader2 } from 'lucide-react'

const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const Register = lazy(() => import('./pages/Register'))
const RegisterResultados = lazy(() => import('./pages/RegisterResultados'))
const RegisterPropriedades = lazy(() => import('./pages/RegisterPropriedades'))
const RegisterSenha = lazy(() => import('./pages/RegisterSenha'))
const RegisterRevisao = lazy(() => import('./pages/RegisterRevisao'))
const SelectProperty = lazy(() => import('./pages/SelectProperty'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const InvoiceHistory = lazy(() => import('./pages/InvoiceHistory'))
const ProducerProfile = lazy(() => import('./pages/ProducerProfile'))
const NotaFiscal = lazy(() => import('./pages/NotaFiscal'))
const EmitirNF = lazy(() => import('./pages/EmitirNF'))
const SelectClient = lazy(() => import('./pages/SelectClient'))
const EmitirLeite = lazy(() => import('./pages/EmitirLeite'))
const EmitirGado = lazy(() => import('./pages/EmitirGado'))
const EmitirGadoNext = lazy(() => import('./pages/EmitirGadoNext'))
const EmitirLeiteNext = lazy(() => import('./pages/EmitirLeiteNext'))
const ConsultarNF = lazy(() => import('./pages/ConsultarNF'))
const InvoiceDetail = lazy(() => import('./pages/InvoiceDetail'))
const Configuracoes = lazy(() => import('./pages/Configuracoes'))
const Estatistica = lazy(() => import('./pages/Estatistica'))
const CadastrarCliente = lazy(() => import('./pages/CadastrarCliente'))
const NotFound = lazy(() => import('./pages/NotFound'))

function SplashLoader() {
  return (
    <div className="fixed inset-0 z-50 bg-[#002C45] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[#A8914E]" />
    </div>
  )
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
          <PwaIntegrityGuard />
          <TooltipProvider>
            <Toaster /> <Sonner />
            <Suspense fallback={<SplashLoader />}>
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
                    path="/emitir-gado/next"
                    element={
                      <RequireProperty>
                        <EmitirGadoNext />
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
            </Suspense>
          </TooltipProvider>
        </NativeAppShell>
      </SessionProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
