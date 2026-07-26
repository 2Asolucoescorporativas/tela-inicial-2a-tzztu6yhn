import { useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import { Logo2A } from '@/components/Logo2A'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { unmaskCpf } from '@/lib/cpf-utils'
import { maskCpfPartial, type RegistrationFlowState } from '@/lib/registration-utils'
import { concluirCadastro } from '@/services/cadastro'
import { toast } from 'sonner'

export default function RegisterRevisao() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as RegistrationFlowState | null

  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  if (!state || !state.senha || !state.propriedadeNomes?.length) {
    return <Navigate to="/register" replace />
  }

  const propriedades = state.propriedadeNomes.map((pn) => {
    const prop = state.selectedPropriedades.find(
      (c) => c.inscricao_estadual === pn.inscricao_estadual,
    )
    return {
      nome: pn.nome,
      inscricao_estadual: pn.inscricao_estadual,
      municipio: prop?.municipio || '-',
      uf: prop?.uf || '-',
    }
  })

  const openDialog = () => {
    setErrorMsg('')
    setDialogOpen(true)
  }

  const handleConfirm = async () => {
    if (submitting) return
    setSubmitting(true)
    setErrorMsg('')

    try {
      const result = await concluirCadastro({
        consulta_id: state.consulta_id,
        cpf: unmaskCpf(state.cpf),
        senha: state.senha!,
        confirmacao_senha: state.senha!,
        propriedades: state.propriedadeNomes!,
      })

      if (result.success) {
        setDialogOpen(false)
        toast.success('Cadastro concluído com sucesso! Faça seu login.')
        navigate('/login', { state: { registrationSuccess: true } })
        return
      }
      const errMsg = result.error || result.message || 'Erro ao concluir cadastro.'
      setErrorMsg(errMsg)
      toast.error(errMsg)
    } catch (err) {
      const error = err as {
        status?: number
        response?: { error?: string; message?: string }
        message?: string
      }
      const specificError = error?.response?.error || error?.response?.message || error?.message
      const displayMsg =
        specificError ||
        'Não foi possível concluir o cadastro. Verifique os dados e tente novamente.'
      setErrorMsg(displayMsg)
      toast.error(displayMsg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col p-6 relative" style={{ backgroundColor: '#3B626B' }}>
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="w-full max-w-md mx-auto flex flex-col space-y-5 pt-16 pb-10 animate-fade-in-up">
        <div className="text-center space-y-2">
          <Logo2A size="sm" showTagline={true} linkTo="/" className="mx-auto mb-2" />
          <h1 className="text-2xl font-bold" style={{ color: '#A8914E' }}>
            Revise seu cadastro
          </h1>
          <p className="text-white/70 text-sm">Confira seus dados antes de finalizar.</p>
        </div>

        {state.isMock && (
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-wide text-white/40 font-medium">
              AMBIENTE DE TESTE
            </span>
            <span className="text-[10px] text-white/30">Dados simulados</span>
          </div>
        )}

        <div className="bg-white rounded-[14px] shadow-md p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Nome</span>
            <span className="text-gray-900 font-medium text-right">{state.nomeUsuario}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">CPF</span>
            <span className="text-gray-900 font-medium">
              {maskCpfPartial(unmaskCpf(state.cpf))}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Propriedades</span>
            <span className="text-gray-900 font-medium">{propriedades.length}</span>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-white/70 text-sm font-medium">Propriedades selecionadas</p>
          {propriedades.map((prop, idx) => (
            <div key={idx} className="bg-white rounded-[14px] shadow-md p-4 space-y-1.5">
              <p className="font-bold text-gray-900 text-sm">{prop.nome}</p>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">IE</span>
                <span className="text-gray-900 font-medium">{prop.inscricao_estadual}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Município/UF</span>
                <span className="text-gray-900 font-medium">
                  {prop.municipio}/{prop.uf}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={() => navigate(-1)}
            disabled={submitting}
            className="w-[80%] mx-auto block text-white/80 font-bold text-lg rounded-[14px] border border-white/20 hover:bg-white/5 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ height: '56px' }}
          >
            VOLTAR E CORRIGIR
          </button>
          <button
            onClick={openDialog}
            disabled={submitting}
            className="w-[80%] mx-auto block text-white font-bold text-lg rounded-[14px] shadow-md hover:brightness-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#A8914E', height: '56px' }}
          >
            CONCLUIR CADASTRO
          </button>
        </div>
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!submitting) {
            setDialogOpen(open)
            if (!open) setErrorMsg('')
          }
        }}
      >
        <DialogContent className="max-w-sm rounded-[14px]">
          <DialogHeader>
            <DialogTitle className="text-center" style={{ color: '#3B626B' }}>
              Confirmar Cadastro
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Deseja concluir seu cadastro? Após a confirmação, suas propriedades e sua senha serão
              vinculadas ao seu CPF.
            </DialogDescription>
          </DialogHeader>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-600 text-sm">{errorMsg}</p>
            </div>
          )}

          <div className="flex flex-col gap-3 mt-2">
            <button
              onClick={() => {
                setDialogOpen(false)
                setErrorMsg('')
              }}
              disabled={submitting}
              className="w-full py-3.5 rounded-[14px] border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50"
            >
              CANCELAR
            </button>
            <button
              onClick={handleConfirm}
              disabled={submitting}
              className="w-full py-3.5 rounded-[14px] text-white font-bold shadow-md hover:brightness-105 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
              style={{ backgroundColor: '#A8914E' }}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  CONFIRMANDO...
                </>
              ) : (
                'CONFIRMAR'
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
