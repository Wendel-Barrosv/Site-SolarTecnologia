import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { selfRegisterSchema } from '@/lib/validations'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

function normalizeCpfCnpj(v: string) {
  return v.replace(/\D/g, '')
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`register:${ip}`, 3, 60 * 60 * 1000)
    if (!rl.allowed) {
      return NextResponse.json(
        { message: 'Muitas tentativas de cadastro. Tente novamente em 1 hora.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } }
      )
    }

    const body = await req.json()
    const parsed = selfRegisterSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ message: 'Dados inválidos', errors: parsed.error.flatten() }, { status: 400 })
    }
    const { name, email, cpfCnpj, phone, password } = parsed.data
    const normalizedDoc = normalizeCpfCnpj(cpfCnpj)

    const [emailExists, docExists] = await Promise.all([
      prisma.user.findUnique({ where: { email } }),
      prisma.user.findUnique({ where: { cpfCnpj: normalizedDoc } }),
    ])
    if (emailExists) return NextResponse.json({ message: 'E-mail já cadastrado' }, { status: 409 })
    if (docExists)   return NextResponse.json({ message: 'CPF/CNPJ já cadastrado' }, { status: 409 })

    let clientRole = await prisma.role.findUnique({ where: { name: 'client' } })
    if (!clientRole) {
      clientRole = await prisma.role.create({ data: { name: 'client', description: 'Cliente' } })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        cpfCnpj: normalizedDoc,
        phone,
        password: hashedPassword,
        status: 'PENDING',
        isActive: false,
        emailVerified: false,
        roleId: clientRole.id,
      },
    })

    await prisma.auditLog.create({
      data: { action: 'SELF_REGISTER', entity: 'User', entityId: user.id, userId: user.id, metadata: { email, cpfCnpj: normalizedDoc } },
    }).catch(() => {})

    return NextResponse.json({ success: true, pending: true }, { status: 201 })
  } catch (err) {
    console.error('Register error:', err)
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 })
  }
}
