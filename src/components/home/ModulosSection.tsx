type ModuleIconName = 'monitoring' | 'crm' | 'billing' | 'customer' | 'proposal' | 'investor'

const modules: { cls: string; iconCls: string; icon: ModuleIconName; number: string; title: string; description: string; items: string[] }[] = [
  {
    cls: 'm-solar',
    iconCls: 'solar',
    icon: 'monitoring',
    number: '01 / OPERAÇÃO',
    title: 'Monitoramento 24/7',
    description: 'Dados em tempo real para acompanhar produção, disponibilidade e desvios por ativo.',
    items: ['Alertas e priorização operacional', 'Histórico de geração e performance', 'Visão consolidada da carteira'],
  },
  {
    cls: 'm-blue',
    iconCls: 'blue',
    icon: 'crm',
    number: '02 / COMERCIAL',
    title: 'CRM Integrado',
    description: 'Pipeline comercial criado para acompanhar oportunidades de energia solar.',
    items: ['Leads e propostas conectados', 'Histórico de relacionamento', 'Jornada comercial rastreável'],
  },
  {
    cls: 'm-green',
    iconCls: 'green',
    icon: 'billing',
    number: '03 / FINANCEIRO',
    title: 'Financeiro / Faturamento',
    description: 'Gestão financeira integrada à operação e aos contratos da carteira solar.',
    items: ['Faturamento e recebimentos', 'Conciliação e cobrança', 'Indicadores gerenciais'],
  },
  {
    cls: 'm-cyan',
    iconCls: 'cyan',
    icon: 'customer',
    number: '04 / CLIENTE',
    title: 'Portal do Cliente',
    description: 'Experiência transparente para acompanhar geração, documentos e relacionamento.',
    items: ['Acesso individualizado', 'Relatórios e documentos', 'Comunicação organizada'],
  },
  {
    cls: 'm-amber',
    iconCls: 'amber',
    icon: 'proposal',
    number: '05 / VENDAS',
    title: 'Gerador de Propostas',
    description: 'Apresentações comerciais consistentes para acelerar novas oportunidades.',
    items: ['Modelos comerciais', 'Simulações de economia', 'Fluxo de aprovação'],
  },
  {
    cls: 'm-violet',
    iconCls: 'violet',
    icon: 'investor',
    number: '06 / INVESTIDOR',
    title: 'Portal do Investidor',
    description: 'Informação executiva para avaliação de ativos, carteiras e resultados.',
    items: ['Indicadores de ativos', 'Relatórios executivos', 'Governança de informação'],
  },
]

function ModuleIcon({ name, className }: { name: ModuleIconName; className: string }) {
  let illustration

  if (name === 'monitoring') {
    illustration = (
      <>
        <path d="M3.8 19.25h16.4M6 19.25l1.35-6.1h9.3l1.35 6.1M8.8 13.15l-.55 6.1M12 13.15v6.1M15.2 13.15l.55 6.1" />
        <path d="M8.3 8.85h2.2l1.35-3 2.05 4.05 1.35-2.25h2.45" />
      </>
    )
  } else if (name === 'crm') {
    illustration = (
      <>
        <circle cx="8.5" cy="8.25" r="3" />
        <path d="M3.5 19c.42-3.1 2.3-4.75 5-4.75 2.73 0 4.6 1.65 5.02 4.75M16.1 7.2h4.4v4.4M20.35 7.35l-5.25 5.25" />
      </>
    )
  } else if (name === 'billing') {
    illustration = (
      <>
        <path d="M6.25 3.6h8.2l3.3 3.35V20.4l-2.4-1.4-2.35 1.4-2.35-1.4-2.4 1.4-2-1.15V3.6Z" />
        <path d="M14.25 3.8v3.65h3.25M9 10.3h5.8M9 13.15h3.25M13.15 17.2h2.2" />
      </>
    )
  } else if (name === 'customer') {
    illustration = (
      <>
        <rect x="3.5" y="4" width="17" height="13" rx="2.3" />
        <path d="M8 20h8M12 17.25V20" />
        <circle cx="12" cy="9" r="2" />
        <path d="M8.75 14.25c.4-1.65 1.5-2.45 3.25-2.45 1.75 0 2.85.8 3.25 2.45" />
      </>
    )
  } else if (name === 'proposal') {
    illustration = (
      <>
        <path d="M6 3.75h8l3.25 3.25v13.25H6V3.75ZM13.8 4v3.45h3.2" />
        <path d="m8.75 16.15 6-6 1.65 1.65-6 6-2.25.55.6-2.2ZM9 9.25h2.6" />
      </>
    )
  } else {
    illustration = (
      <>
        <path d="M4 19.5h16M6.2 19.5V9.4h11.6v10.1M9.2 9.15V6.4h5.6v2.75M8.9 13.2h1.8M13.3 13.2h1.8M8.9 16.3h1.8M13.3 16.3h1.8" />
        <path d="M17.9 5.8h2.2v2.2" />
      </>
    )
  }

  return (
    <div className={`mod-icon ${className}`}>
      <svg className="module-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <g stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
          {illustration}
        </g>
      </svg>
    </div>
  )
}

export default function ModulosSection() {
  return (
    <section id="modulos" className="modules-section">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow eb-solar"><span className="dot" /> Módulos do Solar Wave</span>
          <h2 className="h-display title">Uma plataforma.<br />Toda a jornada solar.</h2>
          <p className="lede">Seis módulos para integrar monitoramento, relacionamento, faturamento e governança em uma operação preparada para crescer.</p>
        </div>

        <div className="modules-grid premium-modules">
          {modules.map((module) => (
            <article className={`module ${module.cls}`} key={module.title}>
              <div className="module-top">
                <ModuleIcon name={module.icon} className={module.iconCls} />
                <span className="num">{module.number}</span>
              </div>
              <h3 className="title">{module.title}</h3>
              <p className="desc">{module.description}</p>
              <ul>
                {module.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
