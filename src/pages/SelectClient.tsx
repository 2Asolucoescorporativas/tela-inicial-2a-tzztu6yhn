import { useState, useMemo, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession, type SelectedClient } from '@/stores/session'
import { AppHeader } from '@/components/AppHeader'
import { getClientes, type ClienteRecord } from '@/services/clientes'
import { useRealtime } from '@/hooks/use-realtime'
import { maskDocumentByType } from '@/lib/client-utils'
import { filterClientsBySearch } from '@/lib/search-utils'
import { cn } from '@/lib/utils'
import { Search, UserPlus, Check, Users } from 'lucide-react'
import { FormPageLayout } from '@/components/FormPageLayout'

export default function SelectClient() {
  const navigate = useNavigate()
  const { selectedClient, setSelectedClient, clearSelectedClient, clearDraftInvoice } = useSession()
  const [clients, setClients] = useState<ClienteRecord[]>([])
  const [search, setSearch] = useState('')
  const [localSelectedId, setLocalSelectedId] = useState<string | null>(selectedClient?.id || null)
  const [loading, setLoading] = useState(true)

  const loadClients = useCallback(async () => {
    try {
      const data = await getClientes()
      setClients(data)
    } catch {
      /* intentionally ignored */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadClients()
  }, [loadClients])

  useRealtime('clientes', () => {
    loadClients()
  })

  const filteredClients = useMemo(() => {
    return filterClientsBySearch(clients, search)
  }, [clients, search])

  const handleSelect = (client: ClienteRecord) => {
    setLocalSelectedId(client.id)
  }

  const handleContinuar = () => {
    const client = clients.find((c) => c.id === localSelectedId)
    if (!client) return
    const sc: SelectedClient = {
      id: client.id,
      tipo_pessoa: client.tipo_pessoa,
      cpf_cnpj: client.cpf_cnpj,
      nome_razao_social: client.nome_razao_social,
      nome_fantasia: client.nome_fantasia,
      indicador_ie: client.indicador_ie,
      inscricao_estadual: client.inscricao_estadual,
      cep: client.cep,
      logradouro: client.logradouro,
      numero: client.numero,
      complemento: client.complemento,
      bairro: client.bairro,
      municipio: client.municipio,
      codigo_ibge: client.codigo_ibge,
      uf: client.uf,
      pais: client.pais,
      codigo_pais: client.codigo_pais,
    }
    setSelectedClient(sc)
    navigate('/emitir-leite')
  }

  const handleCancel = () => {
    clearSelectedClient()
    clearDraftInvoice()
    navigate('/emitir-nf')
  }

  return (
    <FormPageLayout className="text-white">
      <AppHeader etapaAtual={1} totalEtapas={3} />

      <div className="flex-1 flex flex-col px-5 pt-6 pb-8 animate-fade-in">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-white">Selecionar Cliente</h2>
          <p className="text-sm text-white/60 mt-1">Escolha o cliente destinatário da nota.</p>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-white/50 text-sm">Carregando clientes...</p>
          </div>
        ) : clients.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-10">
            <div className="p-4 bg-white/5 rounded-2xl">
              <Users className="w-10 h-10 text-white/30" />
            </div>
            <div className="space-y-1">
              <p className="text-white font-medium">Nenhum cliente cadastrado.</p>
              <p className="text-sm text-white/60">
                Cadastre um cliente para continuar com a emissão da nota.
              </p>
            </div>
            <button
              onClick={() =>
                navigate('/cadastrar-cliente?returnTo=/emitir-leite/selecionar-cliente')
              }
              className="bg-white text-[#002C45] rounded-xl px-6 py-3 font-bold hover:brightness-95 transition-all flex items-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Cadastrar Cliente
            </button>
          </div>
        ) : (
          <>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#002C45]/50 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar cliente"
                className="w-full bg-white text-[#002C45] rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A8914E]"
              />
            </div>

            <div className="space-y-3 flex-1">
              {filteredClients.length === 0 ? (
                <p className="text-white/40 text-sm text-center py-6">
                  Nenhum cliente encontrado com a pesquisa.
                </p>
              ) : (
                filteredClients.map((c) => {
                  const isSelected = localSelectedId === c.id
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleSelect(c)}
                      className={cn(
                        'w-full text-left rounded-xl p-4 border-2 transition-all',
                        isSelected
                          ? 'border-[#A8914E] bg-[#A8914E]/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20',
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 min-w-0 flex-1">
                          <p className="text-white font-semibold text-sm truncate">
                            {c.nome_razao_social}
                          </p>
                          <p className="text-white/60 text-xs">
                            {c.tipo_pessoa === 'FISICA' ? 'CPF' : 'CNPJ'}:{' '}
                            {maskDocumentByType(c.cpf_cnpj, c.tipo_pessoa)}
                          </p>
                          <p className="text-white/50 text-xs">
                            {c.municipio}/{c.uf}
                          </p>
                          {c.inscricao_estadual && (
                            <p className="text-white/40 text-xs">IE: {c.inscricao_estadual}</p>
                          )}
                        </div>
                        {isSelected && (
                          <div className="p-1 bg-[#A8914E] rounded-full flex-shrink-0">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })
              )}
            </div>

            <div className="mt-auto pt-6 flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 rounded-xl py-4 px-6 font-bold text-base bg-white/10 border-2 border-white/20 text-white hover:bg-white/15 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleContinuar}
                disabled={!localSelectedId}
                className={cn(
                  'flex-1 rounded-xl py-4 px-6 font-bold text-base transition-all',
                  localSelectedId
                    ? 'bg-white border-2 border-[#A8914E] text-[#002C45] hover:brightness-95 active:scale-[0.98]'
                    : 'bg-white/10 border-2 border-white/20 text-white/30 cursor-not-allowed',
                )}
              >
                Continuar
              </button>
            </div>
          </>
        )}
      </div>
    </FormPageLayout>
  )
}
