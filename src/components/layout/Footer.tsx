import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-col foot-brand">
            <Link className="logo" href="/">
              <span className="logo-mark">
                <svg width="36" height="36" viewBox="0 0 40 40">
                  <defs>
                    <radialGradient id="sunRGFt" cx="50%" cy="50%" r="50%">
                      <stop offset="0" stopColor="#fde047" />
                      <stop offset="0.6" stopColor="#fbbf24" />
                      <stop offset="1" stopColor="#f59e0b" />
                    </radialGradient>
                    <linearGradient id="waveGFt" x1="0" x2="1" y1="0" y2="0">
                      <stop offset="0" stopColor="#3b82f6" />
                      <stop offset="1" stopColor="#1d4ed8" />
                    </linearGradient>
                  </defs>
                  <circle cx="20" cy="16" r="6.5" fill="url(#sunRGFt)" />
                  <g stroke="#f59e0b" strokeWidth="2" strokeLinecap="round">
                    <line x1="20" y1="3" x2="20" y2="6.5" />
                    <line x1="20" y1="25.5" x2="20" y2="28.5" />
                    <line x1="6" y1="16" x2="9" y2="16" />
                    <line x1="31" y1="16" x2="34" y2="16" />
                    <line x1="10" y1="6" x2="12" y2="8" />
                    <line x1="28" y1="6" x2="26" y2="8" />
                  </g>
                  <path d="M2 32 Q8 26 14 32 T26 32 T38 32" fill="none" stroke="url(#waveGFt)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="logo-text">Solar<span className="accent">Tecnologia</span><small className="logo-product">Solar Wave ERP</small></span>
            </Link>
            <p>Solar Wave ERP: monitoramento inteligente e gestão integrada para integradores, investidores e operadores solares.</p>
            <div className="socials">
              <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5585987217973'}`} aria-label="WhatsApp">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01a9.82 9.82 0 0 0-7.02-2.92zm4.52 12.13c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.42.06-.65.31-.22.25-.85.83-.85 2.02 0 1.19.87 2.34.99 2.5.12.17 1.71 2.62 4.15 3.67.58.25 1.03.4 1.39.51.58.18 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.47-.29z" /></svg>
              </a>
            </div>
          </div>
          <div className="foot-col">
            <h5>Produto</h5>
            <Link href="/#produto">Solar Wave ERP</Link>
            <Link href="/#plataforma">Dashboard real</Link>
            <Link href="/#modulos">Módulos</Link>
            <Link href="/#atuacao">Atuação no Nordeste</Link>
            <Link href="/#integracoes">Compatibilidade</Link>
          </div>
          <div className="foot-col">
            <h5>Empresa</h5>
            <Link href="/#produto">Sobre o produto</Link>
            <Link href="/#modulos">Soluções</Link>
            <Link href="/#atuacao">Presença regional</Link>
            <Link href="/#contato">Contato</Link>
          </div>
          <div className="foot-col">
            <h5>Suporte</h5>
            <Link href="/auth/login">Área do Cliente</Link>
            <Link href="/#contato">Falar com especialista</Link>
            <Link href="/#contato">Solicitar demonstração</Link>
            <Link href="/#contato">Atendimento comercial</Link>
          </div>
          <div className="foot-col foot-location">
            <h5>Endereço</h5>
            <div className="location-card">
              <span className="location-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 21s7-6.03 7-12A7 7 0 0 0 5 9c0 5.97 7 12 7 12Z" stroke="currentColor" strokeWidth="1.7" />
                  <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.7" />
                </svg>
              </span>
              <address>
                Rua Candido Maia, 70<br />
                CEP: 60356-830<br />
                Fortaleza/CE
              </address>
              <a
                className="location-link"
                href="https://www.google.com/maps/search/?api=1&query=Rua%20Candido%20Maia%2C%2070%2C%2060356-830%2C%20Fortaleza%2FCE"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ver endereço da Solar Tecnologia no mapa"
              >
                Ver no mapa
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <path d="M3 13 13 3M7 3h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 Solar Tecnologia LTDA · CNPJ 66.837.941/0001-92</span>
          <div className="links">
            <Link href="/#contato">Contato</Link>
            <Link href="/auth/login">Área do cliente</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
