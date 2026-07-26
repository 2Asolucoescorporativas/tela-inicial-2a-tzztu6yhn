import { useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { ArrowLeft, Database } from 'lucide-react'
import { Logo2A } from '@/components/Logo2A'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { maskCpf } from '@/lib/cpf-utils'
import {
  isPropertyEligible,
  getIneligibilityReason,
  formatEndereco,
  type RegistrationFlowState,
} from '@/lib/registration-utils'
import type { ConsultaPropriedadesResponse } from '@/services/cadastro'

interface ResultadosState {
  result?: ConsultaPropriedadesResponse
  error?: string
}

export default function RegisterResultados() {
  const navigate = useNavigate()
  const location = useLocation()
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const state = location.state as ResultadosState | null

  if (!state?.result || !state.result.success) {
    return <Navigate to="/register" replace />
  }

  const result = state.result
  const isMock = result.origem === 'mock'
  const isCache = result.is_cache === true
  const propriedades = result.propriedades || []

  const toggleSelection = (idx: number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  const handleContinue = () => {
    const selectedPropriedades = propriedades
      .filter((_, idx) => selected.has(idx))
      .filter(isPropertyEligible)
    navigate('/register/propriedades', {
      state: {
        consulta_id: result.consulta_id || '',
        cpf: result.cpf || '',
        nomeUsuario: result.nome || '',
        selectedPropriedades,
        isMock,
        isCache,
      } as RegistrationFlowState,
    })
  }

  return (
    <div className="min-h-screen flex flex-col p-6 relative" style={{ backgroundColor: '#3B626B' }}>
      <button
        onClick={() => navigate('/register')}
        className="absolute top-6 left-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="w-full max-w-md mx-auto flex flex-col space-y-4 pt-16 pb-10 animate-fade-in-up">
        <Logo2A size="sm" showTagline={true} linkTo="/" className="mx-auto" />

        <h1 className="text-2xl font-bold text-center" style={{ color: '#A8914E' }}>
          Cadastros Localizados
        </h1>

        {result.nome && (
          <p className="text-center text-white/80 text-sm font-medium">{result.nome}</p>
        )}
        {result.cpf && <p className="text-center text-white/50 text-xs">{maskCpf(result.cpf)}</p>}

        {isCache && (
          <div className="flex items-center justify-center gap-1.5 text-white/40 text-xs">
            <Database className="w-3 h-3" />
            <span>Dados cadastrais obtidos da última consulta disponível.</span>
          </div>
        )}

        {isMock && !isCache && (
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-wide text-white/40 font-medium">
              AMBIENTE DE TESTE
            </span>
            <span className="text-[10px] text-white/30">Dados simulados</span>
          </div>
        )}

        {(result.quantidade_encontrada === 0 || propriedades.length === 0) && (
          <div className="flex flex-col items-center py-12 space-y-4">
            <p className="text-center text-base leading-relaxed" style={{ color: '#A8914E' }}>
              Nenhuma inscrição estadual de produtor rural foi localizada no Paraná para o CPF
              informado.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="text-sm hover:underline"
              style={{ color: '#A8914E' }}
            >
              Nova consulta
            </button>
          </div>
        )}

        {propriedades.map((prop, idx) => {
          const eligible = isPropertyEligible(prop)
          const reason = getIneligibilityReason(prop)
          return (
            <div
              key={idx}
              className={cn(
                'bg-white rounded-[14px] shadow-md p-4 space-y-2',
                !eligible && 'opacity-60',
              )}
            >
              <div className="flex items-start justify-between border-b border-gray-100 pb-2">
                <div className="space-y-0.5">
                  <p className="font-bold text-gray-900 text-sm">{prop.inscricao_estadual}</p>
                  <p className="text-gray-500 text-xs">
                    {prop.municipio}/{prop.uf}
                  </p>
                </div>
                <Checkbox
                  checked={selected.has(idx)}
                  onCheckedChange={() => toggleSelection(idx)}
                  disabled={!eligible}
                  className="w-6 h-6 border-2 data-[state=checked]:bg-[#A8914E] data-[state=checked]:border-[#A8914E]"
                />
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Situação</span>
                  <span className="text-gray-900 font-medium">
                    {prop.situacao_cadastral || '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tipo IE</span>
                  <span className="text-gray-900 font-medium">{prop.tipo_ie || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Ativa</span>
                  <span className="text-gray-900 font-medium">{prop.ativa ? 'Sim' : 'Não'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Endereço</span>
                  <span className="text-gray-900 font-medium text-right max-w-[60%]">
                    {formatEndereco(prop)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">IBGE</span>
                  <span className="text-gray-900 font-medium">
                    {prop.codigo_municipio_ibge || '-'}
                  </span>
                </div>
              </div>
              {reason && <p className="text-xs text-red-500 font-medium">{reason}</p>}
            </div>
          )
        })}

        {propriedades.length > 0 && (
          <button
            onClick={handleContinue}
            disabled={selected.size === 0}
            className="w-[80%] mx-auto block text-white font-bold text-lg rounded-[14px] shadow-md hover:brightness-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            style={{ backgroundColor: '#A8914E', height: '56px' }}
          >
            CONTINUAR
          </button>
        )}
      </div>
    </div>
  )
}
