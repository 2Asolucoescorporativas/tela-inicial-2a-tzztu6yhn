import { Loader2 } from 'lucide-react'

export function LoadingOverlay({ message = 'Carregando...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white/10 rounded-2xl px-8 py-6 flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#A8914E]" />
        <p className="text-white text-sm font-medium">{message}</p>
      </div>
    </div>
  )
}
