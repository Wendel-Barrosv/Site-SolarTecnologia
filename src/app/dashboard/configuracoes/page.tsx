'use client'
import { useEffect, useState } from 'react'

type EmailConfig = {
  smtp_host: string
  smtp_port: string
  smtp_user: string
  smtp_pass: string
  smtp_from: string
  smtp_to: string
  configured: boolean
}

type Status = { type: 'success' | 'error' | 'testing' | null; message: string }

const FIELD_PASS_PLACEHOLDER = '••••••••'

export default function ConfiguracoesPage() {
  const [config, setConfig] = useState<EmailConfig>({
    smtp_host: 'smtp.gmail.com',
    smtp_port: '587',
    smtp_user: '',
    smtp_pass: '',
    smtp_from: '',
    smtp_to: 'contato@solartecnologia.com',
    configured: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [status, setStatus] = useState<Status>({ type: null, message: '' })
  const [passEditing, setPassEditing] = useState(false)

  useEffect(() => {
    fetch('/api/config/email')
      .then((r) => r.json())
      .then((data) => {
        setConfig(data)
        setLoading(false)
      })
  }, [])

  const handleChange = (key: keyof EmailConfig) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig((prev) => ({ ...prev, [key]: e.target.value }))
    setStatus({ type: null, message: '' })
  }

  const handleSave = async () => {
    setSaving(true)
    setStatus({ type: null, message: '' })
    try {
      const res = await fetch('/api/config/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus({ type: 'success', message: 'Configurações salvas com sucesso.' })
        setPassEditing(false)
        // re-fetch to get fresh masked state
        const fresh = await fetch('/api/config/email').then((r) => r.json())
        setConfig(fresh)
      } else {
        setStatus({ type: 'error', message: data.message || 'Erro ao salvar.' })
      }
    } catch {
      setStatus({ type: 'error', message: 'Erro de conexão.' })
    } finally {
      setSaving(false)
    }
  }

  const handleTest = async () => {
    setTesting(true)
    setStatus({ type: 'testing', message: 'Testando conexão SMTP…' })
    try {
      const res = await fetch('/api/config/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...config, action: 'test' }),
      })
      const data = await res.json()
      setStatus({ type: res.ok ? 'success' : 'error', message: data.message })
    } catch {
      setStatus({ type: 'error', message: 'Erro de conexão ao testar.' })
    } finally {
      setTesting(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '9px 12px',
    border: '1px solid var(--line)',
    borderRadius: '6px',
    fontSize: '13px',
    fontFamily: 'inherit',
    background: '#fff',
    color: 'var(--text)',
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--text-3)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '6px',
    fontFamily: "'JetBrains Mono', monospace",
  }

  if (loading) {
    return (
      <>
        <div className="db-topbar">
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '18px', fontWeight: 600, margin: 0, letterSpacing: '-0.02em' }}>Configurações</h2>
        </div>
        <div className="db-content">
          <div style={{ color: 'var(--text-3)', fontSize: '14px' }}>Carregando…</div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="db-topbar">
        <div>
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '18px', fontWeight: 600, margin: 0, letterSpacing: '-0.02em' }}>Configurações</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-3)', margin: '2px 0 0', fontFamily: "'JetBrains Mono', monospace" }}>
            Administração do sistema
          </p>
        </div>
      </div>

      <div className="db-content">
        <div style={{ maxWidth: '760px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Status card */}
          <div className="panel" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
              background: config.configured ? 'var(--green-soft, #d1fae5)' : '#fef3c7',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {config.configured ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#92400e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              )}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                {config.configured ? 'E-mail configurado' : 'E-mail não configurado'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '2px' }}>
                {config.configured
                  ? `Notificações serão enviadas para ${config.smtp_to}`
                  : 'Preencha as configurações SMTP abaixo para ativar o envio de e-mails.'}
              </div>
            </div>
            {config.configured && (
              <span className="status-badge status-resolved" style={{ marginLeft: 'auto' }}>Ativo</span>
            )}
          </div>

          {/* Email config form */}
          <div className="panel" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-soft)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--brand-blue)' }}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.8" />
                <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>Configurações de E-mail (SMTP)</h3>
            </div>

            <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Provedor hint */}
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '12px 14px', fontSize: '13px', color: '#1e40af', lineHeight: 1.5 }}>
                <strong>Gmail:</strong> Ative a verificação em duas etapas e gere uma{' '}
                <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" style={{ color: '#1d4ed8', fontWeight: 600 }}>
                  App Password
                </a>{' '}
                para usar como senha abaixo.
              </div>

              {/* Row 1: host + port */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Servidor SMTP</label>
                  <input style={inputStyle} value={config.smtp_host} onChange={handleChange('smtp_host')} placeholder="smtp.gmail.com" />
                </div>
                <div>
                  <label style={labelStyle}>Porta</label>
                  <input style={inputStyle} value={config.smtp_port} onChange={handleChange('smtp_port')} placeholder="587" />
                </div>
              </div>

              {/* Row 2: user + pass */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Usuário (e-mail Gmail)</label>
                  <input style={inputStyle} value={config.smtp_user} onChange={handleChange('smtp_user')} placeholder="seu@gmail.com" type="email" />
                </div>
                <div>
                  <label style={labelStyle}>Senha / App Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      style={{ ...inputStyle, paddingRight: '80px' }}
                      value={passEditing ? config.smtp_pass : (config.smtp_pass || '')}
                      onChange={(e) => { setPassEditing(true); handleChange('smtp_pass')(e) }}
                      onFocus={() => { if (config.smtp_pass === FIELD_PASS_PLACEHOLDER) { setConfig(p => ({ ...p, smtp_pass: '' })); setPassEditing(true) } }}
                      placeholder={config.configured ? FIELD_PASS_PLACEHOLDER : 'xxxx xxxx xxxx xxxx'}
                      type={passEditing ? 'text' : 'password'}
                    />
                    {passEditing && (
                      <button
                        type="button"
                        onClick={() => { setPassEditing(false); setConfig(p => ({ ...p, smtp_pass: FIELD_PASS_PLACEHOLDER })) }}
                        style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px' }}
                      >
                        cancelar
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 3: from + to */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Remetente (From)</label>
                  <input style={inputStyle} value={config.smtp_from} onChange={handleChange('smtp_from')} placeholder="seu@gmail.com" type="email" />
                  <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--text-3)' }}>Aparece como "De:" no e-mail recebido</p>
                </div>
                <div>
                  <label style={labelStyle}>Destinatário dos leads (To)</label>
                  <input style={inputStyle} value={config.smtp_to} onChange={handleChange('smtp_to')} placeholder="contato@solartecnologia.com" type="email" />
                  <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--text-3)' }}>Recebe cada novo lead do site</p>
                </div>
              </div>

              {/* Status feedback */}
              {status.type && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  background: status.type === 'success' ? '#d1fae5' : status.type === 'error' ? '#fee2e2' : '#eff6ff',
                  border: `1px solid ${status.type === 'success' ? '#6ee7b7' : status.type === 'error' ? '#fca5a5' : '#bfdbfe'}`,
                  color: status.type === 'success' ? '#065f46' : status.type === 'error' ? '#991b1b' : '#1e40af',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  {status.type === 'testing' && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                  {status.message}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
                <button
                  onClick={handleTest}
                  disabled={testing || saving || !config.smtp_user}
                  className="btn btn-ghost"
                  style={{ padding: '9px 16px', fontSize: '13px' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {testing ? 'Testando…' : 'Testar conexão'}
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || testing}
                  className="btn btn-primary"
                  style={{ padding: '9px 18px', fontSize: '13px' }}
                >
                  {saving ? 'Salvando…' : 'Salvar configurações'}
                </button>
              </div>
            </div>
          </div>

          {/* Info card */}
          <div className="panel" style={{ padding: '16px 20px' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>Como funciona</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { step: '1', text: 'Visitante preenche "Agendar uma visita" no site' },
                { step: '2', text: 'Lead é salvo no banco de dados (tabela contact_requests)' },
                { step: '3', text: 'Sistema envia e-mail de notificação para o destinatário configurado acima' },
                { step: '4', text: 'Equipe comercial recebe o lead e faz o retorno em até 24h' },
              ].map((item) => (
                <div key={item.step} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--brand-blue-soft, #eff6ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '11px', fontWeight: 700, color: 'var(--brand-blue)' }}>
                    {item.step}
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--text-2)', paddingTop: '2px' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  )
}
