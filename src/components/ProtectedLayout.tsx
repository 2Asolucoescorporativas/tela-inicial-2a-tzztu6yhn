import { Outlet } from 'react-router-dom'

export default function ProtectedLayout() {
  return (
    <main className="w-full min-h-[100dvh] bg-[#002C45] font-sans antialiased text-white selection:bg-[#D4AF37] selection:text-[#002C45] box-border">
      <Outlet />
    </main>
  )
}
