import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { adminUpdateUserSchema } from '@/lib/validations'

async function requireAdmin() {
  const s = await getSession()
  return s?.role === 'admin' ? s : null
}

function normalizeCpfCnpj(v: string) { return v.replace(/\D/g, '') }

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ message: 'Acesso negado' }, { status: 403 })
  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true, name: true, email: true, cpfCnpj: true, phone: true,
      status: true, mustChangePassword: true, createdAt: true, updatedAt: true,
      role: { select: { id: true, name: true, description: true } },
    },
  })

  if (!user) return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 })
  return NextResponse.json({ user })
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ message: 'Acesso negado' }, { status: 403 })
  const { id } = await params

  const body = await req.json()
  const parsed = adminUpdateUserSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ message: 'Dados inválidos', errors: parsed.error.flatten() }, { status: 400 })

  const existing = await prisma.user.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 })

  const { name, email, cpfCnpj, phone, roleId, status, mustChangePassword } = parsed.data

  if (email && email !== existing.email) {
    const conflict = await prisma.user.findUnique({ where: { email } })
    if (conflict) return NextResponse.json({ message: 'E-mail já cadastrado' }, { status: 409 })
  }

  const normalizedDoc = cpfCnpj ? normalizeCpfCnpj(cpfCnpj) : cpfCnpj
  if (normalizedDoc && normalizedDoc !== existing.cpfCnpj) {
    const conflict = await prisma.user.findUnique({ where: { cpfCnpj: normalizedDoc } })
    if (conflict) return NextResponse.json({ message: 'CPF/CNPJ já cadastrado' }, { status: 409 })
  }

  const updateData: Record<string, unknown> = {}
  if (name !== undefined) updateData.name = name
  if (email !== undefined) updateData.email = email
  if (cpfCnpj !== undefined) updateData.cpfCnpj = normalizedDoc ?? null
  if (phone !== undefined) updateData.phone = phone ?? null
  if (roleId !== undefined) updateData.roleId = roleId
  if (status !== undefined) {
    updateData.status = status
    updateData.isActive = status === 'ACTIVE'
  }
  if (mustChangePassword !== undefined) updateData.mustChangePassword = mustChangePassword

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true, name: true, email: true, cpfCnpj: true, phone: true,
      status: true, mustChangePassword: true, createdAt: true,
      role: { select: { id: true, name: true, description: true } },
    },
  })

  await prisma.auditLog.create({
    data: { action: 'USER_UPDATED', entity: 'User', entityId: id, userId: admin.sub, metadata: parsed.data },
  }).catch(() => {})

  return NextResponse.json({ success: true, user })
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ message: 'Acesso negado' }, { status: 403 })
  const { id } = await params

  if (id === admin.sub) {
    return NextResponse.json({ message: 'Não é possível desativar seu próprio usuário' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 })

  await prisma.user.update({
    where: { id },
    data: { status: 'INACTIVE', isActive: false },
  })

  await prisma.auditLog.create({
    data: { action: 'USER_DEACTIVATED', entity: 'User', entityId: id, userId: admin.sub },
  }).catch(() => {})

  return NextResponse.json({ success: true })
}
