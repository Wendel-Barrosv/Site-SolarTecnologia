import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { forgotPasswordSchema } from '@/lib/validations'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`forgot:${ip}`, 3, 60 * 60 * 1000)
    if (!rl.allowed) {
      // Return success to prevent email enumeration, but silently block
      return NextResponse.json(
        { success: true, message: 'Se o e-mail existir, as instruções foram enviadas.' },
        { headers: { 'Retry-After': String(rl.retryAfter) } }
      )
    }

    const body = await req.json()
    const parsed = forgotPasswordSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ message: 'E-mail inválido' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email: parsed.data.email } })
    if (user) {
      const rawToken = crypto.randomBytes(32).toString('hex')
      // Hash before storing — raw token is only sent via email, never persisted in plaintext
      const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex')
      const expiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken: hashedToken, resetTokenExp: expiry },
      })

      // In production: send email with reset link using rawToken (not hashedToken)
      console.log(`[DEV] Reset link: http://localhost:3101/auth/redefinir-senha?token=${rawToken}`)
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({ success: true, message: 'Se o e-mail existir, as instruções foram enviadas.' })
  } catch (err) {
    console.error('Forgot password error:', err)
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 })
  }
}
