import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { adminCreateUserSchema } from '@/lib/validations'

async function requireAdmin() {
  const s = await getSession()
  return s?.role === 'admin' ? s : null
}

function normalizeCpfCnpj(v: string) { return v.replace(/\D/g, '') }

function generatePassword(): string {
  const u = 'ABCDEFGHJKLMNPQRSTUVWXYZ', l = 'abcdefghijkmnpqrstuvwxyz'
  const d = '23456789', sp = '!@#$%&*'
  const all = u + l + d + sp
  const pw = [u[Math.floor(Math.random()*u.length)], l[Math.floor(Math.random()*l.length)], d[Math.floor(Math.random()*d.length)], sp[Math.floor(Math.random()*sp.length)]]
  for (let i = 4; i < 12; i++) pw.push(all[Math.floor(Math.random()*all.length)])
  return pw.sort(() => Math.random() - 0.5).join('')
}

export async function GET(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ message: 'Acesso negado' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || ''
  const roleId = searchParams.get('roleId') || ''
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const pageSize = Math.min(50, parseInt(searchParams.get('pageSize') || '20'))

  const where: Record<string, unknown> = {}
  if (status) where.status = status
  if (roleId) where.roleId = roleId
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { cpfCnpj: { contains: search.replace(/\D/g, '') } },
    ]
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true, name: true, email: true, cpfCnpj: true, phone: true,
        status: true, mustChangePassword: true, createdAt: true,
        role: { select: { id: true, name: true, description: true } },
      },
    }),
    prisma.user.count({ where }),
  ])

  return NextResponse.json({ users, total, page, pageSize })
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ message: 'Acesso negado' }, { status: 403 })

  const body = await req.json()
  const parsed = adminCreateUserSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ message: 'Dados inválidos', errors: parsed.error.flatten() }, { status: 400 })

  const { name, email, cpfCnpj, phone, roleId, status, password, mustChangePassword } = parsed.data

  const emailExists = await prisma.user.findUnique({ where: { email } })
  if (emailExists) return NextResponse.json({ message: 'E-mail já cadastrado' }, { status: 409 })

  const normalizedDoc = cpfCnpj ? normalizeCpfCnpj(cpfCnpj) : undefined
  if (normalizedDoc) {
    const docExists = await prisma.user.findUnique({ where: { cpfCnpj: normalizedDoc } })
    if (docExists) return NextResponse.json({ message: 'CPF/CNPJ já cadastrado' }, { status: 409 })
  }

  const rawPassword = password || generatePassword()
  const hashedPassword = await bcrypt.hash(rawPassword, 12)

  const user = await prisma.user.create({
    data: {
      name, email, cpfCnpj: normalizedDoc, phone,
      password: hashedPassword,
      status: status as 'ACTIVE',
      isActive: status === 'ACTIVE',
      mustChangePassword,
      emailVerified: false,
      roleId,
    },
    include: { role: true },
  })

  await prisma.auditLog.create({
    data: { action: 'USER_CREATED', entity: 'User', entityId: user.id, userId: admin.sub, metadata: { email, status, roleId } },
  }).catch(() => {})

  return NextResponse.json({ success: true, user, temporaryPassword: password ? undefined : rawPassword }, { status: 201 })
}
