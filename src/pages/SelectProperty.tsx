import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useSession } from '@/stores/session'
import { getPropriedades, type PropriedadeRecord } from '@/services/propriedades'
import { maskCpf } from '@/lib/cpf-utils'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Check,
  MoreVertical,
  User,
  Settings,
  LogOut,
  Loader2,
  MapPin,
  FileText,
  Home,
} from 'lucide-react'

export default function SelectProperty() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { setActiveProperty } = useSession()
  const [properties, setProperties] = useState<PropriedadeRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    getPropriedades()
      .then(setProperties)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleContinue = () => {
    const selected = properties.find((p) => p.id === selectedId)
    if (!selected) return
    setActiveProperty({
      id: selected.id,
      nome: selected.nome,
      inscricao_estadual: selected.inscricao_estadual,
      municipio: selected.municipio,
      uf: selected.uf,
    })
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#002C45] text-white max-w-md mx-auto sm:max-w-xl">
      <div className="p-5 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold-gradient text-[#002C45] font-bold flex items-center justify-center text-lg">
            {user?.name ? user.name[0] : 'A'}
          </div>
          <div>
            <h2 className="text-sm font-bold leading-tight">{user?.name || 'Usuário'}</h2>
            <span className="text-[11px] text-white/60">CPF: {maskCpf(user?.cpf || '')}</span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-white/60 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" /> Perfil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" /> Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" /> Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="p-5 space-y-5 animate-fade-in pb-10">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold" style={{ color: '#A8914E' }}>
            Selecione a propriedade
          </h1>
          <p className="text-white/70 text-sm">
            Escolha a propriedade que deseja utilizar nesta sessão.
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#A8914E]" />
          </div>
        ) : properties.length === 0 ? (
          <div className="py-12 text-center text-white/50 text-sm">
            Nenhuma propriedade encontrada. Entre em contato com o suporte.
          </div>
        ) : (
          <div className="space-y-3">
            {properties.map((prop) => {
              const isSelected = selectedId === prop.id
              return (
                <div
                  key={prop.id}
                  onClick={() => setSelectedId(prop.id)}
                  className={cn(
                    'bg-white rounded-2xl p-4 cursor-pointer transition-all relative',
                    isSelected ? 'border-2 border-[#A8914E] shadow-lg' : 'border border-gray-200',
                  )}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#A8914E] flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <Home className="w-5 h-5 text-[#A8914E]" />
                    <span className="font-bold text-gray-900 text-base">{prop.nome}</span>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span>IE: {prop.inscricao_estadual}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>
                        {prop.municipio} - {prop.uf}
                      </span>
                    </div>
                  </div>
                  {/* Reserved structural space for future fields:
                      Situação da IE, Última Sincronização, Certificado Digital,
                      Qtd Notas Emitidas, Alertas, Pendências, Eventos Pendentes */}
                </div>
              )
            })}
          </div>
        )}

        <button
          onClick={handleContinue}
          disabled={!selectedId}
          className="w-[85%] mx-auto block text-white font-bold text-lg rounded-[14px] shadow-md hover:brightness-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
          style={{ backgroundColor: '#A8914E', height: '56px' }}
        >
          CONTINUAR
        </button>
      </div>
    </div>
  )
}
