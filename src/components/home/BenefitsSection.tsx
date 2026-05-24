const benefits = [
  { cls: 'b-solar', label: 'Operação', title: 'Monitoramento inteligente', desc: 'Acompanhe usinas, alertas e desempenho com contexto para agir rapidamente.' },
  { cls: 'b-blue', label: 'Gestão', title: 'Informação centralizada', desc: 'Reduza planilhas isoladas com dados técnicos, comerciais e financeiros conectados.' },
  { cls: 'b-green', label: 'Receita', title: 'Faturamento organizado', desc: 'Aproxime contratos, cobranças e recebimentos da operação que os sustenta.' },
  { cls: 'b-violet', label: 'Vendas', title: 'Conversão comercial', desc: 'Estruture leads, propostas e relacionamentos em um fluxo próprio para integradores.' },
  { cls: 'b-cyan', label: 'Confiança', title: 'Portais transparentes', desc: 'Entregue informações claras para clientes empresariais e investidores.' },
  { cls: 'b-amber', label: 'Escala', title: 'Integração preparada', desc: 'Conecte inversores e serviços essenciais em uma arquitetura orientada a expansão.' },
]

export default function BenefitsSection() {
  return (
    <section className="outcomes-section">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow eb-solar"><span className="dot" /> Valor para o negócio</span>
          <h2 className="h-display title">Tecnologia para operar<br />com mais confiança.</h2>
          <p className="lede">Automação para integradores, investidores e operadores solares, com leitura clara do negócio e da geração.</p>
        </div>
        <div className="benefits-grid">
          {benefits.map((benefit) => (
            <article key={benefit.title} className={`benefit ${benefit.cls} outcome`}>
              <span className="outcome-label">{benefit.label}</span>
              <h4>{benefit.title}</h4>
              <p>{benefit.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
