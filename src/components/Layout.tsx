import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <main className="w-full h-[100dvh] overflow-hidden bg-[#002C45] font-sans antialiased text-white selection:bg-[#D4AF37] selection:text-[#002C45] safe-area-pt safe-area-pb box-border">
      <Outlet />
    </main>
  )
}
