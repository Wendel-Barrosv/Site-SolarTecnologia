'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TicketCommentForm({ ticketId }: { ticketId: string }) {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)
    try {
      await fetch(`/api/tickets/${ticketId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      setContent('')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>Adicionar comentário</h4>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        placeholder="Escreva seu comentário..."
        style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 'var(--r-sm)', fontSize: '13px', fontFamily: 'Inter, sans-serif', resize: 'vertical', outline: 'none', color: 'var(--text)' }}
      />
      <button type="submit" className="btn btn-blue" style={{ alignSelf: 'flex-end', padding: '9px 16px' }} disabled={loading || !content.trim()}>
        {loading ? 'Enviando...' : 'Enviar comentário'}
      </button>
    </form>
  )
}
