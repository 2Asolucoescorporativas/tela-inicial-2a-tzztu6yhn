import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function FormPageLayout({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex-1 flex flex-col overflow-y-auto min-h-0 w-full max-w-md mx-auto sm:max-w-xl',
        className,
      )}
    >
      {children}
    </div>
  )
}
