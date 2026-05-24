export default function ProdutoSection() {
  return (
    <section id="produto">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow eb-blue"><span className="dot" /> Solar Wave ERP</span>
          <h2 className="h-display title">
            A plataforma de gestão<br />para a operação solar.
          </h2>
          <p className="lede">
            O Solar Wave conecta dados técnicos, processos financeiros e relacionamento comercial
            para integradores, investidores e operadores de usinas.
          </p>
        </div>

        <div className="pillars" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
          <div className="benefit pillar-card b-blue" style={{ padding: '22px' }}>
            <div className="mod-icon blue">
              <svg className="pillar-svg" viewBox="0 0 24 24" fill="none">
                <path d="M7.5 8.25 12 5.6l4.5 2.65v5.45L12 16.35 7.5 13.7V8.25Z" stroke="currentColor" strokeWidth="1.65" strokeLinejoin="round" />
                <path d="M12 16.35v3.05M7.5 10.9 4.4 9.1M16.5 10.9l3.1-1.8" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
                <circle cx="12" cy="5.15" r="1.35" fill="currentColor" />
                <circle cx="4" cy="8.9" r="1.35" fill="currentColor" />
                <circle cx="20" cy="8.9" r="1.35" fill="currentColor" />
                <circle cx="12" cy="19.7" r="1.35" fill="currentColor" />
              </svg>
            </div>
            <h4>Operação conectada</h4>
            <p>Controle operacional, financeiro e comercial em uma única plataforma.</p>
          </div>

          <div className="benefit pillar-card b-violet" style={{ padding: '22px' }}>
            <div className="mod-icon violet">
              <svg className="pillar-svg" viewBox="0 0 24 24" fill="none">
                <path d="M12 3.25v3M12 17.75v3M20.75 12h-3M6.25 12h-3M18.2 5.8l-2.12 2.12M7.92 16.08 5.8 18.2M18.2 18.2l-2.12-2.12M7.92 7.92 5.8 5.8" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
                <path d="M12 7.8 13.3 10.7 16.4 12l-3.1 1.3-1.3 2.9-1.3-2.9L7.6 12l3.1-1.3L12 7.8Z" stroke="currentColor" strokeWidth="1.55" strokeLinejoin="round" />
              </svg>
            </div>
            <h4>Automação eficiente</h4>
            <p>Fluxos de cobrança, alertas e relatórios pensados para escala.</p>
          </div>

          <div className="benefit pillar-card b-solar" style={{ padding: '22px' }}>
            <div className="mod-icon">
              <svg className="pillar-svg" viewBox="0 0 24 24" fill="none">
                <path d="M4 19.25h16M5.5 16.1l4.2-4.25 3.2 2.6 5.6-7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15.65 7.45h2.85v2.85" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="9.7" cy="11.85" r="1.15" fill="currentColor" />
              </svg>
            </div>
            <h4>Decisão em tempo real</h4>
            <p>Dados de geração e performance visíveis para decisões mais rápidas.</p>
          </div>

          <div className="benefit pillar-card b-cyan" style={{ padding: '22px' }}>
            <div className="mod-icon cyan">
              <svg className="pillar-svg" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3.15" stroke="currentColor" strokeWidth="1.65" />
                <path d="M12 8.85V5.2M12 18.8v-3.65M8.85 12H5.2M18.8 12h-3.65" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
                <path d="M5.2 8V5.2H8M16 5.2h2.8V8M18.8 16v2.8H16M8 18.8H5.2V16" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h4>Multi-fabricante</h4>
            <p>Compatibilidade com os principais fabricantes usados no mercado solar.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
