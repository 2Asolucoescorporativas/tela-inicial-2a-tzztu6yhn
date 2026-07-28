import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TextButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
}

export function TextButton({ children, onClick, className }: TextButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-white/60 font-medium text-sm hover:text-white transition-colors py-2 min-h-[48px] flex items-center justify-center',
        className,
      )}
    >
      {children}
    </button>
  )
}
