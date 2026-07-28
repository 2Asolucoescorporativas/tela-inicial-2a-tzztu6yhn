import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function AppScaffold({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn('min-h-screen flex flex-col', className)}
      style={{ backgroundColor: '#002C45' }}
    >
      {children}
    </div>
  )
}
