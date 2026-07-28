import { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { primaryButtonStyle, secondaryButtonStyle } from '@/lib/button-styles'

interface PrimaryButtonProps {
  children: ReactNode
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  className?: string
  variant?: 'solid' | 'secondary' | 'outlined' | 'dark'
  type?: 'button' | 'submit'
}

export function PrimaryButton({
  children,
  disabled,
  loading,
  onClick,
  className,
  variant = 'solid',
  type = 'button',
}: PrimaryButtonProps) {
  const isPrimary = variant === 'solid' || variant === 'dark'

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'w-full flex items-center justify-center transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 active:scale-95 min-h-[48px] cursor-pointer',
        isPrimary ? 'shadow-md hover:brightness-105' : 'hover:bg-[#C89B51]/10',
        className,
      )}
      style={isPrimary ? primaryButtonStyle : secondaryButtonStyle}
    >
      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : children}
    </button>
  )
}
