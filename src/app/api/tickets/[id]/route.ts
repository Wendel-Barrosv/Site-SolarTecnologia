import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  assigneeId: z.string().optional().nullable(),
})

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_: NextRequest, { params }: RouteContext) {
  try {
    const session = await getSession()
    const { id } = await params
    if (!session) return NextResponse.json({ message: 'Não autenticado' }, { status: 401 })

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        creator: { select: { name: true, email: true } },
        assignee: { select: { name: true } },
        client: { select: { companyName: true } },
        comments: { include: { author: { select: { name: true } } }, orderBy: { createdAt: 'asc' } },
      },
    })
    if (!ticket) return NextResponse.json({ message: 'Chamado não encontrado' }, { status: 404 })

    // Access control: clients can only see their own tickets
    if (session.role !== 'admin' && ticket.clientId !== session.clientId) {
      return NextResponse.json({ message: 'Acesso negado' }, { status: 403 })
    }

    return NextResponse.json(ticket)
  } catch (err) {
    console.error('GET ticket error:', err)
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await getSession()
    const { id } = await params
    if (!session) return NextResponse.json({ message: 'Não autenticado' }, { status: 401 })

    const body = await req.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ message: 'Dados inválidos' }, { status: 400 })
    }

    const ticket = await prisma.ticket.findUnique({ where: { id } })
    if (!ticket) return NextResponse.json({ message: 'Chamado não encontrado' }, { status: 404 })
    if (session.role !== 'admin' && session.role !== 'support') {
      return NextResponse.json({ message: 'Sem permissão para atualizar chamado' }, { status: 403 })
    }

    const updated = await prisma.ticket.update({
      where: { id },
      data: {
        ...parsed.data,
        ...(parsed.data.status === 'RESOLVED' || parsed.data.status === 'CLOSED' ? { closedAt: new Date() } : {}),
      },
    })

    await prisma.auditLog.create({
      data: { action: 'UPDATE', entity: 'Ticket', entityId: ticket.id, metadata: parsed.data, userId: session.sub },
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error('PATCH ticket error:', err)
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: RouteContext) {
  try {
    const session = await getSession()
    const { id } = await params
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ message: 'Sem permissão' }, { status: 403 })
    }

    await prisma.ticket.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE ticket error:', err)
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 })
  }
}
