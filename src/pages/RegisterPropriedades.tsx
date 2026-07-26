import { useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  normalizeName,
  validatePropertyName,
  formatEndereco,
  type RegistrationFlowState,
} from '@/lib/registration-utils'

export default function RegisterPropriedades() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as RegistrationFlowState | null
  const [nomes, setNomes] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())

  if (!state?.selectedPropriedades?.length) {
    return <Navigate to="/register" replace />
  }

  const getFieldError = (ie: string): string | null => {
    const name = nomes[ie] || ''
    const baseError = validatePropertyName(name)
    if (baseError) return baseError
    const normalized = normalizeName(name)
    for (const c of state.selectedPropriedades) {
      if (c.inscricao_estadual === ie) continue
      const otherName = nomes[c.inscricao_estadual] || ''
      if (otherName && normalizeName(otherName) === normalized) {
        return 'Já existe uma propriedade com esse nome. Escolha outro nome.'
      }
    }
    return null
  }

  const allValid = state.selectedPropriedades.every(
    (c) => getFieldError(c.inscricao_estadual) === null,
  )

  const handleNameChange = (ie: string, value: string) => {
    setNomes((prev) => ({ ...prev, [ie]: value }))
  }

  const handleBlur = (ie: string) => {
    setTouched((prev) => new Set(prev).add(ie))
  }

  const handleContinue = () => {
    const propriedadeNomes = state.selectedPropriedades.map((c) => ({
      inscricao_estadual: c.inscricao_estadual,
      nome: (nomes[c.inscricao_estadual] || '').trim(),
    }))
    navigate('/register/senha', { state: { ...state, propriedadeNomes } })
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
            Identifique suas propriedades
          </h1>
          <p className="text-white/70 text-sm leading-relaxed">
            Crie um nome simples para identificar cada propriedade dentro do aplicativo.
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

        {state.selectedPropriedades.map((propriedade) => {
          const ie = propriedade.inscricao_estadual
          const error = touched.has(ie) ? getFieldError(ie) : null
          return (
            <div key={ie} className="bg-white rounded-[14px] shadow-md p-4 space-y-3">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">IE</span>
                  <span className="text-gray-900 font-medium">{ie}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Município</span>
                  <span className="text-gray-900 font-medium">{propriedade.municipio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Endereço</span>
                  <span className="text-gray-900 font-medium text-right max-w-[60%]">
                    {formatEndereco(propriedade)}
                  </span>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-700 text-sm font-medium">Nome da propriedade</Label>
                <Input
                  value={nomes[ie] || ''}
                  onChange={(e) => handleNameChange(ie, e.target.value)}
                  onBlur={() => handleBlur(ie)}
                  placeholder="Ex: Fazenda Boa Esperança"
                  maxLength={50}
                  className="bg-white text-gray-900 rounded-[14px]"
                />
                {error && <p className="text-red-500 text-xs animate-fade-in">{error}</p>}
              </div>
            </div>
          )
        })}

        <button
          onClick={handleContinue}
          disabled={!allValid}
          className="w-[80%] mx-auto block text-white font-bold text-lg rounded-[14px] shadow-md hover:brightness-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          style={{ backgroundColor: '#A8914E', height: '56px' }}
        >
          CONTINUAR
        </button>
      </div>
    </div>
  )
}
