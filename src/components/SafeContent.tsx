import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function SafeContent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-col flex-1 min-h-0 safe-area-pt safe-area-pb', className)}>
      {children}
    </div>
  )
}
