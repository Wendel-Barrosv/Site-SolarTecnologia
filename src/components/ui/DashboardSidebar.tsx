'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import type { JWTPayload } from '@/lib/auth'

export default function DashboardSidebar({ user }: { user: JWTPayload }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  // Close drawer on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
  }

  const close = () => setMobileOpen(false)

  return (
    <>
      {/* Mobile hamburger — fixed, only visible on mobile */}
      <button
        className="db-hamburger"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menu lateral"
        aria-expanded={mobileOpen}
        style={{ position: 'fixed', top: '16px', left: '16px', zIndex: 210 }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Mobile overlay backdrop */}
      <div
        className={`db-mobile-overlay${mobileOpen ? ' open' : ''}`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside className={`db-sidebar${mobileOpen ? ' mobile-open' : ''}`}>
        {/* Mobile close button inside sidebar */}
        <button
          onClick={close}
          aria-label="Fechar menu"
          style={{
            display: 'none',
            position: 'absolute', top: '14px', right: '12px',
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'var(--bg-2)', border: '1px solid var(--line)',
            cursor: 'pointer', color: 'var(--text)',
            alignItems: 'center', justifyContent: 'center',
          }}
          className="db-sidebar-close-btn"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="db-logo">
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <svg width="30" height="30" viewBox="0 0 40 40">
              <defs>
                <radialGradient id="sunRGDB" cx="50%" cy="50%" r="50%">
                  <stop offset="0" stopColor="#fde047" /><stop offset="1" stopColor="#f59e0b" />
                </radialGradient>
                <linearGradient id="waveGDB" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0" stopColor="#3b82f6" /><stop offset="1" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>
              <circle cx="20" cy="16" r="6.5" fill="url(#sunRGDB)" />
              <g stroke="#f59e0b" strokeWidth="2" strokeLinecap="round">
                <line x1="20" y1="3" x2="20" y2="6.5" /><line x1="20" y1="25.5" x2="20" y2="28.5" />
                <line x1="6" y1="16" x2="9" y2="16" /><line x1="31" y1="16" x2="34" y2="16" />
              </g>
              <path d="M2 32 Q8 26 14 32 T26 32 T38 32" fill="none" stroke="url(#waveGDB)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '15px', color: 'var(--text)' }}>
              Solar<span style={{ color: 'var(--brand-blue)' }}>Tec</span>
            </span>
          </Link>
        </div>

        <div className="db-group">Principal</div>
        <Link href="/dashboard" onClick={close} className={`db-item ${isActive('/dashboard') && pathname === '/dashboard' ? 'active' : ''}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="1.8" /><path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="1.8" /></svg>
          Dashboard
        </Link>

        <div className="db-group">Suporte</div>
        <Link href="/dashboard/chamados" onClick={close} className={`db-item ${isActive('/dashboard/chamados') ? 'active' : ''}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.8" /></svg>
          Chamados
        </Link>
        <Link href="/dashboard/chamados/novo" onClick={close} className={`db-item ${isActive('/dashboard/chamados/novo') ? 'active' : ''}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          Abrir chamado
        </Link>

        <div className="db-group">Conta</div>
        <Link href="/dashboard/perfil" onClick={close} className={`db-item ${isActive('/dashboard/perfil') ? 'active' : ''}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" /><path d="M4 20a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          Meu perfil
        </Link>

        {user.role === 'admin' && (
          <>
            <div className="db-group">Sistema</div>
            <Link href="/dashboard/usuarios" onClick={close} className={`db-item ${isActive('/dashboard/usuarios') ? 'active' : ''}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              Gestão de Usuários
            </Link>
            <Link href="/dashboard/configuracoes" onClick={close} className={`db-item ${isActive('/dashboard/configuracoes') ? 'active' : ''}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" strokeWidth="1.8" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="1.8" /></svg>
              Configurações
            </Link>
          </>
        )}

        <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--line-soft)' }}>
          <div style={{ padding: '10px 12px', marginBottom: '6px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{user.name}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", marginTop: '2px' }}>{user.role}</div>
          </div>
          <button onClick={handleLogout} className="db-item" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)', textAlign: 'left' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Sair
          </button>
        </div>
      </aside>

      <style>{`
        @media (max-width: 960px) {
          .db-sidebar-close-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}
