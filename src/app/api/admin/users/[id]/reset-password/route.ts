import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

async function requireAdmin() {
  const s = await getSession()
  return s?.role === 'admin' ? s : null
}

function generatePassword(): string {
  const u = 'ABCDEFGHJKLMNPQRSTUVWXYZ', l = 'abcdefghijkmnpqrstuvwxyz'
  const d = '23456789', sp = '!@#$%&*'
  const all = u + l + d + sp
  const pw = [u[Math.floor(Math.random()*u.length)], l[Math.floor(Math.random()*l.length)], d[Math.floor(Math.random()*d.length)], sp[Math.floor(Math.random()*sp.length)]]
  for (let i = 4; i < 12; i++) pw.push(all[Math.floor(Math.random()*all.length)])
  return pw.sort(() => Math.random() - 0.5).join('')
}

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(req: NextRequest, { params }: RouteContext) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ message: 'Acesso negado' }, { status: 403 })
  const { id } = await params

  const body = await req.json().catch(() => ({}))
  const { password, mustChangePassword = true } = body

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 })

  const rawPassword = password || generatePassword()
  const hashedPassword = await bcrypt.hash(rawPassword, 12)

  await prisma.user.update({
    where: { id },
    data: { password: hashedPassword, mustChangePassword },
  })

  await prisma.auditLog.create({
    data: { action: 'PASSWORD_RESET', entity: 'User', entityId: id, userId: admin.sub, metadata: { byAdmin: true } },
  }).catch(() => {})

  return NextResponse.json({
    success: true,
    temporaryPassword: password ? undefined : rawPassword,
  })
}
