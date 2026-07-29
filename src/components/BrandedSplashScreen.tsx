import { Logo2A } from '@/components/Logo2A'

interface BrandedSplashScreenProps {
  message?: string
}

export function BrandedSplashScreen({ message = 'Carregando...' }: BrandedSplashScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#071C33] text-white p-6">
      <div className="flex flex-col items-center animate-fade-in">
        <div className="text-6xl font-bold text-[#D0A85C] leading-none">2A</div>
        <div className="text-xl font-bold text-[#D0A85C] mt-1 tracking-[4px]">RURAL</div>
        <div className="w-24 h-0.5 bg-[#D0A85C]/40 rounded mt-4" />
        <p className="text-sm font-medium text-white/60 tracking-wide mt-4">{message}</p>
      </div>
    </div>
  )
}
