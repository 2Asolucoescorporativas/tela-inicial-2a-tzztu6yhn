import { Outlet } from 'react-router-dom'
import { AppHeader } from '@/components/AppHeader'
import { AppFooter } from '@/components/AppFooter'

export default function ProtectedLayout() {
  return (
    <div className="min-h-screen bg-[#002C45] font-sans antialiased text-white selection:bg-[#D4AF37] selection:text-[#002C45] flex flex-col">
      <AppHeader />
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
      <AppFooter />
    </div>
  )
}
