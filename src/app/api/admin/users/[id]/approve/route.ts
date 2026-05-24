import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

async function requireAdmin() {
  const s = await getSession()
  return s?.role === 'admin' ? s : null
}

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(_req: NextRequest, { params }: RouteContext) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ message: 'Acesso negado' }, { status: 403 })
  const { id } = await params

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 })
  if (user.status !== 'PENDING') {
    return NextResponse.json({ message: 'Usuário não está pendente de aprovação' }, { status: 400 })
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { status: 'ACTIVE', isActive: true },
    select: { id: true, name: true, email: true, status: true },
  })

  await prisma.auditLog.create({
    data: { action: 'USER_APPROVED', entity: 'User', entityId: id, userId: admin.sub },
  }).catch(() => {})

  return NextResponse.json({ success: true, user: updated })
}
