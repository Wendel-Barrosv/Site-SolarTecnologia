import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) return null

  const [totalTickets, openTickets, resolvedTickets] = await Promise.all([
    prisma.ticket.count({ where: session.role !== 'admin' && session.clientId ? { clientId: session.clientId } : {} }),
    prisma.ticket.count({ where: { status: 'OPEN', ...(session.role !== 'admin' && session.clientId ? { clientId: session.clientId } : {}) } }),
    prisma.ticket.count({ where: { status: 'RESOLVED', ...(session.role !== 'admin' && session.clientId ? { clientId: session.clientId } : {}) } }),
  ])

  const recentTickets = await prisma.ticket.findMany({
    where: session.role !== 'admin' && session.clientId ? { clientId: session.clientId } : {},
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { creator: { select: { name: true } } },
  })

  const statusLabel: Record<string, string> = { OPEN: 'Aberto', IN_PROGRESS: 'Em andamento', RESOLVED: 'Resolvido', CLOSED: 'Fechado' }
  const statusClass: Record<string, string> = { OPEN: 'status-open', IN_PROGRESS: 'status-progress', RESOLVED: 'status-resolved', CLOSED: 'status-closed' }
  const priorityLabel: Record<string, string> = { LOW: 'Baixa', MEDIUM: 'Média', HIGH: 'Alta', CRITICAL: 'Crítica' }
  const priorityClass: Record<string, string> = { LOW: 'priority-low', MEDIUM: 'priority-medium', HIGH: 'priority-high', CRITICAL: 'priority-critical' }

  return (
    <>
      <div className="db-topbar">
        <div>
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '18px', fontWeight: 600, margin: 0, letterSpacing: '-0.02em' }}>Dashboard</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-3)', margin: '2px 0 0', fontFamily: "'JetBrains Mono', monospace" }}>
            Bem-vindo, {session.name}
          </p>
        </div>
        <a href="/dashboard/chamados/novo" className="btn btn-primary" style={{ padding: '9px 16px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          Abrir chamado
        </a>
      </div>

      <div className="db-content">
        {/* KPI Grid */}
        <div className="kpi-grid">
          {[
            { label: 'Total de chamados', value: totalTickets, cls: 'k-blue', pill: 'todos' },
            { label: 'Chamados abertos', value: openTickets, cls: 'k-solar', pill: 'em aberto' },
            { label: 'Chamados resolvidos', value: resolvedTickets, cls: 'k-green', pill: 'resolvidos' },
          ].map((kpi) => (
            <div key={kpi.label} className={`kpi ${kpi.cls}`}>
              <span className="label">{kpi.label}</span>
              <span className="value">{kpi.value}</span>
              <span className="pill">{kpi.pill}</span>
            </div>
          ))}
        </div>

        {/* Recent Tickets */}
        <div className="panel" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--line-soft)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>Chamados recentes</h3>
            <a href="/dashboard/chamados" style={{ fontSize: '12px', color: 'var(--brand-blue)', textDecoration: 'none', fontWeight: 500 }}>Ver todos</a>
          </div>
          {recentTickets.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 12px', display: 'block' }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5" /></svg>
              <p style={{ margin: 0, fontSize: '14px' }}>Nenhum chamado ainda.</p>
              <a href="/dashboard/chamados/novo" className="btn btn-primary" style={{ marginTop: '16px', display: 'inline-flex', padding: '9px 16px' }}>Abrir primeiro chamado</a>
            </div>
          ) : (
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Status</th>
                    <th>Prioridade</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTickets.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <a href={`/dashboard/chamados/${t.id}`} className="row-title" style={{ textDecoration: 'none', color: 'inherit' }}>
                          {t.title}
                        </a>
                      </td>
                      <td><span className={`status-badge ${statusClass[t.status]}`}>{statusLabel[t.status]}</span></td>
                      <td><span className={`status-badge ${priorityClass[t.priority]}`}>{priorityLabel[t.priority]}</span></td>
                      <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}>
                        {new Date(t.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
