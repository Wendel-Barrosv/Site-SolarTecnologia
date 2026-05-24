import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { commentSchema } from '@/lib/validations'

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await getSession()
    const { id } = await params
    if (!session) return NextResponse.json({ message: 'Não autenticado' }, { status: 401 })

    const ticket = await prisma.ticket.findUnique({ where: { id } })
    if (!ticket) return NextResponse.json({ message: 'Chamado não encontrado' }, { status: 404 })

    // Access control
    if (session.role !== 'admin' && session.role !== 'support' && ticket.clientId !== session.clientId) {
      return NextResponse.json({ message: 'Acesso negado' }, { status: 403 })
    }

    const body = await req.json()
    const parsed = commentSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ message: 'Dados inválidos' }, { status: 400 })
    }

    // Only admins/support can add internal comments
    const isInternal = (session.role === 'admin' || session.role === 'support') ? (parsed.data.isInternal ?? false) : false

    const comment = await prisma.ticketComment.create({
      data: {
        content: parsed.data.content,
        isInternal,
        ticketId: id,
        authorId: session.sub,
      },
      include: { author: { select: { name: true } } },
    })

    // Update ticket status to in_progress when first comment from support
    if ((session.role === 'support' || session.role === 'admin') && ticket.status === 'OPEN') {
      await prisma.ticket.update({ where: { id }, data: { status: 'IN_PROGRESS' } })
    }

    return NextResponse.json(comment, { status: 201 })
  } catch (err) {
    console.error('POST comment error:', err)
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 })
  }
}
