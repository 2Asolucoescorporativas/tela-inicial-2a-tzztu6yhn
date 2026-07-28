import { ReactNode } from 'react'
import { Inbox } from 'lucide-react'
import { secondaryButtonStyle } from '@/lib/button-styles'

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
          className="px-6 hover:bg-[#C89B51]/10 transition-colors cursor-pointer"
          style={secondaryButtonStyle}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
