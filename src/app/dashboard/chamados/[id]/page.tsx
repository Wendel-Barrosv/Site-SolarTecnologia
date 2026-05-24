import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import TicketCommentForm from '@/components/ui/TicketCommentForm'

const statusLabel: Record<string, string> = { OPEN: 'Aberto', IN_PROGRESS: 'Em andamento', RESOLVED: 'Resolvido', CLOSED: 'Fechado' }
const statusClass: Record<string, string> = { OPEN: 'status-open', IN_PROGRESS: 'status-progress', RESOLVED: 'status-resolved', CLOSED: 'status-closed' }
const priorityLabel: Record<string, string> = { LOW: 'Baixa', MEDIUM: 'Média', HIGH: 'Alta', CRITICAL: 'Crítica' }
const priorityClass: Record<string, string> = { LOW: 'priority-low', MEDIUM: 'priority-medium', HIGH: 'priority-high', CRITICAL: 'priority-critical' }

export default async function TicketDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return null

  const ticket = await prisma.ticket.findUnique({
    where: { id: params.id },
    include: {
      creator: { select: { name: true, email: true } },
      assignee: { select: { name: true } },
      client: { select: { companyName: true } },
      comments: {
        include: { author: { select: { name: true, role: { select: { name: true } } } } },
        orderBy: { createdAt: 'asc' },
        where: session.role !== 'admin' ? { isInternal: false } : {},
      },
    },
  })

  if (!ticket) notFound()

  return (
    <>
      <div className="db-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/dashboard/chamados" style={{ color: 'var(--text-3)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Chamados
          </Link>
          <span style={{ color: 'var(--line-strong)' }}>/</span>
          <span style={{ fontSize: '13px', color: 'var(--text)', fontWeight: 600, maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ticket.title}</span>
        </div>
      </div>

      <div className="db-content">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px' }}>
          {/* Main */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="panel">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <h1 style={{ fontFamily: 'Space Grotesk', fontSize: '22px', fontWeight: 600, margin: 0, letterSpacing: '-0.02em', color: 'var(--text)' }}>{ticket.title}</h1>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span className={`status-badge ${statusClass[ticket.status]}`}>{statusLabel[ticket.status]}</span>
                  <span className={`status-badge ${priorityClass[ticket.priority]}`}>{priorityLabel[ticket.priority]}</span>
                </div>
              </div>
              <p style={{ color: 'var(--text-2)', fontSize: '14px', lineHeight: 1.65, margin: '12px 0 0', whiteSpace: 'pre-wrap' }}>{ticket.description}</p>
            </div>

            {/* Comments */}
            <div className="panel">
              <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 600 }}>Comentários ({ticket.comments.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {ticket.comments.map((c) => (
                  <div key={c.id} style={{ padding: '14px', borderRadius: 'var(--r-sm)', background: c.author.role?.name === 'client' ? 'var(--brand-blue-soft)' : 'var(--bg-1)', border: '1px solid var(--line-soft)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>{c.author.name}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace" }}>
                        {new Date(c.createdAt).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{c.content}</p>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--line-soft)' }}>
                <TicketCommentForm ticketId={ticket.id} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="panel" style={{ gap: '14px' }}>
              <h4 style={{ margin: 0, fontSize: '12px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>Detalhes</h4>
              {[
                { label: 'Solicitante', value: ticket.creator.name },
                { label: 'Empresa', value: ticket.client.companyName },
                { label: 'Atribuído a', value: ticket.assignee?.name || 'Não atribuído' },
                { label: 'Categoria', value: ticket.category || '—' },
                { label: 'Criado em', value: new Date(ticket.createdAt).toLocaleDateString('pt-BR') },
                { label: 'Atualizado', value: new Date(ticket.updatedAt).toLocaleString('pt-BR') },
              ].map((d) => (
                <div key={d.label}>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 600, marginBottom: '3px' }}>{d.label}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text)', fontWeight: 500 }}>{d.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
