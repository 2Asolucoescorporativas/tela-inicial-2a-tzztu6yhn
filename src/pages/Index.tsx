import { useNavigate } from 'react-router-dom'
import { Logo2A } from '@/components/Logo2A'

export default function Index() {
  const navigate = useNavigate()

  const handleEntrar = () => {
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#002C45] flex flex-col items-center justify-between p-6 select-none relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />

      <div className="w-full flex-1 flex flex-col items-center justify-center -mt-10 animate-fade-in-up">
        <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center">
          <Logo2A size="lg" showTagline={true} />
        </div>
      </div>

      <div className="w-full max-w-sm flex flex-col items-center mb-8 animate-fade-in space-y-4">
        <button
          onClick={handleEntrar}
          type="button"
          className="w-[80%] h-14 bg-gold-gradient rounded-2xl text-[#002C45] font-sans font-bold text-xl tracking-wide shadow-lg hover:brightness-105 active:scale-95 transition-all duration-150 flex items-center justify-center"
        >
          ENTRAR
        </button>

        <span className="text-white/40 text-xs font-light tracking-wider">
          Emissão Digital de Nota Fiscal Produtor Rural
        </span>
      </div>
    </div>
  )
}
