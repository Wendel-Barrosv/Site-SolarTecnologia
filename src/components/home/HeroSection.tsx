export default function HeroSection() {
  return (
    <section className="hero">
      <div className="dots" />
      <div className="wrap hero-inner">
        <div className="reveal" style={{ display: 'flex', justifyContent: 'center' }}>
          <span className="eyebrow eb-solar">
            <span className="dot" />
            Solar Tecnologia · Solar Wave ERP
          </span>
        </div>

        <h1 className="reveal" style={{ animationDelay: '.05s' }}>
          Gestão inteligente
          <span className="line2">para usinas solares</span>
        </h1>

        <p className="sub reveal" style={{ animationDelay: '.12s' }}>
          Monitoramento inteligente para usinas solares. Controle operacional, financeiro e comercial
          em uma única plataforma para integradores, investidores e operadores.
        </p>

        <div className="hero-cta reveal" style={{ animationDelay: '.18s' }}>
          <a href="#contato" className="btn btn-primary btn-lg">
            Solicitar demonstração
            <svg className="arrow" width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a href="#plataforma" className="btn btn-ghost btn-lg">Conhecer o Solar Wave</a>
        </div>

        <div className="hero-meta reveal" style={{ animationDelay: '.22s' }}>
          <span><b>Dados em tempo real</b> para decisão</span>
          <span style={{ color: 'var(--line-strong)' }}>·</span>
          <span><b>Automação</b> operacional e comercial</span>
          <span style={{ color: 'var(--line-strong)' }}>·</span>
          <span><b>Presença regional</b> no Nordeste</span>
          <span style={{ color: 'var(--line-strong)' }}>·</span>
          <span><b>ERP</b> para o setor solar</span>
        </div>
      </div>
    </section>
  )
}
