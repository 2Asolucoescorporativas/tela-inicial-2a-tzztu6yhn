import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

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
    xs: { symbolHeight: 'h-10', textRural: 'text-[10px]', textTagline: 'text-[8px]' },
    sm: { symbolHeight: 'h-14', textRural: 'text-xs', textTagline: 'text-[10px]' },
    md: { symbolHeight: 'h-20', textRural: 'text-lg', textTagline: 'text-xs' },
    lg: { symbolHeight: 'h-28', textRural: 'text-2xl', textTagline: 'text-sm' },
    xl: { symbolHeight: 'h-36', textRural: 'text-3xl', textTagline: 'text-base' },
  }

  const currentSize = sizeClasses[size]

  const content = (
    <div className={cn('flex flex-col items-center select-none group text-center', className)}>
      <div className="relative flex flex-col items-center">
        {/* Emblem SVG rendering "2A" mark accurately */}
        <div className={cn('relative flex items-center justify-center', currentSize.symbolHeight)}>
          <svg
            viewBox="0 0 180 140"
            className="h-full w-auto drop-shadow-md"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label={altText}
          >
            {/* White '2' */}
            <path
              d="M12 40 C12 18, 38 8, 62 18 C78 26, 80 44, 66 60 L24 110 L82 110 L82 126 L12 126 L12 108 L54 58 C64 46, 62 32, 50 28 C38 24, 28 32, 28 40 Z"
              fill="#FFFFFF"
            />

            {/* Gold 'A' */}
            <path
              d="M112 18 L134 18 L170 126 L148 126 L138 92 L98 92 L90 126 L70 126 Z M104 74 L132 74 L122 36 Z"
              fill="#C89B51"
            />

            {/* Wheat/leaf branch inside 'A' */}
            <path
              d="M112 48 Q118 42, 126 40 Q120 48, 114 56 Z M116 58 Q124 54, 132 54 Q124 62, 118 68 Z M118 70 Q128 68, 134 70 Q126 78, 120 82 Z"
              fill="#C89B51"
            />

            {/* White leaf accent at bottom inner left of 'A' */}
            <path d="M92 100 Q96 90, 104 92 Q98 102, 92 100 Z" fill="#FFFFFF" />
          </svg>
        </div>

        {/* Text 'RURAL' */}
        <span
          className={cn(
            'font-sans font-bold tracking-[0.35em] text-white uppercase mt-1 drop-shadow-sm',
            currentSize.textRural,
          )}
        >
          RURAL
        </span>

        {/* Subtitle / Tagline */}
        {showTagline && (
          <span
            className={cn(
              'font-sans font-medium tracking-wide mt-1 drop-shadow-sm',
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
