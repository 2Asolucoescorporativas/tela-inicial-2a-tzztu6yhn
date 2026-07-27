import { Loader2 } from 'lucide-react'
import { Logo2A } from '@/components/Logo2A'

interface BrandedSplashScreenProps {
  message?: string
}

export function BrandedSplashScreen({
  message = 'Carregando o sistema...',
}: BrandedSplashScreenProps) {
  return (
    <div className="h-[100dvh] min-h-[100dvh] w-full bg-[#071C33] flex flex-col items-center justify-center p-6 select-none relative overflow-hidden">
      <div className="absolute inset-0 bg-radial from-[#0e2a4a]/50 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full space-y-8 text-center animate-fade-in">
        <Logo2A size="lg" showTagline={true} />

        <div className="flex flex-col items-center space-y-3 pt-2">
          <Loader2 className="w-8 h-8 text-[#C89B51] animate-spin" />
          <span className="text-[#D0A85C]/90 text-xs sm:text-sm font-medium tracking-wide">
            {message}
          </span>
        </div>
      </div>
    </div>
  )
}
