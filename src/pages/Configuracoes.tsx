import { useNavigate } from 'react-router-dom'
import { AppScaffold } from '@/components/AppScaffold'
import { SafeContent } from '@/components/SafeContent'
import { AppHeader } from '@/components/AppHeader'
import { ScreenTitle } from '@/components/ScreenTitle'
import { ScreenContent } from '@/components/ScreenContent'
import { PrimaryButton } from '@/components/PrimaryButton'
import { UserPlus, BarChart3, Building2, LogOut, FileText } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useSession } from '@/stores/session'

export default function Configuracoes() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const { activeProperty, setActiveProperty } = useSession()

  const handleLogout = () => {
    signOut()
    navigate('/login')
  }

  return (
    <AppScaffold>
      <SafeContent className="overflow-hidden flex flex-col h-full bg-[#002C45]">
        <AppHeader exibirBotaoVoltar exibirCpf exibirCadPro />

        <div className="flex-shrink-0 h-[2px] w-full" style={{ backgroundColor: '#A8914E' }} />

        <ScreenTitle>CONFIGURAÇÕES</ScreenTitle>

        <div className="flex-shrink-0 h-[2px] w-full" style={{ backgroundColor: '#A8914E' }} />

        <ScreenContent className="flex-1 min-h-0 overflow-y-auto px-5 py-6">
          <div className="space-y-4 max-w-md mx-auto">
            {activeProperty && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-white space-y-1">
                <span className="text-xs font-semibold text-[#A8914E] uppercase tracking-wide">
                  Propriedade Ativa
                </span>
                <p className="font-bold text-base text-white">{activeProperty.nome}</p>
                <p className="text-xs text-white/60">
                  IE: {activeProperty.inscricao_estadual} | {activeProperty.municipio}/
                  {activeProperty.uf}
                </p>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <button
                onClick={() => navigate('/cadastrar-cliente')}
                className="w-full flex items-center justify-between bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl px-4 py-3.5 text-white transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#A8914E]/20 text-[#F9E27D] rounded-lg">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold">Cadastrar Cliente</p>
                    <p className="text-xs text-white/60">Gerenciar destinatários das NFe</p>
                  </div>
                </div>
                <span className="text-white/40 text-lg">&rsaquo;</span>
              </button>

              <button
                onClick={() => navigate('/estatistica')}
                className="w-full flex items-center justify-between bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl px-4 py-3.5 text-white transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#A8914E]/20 text-[#F9E27D] rounded-lg">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold">Estatísticas</p>
                    <p className="text-xs text-white/60">Relatórios e volume de vendas</p>
                  </div>
                </div>
                <span className="text-white/40 text-lg">&rsaquo;</span>
              </button>

              <button
                onClick={() => {
                  setActiveProperty(null)
                  navigate('/selecionar-propriedade')
                }}
                className="w-full flex items-center justify-between bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl px-4 py-3.5 text-white transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#A8914E]/20 text-[#F9E27D] rounded-lg">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold">Trocar Propriedade</p>
                    <p className="text-xs text-white/60">
                      Alternar entre suas propriedades cadastradas
                    </p>
                  </div>
                </div>
                <span className="text-white/40 text-lg">&rsaquo;</span>
              </button>

              <button
                onClick={() => navigate('/historico')}
                className="w-full flex items-center justify-between bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl px-4 py-3.5 text-white transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#A8914E]/20 text-[#F9E27D] rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold">Histórico de Notas</p>
                    <p className="text-xs text-white/60">Consultar todas as NFe emitidas</p>
                  </div>
                </div>
                <span className="text-white/40 text-lg">&rsaquo;</span>
              </button>

              <div className="pt-4">
                <PrimaryButton
                  variant="secondary"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  <span className="text-red-400">Sair da Conta</span>
                </PrimaryButton>
              </div>
            </div>
          </div>
        </ScreenContent>
      </SafeContent>
    </AppScaffold>
  )
}
