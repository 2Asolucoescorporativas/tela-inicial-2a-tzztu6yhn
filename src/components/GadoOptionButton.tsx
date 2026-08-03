import { Check } from 'lucide-react'
import type { CSSProperties } from 'react'

interface GadoOptionButtonProps {
  label: string
  selected: boolean
  onClick: () => void
}

const unselectedStyle: CSSProperties = {
  backgroundColor: '#071C33',
  border: '2px solid rgba(200, 155, 81, 0.7)',
  color: '#D0A85C',
  borderRadius: '14px',
  height: '56px',
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 600,
  fontSize: '14pt',
}

const selectedStyle: CSSProperties = {
  backgroundColor: '#A8914E',
  border: '2px solid #A8914E',
  color: '#FFFFFF',
  borderRadius: '14px',
  height: '56px',
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 600,
  fontSize: '14pt',
}

export function GadoOptionButton({ label, selected, onClick }: GadoOptionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-5 transition-all duration-150 active:scale-[0.98] cursor-pointer"
      style={selected ? selectedStyle : unselectedStyle}
    >
      <span>{label}</span>
      {selected && <Check className="w-5 h-5 flex-shrink-0" />}
    </button>
  )
}
