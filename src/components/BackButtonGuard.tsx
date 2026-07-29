import { useBackButtonInterceptor } from '@/hooks/use-back-button-interceptor'
import { ExitConfirmationDialog } from '@/components/ExitConfirmationDialog'

interface BackButtonGuardProps {
  enabled?: boolean
}

export function BackButtonGuard({ enabled = true }: BackButtonGuardProps) {
  const { showExitModal, setModal, performExit } = useBackButtonInterceptor(enabled)

  if (!enabled) return null

  return (
    <ExitConfirmationDialog
      open={showExitModal}
      onContinue={() => setModal(false)}
      onExit={performExit}
    />
  )
}
