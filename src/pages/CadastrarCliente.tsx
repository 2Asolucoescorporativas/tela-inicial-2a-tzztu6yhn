import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { Logo2A } from '@/components/Logo2A'
import { ClientForm } from '@/components/ClientForm'
import { ClientList } from '@/components/ClientList'
import { useAuth } from '@/hooks/use-auth'
import { useSession } from '@/stores/session'
import { useRealtime } from '@/hooks/use-realtime'
import {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente,
  checkDuplicateCpfCnpj,
  type ClienteRecord,
} from '@/services/clientes'
import { unmaskDocument, type ClientFormData } from '@/lib/client-utils'
import { getErrorMessage } from '@/lib/pocketbase/errors'
import { FormPageLayout } from '@/components/FormPageLayout'

export default function CadastrarCliente() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const returnTo = searchParams.get('returnTo')
  const { user } = useAuth()
  const { activeProperty } = useSession()
  const [clients, setClients] = useState<ClienteRecord[]>([])
  const [editingClient, setEditingClient] = useState<ClienteRecord | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formKey, setFormKey] = useState(0)

  const loadClients = useCallback(async () => {
    try {
      setClients(await getClientes())
    } catch {
      /* intentionally ignored */
    }
  }, [])

  useEffect(() => {
    loadClients()
  }, [loadClients])
  useRealtime('clientes', () => {
    loadClients()
  })

  const handleSubmit = async (data: ClientFormData) => {
    setSubmitting(true)
    try {
      const isDuplicate = await checkDuplicateCpfCnpj(data.cpf_cnpj, editingClient?.id)
      if (isDuplicate) {
        toast.error('Já existe um cliente cadastrado com este CPF ou CNPJ.')
        return
      }
      if (editingClient) {
        await updateCliente(editingClient.id, data)
        toast.success('Cliente atualizado com sucesso.')
      } else {
        await createCliente(data)
        toast.success('Cliente cadastrado com sucesso.')
      }
      setEditingClient(null)
      setFormKey((k) => k + 1)
      await loadClients()
      if (returnTo) {
        navigate(returnTo)
      }
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (client: ClienteRecord) => {
    setEditingClient(client)
    setFormKey((k) => k + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteCliente(id)
      toast.success('Cliente excluído com sucesso.')
      await loadClients()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleCancel = () => navigate(returnTo || '/configuracoes')

  return (
    <FormPageLayout className="text-white">
      <div className="p-5 flex items-center gap-3 border-b border-white/10 bg-[#001f31]/60 backdrop-blur-md sticky top-0 z-30 flex-shrink-0">
        <button
          onClick={() => navigate('/configuracoes')}
          className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Logo2A size="xs" showTagline={false} linkTo="/dashboard" />
      </div>
      <div className="px-5 py-3 border-b border-white/10">
        <p className="text-sm font-medium text-white">{user?.name || 'Usuário'}</p>
        {activeProperty && (
          <p className="text-xs text-white/60">
            {activeProperty.nome} • CAD/PRO: {activeProperty.inscricao_estadual}
          </p>
        )}
      </div>
      <div className="flex-1 p-5 space-y-6 animate-fade-in">
        <h1 className="text-xl font-bold text-white">Cadastrar Cliente</h1>
        <ClientForm
          key={formKey}
          initialData={editingClient}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitting={submitting}
        />
        <ClientList clients={clients} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </FormPageLayout>
  )
}
