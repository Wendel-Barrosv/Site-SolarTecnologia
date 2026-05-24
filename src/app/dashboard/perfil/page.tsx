import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function PerfilPage() {
  const session = await getSession()
  if (!session) return null

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    include: { role: true, client: true },
  })

  if (!user) return null

  return (
    <>
      <div className="db-topbar">
        <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '18px', fontWeight: 600, margin: 0, letterSpacing: '-0.02em' }}>Meu Perfil</h2>
      </div>
      <div className="db-content">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '800px' }}>
          <div className="panel" style={{ gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--line-soft)' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--brand-blue-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 700, color: 'var(--brand-blue-2)', fontFamily: 'Space Grotesk' }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 style={{ margin: 0, fontFamily: 'Space Grotesk', fontSize: '18px', fontWeight: 600 }}>{user.name}</h3>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace" }}>{user.role.name} · {user.email}</p>
              </div>
              <span className="status-badge status-resolved" style={{ marginLeft: 'auto' }}>
                {user.isActive ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              {[
                { label: 'Nome completo', value: user.name },
                { label: 'E-mail', value: user.email },
                { label: 'Telefone', value: user.phone || '—' },
                { label: 'Perfil de acesso', value: user.role.name },
                { label: 'Empresa', value: user.client?.companyName || '—' },
                { label: 'Membro desde', value: new Date(user.createdAt).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' }) },
              ].map((f) => (
                <div key={f.label}>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '4px' }}>{f.label}</div>
                  <div style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 500 }}>{f.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <h3 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 600 }}>Segurança</h3>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'var(--text-2)' }}>Para alterar a senha, entre em contato com o suporte.</p>
            <a href="/dashboard/chamados/novo" className="btn btn-ghost" style={{ padding: '9px 14px', fontSize: '13px' }}>
              Abrir chamado de segurança
            </a>
          </div>

          <div className="panel">
            <h3 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 600 }}>Suporte</h3>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'var(--text-2)' }}>Precisa de ajuda? Nossa equipe está disponível.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: 'var(--text-2)' }}>
              <span>📧 contato@solartecnologia.com</span>
              <span>📱 +55 (85) 98721-7973</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
