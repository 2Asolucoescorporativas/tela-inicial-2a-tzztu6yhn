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
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { maskCpf } from '@/lib/cpf-utils'
import {
  maskCnpj,
  maskCep,
  unmaskDocument,
  getDefaultClientForm,
  validateClientForm,
  type ClientFormData,
} from '@/lib/client-utils'
import type { ClienteRecord } from '@/services/clientes'

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
  const [form, setForm] = useState<ClientFormData>(() =>
    initialData
      ? {
          tipo_pessoa: initialData.tipo_pessoa,
          cpf_cnpj:
            initialData.tipo_pessoa === 'FISICA'
              ? maskCpf(initialData.cpf_cnpj)
              : maskCnpj(initialData.cpf_cnpj),
          nome_razao_social: initialData.nome_razao_social,
          nome_fantasia: initialData.nome_fantasia,
          indicador_ie: (initialData.indicador_ie || '') as ClientFormData['indicador_ie'],
          inscricao_estadual: initialData.inscricao_estadual,
          cep: maskCep(initialData.cep),
          logradouro: initialData.logradouro,
          numero: initialData.numero,
          complemento: initialData.complemento,
          bairro: initialData.bairro,
          municipio: initialData.municipio,
          codigo_ibge: initialData.codigo_ibge,
          uf: initialData.uf,
          pais: initialData.pais || 'Brasil',
          codigo_pais: initialData.codigo_pais || '1058',
          telefone: initialData.telefone,
          email: initialData.email,
        }
      : getDefaultClientForm(),
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  const update = (field: keyof ClientFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setIsDirty(true)
    if (errors[field])
      setErrors((prev) => {
        const n = { ...prev }
        delete n[field]
        return n
      })
  }
  const handleDocChange = (raw: string) =>
    update('cpf_cnpj', form.tipo_pessoa === 'FISICA' ? maskCpf(raw) : maskCnpj(raw))
  const handleTipoChange = (tipo: 'FISICA' | 'JURIDICA') => {
    setForm((prev) => ({ ...prev, tipo_pessoa: tipo, cpf_cnpj: '' }))
    setIsDirty(true)
    if (errors.cpf_cnpj)
      setErrors((prev) => {
        const n = { ...prev }
        delete n.cpf_cnpj
        return n
      })
  }
  const handleIeChange = (v: string) => {
    update('indicador_ie', v)
    if (v === '9') update('inscricao_estadual', '')
  }
  const handleCancelClick = () => {
    if (isDirty) setShowCancelDialog(true)
    else onCancel()
  }
  const handleSubmit = async () => {
    const ve = validateClientForm(form)
    if (Object.keys(ve).length > 0) {
      setErrors(ve)
      return
    }
    await onSubmit(form)
  }

  const ieDisabled = form.indicador_ie === '9'
  const cls = 'bg-white text-gray-900 rounded-[14px]'
  const ieOptions = [
    { v: '1', l: 'Contribuinte do ICMS' },
    { v: '2', l: 'Contribuinte isento de Inscrição Estadual' },
    { v: '9', l: 'Não contribuinte' },
  ]

  return (
    <div className="bg-white rounded-[14px] shadow-md p-5 space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {(['JURIDICA', 'FISICA'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => handleTipoChange(t)}
            className={cn(
              'py-2.5 rounded-[14px] text-sm font-medium transition-all',
              form.tipo_pessoa === t ? 'bg-[#A8914E] text-white' : 'bg-gray-100 text-gray-600',
            )}
          >
            {t === 'JURIDICA' ? 'Pessoa Jurídica' : 'Pessoa Física'}
          </button>
        ))}
      </div>
      <Field
        label={form.tipo_pessoa === 'FISICA' ? 'CPF' : 'CNPJ'}
        required
        error={errors.cpf_cnpj}
      >
        <div className="flex gap-2">
          <Input
            value={form.cpf_cnpj}
            onChange={(e) => handleDocChange(e.target.value)}
            placeholder={form.tipo_pessoa === 'FISICA' ? '000.000.000-00' : '00.000.000/0000-00'}
            className={cn(cls, 'flex-1')}
          />
          <Button type="button" disabled variant="outline" className="rounded-[14px]">
            <Search className="w-4 h-4 mr-1" />
            Consultar
          </Button>
        </div>
      </Field>
      <Field label="Nome ou Razão Social" required error={errors.nome_razao_social}>
        <Input
          value={form.nome_razao_social}
          onChange={(e) => update('nome_razao_social', e.target.value)}
          className={cls}
          maxLength={100}
        />
      </Field>
      <Field label="Nome Fantasia" optional>
        <Input
          value={form.nome_fantasia}
          onChange={(e) => update('nome_fantasia', e.target.value)}
          className={cls}
          maxLength={100}
        />
      </Field>
      <div className="space-y-3 pt-2 border-t border-gray-100">
        <Field label="Indicador da Inscrição Estadual" required error={errors.indicador_ie}>
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
        <Field label="CEP" error={errors.cep}>
          <Input
            value={form.cep}
            onChange={(e) => update('cep', maskCep(e.target.value))}
            placeholder="00000-000"
            className={cls}
          />
        </Field>
        <Field label="Logradouro" required error={errors.logradouro}>
          <Input
            value={form.logradouro}
            onChange={(e) => update('logradouro', e.target.value)}
            className={cls}
            maxLength={100}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Número" required error={errors.numero}>
            <Input
              value={form.numero}
              onChange={(e) => update('numero', e.target.value)}
              className={cls}
            />
          </Field>
          <Field label="Complemento" optional>
            <Input
              value={form.complemento}
              onChange={(e) => update('complemento', e.target.value)}
              className={cls}
            />
          </Field>
        </div>
        <Field label="Bairro" required error={errors.bairro}>
          <Input
            value={form.bairro}
            onChange={(e) => update('bairro', e.target.value)}
            className={cls}
            maxLength={60}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Município" required error={errors.municipio}>
            <Input
              value={form.municipio}
              onChange={(e) => update('municipio', e.target.value)}
              className={cls}
              maxLength={60}
            />
          </Field>
          <Field label="UF" required error={errors.uf}>
            <Input
              value={form.uf}
              onChange={(e) => update('uf', e.target.value.toUpperCase().slice(0, 2))}
              className={cls}
            />
          </Field>
        </div>
        <Field label="Código IBGE do Município" required error={errors.codigo_ibge}>
          <Input
            value={form.codigo_ibge}
            onChange={(e) => update('codigo_ibge', unmaskDocument(e.target.value).slice(0, 7))}
            className={cls}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="País">
            <Input
              value={form.pais}
              onChange={(e) => update('pais', e.target.value)}
              className={cls}
            />
          </Field>
          <Field label="Código do País">
            <Input
              value={form.codigo_pais}
              onChange={(e) => update('codigo_pais', unmaskDocument(e.target.value).slice(0, 4))}
              className={cls}
            />
          </Field>
        </div>
      </div>
      <div className="space-y-4 pt-2 border-t border-gray-100">
        <Field label="Telefone" optional>
          <Input
            value={form.telefone}
            onChange={(e) => update('telefone', e.target.value)}
            placeholder="(00) 00000-0000"
            className={cls}
          />
        </Field>
        <Field label="E-mail" optional>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="exemplo@email.com"
            className={cls}
          />
        </Field>
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
