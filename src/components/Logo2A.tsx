import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import logoImage from '@/assets/icone-invertido-2a-solucoes-1b349.jpg'

interface Logo2AProps {
  className?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  showTagline?: boolean
  linkTo?: string
  altText?: string
}

export function Logo2A({
  className,
  size = 'md',
  showTagline = true,
  linkTo,
  altText = '2A RURAL Logo',
}: Logo2AProps) {
  const sizeClasses = {
    xs: { imgHeight: 'h-16', textTagline: 'text-[8px]' },
    sm: { imgHeight: 'h-20', textTagline: 'text-[10px]' },
    md: { imgHeight: 'h-28', textTagline: 'text-xs' },
    lg: { imgHeight: 'h-36', textTagline: 'text-sm' },
    xl: { imgHeight: 'h-44', textTagline: 'text-base' },
  }

  const currentSize = sizeClasses[size]

  const content = (
    <div className={cn('flex flex-col items-center select-none group text-center', className)}>
      <div className="relative flex flex-col items-center">
        <img
          src={logoImage}
          alt={altText}
          className={cn('w-auto drop-shadow-md object-contain', currentSize.imgHeight)}
        />
        {showTagline && (
          <span
            className={cn(
              'font-sans font-medium tracking-wide mt-2 drop-shadow-sm',
              currentSize.textTagline,
            )}
            style={{ color: '#D0A85C' }}
          >
            Gestão que gera confiança
          </span>
        )}
      </div>
    </div>
  )

  if (linkTo) {
    return (
      <Link to={linkTo} aria-label="2A RURAL - Página Inicial" className="inline-block">
        {content}
      </Link>
    )
  }

  return content
}
