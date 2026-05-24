'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  company: z.string().min(2, 'Empresa obrigatória'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone obrigatório'),
  serviceType: z.string().min(1, 'Selecione um serviço'),
  description: z.string().min(10, 'Descreva sua necessidade'),
})
type FormData = z.infer<typeof schema>

export default function CTASection() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setSubmitError(null)
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (res.ok) {
        setSent(true)
        reset()
      } else {
        const body = await res.json().catch(() => ({}))
        setSubmitError(body.message || 'Não foi possível enviar. Tente novamente.')
      }
    } catch {
      setSubmitError('Erro de conexão. Verifique sua internet e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contato">
      <div className="wrap">
        <div className="cta">
          <div className="cta-inner">
            {/* Left */}
            <div>
              <span className="eyebrow eb-solar"><span className="dot" /> Pronto para começar?</span>
              <h2 style={{ marginTop: '18px' }}>
                Conheça o Solar Wave<br />aplicado à <span className="solar-text">sua operação</span>.
              </h2>
              <p>Agende uma apresentação com um especialista e descubra como centralizar dados, processos financeiros e relacionamento comercial.</p>

              <div className="cta-list">
                {[
                  { color: '', label: 'Demonstração orientada ao negócio', desc: 'Apresentação para sua carteira e modelo operacional.' },
                  { color: 'blue', label: 'Avaliação de integrações', desc: 'Mapeamento dos fabricantes e fluxos que sua equipe utiliza.' },
                  { color: 'green', label: 'Contato especializado', desc: 'Conversa objetiva sobre operação, vendas e investimento solar.' },
                ].map((item) => (
                  <div key={item.label} className="item">
                    <div className={`mod-icon ${item.color}`} style={{ flexShrink: 0, width: '40px', height: '40px' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <b>{item.label}</b>
                      <span>{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '28px', marginTop: '28px', fontSize: '13px', color: 'var(--text-2)', flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--brand-blue)' }}><path d="M3 4l5 4 5-4 M3 4v8h10V4 M3 4h10" stroke="currentColor" strokeWidth="1.4" /></svg>
                  contato@solartecnologia.com
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--brand-blue)' }}><path d="M3 4c0 6 3 9 9 9 l1-2 -2-2 -2 1 c-1 0 -3 -2 -3 -3 l1 -2 -2 -2 z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>
                  +55 (85) 98721-7973
                </span>
              </div>
            </div>

            {/* Right — Form */}
            <div style={{ background: '#fff', borderRadius: 'var(--r-lg)', padding: '28px', border: '1px solid var(--line)', boxShadow: 'var(--shadow-card)' }}>
              {sent ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--green-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <h3 style={{ fontFamily: 'Space Grotesk', fontSize: '20px', margin: '0 0 8px' }}>Solicitação enviada!</h3>
                  <p style={{ color: 'var(--text-2)', fontSize: '14px', margin: 0 }}>Nossa equipe entrará em contato em até 24 horas.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <h3 style={{ fontFamily: 'Space Grotesk', fontSize: '18px', margin: '0 0 4px', letterSpacing: '-0.02em' }}>Agendar apresentação</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="auth-field">
                      <label>Nome</label>
                      <input {...register('name')} placeholder="Seu nome" />
                      {errors.name && <span className="err">{errors.name.message}</span>}
                    </div>
                    <div className="auth-field">
                      <label>Empresa</label>
                      <input {...register('company')} placeholder="Nome da empresa" />
                      {errors.company && <span className="err">{errors.company.message}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="auth-field">
                      <label>E-mail</label>
                      <input {...register('email')} type="email" placeholder="seu@email.com" />
                      {errors.email && <span className="err">{errors.email.message}</span>}
                    </div>
                    <div className="auth-field">
                      <label>Telefone</label>
                      <input {...register('phone')} placeholder="(00) 00000-0000" />
                      {errors.phone && <span className="err">{errors.phone.message}</span>}
                    </div>
                  </div>
                  <div className="auth-field">
                    <label>Tipo de serviço</label>
                    <select {...register('serviceType')}>
                      <option value="">Selecione...</option>
                      <option value="monitoramento">Monitoramento de usinas</option>
                      <option value="crm">CRM Solar</option>
                      <option value="financeiro">Faturamento & Cobrança</option>
                      <option value="portal">Portal do Cliente</option>
                      <option value="completo">Plataforma completa</option>
                      <option value="outro">Outro</option>
                    </select>
                    {errors.serviceType && <span className="err">{errors.serviceType.message}</span>}
                  </div>
                  <div className="auth-field">
                    <label>Descreva sua necessidade</label>
                    <textarea {...register('description')} rows={3} placeholder="Conte-nos sobre sua operação..." style={{ resize: 'vertical' }} />
                    {errors.description && <span className="err">{errors.description.message}</span>}
                  </div>
                  {submitError && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '10px 14px', color: '#dc2626', fontSize: '13px' }}>
                      {submitError}
                    </div>
                  )}
                  <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                    {loading ? 'Enviando...' : 'Agendar apresentação'}
                    {!loading && (
                      <svg className="arrow" width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
