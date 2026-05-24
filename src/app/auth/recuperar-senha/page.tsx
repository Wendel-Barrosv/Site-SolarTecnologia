'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { forgotPasswordSchema, ForgotPasswordInput } from '@/lib/validations'

export default function RecuperarSenhaPage() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordInput) => {
    setLoading(true)
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
          <svg width="36" height="36" viewBox="0 0 40 40">
            <defs>
              <radialGradient id="sunRGR" cx="50%" cy="50%" r="50%">
                <stop offset="0" stopColor="#fde047" /><stop offset="1" stopColor="#f59e0b" />
              </radialGradient>
              <linearGradient id="waveGR" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor="#3b82f6" /><stop offset="1" stopColor="#1d4ed8" />
              </linearGradient>
            </defs>
            <circle cx="20" cy="16" r="6.5" fill="url(#sunRGR)" />
            <g stroke="#f59e0b" strokeWidth="2" strokeLinecap="round">
              <line x1="20" y1="3" x2="20" y2="6.5" /><line x1="20" y1="25.5" x2="20" y2="28.5" />
              <line x1="6" y1="16" x2="9" y2="16" /><line x1="31" y1="16" x2="34" y2="16" />
            </g>
            <path d="M2 32 Q8 26 14 32 T26 32 T38 32" fill="none" stroke="url(#waveGR)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '17px', letterSpacing: '-0.015em' }}>
            Solar<span style={{ color: 'var(--brand-blue)' }}>Tecnologia</span>
          </div>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--green-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 8l7 5 7-5 M3 6h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" stroke="#047857" strokeWidth="1.8" /></svg>
            </div>
            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '22px', margin: '0 0 12px', letterSpacing: '-0.02em' }}>E-mail enviado!</h2>
            <p style={{ color: 'var(--text-2)', fontSize: '14px', lineHeight: 1.6, margin: '0 0 24px' }}>
              Se o e-mail informado estiver cadastrado, você receberá as instruções para redefinir sua senha em breve.
            </p>
            <Link href="/auth/login" className="btn btn-ghost" style={{ display: 'inline-flex' }}>
              Voltar ao login
            </Link>
          </div>
        ) : (
          <>
            <h1 style={{ fontFamily: 'Space Grotesk', fontSize: '24px', fontWeight: 600, margin: '0 0 8px', letterSpacing: '-0.025em' }}>Recuperar senha</h1>
            <p style={{ color: 'var(--text-2)', fontSize: '14px', margin: '0 0 24px', lineHeight: 1.5 }}>
              Informe seu e-mail e enviaremos as instruções para redefinir sua senha.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="auth-field">
                <label>E-mail cadastrado</label>
                <input type="email" {...register('email')} placeholder="seu@email.com" />
                {errors.email && <span className="err">{errors.email.message}</span>}
              </div>
              <button type="submit" className="btn btn-blue btn-lg" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar instruções'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-2)' }}>
              Lembrou a senha?{' '}
              <Link href="/auth/login" style={{ color: 'var(--brand-blue)', fontWeight: 600, textDecoration: 'none' }}>Entrar</Link>
            </p>
          </>
        )}
        <p style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link href="/" style={{ fontSize: '12px', color: 'var(--text-3)', textDecoration: 'none' }}>← Voltar ao site</Link>
        </p>
      </div>
    </div>
  )
}
