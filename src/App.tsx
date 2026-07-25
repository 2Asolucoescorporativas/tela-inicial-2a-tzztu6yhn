import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider, useAuth } from '@/hooks/use-auth'

import Index from './pages/Index'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import InvoiceHistory from './pages/InvoiceHistory'
import ProducerProfile from './pages/ProducerProfile'
import ForgotPassword from './pages/ForgotPassword'
import Register from './pages/Register'
import RegisterResultados from './pages/RegisterResultados'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'

function ProtectedRoute({ children }: { children: React.JSX.Element }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

const App = () => (
  <BrowserRouter>
    <AuthProvider>
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

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/historico"
              element={
                <ProtectedRoute>
                  <InvoiceHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/perfil"
              element={
                <ProtectedRoute>
                  <ProducerProfile />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
