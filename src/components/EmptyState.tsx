import { ReactNode } from 'react'
import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  icon?: ReactNode
}

export function EmptyState({ title, description, actionLabel, onAction, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in">
      {icon ?? <Inbox className="w-12 h-12 text-white/30 mb-3" />}
      <h3 className="text-white font-bold text-base mb-1">{title}</h3>
      {description && <p className="text-white/50 text-sm mb-4">{description}</p>}
      {actionLabel && (
        <button
          onClick={onAction}
          className="text-[#A8914E] font-medium text-sm border border-[#A8914E]/30 rounded-[14px] px-6 min-h-[48px] hover:bg-[#A8914E]/10 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
