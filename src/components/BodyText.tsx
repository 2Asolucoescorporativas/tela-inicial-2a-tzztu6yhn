import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function BodyText({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('text-white/70 text-sm text-center', className)}>{children}</p>
}
