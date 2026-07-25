import { useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { unmaskCpf } from '@/lib/cpf-utils'
import { validatePassword, type RegistrationFlowState } from '@/lib/registration-utils'

export default function RegisterSenha() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as RegistrationFlowState | null

  const [senha, setSenha] = useState('')
  const [confirmacao, setConfirmacao] = useState('')
  const [showSenha, setShowSenha] = useState(false)
  const [showConfirmacao, setShowConfirmacao] = useState(false)
  const [touchedSenha, setTouchedSenha] = useState(false)
  const [touchedConfirmacao, setTouchedConfirmacao] = useState(false)

  if (!state?.propriedadeNomes?.length) {
    return <Navigate to="/register" replace />
  }

  const cpfDigits = unmaskCpf(state.cpf)
  const senhaError = touchedSenha ? validatePassword(senha, cpfDigits) : null
  const confirmacaoError =
    touchedConfirmacao && confirmacao.length > 0 && senha !== confirmacao
      ? 'As senhas não conferem.'
      : null

  const isFormValid =
    senha.length === 6 &&
    validatePassword(senha, cpfDigits) === null &&
    confirmacao.length === 6 &&
    senha === confirmacao

  const handleSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSenha(e.target.value.replace(/\D/g, '').slice(0, 6))
  }

  const handleConfirmacaoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmacao(e.target.value.replace(/\D/g, '').slice(0, 6))
  }

  const handleContinue = () => {
    navigate('/register/revisao', { state: { ...state, senha } })
  }

  return (
    <div className="min-h-screen flex flex-col p-6 relative" style={{ backgroundColor: '#3B626B' }}>
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="w-full max-w-md mx-auto flex flex-col space-y-6 pt-20 pb-10 animate-fade-in-up">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold" style={{ color: '#A8914E' }}>
            Crie sua senha
          </h1>
          <p className="text-white/70 text-sm leading-relaxed">
            Sua senha deve conter exatamente 6 dígitos numéricos. Evite sequências simples ou
            repetições.
          </p>
        </div>

        {state.isMock && (
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-wide text-white/40 font-medium">
              AMBIENTE DE TESTE
            </span>
            <span className="text-[10px] text-white/30">Dados simulados</span>
          </div>
        )}

        <div className="space-y-5">
          <div className="space-y-1.5">
            <Label className="text-white/80 text-sm font-medium">Senha (6 dígitos)</Label>
            <div className="relative">
              <Input
                type={showSenha ? 'text' : 'password'}
                inputMode="numeric"
                value={senha}
                onChange={handleSenhaChange}
                onBlur={() => setTouchedSenha(true)}
                placeholder="••••••"
                maxLength={6}
                className="bg-white border-none text-gray-900 rounded-[14px] shadow-sm pr-12 focus-visible:ring-2 focus-visible:ring-[#A8914E]/40 tracking-[0.3em]"
                style={{ height: '52px' }}
              />
              <button
                type="button"
                onClick={() => setShowSenha(!showSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {senhaError && <p className="text-red-300 text-xs animate-fade-in">{senhaError}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-white/80 text-sm font-medium">Confirmar senha</Label>
            <div className="relative">
              <Input
                type={showConfirmacao ? 'text' : 'password'}
                inputMode="numeric"
                value={confirmacao}
                onChange={handleConfirmacaoChange}
                onBlur={() => setTouchedConfirmacao(true)}
                placeholder="••••••"
                maxLength={6}
                className="bg-white border-none text-gray-900 rounded-[14px] shadow-sm pr-12 focus-visible:ring-2 focus-visible:ring-[#A8914E]/40 tracking-[0.3em]"
                style={{ height: '52px' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmacao(!showConfirmacao)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmacao ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {confirmacaoError && (
              <p className="text-red-300 text-xs animate-fade-in">{confirmacaoError}</p>
            )}
          </div>
        </div>

        <button
          onClick={handleContinue}
          disabled={!isFormValid}
          className="w-[80%] mx-auto block text-white font-bold text-lg rounded-[14px] shadow-md hover:brightness-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          style={{ backgroundColor: '#A8914E', height: '56px' }}
        >
          CONTINUAR
        </button>
      </div>
    </div>
  )
}
