'use client'
import Link from 'next/link'
import { useState } from 'react'

const NAV_LINKS = [
  { href: '/#produto', label: 'Solar Wave' },
  { href: '/#plataforma', label: 'Plataforma' },
  { href: '/#modulos', label: 'Módulos' },
  { href: '/#atuacao', label: 'Nordeste' },
  { href: '/#integracoes', label: 'Compatibilidade' },
  { href: '/#contato', label: 'Contato' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const close = () => setMenuOpen(false)

  return (
    <>
      <nav className="nav">
        <Link className="logo" href="/" aria-label="Solar Tecnologia">
          <span className="logo-mark">
            <svg width="36" height="36" viewBox="0 0 40 40">
              <defs>
                <radialGradient id="sunRGNav" cx="50%" cy="50%" r="50%">
                  <stop offset="0" stopColor="#fde047" />
                  <stop offset="0.6" stopColor="#fbbf24" />
                  <stop offset="1" stopColor="#f59e0b" />
                </radialGradient>
                <linearGradient id="waveGNav" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0" stopColor="#3b82f6" />
                  <stop offset="1" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>
              <circle cx="20" cy="16" r="6.5" fill="url(#sunRGNav)" />
              <g stroke="#f59e0b" strokeWidth="2" strokeLinecap="round">
                <line x1="20" y1="3" x2="20" y2="6.5" />
                <line x1="20" y1="25.5" x2="20" y2="28.5" />
                <line x1="6" y1="16" x2="9" y2="16" />
                <line x1="31" y1="16" x2="34" y2="16" />
                <line x1="10" y1="6" x2="12" y2="8" />
                <line x1="28" y1="6" x2="26" y2="8" />
              </g>
              <path d="M2 32 Q8 26 14 32 T26 32 T38 32" fill="none" stroke="url(#waveGNav)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="logo-text">Solar<span className="accent">Tecnologia</span><small className="logo-product">Solar Wave ERP</small></span>
        </Link>

        <div className="nav-links">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href}>{l.label}</Link>
          ))}
        </div>

        <div className="nav-actions">
          <Link href="/auth/login" className="btn btn-ghost" style={{ padding: '9px 16px' }}>
            Entrar
          </Link>
          <Link href="/#contato" className="btn btn-primary" style={{ padding: '9px 16px' }}>
            Solicitar demonstração
          </Link>
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu de navegação"
            aria-expanded={menuOpen}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`nav-mobile-overlay${menuOpen ? ' open' : ''}`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Mobile menu drawer */}
      <div
        className={`nav-mobile-menu${menuOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
      >
        <div className="nav-mobile-head">
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '15px', color: 'var(--text)' }}>
            Solar<span style={{ color: 'var(--brand-blue)' }}>Tecnologia</span>
          </span>
          <button className="nav-mobile-close" onClick={close} aria-label="Fechar menu">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="nav-mobile-links">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={close}>{l.label}</Link>
          ))}
        </nav>

        <div className="nav-mobile-actions">
          <Link href="/auth/login" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }} onClick={close}>
            Entrar
          </Link>
          <Link href="/#contato" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={close}>
            Solicitar demonstração
          </Link>
        </div>
      </div>
    </>
  )
}
