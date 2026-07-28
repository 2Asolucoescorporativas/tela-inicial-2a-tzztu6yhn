import { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PrimaryButtonProps {
  children: ReactNode
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  className?: string
  variant?: 'solid' | 'outlined' | 'dark'
}

export function PrimaryButton({
  children,
  disabled,
  loading,
  onClick,
  className,
  variant = 'solid',
}: PrimaryButtonProps) {
  const isOutlined = variant === 'outlined'

  const solidStyle =
    variant === 'dark'
      ? {
          backgroundColor: '#002C45',
          border: 'none',
          color: '#fff',
          borderRadius: '14px',
          height: '56px',
          fontWeight: 700,
          fontSize: '18px',
        }
      : {
          backgroundColor: '#A8914E',
          border: 'none',
          color: '#fff',
          borderRadius: '14px',
          height: '56px',
          fontWeight: 700,
          fontSize: '18px',
        }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'w-full flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 active:scale-95 min-h-[48px]',
        !isOutlined && 'shadow-md hover:brightness-105',
        className,
      )}
      style={
        isOutlined
          ? {
              backgroundColor: 'transparent',
              border: '2px solid #002C45',
              color: '#002C45',
              borderRadius: '14px',
              height: '56px',
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              fontSize: '18px',
            }
          : solidStyle
      }
    >
      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : children}
    </button>
  )
}
