import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Logo2A } from '@/components/Logo2A'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { maskCpf, unmaskCpf, isValidCpf } from '@/lib/cpf-utils'
import { getCadastroProvider } from '@/providers/cadastro-provider'
import { primaryButtonStyle, secondaryButtonStyle } from '@/lib/button-styles'

export default function Register() {
  const navigate = useNavigate()
  const [cpf, setCpf] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [jaCadastrado, setJaCadastrado] = useState(false)

  const isCpfValid = isValidCpf(cpf)

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(maskCpf(e.target.value))
    setErrorMsg('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const unmasked = unmaskCpf(cpf)
    if (!isValidCpf(unmasked)) return

    setLoading(true)
    setErrorMsg('')

    try {
      const result = await getCadastroProvider().consultarPropriedades(unmasked)
      if (result.ja_cadastrado) {
        setJaCadastrado(true)
        setLoading(false)
        return
      }
      navigate('/register/resultados', { state: { result } })
    } catch (err) {
      const response = (err as { response?: { message?: string } })?.response
      if (response?.message) {
        setErrorMsg(response.message)
      } else {
        setErrorMsg('Não foi possível consultar o cadastro. Tente novamente.')
      }
      setLoading(false)
    }
  }

  if (jaCadastrado) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6 relative"
        style={{ backgroundColor: '#3B626B' }}
      >
        <button
          onClick={() => navigate('/login')}
          className="absolute top-6 left-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="w-full max-w-sm flex flex-col items-center space-y-8 animate-fade-in-up">
          <h1 className="text-2xl font-bold text-center" style={{ color: '#A8914E' }}>
            Cadastro já existe
          </h1>

          <p className="text-white/80 text-center text-base leading-relaxed">
            Este CPF já possui cadastro no 2A Rural. Acesse o aplicativo utilizando seu CPF e sua
            senha.
          </p>

          <div className="w-full space-y-3">
            <button
              onClick={() => navigate('/login')}
              className="w-full flex items-center justify-center shadow-md hover:brightness-105 active:scale-95 transition-all"
              style={primaryButtonStyle}
            >
              IR PARA LOGIN
            </button>
            <button
              onClick={() => navigate('/forgot-password')}
              className="w-full flex items-center justify-center hover:bg-[#C89B51]/10 active:scale-95 transition-all"
              style={secondaryButtonStyle}
            >
              RECUPERAR SENHA
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 relative"
      style={{ backgroundColor: '#3B626B' }}
    >
      <button
        onClick={() => navigate('/login')}
        className="absolute top-6 left-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="w-full max-w-sm flex flex-col items-center space-y-6 animate-fade-in-up">
        <Logo2A size="sm" showTagline={true} linkTo="/" />

        <h1 className="text-2xl font-bold text-center" style={{ color: '#A8914E' }}>
          Localizar Cadastro Rural
        </h1>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="space-y-1.5">
            <Label className="text-white/80 text-sm font-medium">CPF</Label>
            <Input
              type="text"
              inputMode="numeric"
              value={cpf}
              onChange={handleCpfChange}
              placeholder="000.000.000-00"
              className="bg-white border-none text-gray-900 rounded-[14px] shadow-sm focus-visible:ring-2 focus-visible:ring-[#A8914E]/40"
              style={{ height: '52px' }}
            />
          </div>

          {errorMsg && (
            <p className="text-red-300 text-sm text-center font-medium animate-fade-in">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={!isCpfValid || loading}
            className="w-full flex items-center justify-center shadow-md hover:brightness-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            style={primaryButtonStyle}
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'CONSULTAR CADASTRO'}
          </button>
        </form>
      </div>
    </div>
  )
}
