import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Logo2A } from '@/components/Logo2A'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { maskCpf, isValidCpf } from '@/lib/cpf-utils'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signInWithCpf } = useAuth()

  const [cpf, setCpf] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [cpfError, setCpfError] = useState('')
  const [showSuccessBanner, setShowSuccessBanner] = useState(
    (location.state as { registrationSuccess?: boolean })?.registrationSuccess || false,
  )

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCpf(e.target.value)
    setCpf(masked)
    setCpfError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValidCpf(cpf)) {
      setCpfError('CPF deve conter 11 dígitos')
      return
    }

    if (!password) {
      setErrorMsg('Digite sua senha')
      return
    }

    setLoading(true)
    setErrorMsg('')
    setCpfError('')

    const { error } = await signInWithCpf(cpf, password)
    if (error) {
      setErrorMsg('CPF ou senha inválidos')
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 relative"
      style={{ backgroundColor: '#3B626B' }}
    >
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="w-full max-w-sm flex flex-col items-center space-y-8 animate-fade-in-up">
        <Logo2A size="sm" showTagline={true} className="scale-110" />

        {showSuccessBanner && (
          <div className="w-full bg-green-500/15 border border-green-400/30 rounded-[14px] p-3 flex items-start gap-2 animate-fade-in">
            <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-green-200 text-sm leading-relaxed">
                Cadastro concluído com sucesso. Agora você já pode acessar o 2A Rural com seu CPF e
                sua senha.
              </p>
              <button
                onClick={() => setShowSuccessBanner(false)}
                className="text-green-300/60 text-xs hover:text-green-200 mt-1"
              >
                Fechar
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="space-y-1.5">
            <Label className="text-white/80 text-sm font-medium">CPF</Label>
            <Input
              type="text"
              inputMode="numeric"
              value={cpf}
              onChange={handleCpfChange}
              required
              placeholder="000.000.000-00"
              className="bg-white border-none text-gray-900 rounded-[14px] shadow-sm focus-visible:ring-2 focus-visible:ring-[#A8914E]/40"
              style={{ height: '52px' }}
            />
            {cpfError && <p className="text-red-300 text-xs animate-fade-in">{cpfError}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-white/80 text-sm font-medium">Senha</Label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setErrorMsg('')
                }}
                required
                placeholder="Digite sua senha"
                className="bg-white border-none text-gray-900 rounded-[14px] shadow-sm pr-12 focus-visible:ring-2 focus-visible:ring-[#A8914E]/40"
                style={{ height: '52px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <p className="text-red-300 text-sm text-center font-medium animate-fade-in">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-[80%] mx-auto block text-white font-bold text-lg rounded-[14px] shadow-md hover:brightness-105 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#A8914E', height: '56px' }}
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'ENTRAR'}
          </button>
        </form>

        <div className="flex flex-col items-center gap-4 mt-2">
          <Link
            to="/forgot-password"
            className="text-sm hover:underline transition-all"
            style={{ color: '#A8914E' }}
          >
            Esqueci minha senha
          </Link>
          <Link
            to="/register"
            className="text-sm hover:underline transition-all"
            style={{ color: '#A8914E' }}
          >
            Não sou cadastrado
          </Link>
        </div>
      </div>
    </div>
  )
}
