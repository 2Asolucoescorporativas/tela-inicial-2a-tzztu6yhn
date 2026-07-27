import { Logo2A } from '@/components/Logo2A'

interface BrandedSplashScreenProps {
  message?: string
}

export function BrandedSplashScreen({ message = 'Carregando...' }: BrandedSplashScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#071C33] text-white p-6">
      <Logo2A size="lg" className="animate-pulse mb-6" />
      <p className="text-sm font-medium text-[#D0A85C] tracking-wide animate-fade-in">{message}</p>
    </div>
  )
}
