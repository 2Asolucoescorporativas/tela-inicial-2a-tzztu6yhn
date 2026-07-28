import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function BottomActions({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex-shrink-0 px-5 py-4 space-y-2 safe-area-pb', className)}>
      {children}
    </div>
  )
}
