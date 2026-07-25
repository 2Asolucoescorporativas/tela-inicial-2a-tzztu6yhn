import { useNavigate } from 'react-router-dom'
import { Logo2A } from '@/components/Logo2A'

export default function Index() {
  const navigate = useNavigate()

  const handleEntrar = () => {
    navigate('/login')
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between p-6 select-none relative overflow-hidden"
      style={{ backgroundColor: '#3B626B' }}
    >
      <div className="w-full flex-1 flex flex-col items-center justify-center -mt-10 animate-fade-in-up">
        <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center">
          <Logo2A size="lg" showTagline={true} />
        </div>
      </div>

      <div className="w-full max-w-sm flex flex-col items-center mb-8 animate-fade-in space-y-4">
        <button
          onClick={handleEntrar}
          type="button"
          style={{ backgroundColor: '#FFFFFF', color: '#3B626B' }}
          className="w-[80%] h-14 bg-[#FFFFFF] rounded-2xl text-[#3B626B] font-sans font-bold text-xl tracking-wide shadow-lg hover:bg-white/95 active:scale-95 transition-all duration-150 flex items-center justify-center"
        >
          ENTRAR
        </button>

        <span className="text-white/60 text-xs font-light tracking-wider text-center">
          Emissão Digital de Nota Fiscal Produtor{' '}
          <span style={{ color: '#A8914E' }} className="text-[#A8914E] font-semibold">
            Rural
          </span>
        </span>
      </div>
    </div>
  )
}
