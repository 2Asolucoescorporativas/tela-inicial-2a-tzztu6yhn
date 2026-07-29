import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppScaffold } from '@/components/AppScaffold'
import { SafeContent } from '@/components/SafeContent'
import { AppHeader } from '@/components/AppHeader'
import { ScreenTitle } from '@/components/ScreenTitle'
import { ScreenContent } from '@/components/ScreenContent'
import { PrimaryButton } from '@/components/PrimaryButton'
import { getInvoices, type InvoiceRecord } from '@/services/invoices'
import { formatCurrency } from '@/lib/decimal-utils'
import { FileCheck2, DollarSign, TrendingUp, Calendar } from 'lucide-react'

export default function Estatistica() {
  const navigate = useNavigate()
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([])

  useEffect(() => {
    getInvoices()
      .then((data) => setInvoices(data))
      .catch(() => setInvoices([]))
  }, [])

  const emitidas = invoices.filter((i) => i.status === 'emitida')
  const totalValor = emitidas.reduce((acc, curr) => acc + (curr.total_value || 0), 0)
  const totalCount = emitidas.length

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const emitidasMes = emitidas.filter((i) => {
    if (!i.created) return false
    const d = new Date(i.created)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })
  const valorMes = emitidasMes.reduce((acc, curr) => acc + (curr.total_value || 0), 0)

  const leiteInvoices = emitidas.filter((i) => i.items_summary?.toLowerCase().includes('leite'))
  const gadoInvoices = emitidas.filter(
    (i) =>
      i.items_summary?.toLowerCase().includes('gado') ||
      i.items_summary?.toLowerCase().includes('bovino'),
  )
  const outrosInvoices = emitidas.filter(
    (i) =>
      !i.items_summary?.toLowerCase().includes('leite') &&
      !i.items_summary?.toLowerCase().includes('gado') &&
      !i.items_summary?.toLowerCase().includes('bovino'),
  )

  const valorLeite = leiteInvoices.reduce((acc, curr) => acc + (curr.total_value || 0), 0)
  const valorGado = gadoInvoices.reduce((acc, curr) => acc + (curr.total_value || 0), 0)
  const valorOutros = outrosInvoices.reduce((acc, curr) => acc + (curr.total_value || 0), 0)

  return (
    <AppScaffold>
      <SafeContent className="overflow-hidden flex flex-col h-full bg-[#002C45]">
        <AppHeader exibirBotaoVoltar exibirCpf exibirCadPro />

        <div className="flex-shrink-0 h-[2px] w-full" style={{ backgroundColor: '#A8914E' }} />

        <ScreenTitle>ESTATÍSTICAS</ScreenTitle>

        <div className="flex-shrink-0 h-[2px] w-full" style={{ backgroundColor: '#A8914E' }} />

        <ScreenContent className="flex-1 min-h-0 overflow-y-auto px-5 py-6">
          <div className="space-y-6 max-w-md mx-auto">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 border border-white/15 rounded-xl p-4 text-white">
                <div className="flex items-center gap-2 text-[#A8914E] mb-2">
                  <FileCheck2 className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    Notas Emitidas
                  </span>
                </div>
                <p className="text-2xl font-extrabold text-white">{totalCount}</p>
                <p className="text-[11px] text-white/50 mt-1">Total acumulado</p>
              </div>

              <div className="bg-white/10 border border-white/15 rounded-xl p-4 text-white">
                <div className="flex items-center gap-2 text-[#F9E27D] mb-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">Faturamento</span>
                </div>
                <p className="text-xl font-extrabold text-white">{formatCurrency(totalValor)}</p>
                <p className="text-[11px] text-white/50 mt-1">Total em vendas</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-[#A8914E]">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">Mês Atual</span>
                </div>
                <span className="text-xs bg-[#A8914E]/20 text-[#F9E27D] px-2.5 py-0.5 rounded-full font-medium">
                  {emitidasMes.length} {emitidasMes.length === 1 ? 'nota' : 'notas'}
                </span>
              </div>
              <p className="text-2xl font-bold text-white">{formatCurrency(valorMes)}</p>
              <p className="text-xs text-white/60 mt-1">Total faturado no mês vigente</p>
            </div>

            <div className="bg-white/10 border border-white/15 rounded-xl p-4 text-white space-y-3">
              <div className="flex items-center gap-2 text-[#A8914E] mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Distribuição por Categoria
                </span>
              </div>

              <div className="space-y-3 pt-1">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/80 font-medium">
                      Venda de Leite ({leiteInvoices.length})
                    </span>
                    <span className="text-[#F9E27D] font-bold">{formatCurrency(valorLeite)}</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gold-gradient h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${totalValor > 0 ? Math.min(100, Math.round((valorLeite / totalValor) * 100)) : 0}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/80 font-medium">
                      Venda de Gado ({gadoInvoices.length})
                    </span>
                    <span className="text-[#F9E27D] font-bold">{formatCurrency(valorGado)}</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${totalValor > 0 ? Math.min(100, Math.round((valorGado / totalValor) * 100)) : 0}%`,
                      }}
                    />
                  </div>
                </div>

                {outrosInvoices.length > 0 && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/80 font-medium">
                        Outras Operações ({outrosInvoices.length})
                      </span>
                      <span className="text-[#F9E27D] font-bold">
                        {formatCurrency(valorOutros)}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-400 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            totalValor > 0
                              ? Math.min(100, Math.round((valorOutros / totalValor) * 100))
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2">
              <PrimaryButton variant="secondary" onClick={() => navigate('/configuracoes')}>
                Voltar para Configurações
              </PrimaryButton>
            </div>
          </div>
        </ScreenContent>
      </SafeContent>
    </AppScaffold>
  )
}
