import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function ScreenContent({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('flex-1 overflow-y-auto px-5 py-4', className)}>{children}</div>
}
