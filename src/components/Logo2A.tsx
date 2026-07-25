import { cn } from '@/lib/utils'

interface Logo2AProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showTagline?: boolean
}

export function Logo2A({ className, size = 'md', showTagline = true }: Logo2AProps) {
  const sizeClasses = {
    sm: { container: 'w-28 h-20', font: 'text-2xl', subFont: 'text-3xl' },
    md: { container: 'w-48 h-36', font: 'text-4xl', subFont: 'text-4xl sm:text-5xl' },
    lg: { container: 'w-64 h-48', font: 'text-6xl', subFont: 'text-5xl sm:text-6xl' },
  }

  const currentSize = sizeClasses[size]

  return (
    <div className={cn('flex flex-col items-center select-none', className)}>
      <div className={cn('relative flex items-center justify-center', currentSize.container)}>
        <svg
          viewBox="0 0 320 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          <path
            d="M50 145 C50 85, 110 50, 150 82 C165 98, 142 122, 100 152 L158 152 L158 168 L50 168 L50 152 C95 120, 126 100, 108 82 C88 64, 68 85, 68 115 Z"
            fill="#FFFFFF"
          />
          <path
            d="M175 168 L220 50 L245 50 L288 168 L264 168 L252 136 L208 136 L196 168 Z M214 118 L246 118 L230 72 Z"
            fill="url(#goldGradientText)"
          />
          <path
            d="M38 152 C90 178, 185 162, 280 102"
            stroke="url(#goldGradientArrow)"
            strokeWidth="18"
            strokeLinecap="round"
          />
          <path d="M260 85 L292 95 L272 125 Z" fill="#A8914E" />
          <defs>
            <linearGradient
              id="goldGradientText"
              x1="170"
              y1="50"
              x2="288"
              y2="168"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#A8914E" />
              <stop offset="50%" stopColor="#F9E27D" />
              <stop offset="100%" stopColor="#A8914E" />
            </linearGradient>
            <linearGradient
              id="goldGradientArrow"
              x1="38"
              y1="160"
              x2="280"
              y2="100"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#002C45" />
              <stop offset="30%" stopColor="#A8914E" />
              <stop offset="70%" stopColor="#F9E27D" />
              <stop offset="100%" stopColor="#A8914E" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showTagline && (
        <div className="w-full flex justify-end pr-2 -mt-2 sm:-mt-4">
          <span
            className={cn(
              'font-serif italic tracking-wider font-light text-right drop-shadow-sm',
              currentSize.subFont,
            )}
            style={{
              fontFamily: "'Playfair Display', Garamond, 'Times New Roman', serif",
              color: '#A8914E',
            }}
          >
            Rural
          </span>
        </div>
      )}
    </div>
  )
}
