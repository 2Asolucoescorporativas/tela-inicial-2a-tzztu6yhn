import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { maskCpf } from '@/lib/cpf-utils'
import type { ConsultaCadastroResponse } from '@/services/cadastro'

interface ResultadosState {
  result?: ConsultaCadastroResponse
  error?: string
}

export default function RegisterResultados() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as ResultadosState | null

  if (!state) {
    return <Navigate to="/register" replace />
  }

  const { result, error } = state

  return (
    <div className="min-h-screen flex flex-col p-6 relative" style={{ backgroundColor: '#3B626B' }}>
      <button
        onClick={() => navigate('/register')}
        className="absolute top-6 left-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="w-full max-w-md mx-auto flex flex-col space-y-6 pt-20 pb-10 animate-fade-in-up">
        <h1 className="text-2xl font-bold text-center" style={{ color: '#A8914E' }}>
          Cadastros Localizados
        </h1>

        {error && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <p className="text-center text-base leading-relaxed" style={{ color: '#A8914E' }}>
              {error}
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

        {result &&
          result.inscricoes.map((insc, idx) => (
            <div key={idx} className="bg-white rounded-[14px] shadow-md p-5 space-y-3">
              <div className="border-b border-gray-100 pb-2">
                <p className="font-bold text-gray-900 text-base">{result.nome}</p>
                <p className="text-gray-500 text-sm">{maskCpf(result.cpf)}</p>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Inscrição Estadual</span>
                  <span className="text-gray-900 font-medium">{insc.ie}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Situação da IE</span>
                  <span className="text-gray-900 font-medium">{insc.situacao_ie}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tipo da IE</span>
                  <span className="text-gray-900 font-medium">{insc.tipo_ie}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Município</span>
                  <span className="text-gray-900 font-medium">{insc.municipio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">UF</span>
                  <span className="text-gray-900 font-medium">{insc.uf}</span>
                </div>
              </div>
            </div>
          ))}

        {result && (
          <button
            onClick={() => navigate('/register')}
            className="text-sm hover:underline text-center mx-auto block pt-2"
            style={{ color: '#A8914E' }}
          >
            Nova consulta
          </button>
        )}
      </div>
    </div>
  )
}
