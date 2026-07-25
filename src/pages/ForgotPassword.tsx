import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function ForgotPassword() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ backgroundColor: '#3B626B' }}
    >
      <Link
        to="/login"
        className="absolute top-6 left-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
      >
        <ArrowLeft className="w-6 h-6" />
      </Link>

      <div className="text-center space-y-4 max-w-sm">
        <h1 className="text-white text-2xl font-bold">Recuperação de Senha</h1>
        <p className="text-white/70 text-sm leading-relaxed">
          Esta funcionalidade estará disponível em breve. Entre em contato com o suporte para
          redefinir sua senha.
        </p>
        <Link
          to="/login"
          className="inline-block text-sm hover:underline mt-2"
          style={{ color: '#A8914E' }}
        >
          Voltar para o login
        </Link>
      </div>
    </div>
  )
}
