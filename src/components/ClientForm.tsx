import { useState, type ReactNode } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'
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
import { Search, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  maskCnpj,
  maskCep,
  unmaskDocument,
  getDefaultClientForm,
  validateClientForm,
  recordToForm,
  type ClientFormData,
} from '@/lib/client-utils'
import type { ClienteRecord } from '@/services/clientes'
import { consultarCnpj } from '@/services/clientes'

interface Props {
  initialData?: ClienteRecord | null
  onSubmit: (data: ClientFormData) => Promise<void>
  onCancel: () => void
  submitting?: boolean
}

function Field({
  label,
  required,
  optional,
  error,
  children,
}: {
  label: string
  required?: boolean
  optional?: boolean
  error?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-gray-700 text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
        {optional && <span className="text-gray-400 text-xs ml-1">(opcional)</span>}
      </Label>
      {children}
      {error && <p className="text-red-500 text-xs animate-fade-in">{error}</p>}
    </div>
  )
}

export function ClientForm({ initialData, onSubmit, onCancel, submitting }: Props) {
  const [cnpjInput, setCnpjInput] = useState(() =>
    initialData ? maskCnpj(initialData.cpf_cnpj) : '',
  )
  const [consulting, setConsulting] = useState(false)
  const [consultError, setConsultError] = useState('')
  const [form, setForm] = useState<ClientFormData>(() =>
    initialData
      ? recordToForm(initialData as unknown as Record<string, unknown>)
      : getDefaultClientForm(),
  )
  const [hasData, setHasData] = useState(!!initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  const handleConsult = async () => {
    const clean = unmaskDocument(cnpjInput)
    setConsultError('')
    if (clean.length !== 14) {
      setConsultError('CNPJ deve conter 14 dígitos')
      return
    }
    setConsulting(true)
    try {
      const result = await consultarCnpj(clean)
      setForm(recordToForm(result as unknown as Record<string, unknown>))
      setHasData(true)
      setErrors({})
      setIsDirty(false)
    } catch (err) {
      setConsultError(err instanceof Error ? err.message : 'Erro ao consultar CNPJ')
    } finally {
      setConsulting(false)
    }
  }

  const update = (field: keyof ClientFormData, value: string) => {
    setForm((p) => ({ ...p, [field]: value }))
    setIsDirty(true)
    if (errors[field])
      setErrors((p) => {
        const n = { ...p }
        delete n[field]
        return n
      })
  }
  const handleIeChange = (v: string) => {
    update('indicador_ie', v)
    if (v === '9') update('inscricao_estadual', '')
  }
  const handleSubmit = async () => {
    const ve = validateClientForm(form)
    if (Object.keys(ve).length > 0) {
      setErrors(ve)
      return
    }
    await onSubmit(form)
  }
  const handleCancelClick = () => {
    if (isDirty) setShowCancelDialog(true)
    else onCancel()
  }

  const ieDisabled = form.indicador_ie === '9'
  const cls = 'bg-white text-gray-900 rounded-[14px]'
  const ieOptions = [
    { v: '1', l: 'Contribuinte do ICMS' },
    { v: '2', l: 'Contribuinte isento' },
    { v: '9', l: 'Não contribuinte' },
  ]

  const txt = (
    name: keyof ClientFormData,
    label: string,
    opts?: {
      req?: boolean
      opt?: boolean
      max?: number
      mask?: (v: string) => string
      tf?: (v: string) => string
      ph?: string
    },
  ) => (
    <Field label={label} required={opts?.req} optional={opts?.opt} error={errors[name]}>
      <Input
        value={form[name] as string}
        onChange={(e) =>
          update(
            name,
            opts?.mask
              ? opts.mask(e.target.value)
              : opts?.tf
                ? opts.tf(e.target.value)
                : e.target.value,
          )
        }
        className={cls}
        maxLength={opts?.max}
        placeholder={opts?.ph}
      />
    </Field>
  )

  if (!hasData)
    return (
      <div className="bg-white rounded-[14px] shadow-md p-5 space-y-4">
        <Field label="CNPJ" required error={consultError}>
          <div className="flex gap-2">
            <Input
              value={cnpjInput}
              onChange={(e) => {
                setCnpjInput(maskCnpj(e.target.value))
                setConsultError('')
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConsult()
              }}
              placeholder="00.000.000/0000-00"
              className={cn(cls, 'flex-1')}
            />
            <Button
              type="button"
              onClick={handleConsult}
              disabled={consulting}
              className="rounded-[14px] bg-[#A8914E] hover:bg-[#A8914E]/90 text-white"
            >
              {consulting ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Search className="w-4 h-4 mr-1" />
              )}
              Consultar
            </Button>
          </div>
        </Field>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="w-full rounded-[14px] h-12 border-gray-300 text-gray-700"
        >
          Cancelar
        </Button>
      </div>
    )

  return (
    <div className="bg-white rounded-[14px] shadow-md p-5 space-y-4">
      <Field label="CNPJ" required>
        <div className="flex gap-2">
          <Input value={form.cpf_cnpj} disabled className={cn(cls, 'flex-1 opacity-60')} />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setHasData(false)
              setCnpjInput(form.cpf_cnpj)
              setIsDirty(false)
            }}
            className="rounded-[14px]"
          >
            <Search className="w-4 h-4 mr-1" />
            Nova consulta
          </Button>
        </div>
      </Field>
      {txt('nome_razao_social', 'Nome ou Razão Social', { req: true, max: 100 })}
      {txt('nome_fantasia', 'Nome Fantasia', { opt: true, max: 100 })}
      <div className="space-y-3 pt-2 border-t border-gray-100">
        <Field label="Indicador da IE" required error={errors.indicador_ie}>
          <RadioGroup value={form.indicador_ie} onValueChange={handleIeChange}>
            {ieOptions.map((o) => (
              <div key={o.v} className="flex items-center space-x-2">
                <RadioGroupItem value={o.v} id={`ie-${o.v}`} />
                <Label htmlFor={`ie-${o.v}`} className="text-sm text-gray-700 cursor-pointer">
                  {o.l}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </Field>
        <Field label="Inscrição Estadual" error={errors.inscricao_estadual}>
          <Input
            value={form.inscricao_estadual}
            onChange={(e) => update('inscricao_estadual', e.target.value)}
            disabled={ieDisabled}
            placeholder={ieDisabled ? 'Não aplicável' : 'Digite a IE'}
            className={cn(cls, ieDisabled && 'opacity-50 cursor-not-allowed')}
          />
        </Field>
      </div>
      <div className="space-y-4 pt-2 border-t border-gray-100">
        {txt('cep', 'CEP', { mask: maskCep, ph: '00000-000' })}
        {txt('logradouro', 'Logradouro', { req: true, max: 100 })}
        <div className="grid grid-cols-2 gap-3">
          {txt('numero', 'Número', { req: true })}
          {txt('complemento', 'Complemento', { opt: true })}
        </div>
        {txt('bairro', 'Bairro', { req: true, max: 60 })}
        <div className="grid grid-cols-2 gap-3">
          {txt('municipio', 'Município', { req: true, max: 60 })}
          {txt('uf', 'UF', { req: true, tf: (v) => v.toUpperCase().slice(0, 2) })}
        </div>
        {txt('codigo_ibge', 'Código IBGE', {
          req: true,
          tf: (v) => unmaskDocument(v).slice(0, 7),
        })}
        <div className="grid grid-cols-2 gap-3">
          {txt('pais', 'País')}
          {txt('codigo_pais', 'Código do País', { tf: (v) => unmaskDocument(v).slice(0, 4) })}
        </div>
      </div>
      <div className="space-y-4 pt-2 border-t border-gray-100">
        {txt('telefone', 'Telefone', { opt: true, ph: '(00) 00000-0000' })}
        {txt('email', 'E-mail', { opt: true, ph: 'exemplo@email.com' })}
      </div>
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancelClick}
          className="flex-1 rounded-[14px] h-12 border-gray-300 text-gray-700"
        >
          Cancelar
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-1 rounded-[14px] h-12 bg-[#A8914E] hover:bg-[#A8914E]/90 text-white font-bold"
        >
          {submitting ? 'Salvando...' : 'Salvar Cliente'}
        </Button>
      </div>
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar cadastro</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja sair sem salvar o cadastro do cliente?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={onCancel}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
