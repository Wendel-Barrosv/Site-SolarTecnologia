import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

const statusLabel: Record<string, string> = { OPEN: 'Aberto', IN_PROGRESS: 'Em andamento', RESOLVED: 'Resolvido', CLOSED: 'Fechado' }
const statusClass: Record<string, string> = { OPEN: 'status-open', IN_PROGRESS: 'status-progress', RESOLVED: 'status-resolved', CLOSED: 'status-closed' }
const priorityLabel: Record<string, string> = { LOW: 'Baixa', MEDIUM: 'Média', HIGH: 'Alta', CRITICAL: 'Crítica' }
const priorityClass: Record<string, string> = { LOW: 'priority-low', MEDIUM: 'priority-medium', HIGH: 'priority-high', CRITICAL: 'priority-critical' }

export default async function ChamadosPage() {
  const session = await getSession()
  if (!session) return null

  const where = session.role !== 'admin' && session.clientId ? { clientId: session.clientId } : {}
  const tickets = await prisma.ticket.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { creator: { select: { name: true } }, assignee: { select: { name: true } } },
  })

  return (
    <>
      <div className="db-topbar">
        <div>
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '18px', fontWeight: 600, margin: 0, letterSpacing: '-0.02em' }}>Chamados</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-3)', margin: '2px 0 0', fontFamily: "'JetBrains Mono', monospace" }}>{tickets.length} chamado{tickets.length !== 1 ? 's' : ''} encontrado{tickets.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/dashboard/chamados/novo" className="btn btn-primary" style={{ padding: '9px 16px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          Novo chamado
        </Link>
      </div>

      <div className="db-content">
        <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
          {tickets.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-3)' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 16px', display: 'block' }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5" /></svg>
              <h3 style={{ margin: '0 0 8px', fontSize: '16px', color: 'var(--text)' }}>Nenhum chamado ainda</h3>
              <p style={{ margin: '0 0 20px', fontSize: '14px' }}>Abra seu primeiro chamado de suporte.</p>
              <Link href="/dashboard/chamados/novo" className="btn btn-primary" style={{ display: 'inline-flex' }}>Abrir chamado</Link>
            </div>
          ) : (
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Título</th>
                    <th>Status</th>
                    <th>Prioridade</th>
                    <th>Solicitante</th>
                    <th>Atribuído a</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t, idx) => (
                    <tr key={t.id}>
                      <td className="mono" style={{ fontSize: '11px', color: 'var(--text-3)' }}>#{String(idx + 1).padStart(4, '0')}</td>
                      <td>
                        <Link href={`/dashboard/chamados/${t.id}`} className="row-title" style={{ textDecoration: 'none', color: 'inherit' }}>
                          {t.title}
                        </Link>
                      </td>
                      <td><span className={`status-badge ${statusClass[t.status]}`}>{statusLabel[t.status]}</span></td>
                      <td><span className={`status-badge ${priorityClass[t.priority]}`}>{priorityLabel[t.priority]}</span></td>
                      <td style={{ fontSize: '13px' }}>{t.creator.name}</td>
                      <td style={{ fontSize: '13px', color: 'var(--text-3)' }}>{t.assignee?.name || '—'}</td>
                      <td className="mono" style={{ fontSize: '12px' }}>{new Date(t.createdAt).toLocaleDateString('pt-BR')}</td>
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
