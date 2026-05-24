'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { loginSchema, LoginInput } from '@/lib/validations'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.message || 'Credenciais inválidas'); return }
      if (json.user?.mustChangePassword) {
        router.push('/dashboard/perfil?mustChange=1')
      } else {
        router.push('/dashboard')
      }
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <svg width="36" height="36" viewBox="0 0 40 40">
            <defs>
              <radialGradient id="sunRGL" cx="50%" cy="50%" r="50%">
                <stop offset="0" stopColor="#fde047" /><stop offset="0.6" stopColor="#fbbf24" /><stop offset="1" stopColor="#f59e0b" />
              </radialGradient>
              <linearGradient id="waveGL" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor="#3b82f6" /><stop offset="1" stopColor="#1d4ed8" />
              </linearGradient>
            </defs>
            <circle cx="20" cy="16" r="6.5" fill="url(#sunRGL)" />
            <g stroke="#f59e0b" strokeWidth="2" strokeLinecap="round">
              <line x1="20" y1="3" x2="20" y2="6.5" /><line x1="20" y1="25.5" x2="20" y2="28.5" />
              <line x1="6" y1="16" x2="9" y2="16" /><line x1="31" y1="16" x2="34" y2="16" />
              <line x1="10" y1="6" x2="12" y2="8" /><line x1="28" y1="6" x2="26" y2="8" />
            </g>
            <path d="M2 32 Q8 26 14 32 T26 32 T38 32" fill="none" stroke="url(#waveGL)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '17px', letterSpacing: '-0.015em' }}>
              Solar<span style={{ color: 'var(--brand-blue)' }}>Tecnologia</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace" }}>Área do Cliente</div>
          </div>
        </div>

        <h1 style={{ fontFamily: 'Space Grotesk', fontSize: '26px', fontWeight: 600, margin: '0 0 6px', letterSpacing: '-0.025em' }}>Bem-vindo de volta</h1>
        <p style={{ color: 'var(--text-2)', fontSize: '14px', margin: '0 0 28px' }}>Entre com e-mail ou CPF/CNPJ para acessar o portal.</p>

        {error && (
          <div style={{ padding: '12px 14px', borderRadius: 'var(--r-sm)', background: 'var(--red-soft)', border: '1px solid #fecaca', color: 'var(--red)', fontSize: '13px', marginBottom: '16px', fontWeight: 500 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="auth-field">
            <label htmlFor="identifier">E-mail ou CPF/CNPJ</label>
            <input
              id="identifier"
              type="text"
              {...register('identifier')}
              placeholder="seu@email.com ou 000.000.000-00"
              autoComplete="username"
            />
            {errors.identifier && <span className="err">{errors.identifier.message}</span>}
          </div>
          <div className="auth-field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="password">Senha</label>
              <Link href="/auth/recuperar-senha" style={{ fontSize: '12px', color: 'var(--brand-blue)', textDecoration: 'none', fontWeight: 500 }}>Esqueceu a senha?</Link>
            </div>
            <input id="password" type="password" {...register('password')} placeholder="••••••••" autoComplete="current-password" />
            {errors.password && <span className="err">{errors.password.message}</span>}
          </div>

          <button type="submit" className="btn btn-blue btn-lg" style={{ width: '100%', marginTop: '4px' }} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar na plataforma'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--text-2)' }}>
          Não tem uma conta?{' '}
          <Link href="/auth/cadastro" style={{ color: 'var(--brand-blue)', fontWeight: 600, textDecoration: 'none' }}>Cadastre-se</Link>
        </p>
        <p style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link href="/" style={{ fontSize: '12px', color: 'var(--text-3)', textDecoration: 'none' }}>← Voltar ao site</Link>
        </p>
      </div>
    </div>
  )
}
