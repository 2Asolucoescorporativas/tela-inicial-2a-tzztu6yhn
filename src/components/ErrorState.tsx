import { AlertCircle } from 'lucide-react'
import { secondaryButtonStyle } from '@/lib/button-styles'

interface ErrorStateProps {
  message: string
  retryLabel?: string
  onRetry?: () => void
}

export function ErrorState({ message, retryLabel = 'Tentar novamente', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in">
      <AlertCircle className="w-12 h-12 text-red-400/70 mb-3" />
      <p className="text-white/70 text-sm mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="px-6 hover:bg-[#C89B51]/10 transition-colors cursor-pointer"
        style={secondaryButtonStyle}
      >
        {retryLabel}
      </button>
    </div>
  )
}
