import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import type { ClienteRecord } from '@/services/clientes'
import { maskDocumentByType } from '@/lib/client-utils'

interface Props {
  clients: ClienteRecord[]
  onEdit: (client: ClienteRecord) => void
  onDelete: (id: string) => void
}

export function ClientList({ clients, onEdit, onDelete }: Props) {
  const [deleteTarget, setDeleteTarget] = useState<ClienteRecord | null>(null)

  const confirmDelete = () => {
    if (deleteTarget) {
      onDelete(deleteTarget.id)
      setDeleteTarget(null)
    }
  }

  if (clients.length === 0) {
    return <p className="text-white/40 text-sm text-center py-6">Nenhum cliente cadastrado.</p>
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wide">
        Clientes Cadastrados ({clients.length})
      </h2>
      {clients.map((c) => (
        <div key={c.id} className="bg-white/5 rounded-[14px] p-4 border border-white/10">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-white font-medium text-sm">{c.nome_razao_social}</p>
              <p className="text-white/60 text-xs">
                {maskDocumentByType(c.cpf_cnpj, c.tipo_pessoa)} • {c.municipio}/{c.uf}
              </p>
              <p className="text-white/40 text-xs">IE: {c.inscricao_estadual || '—'}</p>
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(c)}
                className="text-[#A8914E] hover:text-[#A8914E] hover:bg-[#A8914E]/10 h-8 px-2"
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setDeleteTarget(c)}
                className="text-red-400 hover:text-red-400 hover:bg-red-400/10 h-8 px-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      ))}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir cliente</AlertDialogTitle>
            <AlertDialogDescription>Deseja realmente excluir este cliente?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
