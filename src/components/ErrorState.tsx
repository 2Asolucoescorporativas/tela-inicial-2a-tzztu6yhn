import { AlertCircle } from 'lucide-react'

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
        className="text-[#A8914E] font-medium text-sm border border-[#A8914E]/30 rounded-[14px] px-6 min-h-[48px] hover:bg-[#A8914E]/10 transition-colors"
      >
        {retryLabel}
      </button>
    </div>
  )
}
