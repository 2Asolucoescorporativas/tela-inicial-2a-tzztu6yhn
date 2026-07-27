import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import logoImage from '@/assets/chatgpt-image-27-de-jul.de-2026-202036-6ec94.png'

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
  linkTo,
  altText = '2A RURAL - Gestão que gera confiança',
}: Logo2AProps) {
  const sizeClasses = {
    xs: 'h-16',
    sm: 'h-24',
    md: 'h-32',
    lg: 'h-44',
    xl: 'h-56',
  }

  const currentSizeClass = sizeClasses[size]

  const content = (
    <div
      className={cn(
        'flex flex-col items-center justify-center select-none group text-center',
        className,
      )}
    >
      <img
        src={logoImage}
        alt={altText}
        className={cn('w-auto object-contain drop-shadow-md rounded-2xl', currentSizeClass)}
      />
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
