import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useSession } from '@/stores/session'
import { getPropriedades, type PropriedadeRecord } from '@/services/propriedades'
import { useRealtime } from '@/hooks/use-realtime'
import { AppScaffold } from '@/components/AppScaffold'
import { SafeContent } from '@/components/SafeContent'
import { AppHeader } from '@/components/AppHeader'
import { ScreenContent } from '@/components/ScreenContent'
import { PropertyCard } from '@/components/PropertyCard'
import { PrimaryButton } from '@/components/PrimaryButton'
import { LoadingOverlay } from '@/components/LoadingOverlay'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { ConfirmationDialog } from '@/components/ConfirmationDialog'
import { maskCpf } from '@/lib/cpf-utils'
import { cn } from '@/lib/utils'

function formatEndereco(prop: PropriedadeRecord): string {
  const parts: string[] = []
  if (prop.endereco) parts.push(prop.endereco)
  if (prop.numero) parts.push(prop.numero)
  if (prop.bairro) parts.push(prop.bairro)
  if (prop.municipio) parts.push(prop.municipio)
  if (prop.uf) parts.push(prop.uf)
  if (prop.cep) parts.push(`CEP: ${prop.cep}`)
  return parts.join(', ')
}

export default function SelectProperty() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { setActiveProperty, clearSession } = useSession()

  const [properties, setProperties] = useState<PropriedadeRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [continuing, setContinuing] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const userCpf = maskCpf(user?.cpf || '')

  const loadProperties = useCallback(() => {
    setSelectedId(null)
    setLoading(true)
    setError(false)
    getPropriedades()
      .then(setProperties)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadProperties()
  }, [loadProperties])

  useRealtime('propriedades', () => {
    loadProperties()
  })

  const handleSelect = (id: string) => {
    setSelectedId(id)
  }

  const handleContinue = () => {
    const selected = properties.find((p) => p.id === selectedId)
    if (!selected) return
    setContinuing(true)
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

  const handleConfirmSair = () => {
    setShowConfirm(false)
    clearSession()
    signOut()
    navigate('/login')
  }

  const isButtonDisabled = !selectedId || error || properties.length === 0
  const showCenteredState = error || (!loading && properties.length === 0)

  return (
    <AppScaffold>
      <SafeContent className="overflow-hidden">
        <AppHeader exibirPropriedade={false} exibirBotaoVoltar={false} exibirCpf />

        <div className="flex-shrink-0 h-[2px] w-full" style={{ backgroundColor: '#A8914E' }} />

        <div className="flex-shrink-0 py-4 px-6 bg-white">
          <p className="text-center font-semibold text-[18px]" style={{ color: '#002C45' }}>
            Selecione a Propriedade Ativa do Usuário
          </p>
        </div>

        <div className="flex-shrink-0 h-[2px] w-full" style={{ backgroundColor: '#A8914E' }} />

        <ScreenContent
          className={cn(
            'flex-1 min-h-0 overflow-y-auto',
            showCenteredState && 'flex flex-col items-center justify-center',
          )}
        >
          {error ? (
            <ErrorState
              message="Não foi possível carregar as propriedades."
              onRetry={loadProperties}
            />
          ) : !loading && properties.length === 0 ? (
            <EmptyState
              title="Nenhuma propriedade encontrada."
              description="Não existem propriedades rurais vinculadas ao seu CPF."
              actionLabel="Atualizar"
              onAction={loadProperties}
            />
          ) : (
            <div className="space-y-3">
              {properties.map((prop) => (
                <PropertyCard
                  key={prop.id}
                  nome={prop.nome}
                  cpf={userCpf}
                  endereco={formatEndereco(prop)}
                  cadPro={prop.inscricao_estadual}
                  municipio={prop.municipio}
                  uf={prop.uf}
                  situacaoIE={prop.situacao_ie || undefined}
                  selected={selectedId === prop.id}
                  onSelect={() => handleSelect(prop.id)}
                />
              ))}
            </div>
          )}
        </ScreenContent>

        <div className="flex-shrink-0">
          <div className="h-[2px] w-full" style={{ backgroundColor: '#A8914E' }} />
          <div
            className="px-5 flex flex-col"
            style={{ paddingTop: '24px', paddingBottom: '24px', gap: '16px' }}
          >
            <PrimaryButton
              disabled={isButtonDisabled}
              loading={continuing}
              onClick={handleContinue}
            >
              Selecionar
            </PrimaryButton>
            <PrimaryButton variant="dark" onClick={() => setShowConfirm(true)}>
              Sair
            </PrimaryButton>
          </div>
        </div>
      </SafeContent>

      {loading && <LoadingOverlay message="Carregando propriedades..." />}

      <ConfirmationDialog
        open={showConfirm}
        message="Deseja realmente sair do aplicativo?"
        cancelLabel="Cancelar"
        confirmLabel="Sair"
        onConfirm={handleConfirmSair}
        onCancel={() => setShowConfirm(false)}
      />
    </AppScaffold>
  )
}
