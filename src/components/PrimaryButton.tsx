import { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PrimaryButtonProps {
  children: ReactNode
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  className?: string
}

export function PrimaryButton({
  children,
  disabled,
  loading,
  onClick,
  className,
}: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'w-full text-white font-bold text-lg rounded-[14px] shadow-md hover:brightness-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 min-h-[48px] flex items-center justify-center',
        className,
      )}
      style={{ backgroundColor: '#A8914E', height: '56px' }}
    >
      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : children}
    </button>
  )
}
