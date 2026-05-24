'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ticketSchema, TicketInput } from '@/lib/validations'

export default function NovoChamadoPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<TicketInput>({
    resolver: zodResolver(ticketSchema),
    defaultValues: { priority: 'MEDIUM' },
  })

  const onSubmit = async (data: TicketInput) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.message || 'Erro ao criar chamado'); return }
      router.push(`/dashboard/chamados/${json.id}`)
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="db-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/dashboard/chamados" style={{ color: 'var(--text-3)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Chamados
          </Link>
          <span style={{ color: 'var(--line-strong)' }}>/</span>
          <span style={{ fontSize: '13px', color: 'var(--text)', fontWeight: 600 }}>Novo chamado</span>
        </div>
      </div>

      <div className="db-content">
        <div className="panel" style={{ maxWidth: '680px' }}>
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '20px', fontWeight: 600, margin: '0 0 6px', letterSpacing: '-0.02em' }}>Abrir chamado de suporte</h2>
          <p style={{ color: 'var(--text-2)', fontSize: '14px', margin: '0 0 24px' }}>
            Descreva o problema ou solicitação com o máximo de detalhes possível.
          </p>

          {error && (
            <div style={{ padding: '12px 14px', borderRadius: 'var(--r-sm)', background: 'var(--red-soft)', border: '1px solid #fecaca', color: 'var(--red)', fontSize: '13px', marginBottom: '16px', fontWeight: 500 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="auth-field">
              <label>Título do chamado</label>
              <input {...register('title')} placeholder="Ex: Problema no monitoramento do inversor Growatt" />
              {errors.title && <span className="err">{errors.title.message}</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="auth-field">
                <label>Prioridade</label>
                <select {...register('priority')}>
                  <option value="LOW">Baixa</option>
                  <option value="MEDIUM">Média</option>
                  <option value="HIGH">Alta</option>
                  <option value="CRITICAL">Crítica</option>
                </select>
                {errors.priority && <span className="err">{errors.priority.message}</span>}
              </div>
              <div className="auth-field">
                <label>Categoria (opcional)</label>
                <select {...register('category')}>
                  <option value="">Selecione...</option>
                  <option value="monitoramento">Monitoramento</option>
                  <option value="financeiro">Financeiro</option>
                  <option value="acesso">Acesso / Login</option>
                  <option value="relatorio">Relatórios</option>
                  <option value="integracao">Integração</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
            </div>

            <div className="auth-field">
              <label>Descrição detalhada</label>
              <textarea
                {...register('description')}
                rows={6}
                placeholder="Descreva o problema com detalhes: quando começou, o que foi tentado, mensagens de erro, etc."
                style={{ resize: 'vertical' }}
              />
              {errors.description && <span className="err">{errors.description.message}</span>}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? 'Enviando...' : 'Abrir chamado'}
              </button>
              <Link href="/dashboard/chamados" className="btn btn-ghost btn-lg">Cancelar</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
