import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import DashboardSidebar from '@/components/ui/DashboardSidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/auth/login')

  return (
    <div className="db-layout">
      <DashboardSidebar user={session} />
      <div className="db-main">{children}</div>
    </div>
  )
}
