import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useSession } from '@/stores/session'
import { getPropriedades, type PropriedadeRecord } from '@/services/propriedades'
import { useRealtime } from '@/hooks/use-realtime'
import { AppScaffold } from '@/components/AppScaffold'
import { SafeContent } from '@/components/SafeContent'
import { AppHeader } from '@/components/AppHeader'
import { ScreenContent } from '@/components/ScreenContent'
import { ScreenTitle } from '@/components/ScreenTitle'
import { BodyText } from '@/components/BodyText'
import { PropertyCard } from '@/components/PropertyCard'
import { BottomActions } from '@/components/BottomActions'
import { PrimaryButton } from '@/components/PrimaryButton'
import { TextButton } from '@/components/TextButton'
import { LoadingOverlay } from '@/components/LoadingOverlay'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { ConfirmationDialog } from '@/components/ConfirmationDialog'
import { LogOut } from 'lucide-react'

export default function SelectProperty() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const { setActiveProperty } = useSession()

  const [properties, setProperties] = useState<PropriedadeRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [continuing, setContinuing] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const loadProperties = useCallback(() => {
    setSelectedId(null)
    setLoading(true)
    setError(false)
    getPropriedades()
      .then(setProperties)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  useRealtime('propriedades', () => {
    loadProperties()
  })

  if (loading && properties.length === 0 && !error) {
    return (
      <AppScaffold>
        <SafeContent>
          <AppHeader exibirPropriedade={false} exibirBotaoVoltar={false} exibirCpf />
        </SafeContent>
        <LoadingOverlay message="Carregando propriedades..." />
      </AppScaffold>
    )
  }

  if (error) {
    return (
      <AppScaffold>
        <SafeContent>
          <AppHeader exibirPropriedade={false} exibirBotaoVoltar={false} exibirCpf />
          <ScreenContent className="flex items-center">
            <ErrorState
              message="Não foi possível carregar as propriedades."
              onRetry={loadProperties}
            />
          </ScreenContent>
        </SafeContent>
      </AppScaffold>
    )
  }

  if (!loading && properties.length === 0) {
    return (
      <AppScaffold>
        <SafeContent>
          <AppHeader exibirPropriedade={false} exibirBotaoVoltar={false} exibirCpf />
          <ScreenContent className="flex items-center">
            <EmptyState
              title="Nenhuma propriedade encontrada."
              description="Não existem propriedades rurais vinculadas ao seu CPF."
              actionLabel="Atualizar"
              onAction={loadProperties}
            />
          </ScreenContent>
        </SafeContent>
      </AppScaffold>
    )
  }

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
    signOut()
    navigate('/login')
  }

  return (
    <AppScaffold>
      <SafeContent>
        <AppHeader exibirPropriedade={false} exibirBotaoVoltar={false} exibirCpf />

        <ScreenContent>
          <div className="space-y-1 mb-4">
            <ScreenTitle className="text-center">Selecione a propriedade</ScreenTitle>
            <BodyText>Escolha a propriedade que será utilizada nesta sessão.</BodyText>
          </div>

          <div className="space-y-3">
            {properties.map((prop) => (
              <PropertyCard
                key={prop.id}
                nome={prop.nome}
                cadPro={prop.inscricao_estadual}
                inscricaoEstadual={prop.inscricao_estadual}
                municipio={prop.municipio}
                uf={prop.uf}
                situacaoIE={prop.situacao_ie || undefined}
                selected={selectedId === prop.id}
                onSelect={() => handleSelect(prop.id)}
              />
            ))}
          </div>
        </ScreenContent>

        <BottomActions>
          <PrimaryButton disabled={!selectedId} loading={continuing} onClick={handleContinue}>
            CONTINUAR
          </PrimaryButton>
          <TextButton onClick={() => setShowConfirm(true)}>
            <span className="flex items-center gap-1.5">
              <LogOut className="w-4 h-4" />
              Sair do aplicativo
            </span>
          </TextButton>
        </BottomActions>
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
