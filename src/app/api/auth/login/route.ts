import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signJWT, setAuthCookie } from '@/lib/auth'
import { loginSchema } from '@/lib/validations'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { cookies } from 'next/headers'

const STATUS_MESSAGES: Record<string, string> = {
  PENDING:  'Sua conta está aguardando aprovação do administrador.',
  BLOCKED:  'Sua conta foi bloqueada. Entre em contato com o suporte.',
  REJECTED: 'Sua solicitação de acesso foi recusada.',
  INACTIVE: 'Sua conta está inativa. Entre em contato com o suporte.',
}

function normalizeCpfCnpj(v: string) {
  return v.replace(/\D/g, '')
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`login:${ip}`, 5, 15 * 60 * 1000)
    if (!rl.allowed) {
      return NextResponse.json(
        { message: 'Muitas tentativas de login. Tente novamente em alguns minutos.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } }
      )
    }

    const body = await req.json()
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ message: 'Dados inválidos' }, { status: 400 })
    }
    const { identifier, password } = parsed.data

    // Find by email OR cpfCnpj
    const isEmail = identifier.includes('@')
    const user = isEmail
      ? await prisma.user.findUnique({ where: { email: identifier }, include: { role: true } })
      : await prisma.user.findUnique({ where: { cpfCnpj: normalizeCpfCnpj(identifier) }, include: { role: true } })

    // Generic message when user not found or wrong password (security)
    if (!user) {
      return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 })
    }

    // Check status before password verification (show specific message for blocked/pending)
    if (user.status !== 'ACTIVE') {
      const msg = STATUS_MESSAGES[user.status] ?? 'Acesso não permitido.'
      await prisma.auditLog.create({
        data: { action: 'LOGIN_BLOCKED', entity: 'User', entityId: user.id, userId: user.id, metadata: { reason: user.status } },
      }).catch(() => {})
      return NextResponse.json({ message: msg }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 })
    }

    await prisma.auditLog.create({
      data: { action: 'LOGIN', entity: 'User', entityId: user.id, userId: user.id },
    }).catch(() => {})

    const token = await signJWT({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role.name,
      clientId: user.clientId ?? undefined,
      status: user.status,
      mustChangePassword: user.mustChangePassword,
    })

    const cookie = setAuthCookie(token)
    const cookieStore = await cookies()
    cookieStore.set(cookie.name, cookie.value, cookie.options as Parameters<typeof cookieStore.set>[2])

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role.name, mustChangePassword: user.mustChangePassword },
    })
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 })
  }
}
