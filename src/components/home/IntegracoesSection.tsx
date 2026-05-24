type IntegrationIconName = 'monitoring' | 'billing' | 'crm' | 'support'

const integrations: { name: string; tag: string; cls: string; icon: IntegrationIconName }[] = [
  { name: 'Monitoramento', tag: 'Telemetria', cls: 'i-blue', icon: 'monitoring' },
  { name: 'Faturamento', tag: 'Financeiro', cls: 'i-green', icon: 'billing' },
  { name: 'CRM', tag: 'Comercial', cls: 'i-violet', icon: 'crm' },
  { name: 'Atendimento', tag: 'Cliente', cls: 'i-cyan', icon: 'support' },
]

const featuredBrands = [
  { name: 'Growatt', domain: 'www.growatt.com', category: 'Inversores' },
  { name: 'Huawei', domain: 'solar.huawei.com', category: 'FusionSolar' },
  { name: 'Sungrow', domain: 'www.sungrowpower.com', category: 'Inversores' },
  { name: 'Solarman', domain: 'www.solarmanpv.com', category: 'Monitoramento' },
  { name: 'Fronius', domain: 'www.fronius.com', category: 'Inversores' },
  { name: 'GoodWe', domain: 'www.goodwe.com', category: 'Inversores' },
  { name: 'SMA', domain: 'www.sma.de', category: 'Inversores' },
  { name: 'Solis', domain: 'www.solisinverters.com', category: 'Inversores' },
]

const scaleSignals = [
  'Novas integrações podem ser adicionadas rapidamente',
  'Arquitetura preparada para expansão',
  'Plataforma multi-fabricante',
]

function IntegrationIcon({ name }: { name: IntegrationIconName }) {
  const commonProps = {
    width: 29,
    height: 29,
    viewBox: '0 0 28 28',
    fill: 'none',
    'aria-hidden': true,
  }

  if (name === 'monitoring') {
    return (
      <svg {...commonProps}>
        <path d="M4 19.25h20M7 19.25l1.5-7h11l1.5 7M10 12.25l-.65 7M14 12.25v7M18 12.25l.65 7" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 8.2h2.1l1.4-2.75 2.15 4.15 1.25-2.1H20" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  if (name === 'billing') {
    return (
      <svg {...commonProps}>
        <path d="M8 4.5h9l3 3v16l-3-1.75-3 1.75-3-1.75L8 23.5v-19Z" stroke="currentColor" strokeWidth="1.55" strokeLinejoin="round" />
        <path d="M16.5 4.75v4h3.25M11.25 11h5.5M11.25 14h3" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15.1 19.4c1.05 0 1.8-.54 1.8-1.32 0-1.82-3.55-.72-3.55-2.56 0-.76.72-1.32 1.75-1.32.8 0 1.45.3 1.8.73M15.1 13.45v6.7" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
      </svg>
    )
  }

  if (name === 'crm') {
    return (
      <svg {...commonProps}>
        <circle cx="10.1" cy="9.2" r="3.05" stroke="currentColor" strokeWidth="1.55" />
        <path d="M4.7 20.1c.45-3.05 2.45-4.75 5.4-4.75 2.96 0 4.98 1.7 5.42 4.75" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" />
        <path d="M18.2 8v6.7M15.75 12.25l2.45 2.45 2.45-2.45M17.05 20.1h6.15" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  return (
    <svg {...commonProps}>
      <path d="M6 15v-2.2a8 8 0 0 1 16 0V15" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
      <path d="M6 14.1h2.2a1.4 1.4 0 0 1 1.4 1.4v3.1H7.7A1.7 1.7 0 0 1 6 16.9v-2.8ZM22 14.1h-2.2a1.4 1.4 0 0 0-1.4 1.4v3.1h1.9a1.7 1.7 0 0 0 1.7-1.7v-2.8ZM18.4 18.5c-.45 2.25-2 3.2-4.2 3.2h-1.1" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="10.85" y="20.55" width="3.05" height="2" rx="1" fill="currentColor" />
    </svg>
  )
}

export default function IntegracoesSection() {
  return (
    <section id="integracoes" className="compatibility-section">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow eb-blue"><span className="dot" /> Ecossistema conectado</span>
          <h2 className="h-display title">Integrações para uma<br />operação sem silos.</h2>
          <p className="lede">O Solar Wave organiza os fluxos essenciais da gestão solar para simplificar operação, relacionamento e receita.</p>
        </div>

        <div className="capabilities">
          {integrations.map((integration) => (
            <article key={integration.name} className={`integ ${integration.cls}`}>
              <div className={`ico ${integration.cls}`}><IntegrationIcon name={integration.icon} /></div>
              <div className="integ-copy">
                <div className="name">{integration.name}</div>
                <div className="tag">{integration.tag}</div>
              </div>
            </article>
          ))}
        </div>

        <div className="brands-heading">
          <div>
            <span className="eyebrow eb-solar"><span className="dot" /> Ecossistema aberto</span>
            <h3 className="h-display">Inversores compatíveis</h3>
            <p>
              O Solar Wave ERP integra-se com os principais fabricantes e plataformas de monitoramento
              do mercado solar, proporcionando uma gestão centralizada, inteligente e escalável.
            </p>
          </div>
          <span className="brands-more">e muitos outros...</span>
        </div>

        <div className="brands-marquee" aria-label="Fabricantes e plataformas em destaque">
          <div className="brands-track">
            {[...featuredBrands, ...featuredBrands].map((brand, index) => (
              <article key={`${brand.name}-${index}`} className="premium-brand" aria-hidden={index >= featuredBrands.length}>
                <div className="brand-logo">
                  <img
                    src={`https://www.google.com/s2/favicons?domain_url=https://${brand.domain}&sz=128`}
                    alt=""
                    loading="lazy"
                    width="42"
                    height="42"
                  />
                </div>
                <div>
                  <strong>{brand.name}</strong>
                  <span>{brand.category}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="scale-signals">
          {scaleSignals.map((signal) => (
            <span key={signal}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.5 4.5 6.5 11.5 2.8 7.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {signal}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
