import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useSession } from '@/stores/session'

export function AppFooter() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const {
    clearActiveProperty,
    clearDraftInvoice,
    clearRecipient,
    clearSelectedClient,
    clearOperationType,
  } = useSession()

  const handleSair = () => {
    clearActiveProperty()
    clearDraftInvoice()
    clearRecipient()
    clearSelectedClient()
    clearOperationType()
    signOut()
    navigate('/login')
  }

  return (
    <footer className="border-t border-white/10 bg-[#001f31]/60 backdrop-blur-md safe-area-pb flex-shrink-0">
      <div className="max-w-md mx-auto sm:max-w-xl px-5 py-3 flex justify-center">
        <button
          onClick={handleSair}
          className="text-mont-medium text-white/60 hover:text-white transition-colors py-1.5 px-4"
        >
          🚪 Sair do aplicativo
        </button>
      </div>
    </footer>
  )
}
