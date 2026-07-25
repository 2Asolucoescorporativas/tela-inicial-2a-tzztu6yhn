import { useState } from 'react'
import { useNavigate, Link } from 'react'
import { useNavigate as useNav } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Logo2A } from '@/components/Logo2A'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2, ShieldCheck } from 'lucide-react'

export default function Login() {
  const navigate = useNav()
  const { signIn } = useAuth()

  const [email, setEmail] = useState('alexandre@2asolucoescorporativas.com.br')
  const [password, setPassword] = useState('Skip@Pass')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    const { error } = await signIn(email, password)
    if (error) {
      setErrorMsg('Credenciais inválidas. Verifique seu e-mail e senha.')
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-[#002C45] flex flex-col items-center justify-between p-6 relative">
      <div className="w-full max-w-sm flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="text-xs text-[#F9E27D] font-medium tracking-wide flex items-center gap-1">
          <ShieldCheck className="w-4 h-4" /> Ambiente Seguro
        </span>
      </div>

      <div className="w-full max-w-sm my-auto flex flex-col items-center space-y-6 animate-fade-in-up">
        <Logo2A size="sm" showTagline={true} className="scale-110" />

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="space-y-1.5">
            <Label className="text-white/80 text-xs font-medium pl-1">E-mail</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com.br"
              className="bg-[#001f31]/80 border-white/15 text-white h-12 rounded-xl focus-visible:ring-[#D4AF37] placeholder:text-white/30"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center pl-1 pr-1">
              <Label className="text-white/80 text-xs font-medium">Senha</Label>
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault()
                  alert('Instruções enviadas ao e-mail informado.')
                }}
                className="text-xs text-white/60 hover:text-[#F9E27D] transition-colors"
              >
                Esqueci minha senha
              </a>
            </div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="bg-[#001f31]/80 border-white/15 text-white h-12 rounded-xl focus-visible:ring-[#D4AF37] placeholder:text-white/30"
            />
          </div>

          {errorMsg && (
            <p className="text-[#FF6B6B] text-xs font-medium text-center py-1 animate-fade-in">
              {errorMsg}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-gold-gradient rounded-2xl text-[#002C45] font-sans font-bold text-lg tracking-wide shadow-md hover:brightness-105 active:scale-95 transition-all mt-4"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'ACESSAR'}
          </Button>
        </form>

        <div className="w-full pt-4 border-t border-white/10 text-center space-y-3">
          <span className="text-xs text-white/50 block">Entrar com conta corporativa</span>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => handleSubmit({ preventDefault: () => {} } as any)}
              className="bg-[#001f31] hover:bg-[#00283d] text-white text-xs px-4 py-2.5 rounded-xl border border-white/10 flex items-center gap-2 transition-colors"
            >
              <img
                src="https://img.usecurling.com/i?q=microsoft"
                alt="Microsoft"
                className="w-4 h-4"
              />
              Microsoft
            </button>
            <button
              onClick={() => handleSubmit({ preventDefault: () => {} } as any)}
              className="bg-[#001f31] hover:bg-[#00283d] text-white text-xs px-4 py-2.5 rounded-xl border border-white/10 flex items-center gap-2 transition-colors"
            >
              <img src="https://img.usecurling.com/i?q=google" alt="Google" className="w-4 h-4" />
              Google
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-[10px] text-white/40 pb-2">
        © 2A Soluções Corporativas - Módulo Rural v2.4
      </div>
    </div>
  )
}
