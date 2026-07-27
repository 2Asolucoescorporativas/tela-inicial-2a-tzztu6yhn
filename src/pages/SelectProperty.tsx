import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useSession } from '@/stores/session'
import { getPropriedades, type PropriedadeRecord } from '@/services/propriedades'
import { cn } from '@/lib/utils'
import { FormPageLayout } from '@/components/FormPageLayout'
import { AppHeader } from '@/components/AppHeader'
import { Check, Loader2, MapPin, FileText, Home, LogOut } from 'lucide-react'

export default function SelectProperty() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const { setActiveProperty } = useSession()
  const [properties, setProperties] = useState<PropriedadeRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    getPropriedades()
      .then(setProperties)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleContinue = () => {
    const selected = properties.find((p) => p.id === selectedId)
    if (!selected) return
    setActiveProperty({
      id: selected.id,
      nome: selected.nome,
      inscricao_estadual: selected.inscricao_estadual,
      municipio: selected.municipio,
      uf: selected.uf,
      codigo_ibge: selected.codigo_ibge || '',
      endereco: selected.endereco || '',
      numero: selected.numero || '',
      bairro: selected.bairro || '',
      cep: selected.cep || '',
    })
    navigate('/dashboard')
  }

  const handleSair = () => {
    signOut()
    navigate('/login')
  }

  return (
    <FormPageLayout className="text-white">
      <AppHeader exibirPropriedade={false} />

      <div className="form-page__content p-5 space-y-5 animate-fade-in pb-10">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold" style={{ color: '#A8914E' }}>
            Selecione a propriedade
          </h1>
          <p className="text-white/70 text-sm">
            Escolha a propriedade que deseja utilizar nesta sessão.
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#A8914E]" />
          </div>
        ) : properties.length === 0 ? (
          <div className="py-12 text-center text-white/50 text-sm">
            Nenhuma propriedade encontrada. Entre em contato com o suporte.
          </div>
        ) : (
          <div className="space-y-3">
            {properties.map((prop) => {
              const isSelected = selectedId === prop.id
              return (
                <div
                  key={prop.id}
                  onClick={() => setSelectedId(prop.id)}
                  className={cn(
                    'bg-white rounded-2xl p-4 cursor-pointer transition-all relative',
                    isSelected ? 'border-2 border-[#A8914E] shadow-lg' : 'border border-gray-200',
                  )}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#A8914E] flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <Home className="w-5 h-5 text-[#A8914E]" />
                    <span className="font-bold text-gray-900 text-base">{prop.nome}</span>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span>IE: {prop.inscricao_estadual}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>
                        {prop.municipio} - {prop.uf}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <button
          onClick={handleContinue}
          disabled={!selectedId}
          className="w-[85%] mx-auto block text-white font-bold text-lg rounded-[14px] shadow-md hover:brightness-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
          style={{ backgroundColor: '#A8914E', height: '56px' }}
        >
          CONTINUAR
        </button>

        <button
          onClick={handleSair}
          className="w-[85%] mx-auto block text-white/60 font-medium text-sm hover:text-white transition-colors py-2 flex items-center justify-center gap-1.5"
        >
          <LogOut className="w-4 h-4" />
          Sair do aplicativo
        </button>
      </div>
    </FormPageLayout>
  )
}
