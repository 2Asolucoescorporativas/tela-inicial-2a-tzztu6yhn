import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type AppButtonVariant = 'primary' | 'secondary' | 'gold' | 'danger'

interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AppButtonVariant
  multiline?: boolean
  children: ReactNode
}

export function AppButton({
  variant = 'primary',
  multiline = false,
  className,
  children,
  ...props
}: AppButtonProps) {
  return (
    <button
      className={cn(
        'app-button',
        `app-button--${variant}`,
        multiline && 'app-button--multiline',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function AppButtonGroup({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('app-button-group', className)}>{children}</div>
}
