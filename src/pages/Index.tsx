import { useNavigate } from 'react-router-dom'
import brandBgImage from '@/assets/chatgpt-image-26-de-jul.de-2026-204722-95cd6.png'

export default function Index() {
  const navigate = useNavigate()

  const handleEntrar = () => {
    navigate('/login')
  }

  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-between p-6 select-none overflow-hidden bg-[#071c33]">
      {/* Official 2A Rural Brand Background Image Layer */}
      <div
        className="absolute inset-0 z-0 bg-center bg-no-repeat bg-contain md:bg-cover transition-all duration-300 pointer-events-none"
        style={{
          backgroundImage: `url(${brandBgImage})`,
          backgroundColor: '#071c33',
        }}
      />

      {/* Subtle overlay gradients for depth and visual contrast */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#071c33]/30 via-transparent to-[#071c33]/85 pointer-events-none" />

      {/* Central hero area showcasing the brand logo within the background */}
      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center py-12">
        {/* Keeps center space clear for the 2A Rural emblem in the background image */}
      </div>

      {/* Footer CTA & Tagline */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center mb-8 space-y-4 animate-fade-in-up">
        <button
          onClick={handleEntrar}
          type="button"
          style={{ backgroundColor: '#FFFFFF', color: '#071c33' }}
          className="w-[85%] sm:w-[80%] h-14 rounded-2xl font-sans font-bold text-xl tracking-wide shadow-2xl hover:bg-amber-50 active:scale-95 transition-all duration-150 flex items-center justify-center border border-white/20"
        >
          ENTRAR
        </button>

        <span className="text-white/85 text-xs sm:text-sm font-light tracking-wider text-center drop-shadow-sm px-2">
          Emissão Digital de Nota Fiscal Produtor{' '}
          <span style={{ color: '#D4AF37' }} className="font-semibold">
            Rural
          </span>
        </span>
      </div>
    </div>
  )
}
