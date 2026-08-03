import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useSession, type DraftInvoice } from '@/stores/session'
import { AppScaffold } from '@/components/AppScaffold'
import { SafeContent } from '@/components/SafeContent'
import { AppHeader } from '@/components/AppHeader'
import { ScreenTitle } from '@/components/ScreenTitle'
import { ScreenContent } from '@/components/ScreenContent'
import { PrimaryButton } from '@/components/PrimaryButton'
import { GadoOptionButton } from '@/components/GadoOptionButton'
import { ErrorState } from '@/components/ErrorState'
import {
  GADO_OPERACOES,
  GADO_TIPOS_ANIMAL,
  getOperacaoById,
  hasSuboperacoes,
} from '@/lib/gado-config'

type Step = 'operacao' | 'suboperacao' | 'tipo_animal'

const STEP_TITLES: Record<Step, string> = {
  operacao: 'SELECIONE A OPERAÇÃO',
  suboperacao: 'SELECIONE A SUBOPERAÇÃO',
  tipo_animal: 'SELECIONE O TIPO DE ANIMAL',
}

const goldLineStyle = { backgroundColor: '#A8914E' }
const footerStyle = { paddingTop: '24px', paddingBottom: '24px', gap: '16px' }

export default function EmitirGado() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { activeProperty, setDraftInvoice } = useSession()
  const [step, setStep] = useState<Step>('operacao')
  const [operacaoId, setOperacaoId] = useState('')
  const [suboperacaoId, setSuboperacaoId] = useState('')
  const [tipoAnimalId, setTipoAnimalId] = useState('')
  const [configError, setConfigError] = useState(false)

  const operacao = getOperacaoById(operacaoId)
  const totalSteps = operacaoId ? (hasSuboperacoes(operacaoId) ? 3 : 2) : 0
  const currentStepNum =
    step === 'operacao' ? 1 : step === 'suboperacao' ? 2 : hasSuboperacoes(operacaoId) ? 3 : 2
  const canContinue =
    step === 'operacao' ? !!operacaoId : step === 'suboperacao' ? !!suboperacaoId : !!tipoAnimalId

  const breadcrumbParts: string[] = []
  if (operacao) breadcrumbParts.push(operacao.label)
  if (suboperacaoId && operacao) {
    const sub = operacao.suboperacoes.find((s) => s.id === suboperacaoId)
    if (sub) breadcrumbParts.push(sub.label)
  }

  const handleSelectOperacao = (id: string) => {
    setOperacaoId(id)
    setSuboperacaoId('')
    setTipoAnimalId('')
  }

  const handleSelectSuboperacao = (id: string) => {
    setSuboperacaoId(id)
    setTipoAnimalId('')
  }

  const handleContinue = () => {
    if (step === 'operacao') {
      setStep(hasSuboperacoes(operacaoId) ? 'suboperacao' : 'tipo_animal')
    } else if (step === 'suboperacao') {
      setStep('tipo_animal')
    } else {
      const draft: DraftInvoice = {
        tipoOperacao: 'VENDA_GADO',
        operacao_principal: operacaoId,
        suboperacao: hasSuboperacoes(operacaoId) ? suboperacaoId : '',
        tipo_animal: tipoAnimalId,
        userId: user?.id || '',
        propertyId: activeProperty?.id || '',
        cadpro: activeProperty?.inscricao_estadual || '',
      }
      setDraftInvoice(draft)
      navigate('/emitir-gado/next', { replace: true })
    }
  }

  const handleBack = () => {
    if (step === 'tipo_animal') {
      setStep(hasSuboperacoes(operacaoId) ? 'suboperacao' : 'operacao')
    } else if (step === 'suboperacao') {
      setStep('operacao')
    } else {
      navigate('/emitir-nf', { replace: true })
    }
  }

  if (configError) {
    return (
      <AppScaffold>
        <SafeContent className="overflow-hidden">
          <AppHeader exibirCpf exibirCadPro />
          <div className="flex-shrink-0 h-[2px] w-full" style={goldLineStyle} />
          <ScreenTitle>VENDA DE GADO</ScreenTitle>
          <div className="flex-shrink-0 h-[2px] w-full" style={goldLineStyle} />
          <ScreenContent className="flex-1 min-h-0 overflow-y-auto px-5 py-6">
            <ErrorState
              message="Não foi possível carregar as opções de operação."
              onRetry={() => setConfigError(false)}
            />
          </ScreenContent>
        </SafeContent>
      </AppScaffold>
    )
  }

  return (
    <AppScaffold>
      <SafeContent className="overflow-hidden">
        <AppHeader exibirCpf exibirCadPro />
        <div className="flex-shrink-0 h-[2px] w-full" style={goldLineStyle} />
        <ScreenTitle>VENDA DE GADO</ScreenTitle>
        <div className="flex-shrink-0 h-[2px] w-full" style={goldLineStyle} />
        <ScreenContent className="flex-1 min-h-0 overflow-y-auto px-5 py-6">
          <p className="text-center text-xs text-white/50 mb-1">
            {totalSteps > 0 ? `Etapa ${currentStepNum} de ${totalSteps}` : 'Etapa 1'}
          </p>
          <h3 className="text-center text-base font-semibold text-[#A8914E] mb-1">
            {STEP_TITLES[step]}
          </h3>
          {step === 'tipo_animal' && breadcrumbParts.length > 0 && (
            <p className="text-center text-xs text-white/40 mb-4">{breadcrumbParts.join(' › ')}</p>
          )}
          <div className="space-y-3 mt-4">
            {step === 'operacao' &&
              GADO_OPERACOES.map((op) => (
                <GadoOptionButton
                  key={op.id}
                  label={op.label}
                  selected={operacaoId === op.id}
                  onClick={() => handleSelectOperacao(op.id)}
                />
              ))}
            {step === 'suboperacao' &&
              operacao?.suboperacoes.map((sub) => (
                <GadoOptionButton
                  key={sub.id}
                  label={sub.label}
                  selected={suboperacaoId === sub.id}
                  onClick={() => handleSelectSuboperacao(sub.id)}
                />
              ))}
            {step === 'tipo_animal' &&
              GADO_TIPOS_ANIMAL.map((animal) => (
                <GadoOptionButton
                  key={animal.id}
                  label={animal.label}
                  selected={tipoAnimalId === animal.id}
                  onClick={() => setTipoAnimalId(animal.id)}
                />
              ))}
          </div>
        </ScreenContent>
        <div className="flex-shrink-0">
          <div className="h-[2px] w-full" style={goldLineStyle} />
          <div className="px-5 flex flex-col" style={footerStyle}>
            <PrimaryButton onClick={handleContinue} disabled={!canContinue}>
              Continuar
            </PrimaryButton>
            <PrimaryButton variant="secondary" onClick={handleBack}>
              Voltar
            </PrimaryButton>
          </div>
        </div>
      </SafeContent>
    </AppScaffold>
  )
}
