import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function FormPageLayout({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('form-page max-w-md mx-auto sm:max-w-xl', className)}>{children}</div>
}
