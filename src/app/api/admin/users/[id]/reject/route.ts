import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

async function requireAdmin() {
  const s = await getSession()
  return s?.role === 'admin' ? s : null
}

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(req: NextRequest, { params }: RouteContext) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ message: 'Acesso negado' }, { status: 403 })
  const { id } = await params

  const body = await req.json().catch(() => ({}))
  const reason: string = body.reason || ''

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 })

  await prisma.user.update({
    where: { id },
    data: { status: 'REJECTED', isActive: false },
  })

  await prisma.auditLog.create({
    data: { action: 'USER_REJECTED', entity: 'User', entityId: id, userId: admin.sub, metadata: { reason } },
  }).catch(() => {})

  return NextResponse.json({ success: true })
}
