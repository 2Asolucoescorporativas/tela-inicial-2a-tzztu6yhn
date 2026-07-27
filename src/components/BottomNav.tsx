import { Link, useLocation } from 'react-router-dom'
import { FileText, Clock, User, PlusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BottomNavProps {
  onNewInvoiceClick?: () => void
}

export function BottomNav({ onNewInvoiceClick }: BottomNavProps) {
  const location = useLocation()

  const navItems = [
    { label: 'Início', path: '/dashboard', icon: FileText },
    { label: 'Histórico', path: '/historico', icon: Clock },
    { label: 'Produtor', path: '/perfil', icon: User },
  ]

  return (
    <div className="flex-shrink-0 bg-[#001f31]/95 backdrop-blur-md border-t border-white/10 px-4 py-2 flex items-center justify-around">
      {navItems.slice(0, 1).map((item) => {
        const Icon = item.icon
        const isActive = location.pathname === item.path
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all duration-150',
              isActive ? 'text-[#F9E27D] font-medium' : 'text-white/60 hover:text-white',
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs">{item.label}</span>
          </Link>
        )
      })}

      <button
        onClick={onNewInvoiceClick}
        type="button"
        className="flex flex-col items-center -mt-6 group focus:outline-none"
      >
        <div className="w-12 h-12 rounded-full bg-gold-gradient text-[#002C45] flex items-center justify-center shadow-lg transform group-active:scale-95 transition-transform duration-150 border-2 border-[#002C45]">
          <PlusCircle className="w-7 h-7 stroke-[2.2]" />
        </div>
        <span className="text-[10px] text-[#F9E27D] font-semibold mt-0.5 tracking-tight">
          Emitir NFe
        </span>
      </button>

      {navItems.slice(1).map((item) => {
        const Icon = item.icon
        const isActive = location.pathname === item.path
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all duration-150',
              isActive ? 'text-[#F9E27D] font-medium' : 'text-white/60 hover:text-white',
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs">{item.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
