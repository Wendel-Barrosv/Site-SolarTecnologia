import NordesteMap from './NordesteMap'

const regionalCapabilities = [
  {
    title: 'Monitoramento regional',
    description: 'Visão centralizada de ativos solares em múltiplos estados.',
    tag: 'Dados',
  },
  {
    title: 'Operação distribuída',
    description: 'Gestão coordenada para carteiras e usinas em expansão.',
    tag: 'Escala',
  },
  {
    title: 'Suporte remoto',
    description: 'Atendimento técnico e acompanhamento operacional à distância.',
    tag: 'Suporte',
  },
  {
    title: 'Integração multiusinas',
    description: 'Conectividade preparada para diferentes plantas e fabricantes.',
    tag: 'ERP',
  },
]

const states = [
  { initials: 'CE', name: 'Ceará' },
  { initials: 'RN', name: 'Rio Grande do Norte' },
  { initials: 'PE', name: 'Pernambuco' },
  { initials: 'BA', name: 'Bahia' },
  { initials: 'PB', name: 'Paraíba' },
  { initials: 'PI', name: 'Piauí' },
  { initials: 'MA', name: 'Maranhão' },
  { initials: 'AL', name: 'Alagoas' },
  { initials: 'SE', name: 'Sergipe' },
]

const operatingPoints = ['Fortaleza', 'Natal', 'Recife', 'Salvador', 'João Pessoa', 'Teresina', 'São Luís']

export default function DashboardSection() {
  return (
    <section id="atuacao" className="regional-section">
      <div className="wrap">
        <div className="regional-intro">
          <div>
            <span className="eyebrow eb-blue"><span className="dot" /> Presença estratégica</span>
            <h2 className="h-display regional-title">Atuação em todo<br />o Nordeste.</h2>
          </div>
          <div className="regional-copy">
            <p>Monitoramento inteligente para usinas solares no Nordeste, com tecnologia e gestão energética para operações distribuídas em múltiplos estados.</p>
            <p className="expansion-note">Atendimento em expansão e capacidade operacional preparada para crescimento regional contínuo.</p>
          </div>
        </div>

        <div className="regional-grid">
          <div className="satellite-map">
            <div className="map-header">
              <div>
                <span className="map-kicker">Cobertura operacional</span>
                <strong>Região Nordeste, Brasil</strong>
              </div>
              <span className="map-mode"><i /> Satélite</span>
            </div>
            <NordesteMap />
            <div className="map-points" aria-label="Capitais estratégicas no Nordeste">
              {operatingPoints.map((point) => <span key={point}><i />{point}</span>)}
            </div>
          </div>

          <div className="coverage-panel">
            <div className="coverage-head">
              <span className="eyebrow eb-solar"><span className="dot" /> Operação regional</span>
              <h3 className="h-display">Monitoramento em expansão.</h3>
              <p>Robustez operacional e integração corporativa para acompanhar carteiras solares em escala regional.</p>
            </div>
            <div className="states-grid" aria-label="Estados do Nordeste em destaque">
              {states.map((state) => (
                <span key={state.initials} title={state.name}>
                  <b>{state.initials}</b>{state.name}
                </span>
              ))}
            </div>
            <div className="coverage-list regional-capabilities">
              {regionalCapabilities.map((capability) => (
                <article key={capability.title}>
                  <span className="coverage-tag">{capability.tag}</span>
                  <div>
                    <h4>{capability.title}</h4>
                    <p>{capability.description}</p>
                  </div>
                </article>
              ))}
            </div>
            <a className="btn btn-blue coverage-cta" href="#contato">Falar com especialista</a>
          </div>
        </div>
      </div>
    </section>
  )
}
