import { cn } from '@/lib/utils'
import { Check, Home, FileText, MapPin, BadgeCheck } from 'lucide-react'

interface PropertyCardProps {
  nome: string
  cadPro?: string
  inscricaoEstadual?: string
  municipio?: string
  uf?: string
  situacaoIE?: string
  selected?: boolean
  onSelect?: () => void
}

export function PropertyCard({
  nome,
  cadPro,
  inscricaoEstadual,
  municipio,
  uf,
  situacaoIE,
  selected = false,
  onSelect,
}: PropertyCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect?.()
        }
      }}
      className={cn(
        'bg-white rounded-2xl p-4 cursor-pointer transition-all relative min-h-[72px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A8914E]/50',
        selected
          ? 'border-2 border-[#A8914E] shadow-lg'
          : 'border border-gray-200 hover:border-gray-300',
      )}
    >
      {selected && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#A8914E] flex items-center justify-center">
          <Check className="w-4 h-4 text-white" strokeWidth={3} />
        </div>
      )}
      <div className="flex items-center gap-2 mb-3">
        <Home className="w-5 h-5 text-[#A8914E] flex-shrink-0" />
        <span className="font-bold text-gray-900 text-base">{nome}</span>
      </div>
      <div className="space-y-1.5 text-sm">
        {cadPro && (
          <div className="flex items-center gap-2 text-gray-600">
            <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>CAD/PRO: {cadPro}</span>
          </div>
        )}
        {inscricaoEstadual && (
          <div className="flex items-center gap-2 text-gray-600">
            <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>IE: {inscricaoEstadual}</span>
          </div>
        )}
        {municipio && (
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>
              {municipio}
              {uf ? ` - ${uf}` : ''}
            </span>
          </div>
        )}
        {situacaoIE && (
          <div className="flex items-center gap-2 text-gray-600">
            <BadgeCheck className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="capitalize">{situacaoIE}</span>
          </div>
        )}
      </div>
    </div>
  )
}
