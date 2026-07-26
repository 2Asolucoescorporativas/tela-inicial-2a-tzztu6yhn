import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import logoImg from '@/assets/icone-invertido-2a-solucoes-1b349.jpg'

interface Logo2AProps {
  className?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  showTagline?: boolean
  linkTo?: string
  altText?: string
}

export function Logo2A({
  className,
  size = 'md',
  showTagline = true,
  linkTo,
  altText = '2A Soluções Corporativas Logo',
}: Logo2AProps) {
  const sizeClasses = {
    xs: { img: 'w-10 h-10 rounded-lg', text: 'text-xl' },
    sm: { img: 'w-16 h-16 rounded-xl', text: 'text-2xl' },
    md: { img: 'w-24 h-24 rounded-2xl', text: 'text-3xl' },
    lg: { img: 'w-32 h-32 rounded-2xl', text: 'text-4xl' },
  }

  const currentSize = sizeClasses[size]

  const content = (
    <div className={cn('flex flex-col items-center select-none group', className)}>
      <div className="relative overflow-hidden shadow-md border border-white/10 rounded-2xl transition-transform duration-200 group-hover:scale-105 bg-[#002C45]">
        <img src={logoImg} alt={altText} className={cn('object-cover', currentSize.img)} />
      </div>

      {showTagline && (
        <span
          className={cn(
            'font-serif italic tracking-wider font-light drop-shadow-sm mt-1',
            currentSize.text,
          )}
          style={{
            fontFamily: "'Playfair Display', Garamond, 'Times New Roman', serif",
            color: '#A8914E',
          }}
        >
          Rural
        </span>
      )}
    </div>
  )

  if (linkTo) {
    return (
      <Link
        to={linkTo}
        aria-label="2A Soluções Corporativas - Página Inicial"
        className="inline-block"
      >
        {content}
      </Link>
    )
  }

  return content
}
