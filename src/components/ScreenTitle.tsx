import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function ScreenTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('screen-title', className)}>
      <h2 className="screen-title__text">
        {typeof children === 'string' ? children.toUpperCase() : children}
      </h2>
    </div>
  )
}
