import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { primaryButtonStyle, secondaryButtonStyle } from '@/lib/button-styles'

interface ExitConfirmationDialogProps {
  open: boolean
  onContinue: () => void
  onExit: () => void
}

export function ExitConfirmationDialog({ open, onContinue, onExit }: ExitConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onContinue()}>
      <DialogContent className="max-w-sm bg-[#071C33] border-[#C89B51]/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Sair do Sistema</DialogTitle>
          <DialogDescription className="text-white/80">
            Deseja realmente sair do sistema?
            <br />
            Pressione novamente o botão <strong className="text-[#D4AF37]">Voltar</strong> do
            smartphone para confirmar o encerramento da sessão.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            onClick={onContinue}
            className="flex-1 hover:bg-[#C89B51]/10 transition-colors"
            style={secondaryButtonStyle}
          >
            Continuar utilizando
          </Button>
          <Button
            onClick={onExit}
            className="flex-1 hover:brightness-105 transition-all"
            style={primaryButtonStyle}
          >
            Sair agora
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
