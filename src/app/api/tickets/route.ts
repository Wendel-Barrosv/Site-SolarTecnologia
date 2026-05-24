import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ticketSchema } from '@/lib/validations'

export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ message: 'Não autenticado' }, { status: 401 })

    const where = session.role !== 'admin' && session.clientId ? { clientId: session.clientId } : {}
    const tickets = await prisma.ticket.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { creator: { select: { name: true } }, assignee: { select: { name: true } } },
    })

    return NextResponse.json(tickets)
  } catch (err) {
    console.error('GET tickets error:', err)
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ message: 'Não autenticado' }, { status: 401 })
    if (!session.clientId) return NextResponse.json({ message: 'Usuário sem empresa vinculada' }, { status: 400 })

    const body = await req.json()
    const parsed = ticketSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ message: 'Dados inválidos', errors: parsed.error.flatten() }, { status: 400 })
    }

    const ticket = await prisma.ticket.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        priority: parsed.data.priority,
        category: parsed.data.category,
        status: 'OPEN',
        clientId: session.clientId,
        creatorId: session.sub,
      },
    })

    // Audit log
    await prisma.auditLog.create({
      data: { action: 'CREATE', entity: 'Ticket', entityId: ticket.id, userId: session.sub },
    })

    return NextResponse.json(ticket, { status: 201 })
  } catch (err) {
    console.error('POST ticket error:', err)
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 })
  }
}
