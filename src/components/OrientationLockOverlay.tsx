import { Smartphone } from 'lucide-react'

export function OrientationLockOverlay() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#002C45] flex flex-col items-center justify-center gap-6 animate-fade-in touch-none">
      <div className="animate-float">
        <Smartphone className="w-16 h-16 text-[#A8914E]" style={{ transform: 'rotate(90deg)' }} />
      </div>
      <p className="text-white text-lg font-semibold text-center px-8 font-mont">
        Gire o dispositivo para o modo retrato
      </p>
      <p className="text-white/50 text-sm text-center px-8">
        O aplicativo funciona apenas na vertical
      </p>
    </div>
  )
}
