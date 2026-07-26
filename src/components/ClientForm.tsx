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
  sintegraToForm,
  type ClientFormData,
} from '@/lib/client-utils'
import type { ClienteRecord, SintegraIE } from '@/services/clientes'
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

const INDICADOR_LABELS: Record<string, string> = {
  '1': 'Contribuinte do ICMS',
  '2': 'Contribuinte isento',
  '9': 'Não contribuinte',
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
  const [activeIes, setActiveIes] = useState<SintegraIE[]>([])

  const handleConsult = async () => {
    const clean = unmaskDocument(cnpjInput)
    setConsultError('')
    if (clean.length !== 14) {
      setConsultError('CNPJ deve conter 14 dígitos')
      return
    }
    setConsulting(true)
    try {
      const data = await consultarCnpj(clean)
      const ies = data.inscricoes_ativas || []
      setActiveIes(ies)
      const baseForm = sintegraToForm(data)
      if (ies.length > 0) {
        const selectedIe = ies[0]
        const end = selectedIe.endereco
        baseForm.logradouro = end?.logradouro || ''
        baseForm.numero = end?.numero || ''
        baseForm.complemento = end?.complemento || ''
        baseForm.bairro = end?.bairro || ''
        baseForm.municipio = end?.municipio || ''
        baseForm.codigo_ibge = end?.codigo_municipio_ibge || end?.codigo_ibge || ''
        baseForm.uf = end?.uf || selectedIe.uf || baseForm.uf || ''
        baseForm.cep = end?.cep || ''
        baseForm.inscricao_estadual = selectedIe.inscricao_estadual
        baseForm.tipo_ie = selectedIe.tipo_ie
      }
      setForm(baseForm)
      setHasData(true)
      setErrors({})
      setIsDirty(false)
    } catch (err) {
      setConsultError(err instanceof Error ? err.message : 'Erro ao consultar CNPJ')
    } finally {
      setConsulting(false)
    }
  }
  const handleIeSelect = (value: string) => {
    const selected = activeIes.find((ie) => ie.inscricao_estadual === value)
    if (selected) {
      const end = selected.endereco
      setForm((p) => ({
        ...p,
        inscricao_estadual: selected.inscricao_estadual,
        tipo_ie: selected.tipo_ie,
        logradouro: end?.logradouro || '',
        numero: end?.numero || '',
        complemento: end?.complemento || '',
        bairro: end?.bairro || '',
        municipio: end?.municipio || '',
        codigo_ibge: end?.codigo_municipio_ibge || end?.codigo_ibge || '',
        uf: end?.uf || selected.uf || p.uf || '',
        cep: end?.cep || '',
      }))
      setIsDirty(true)
      if (errors.inscricao_estadual)
        setErrors((p) => {
          const n = { ...p }
          delete n.inscricao_estadual
          return n
        })
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

  const cls = 'bg-white text-gray-900 rounded-[14px]'
  const ro = 'opacity-60 cursor-not-allowed bg-gray-50'

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
      disabled?: boolean
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
        className={cn(cls, opts?.disabled && ro)}
        maxLength={opts?.max}
        placeholder={opts?.ph}
        disabled={opts?.disabled}
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
              {consulting ? 'Consultando...' : 'Buscar'}
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

  const ieDisabled = form.indicador_ie === '9'
  const showIeSelection = activeIes.length > 1

  return (
    <div className="bg-white rounded-[14px] shadow-md p-5 space-y-4">
      <Field label="CNPJ" required>
        <div className="flex gap-2">
          <Input value={form.cpf_cnpj} disabled className={cn(cls, 'flex-1', ro)} />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setHasData(false)
              setCnpjInput(form.cpf_cnpj)
              setIsDirty(false)
              setActiveIes([])
            }}
            className="rounded-[14px]"
          >
            <Search className="w-4 h-4 mr-1" />
            Nova consulta
          </Button>
        </div>
      </Field>

      {txt('nome_razao_social', 'Nome ou Razão Social', { req: true, max: 100, disabled: true })}
      {txt('nome_fantasia', 'Nome Fantasia', { opt: true, max: 100 })}

      <div className="space-y-3 pt-2 border-t border-gray-100">
        <div className="space-y-1.5">
          <Label className="text-gray-700 text-sm font-medium">Indicador da IE</Label>
          <div className={cn(cls, ro, 'px-4 py-3 text-sm text-gray-700')}>
            {INDICADOR_LABELS[form.indicador_ie] || '—'}
          </div>
        </div>

        {showIeSelection ? (
          <Field label="Selecione a Inscrição Estadual" required error={errors.inscricao_estadual}>
            <RadioGroup value={form.inscricao_estadual} onValueChange={handleIeSelect}>
              {activeIes.map((ie) => (
                <div key={ie.inscricao_estadual} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={ie.inscricao_estadual}
                    id={`ie-${ie.inscricao_estadual}`}
                  />
                  <Label
                    htmlFor={`ie-${ie.inscricao_estadual}`}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {ie.inscricao_estadual} — {ie.tipo_ie}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </Field>
        ) : (
          <Field label="Inscrição Estadual" error={errors.inscricao_estadual}>
            <Input
              value={form.inscricao_estadual}
              disabled
              placeholder={ieDisabled ? 'Não aplicável' : ''}
              className={cn(cls, ro)}
            />
          </Field>
        )}
      </div>

      <div className="space-y-4 pt-2 border-t border-gray-100">
        {txt('cep', 'CEP', { mask: maskCep, ph: '00000-000', disabled: true })}
        {txt('logradouro', 'Logradouro', { req: true, max: 100, disabled: true })}
        <div className="grid grid-cols-2 gap-3">
          {txt('numero', 'Número', { req: true, disabled: true })}
          {txt('complemento', 'Complemento', { opt: true, disabled: true })}
        </div>
        {txt('bairro', 'Bairro', { req: true, max: 60, disabled: true })}
        <div className="grid grid-cols-2 gap-3">
          {txt('municipio', 'Município', { req: true, max: 60, disabled: true })}
          {txt('uf', 'UF', { req: true, disabled: true })}
        </div>
        {txt('codigo_ibge', 'Código IBGE', { req: true, disabled: true })}
        <div className="grid grid-cols-2 gap-3">
          {txt('pais', 'País', { disabled: true })}
          {txt('codigo_pais', 'Código do País', { disabled: true })}
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
