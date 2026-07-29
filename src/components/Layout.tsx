import { Outlet, useLocation } from 'react-router-dom'
import { BackButtonGuard } from '@/components/BackButtonGuard'

export default function Layout() {
  const location = useLocation()
  const isProtectedInLayout = location.pathname === '/selecionar-propriedade'

  return (
    <main className="w-full h-[100dvh] overflow-hidden bg-[#002C45] font-sans antialiased text-white selection:bg-[#D4AF37] selection:text-[#002C45] safe-area box-border">
      <Outlet />
      <BackButtonGuard enabled={isProtectedInLayout} />
    </main>
  )
}
