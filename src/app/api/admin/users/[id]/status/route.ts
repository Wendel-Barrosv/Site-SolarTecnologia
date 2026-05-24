import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

async function requireAdmin() {
  const s = await getSession()
  return s?.role === 'admin' ? s : null
}

const ALLOWED = ['ACTIVE', 'INACTIVE', 'BLOCKED']

type RouteContext = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ message: 'Acesso negado' }, { status: 403 })
  const { id } = await params

  const body = await req.json()
  const { status } = body

  if (!status || !ALLOWED.includes(status)) {
    return NextResponse.json({ message: 'Status inválido. Use: ACTIVE, INACTIVE ou BLOCKED' }, { status: 400 })
  }

  if (id === admin.sub && status !== 'ACTIVE') {
    return NextResponse.json({ message: 'Não é possível bloquear seu próprio usuário' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 })

  const updated = await prisma.user.update({
    where: { id },
    data: { status, isActive: status === 'ACTIVE' },
    select: { id: true, name: true, email: true, status: true },
  })

  await prisma.auditLog.create({
    data: { action: 'USER_STATUS_CHANGED', entity: 'User', entityId: id, userId: admin.sub, metadata: { from: user.status, to: status } },
  }).catch(() => {})

  return NextResponse.json({ success: true, user: updated })
}
