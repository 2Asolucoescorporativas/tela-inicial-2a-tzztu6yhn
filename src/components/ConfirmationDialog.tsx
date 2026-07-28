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

interface ConfirmationDialogProps {
  open: boolean
  title?: string
  message: string
  cancelLabel?: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmationDialog({
  open,
  title = 'Confirmação',
  message,
  cancelLabel = 'Cancelar',
  confirmLabel = 'Confirmar',
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            onClick={onCancel}
            className="flex-1 hover:bg-[#C89B51]/10 transition-colors"
            style={secondaryButtonStyle}
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 hover:brightness-105 transition-all"
            style={primaryButtonStyle}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
