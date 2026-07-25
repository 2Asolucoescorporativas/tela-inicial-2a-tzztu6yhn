import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <main className="min-h-screen bg-[#002C45] font-sans antialiased text-white selection:bg-[#D4AF37] selection:text-[#002C45]">
      <Outlet />
    </main>
  )
}
