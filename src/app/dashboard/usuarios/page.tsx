'use client'
import { useState, useEffect, useCallback } from 'react'

type UserStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | 'REJECTED'

interface Role {
  id: string
  name: string
  description: string | null
}

interface User {
  id: string
  name: string
  email: string
  cpfCnpj: string | null
  phone: string | null
  status: UserStatus
  mustChangePassword: boolean
  createdAt: string
  role: Role
}

const STATUS_LABEL: Record<UserStatus, string> = {
  PENDING: 'Pendente',
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo',
  BLOCKED: 'Bloqueado',
  REJECTED: 'Rejeitado',
}

const STATUS_COLOR: Record<UserStatus, string> = {
  PENDING: '#f59e0b',
  ACTIVE: '#10b981',
  INACTIVE: '#94a3b8',
  BLOCKED: '#ef4444',
  REJECTED: '#6b7280',
}

const INITIAL_FORM = {
  name: '', email: '', cpfCnpj: '', phone: '', roleId: '',
  status: 'ACTIVE' as UserStatus, password: '', mustChangePassword: false,
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [tab, setTab] = useState<'all' | 'pending'>('all')
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Modal state
  const [modal, setModal] = useState<null | 'create' | 'edit' | 'resetPw' | 'confirm'>(null)
  const [selected, setSelected] = useState<User | null>(null)
  const [form, setForm] = useState({ ...INITIAL_FORM })
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [tempPassword, setTempPassword] = useState('')
  const [confirmAction, setConfirmAction] = useState<{ label: string; action: () => Promise<void> } | null>(null)

  const pageSize = 20

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const qs = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        search,
        status: tab === 'pending' ? 'PENDING' : statusFilter,
      })
      const res = await fetch(`/api/admin/users?${qs}`)
      if (!res.ok) throw new Error('Erro ao carregar usuários')
      const data = await res.json()
      setUsers(data.users)
      setTotal(data.total)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter, tab])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  useEffect(() => {
    fetch('/api/admin/roles').then(r => r.json()).then(d => setRoles(d.roles || []))
  }, [])

  const openCreate = () => {
    setForm({ ...INITIAL_FORM })
    setFormError('')
    setTempPassword('')
    setModal('create')
  }

  const openEdit = (u: User) => {
    setSelected(u)
    setForm({
      name: u.name, email: u.email,
      cpfCnpj: u.cpfCnpj || '', phone: u.phone || '',
      roleId: u.role.id, status: u.status,
      password: '', mustChangePassword: u.mustChangePassword,
    })
    setFormError('')
    setModal('edit')
  }

  const openResetPw = (u: User) => {
    setSelected(u)
    setForm(f => ({ ...f, password: '', mustChangePassword: true }))
    setFormError('')
    setTempPassword('')
    setModal('resetPw')
  }

  const openConfirm = (label: string, action: () => Promise<void>) => {
    setConfirmAction({ label, action })
    setModal('confirm')
  }

  const closeModal = () => {
    setModal(null)
    setSelected(null)
    setConfirmAction(null)
    setTempPassword('')
    setFormError('')
  }

  const handleCreate = async () => {
    setFormLoading(true)
    setFormError('')
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, email: form.email,
          cpfCnpj: form.cpfCnpj || undefined,
          phone: form.phone || undefined,
          roleId: form.roleId, status: form.status,
          password: form.password || undefined,
          mustChangePassword: form.mustChangePassword,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setFormError(data.message || 'Erro ao criar usuário'); return }
      if (data.temporaryPassword) {
        setTempPassword(data.temporaryPassword)
      } else {
        closeModal()
        fetchUsers()
      }
    } catch {
      setFormError('Erro de conexão')
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = async () => {
    if (!selected) return
    setFormLoading(true)
    setFormError('')
    try {
      const res = await fetch(`/api/admin/users/${selected.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, email: form.email,
          cpfCnpj: form.cpfCnpj || null,
          phone: form.phone || null,
          roleId: form.roleId, status: form.status,
          mustChangePassword: form.mustChangePassword,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setFormError(data.message || 'Erro ao atualizar'); return }
      closeModal()
      fetchUsers()
    } catch {
      setFormError('Erro de conexão')
    } finally {
      setFormLoading(false)
    }
  }

  const handleResetPw = async () => {
    if (!selected) return
    setFormLoading(true)
    setFormError('')
    try {
      const res = await fetch(`/api/admin/users/${selected.id}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: form.password || undefined, mustChangePassword: form.mustChangePassword }),
      })
      const data = await res.json()
      if (!res.ok) { setFormError(data.message || 'Erro ao redefinir senha'); return }
      if (data.temporaryPassword) {
        setTempPassword(data.temporaryPassword)
      } else {
        closeModal()
      }
    } catch {
      setFormError('Erro de conexão')
    } finally {
      setFormLoading(false)
    }
  }

  const approve = async (u: User) => {
    await fetch(`/api/admin/users/${u.id}/approve`, { method: 'POST' })
    fetchUsers()
  }

  const reject = async (u: User) => {
    await fetch(`/api/admin/users/${u.id}/reject`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reason: '' }) })
    fetchUsers()
  }

  const setStatus = async (u: User, status: string) => {
    await fetch(`/api/admin/users/${u.id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchUsers()
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div style={{ maxWidth: '1100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: 'Space Grotesk', fontSize: '24px', fontWeight: 600, margin: '0 0 4px' }}>Gestão de Usuários</h1>
          <p style={{ color: 'var(--text-2)', fontSize: '14px', margin: 0 }}>{total} usuário{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-blue" onClick={openCreate}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginRight: '6px' }}>
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Novo usuário
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--line)', marginBottom: '20px' }}>
        {(['all', 'pending'] as const).map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setPage(1) }}
            style={{
              padding: '8px 16px', fontSize: '13px', fontWeight: 500,
              border: 'none', background: 'none', cursor: 'pointer',
              color: tab === t ? 'var(--brand-blue)' : 'var(--text-2)',
              borderBottom: tab === t ? '2px solid var(--brand-blue)' : '2px solid transparent',
              marginBottom: '-1px',
            }}
          >
            {t === 'all' ? 'Todos' : 'Pendentes'}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="Buscar por nome, e-mail ou CPF/CNPJ..."
          style={{ flex: '1', minWidth: '220px', padding: '8px 12px', borderRadius: 'var(--r-sm)', border: '1px solid var(--line)', background: 'var(--bg)', color: 'var(--text)', fontSize: '13px' }}
        />
        {tab === 'all' && (
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
            style={{ padding: '8px 12px', borderRadius: 'var(--r-sm)', border: '1px solid var(--line)', background: 'var(--bg)', color: 'var(--text)', fontSize: '13px' }}
          >
            <option value="">Todos os status</option>
            <option value="ACTIVE">Ativo</option>
            <option value="PENDING">Pendente</option>
            <option value="INACTIVE">Inativo</option>
            <option value="BLOCKED">Bloqueado</option>
            <option value="REJECTED">Rejeitado</option>
          </select>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: '12px 14px', borderRadius: 'var(--r-sm)', background: 'var(--red-soft)', color: 'var(--red)', fontSize: '13px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-scroll">
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                {['Nome', 'E-mail', 'CPF/CNPJ', 'Perfil', 'Status', 'Criado em', 'Ações'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--text-2)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>Carregando...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>Nenhum usuário encontrado.</td></tr>
              ) : users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--line-soft)' }}>
                  <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 500 }}>
                    {u.name}
                    {u.mustChangePassword && (
                      <span style={{ marginLeft: '6px', fontSize: '10px', background: '#fef3c7', color: '#92400e', padding: '1px 5px', borderRadius: '4px' }}>troca senha</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '13px', color: 'var(--text-2)' }}>{u.email}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace" }}>{u.cpfCnpj || '—'}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px' }}>{u.role?.description || u.role?.name}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '99px',
                      background: STATUS_COLOR[u.status] + '20', color: STATUS_COLOR[u.status],
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: STATUS_COLOR[u.status] }} />
                      {STATUS_LABEL[u.status]}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--text-3)', whiteSpace: 'nowrap' }}>
                    {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {u.status === 'PENDING' && (
                        <>
                          <button onClick={() => openConfirm(`Aprovar ${u.name}?`, () => approve(u))} className="btn btn-sm btn-green">Aprovar</button>
                          <button onClick={() => openConfirm(`Rejeitar ${u.name}?`, () => reject(u))} className="btn btn-sm btn-red">Rejeitar</button>
                        </>
                      )}
                      {u.status === 'ACTIVE' && (
                        <button onClick={() => openConfirm(`Bloquear ${u.name}?`, () => setStatus(u, 'BLOCKED'))} className="btn btn-sm" style={{ color: 'var(--red)', border: '1px solid var(--line)' }}>Bloquear</button>
                      )}
                      {u.status === 'BLOCKED' && (
                        <button onClick={() => openConfirm(`Reativar ${u.name}?`, () => setStatus(u, 'ACTIVE'))} className="btn btn-sm btn-green">Reativar</button>
                      )}
                      <button onClick={() => openEdit(u)} className="btn btn-sm" style={{ border: '1px solid var(--line)' }}>Editar</button>
                      <button onClick={() => openResetPw(u)} className="btn btn-sm" style={{ border: '1px solid var(--line)' }}>Reset senha</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px', alignItems: 'center' }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn btn-sm"
            style={{ border: '1px solid var(--line)' }}
          >← Anterior</button>
          <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>Página {page} de {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn btn-sm"
            style={{ border: '1px solid var(--line)' }}
          >Próxima →</button>
        </div>
      )}

      {/* ─── Modals ─── */}
      {modal && modal !== 'confirm' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} onClick={closeModal} />
          <div style={{ position: 'relative', background: 'var(--bg)', borderRadius: 'var(--r-md)', padding: '28px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>

            {/* Temporary password display after create/reset */}
            {tempPassword ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--green-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg width="28" height="28" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>
                </div>
                <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '20px', fontWeight: 600, margin: '0 0 8px' }}>
                  {modal === 'create' ? 'Usuário criado!' : 'Senha redefinida!'}
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-2)', marginBottom: '16px' }}>Anote a senha temporária abaixo. Ela não será exibida novamente.</p>
                <div style={{ background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: 'var(--r-sm)', padding: '14px', fontFamily: "'JetBrains Mono', monospace", fontSize: '18px', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '20px' }}>
                  {tempPassword}
                </div>
                <button className="btn btn-blue" style={{ width: '100%' }} onClick={() => { closeModal(); fetchUsers() }}>Fechar e continuar</button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '18px', fontWeight: 600, margin: 0 }}>
                    {modal === 'create' && 'Novo usuário'}
                    {modal === 'edit' && `Editar — ${selected?.name}`}
                    {modal === 'resetPw' && `Redefinir senha — ${selected?.name}`}
                  </h2>
                  <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-2)', padding: '4px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                  </button>
                </div>

                {formError && (
                  <div style={{ padding: '10px 12px', background: 'var(--red-soft)', color: 'var(--red)', borderRadius: 'var(--r-sm)', fontSize: '13px', marginBottom: '14px' }}>
                    {formError}
                  </div>
                )}

                {modal === 'resetPw' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div className="auth-field">
                      <label>Nova senha (deixe em branco para gerar automaticamente)</label>
                      <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" />
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={form.mustChangePassword} onChange={e => setForm(f => ({ ...f, mustChangePassword: e.target.checked }))} />
                      Exigir troca de senha no próximo login
                    </label>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <button onClick={closeModal} className="btn" style={{ flex: 1, border: '1px solid var(--line)' }}>Cancelar</button>
                      <button onClick={handleResetPw} className="btn btn-blue" style={{ flex: 1 }} disabled={formLoading}>
                        {formLoading ? 'Salvando...' : 'Redefinir senha'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="auth-field" style={{ gridColumn: '1 / -1' }}>
                        <label>Nome completo *</label>
                        <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nome" />
                      </div>
                      <div className="auth-field" style={{ gridColumn: '1 / -1' }}>
                        <label>E-mail *</label>
                        <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@exemplo.com" />
                      </div>
                      <div className="auth-field">
                        <label>CPF / CNPJ</label>
                        <input value={form.cpfCnpj} onChange={e => setForm(f => ({ ...f, cpfCnpj: e.target.value }))} placeholder="000.000.000-00" />
                      </div>
                      <div className="auth-field">
                        <label>Telefone</label>
                        <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="(00) 00000-0000" />
                      </div>
                      <div className="auth-field">
                        <label>Perfil *</label>
                        <select value={form.roleId} onChange={e => setForm(f => ({ ...f, roleId: e.target.value }))} style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--r-sm)', border: '1px solid var(--line)', background: 'var(--bg)', color: 'var(--text)', fontSize: '13px' }}>
                          <option value="">Selecione...</option>
                          {roles.map(r => <option key={r.id} value={r.id}>{r.description || r.name}</option>)}
                        </select>
                      </div>
                      <div className="auth-field">
                        <label>Status</label>
                        <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as UserStatus }))} style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--r-sm)', border: '1px solid var(--line)', background: 'var(--bg)', color: 'var(--text)', fontSize: '13px' }}>
                          <option value="ACTIVE">Ativo</option>
                          <option value="PENDING">Pendente</option>
                          <option value="INACTIVE">Inativo</option>
                          <option value="BLOCKED">Bloqueado</option>
                          <option value="REJECTED">Rejeitado</option>
                        </select>
                      </div>
                      {modal === 'create' && (
                        <div className="auth-field" style={{ gridColumn: '1 / -1' }}>
                          <label>Senha (deixe em branco para gerar automaticamente)</label>
                          <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Mínimo 8 caracteres" />
                        </div>
                      )}
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={form.mustChangePassword} onChange={e => setForm(f => ({ ...f, mustChangePassword: e.target.checked }))} />
                      Exigir troca de senha no próximo login
                    </label>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <button onClick={closeModal} className="btn" style={{ flex: 1, border: '1px solid var(--line)' }}>Cancelar</button>
                      <button onClick={modal === 'create' ? handleCreate : handleEdit} className="btn btn-blue" style={{ flex: 1 }} disabled={formLoading}>
                        {formLoading ? 'Salvando...' : (modal === 'create' ? 'Criar usuário' : 'Salvar alterações')}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Confirm modal */}
      {modal === 'confirm' && confirmAction && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} onClick={closeModal} />
          <div style={{ position: 'relative', background: 'var(--bg)', borderRadius: 'var(--r-md)', padding: '28px', width: '100%', maxWidth: '380px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '18px', fontWeight: 600, margin: '0 0 12px' }}>Confirmar ação</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-2)', margin: '0 0 20px' }}>{confirmAction.label}</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={closeModal} className="btn" style={{ flex: 1, border: '1px solid var(--line)' }}>Cancelar</button>
              <button
                onClick={async () => { await confirmAction.action(); closeModal() }}
                className="btn btn-blue"
                style={{ flex: 1 }}
              >Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
