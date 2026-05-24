'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { selfRegisterSchema, SelfRegisterInput } from '@/lib/validations'

export default function CadastroPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [pending, setPending] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<SelfRegisterInput>({
    resolver: zodResolver(selfRegisterSchema),
  })

  const onSubmit = async (data: SelfRegisterInput) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.message || 'Erro ao criar conta'); return }
      setPending(true)
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (pending) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--green-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="32" height="32" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <h1 style={{ fontFamily: 'Space Grotesk', fontSize: '24px', fontWeight: 600, margin: '0 0 12px' }}>Cadastro realizado!</h1>
          <p style={{ color: 'var(--text-2)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
            Sua conta foi criada e está <strong>aguardando aprovação</strong> do administrador.<br />
            Você receberá um aviso assim que o acesso for liberado.
          </p>
          <Link href="/auth/login" className="btn btn-blue btn-lg" style={{ display: 'inline-flex', textDecoration: 'none' }}>
            Voltar ao login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '520px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
          <svg width="36" height="36" viewBox="0 0 40 40">
            <defs>
              <radialGradient id="sunRGC" cx="50%" cy="50%" r="50%">
                <stop offset="0" stopColor="#fde047" /><stop offset="0.6" stopColor="#fbbf24" /><stop offset="1" stopColor="#f59e0b" />
              </radialGradient>
              <linearGradient id="waveGC" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor="#3b82f6" /><stop offset="1" stopColor="#1d4ed8" />
              </linearGradient>
            </defs>
            <circle cx="20" cy="16" r="6.5" fill="url(#sunRGC)" />
            <g stroke="#f59e0b" strokeWidth="2" strokeLinecap="round">
              <line x1="20" y1="3" x2="20" y2="6.5" /><line x1="20" y1="25.5" x2="20" y2="28.5" />
              <line x1="6" y1="16" x2="9" y2="16" /><line x1="31" y1="16" x2="34" y2="16" />
            </g>
            <path d="M2 32 Q8 26 14 32 T26 32 T38 32" fill="none" stroke="url(#waveGC)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '17px', letterSpacing: '-0.015em' }}>
              Solar<span style={{ color: 'var(--brand-blue)' }}>Tecnologia</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace" }}>Novo cadastro</div>
          </div>
        </div>

        <h1 style={{ fontFamily: 'Space Grotesk', fontSize: '24px', fontWeight: 600, margin: '0 0 6px', letterSpacing: '-0.025em' }}>Crie sua conta</h1>
        <p style={{ color: 'var(--text-2)', fontSize: '14px', margin: '0 0 24px' }}>Preencha os dados abaixo para solicitar acesso à plataforma.</p>

        {error && (
          <div style={{ padding: '12px 14px', borderRadius: 'var(--r-sm)', background: 'var(--red-soft)', border: '1px solid #fecaca', color: 'var(--red)', fontSize: '13px', marginBottom: '16px', fontWeight: 500 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="auth-field" style={{ gridColumn: '1 / -1' }}>
              <label>Nome completo</label>
              <input {...register('name')} placeholder="Seu nome completo" />
              {errors.name && <span className="err">{errors.name.message}</span>}
            </div>
            <div className="auth-field" style={{ gridColumn: '1 / -1' }}>
              <label>E-mail</label>
              <input type="email" {...register('email')} placeholder="seu@email.com" autoComplete="email" />
              {errors.email && <span className="err">{errors.email.message}</span>}
            </div>
            <div className="auth-field">
              <label>CPF ou CNPJ</label>
              <input {...register('cpfCnpj')} placeholder="000.000.000-00" />
              {errors.cpfCnpj && <span className="err">{errors.cpfCnpj.message}</span>}
            </div>
            <div className="auth-field">
              <label>Telefone</label>
              <input {...register('phone')} placeholder="(00) 00000-0000" />
            </div>
            <div className="auth-field">
              <label>Senha</label>
              <input type="password" {...register('password')} placeholder="••••••••" autoComplete="new-password" />
              {errors.password && <span className="err">{errors.password.message}</span>}
            </div>
            <div className="auth-field">
              <label>Confirmar senha</label>
              <input type="password" {...register('confirmPassword')} placeholder="••••••••" autoComplete="new-password" />
              {errors.confirmPassword && <span className="err">{errors.confirmPassword.message}</span>}
            </div>
          </div>

          <p style={{ fontSize: '12px', color: 'var(--text-3)', margin: '0' }}>
            A senha deve ter no mínimo 8 caracteres, com letra maiúscula, minúscula, número e símbolo.
          </p>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '4px' }} disabled={loading}>
            {loading ? 'Criando conta...' : 'Solicitar acesso'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-2)' }}>
          Já tem uma conta?{' '}
          <Link href="/auth/login" style={{ color: 'var(--brand-blue)', fontWeight: 600, textDecoration: 'none' }}>Entrar</Link>
        </p>
        <p style={{ textAlign: 'center', marginTop: '12px' }}>
          <Link href="/" style={{ fontSize: '12px', color: 'var(--text-3)', textDecoration: 'none' }}>← Voltar ao site</Link>
        </p>
      </div>
    </div>
  )
}
