import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { contactSchema } from '@/lib/validations'
import { sendContactNotification } from '@/lib/email'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`contact:${ip}`, 5, 60 * 60 * 1000)
    if (!rl.allowed) {
      return NextResponse.json(
        { message: 'Muitas solicitações. Tente novamente em 1 hora.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } }
      )
    }

    const body = await req.json()
    const parsed = contactSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ message: 'Dados inválidos', errors: parsed.error.flatten() }, { status: 400 })
    }

    const contact = await prisma.contactRequest.create({
      data: parsed.data,
    })

    // Send notification email — non-blocking: a failure here doesn't reject the lead
    sendContactNotification(parsed.data).catch((err) => {
      console.error('Email notification failed (lead was saved):', err)
    })

    return NextResponse.json({ success: true, id: contact.id }, { status: 201 })
  } catch (err) {
    console.error('Contact request error:', err)
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 })
  }
}
