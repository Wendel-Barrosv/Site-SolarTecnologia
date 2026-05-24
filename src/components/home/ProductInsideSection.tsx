import Image from 'next/image'

export default function ProductInsideSection() {
  return (
    <section id="plataforma" className="inside-section">
      <div className="wrap">
        <div className="inside-heading">
          <div>
            <span className="eyebrow eb-blue"><span className="dot" /> Interface real do produto</span>
            <h2 className="h-display">Conheça o Solar Wave por dentro.</h2>
          </div>
          <div className="inside-lede">
            <p>
              Visualize em tempo real os principais indicadores operacionais, financeiros e comerciais
              da sua operação solar em uma única plataforma.
            </p>
            <a href="#contato" className="btn btn-primary btn-lg">Solicitar demonstração</a>
          </div>
        </div>

        <figure className="inside-frame">
          <div className="inside-browser">
            <span className="inside-browser-dots" aria-hidden="true"><i /><i /><i /></span>
            <span className="inside-browser-title">solarwave.erp / dashboard</span>
            <span className="inside-browser-badge"><i /> Tela real do sistema</span>
          </div>
          <div className="inside-screen">
            <Image
              src="/solarwave-dashboard.png"
              alt="Telas reais do SolarWave ERP com dashboard operacional, monitoramento e integrações"
              width={1672}
              height={941}
              sizes="(max-width: 1280px) calc(100vw - 56px), 1258px"
              quality={95}
            />
          </div>
          <figcaption className="inside-caption">
            <span>Dashboard real do SolarWave ERP</span>
            <strong>Monitoramento, operação e integrações</strong>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
