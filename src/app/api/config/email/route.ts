import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'
import { z } from 'zod'

const EMAIL_KEYS = ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_from', 'smtp_to'] as const
type EmailKey = (typeof EMAIL_KEYS)[number]

const emailConfigSchema = z.object({
  action: z.enum(['save', 'test']).optional(),
  smtp_host: z.string().max(253).optional(),
  smtp_port: z.string().regex(/^\d{1,5}$/).optional().refine(
    (v) => !v || (parseInt(v) >= 1 && parseInt(v) <= 65535),
    'Porta inválida'
  ),
  smtp_user: z.string().max(254).optional(),
  smtp_pass: z.string().max(255).optional(),
  smtp_from: z.string().max(254).optional(),
  smtp_to: z.string().max(254).optional(),
})

async function requireAdmin() {
  const session = await getSession()
  if (!session || session.role !== 'admin') return null
  return session
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 })
  }

  const rows = await prisma.systemConfig.findMany({ where: { key: { in: [...EMAIL_KEYS] } } })
  const config: Record<string, string> = {}
  for (const row of rows) config[row.key] = row.value

  // Fallback to env vars when DB has no value yet
  const result = {
    smtp_host: config.smtp_host ?? process.env.SMTP_HOST ?? 'smtp.gmail.com',
    smtp_port: config.smtp_port ?? process.env.SMTP_PORT ?? '587',
    smtp_user: config.smtp_user ?? process.env.SMTP_USER ?? '',
    smtp_pass: config.smtp_pass ? '••••••••' : (process.env.SMTP_PASS ? '••••••••' : ''),
    smtp_from: config.smtp_from ?? process.env.SMTP_FROM ?? '',
    smtp_to: config.smtp_to ?? process.env.SMTP_TO ?? 'contato@solartecnologia.com',
    configured: !!(config.smtp_user || process.env.SMTP_USER),
  }

  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 })
  }

  const body = await req.json()
  const parsed = emailConfigSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ message: 'Dados inválidos', errors: parsed.error.flatten() }, { status: 400 })
  }
  const { action, smtp_host, smtp_port, smtp_user, smtp_pass, smtp_from, smtp_to } = parsed.data

  if (action === 'test') {
    // Resolve password: if still masked, read current saved value
    let resolvedPass = smtp_pass
    if (smtp_pass === '••••••••' || smtp_pass === '') {
      const saved = await prisma.systemConfig.findUnique({ where: { key: 'smtp_pass' } })
      resolvedPass = saved?.value ?? process.env.SMTP_PASS ?? ''
    }

    try {
      const transport = nodemailer.createTransport({
        host: smtp_host || 'smtp.gmail.com',
        port: parseInt(smtp_port || '587'),
        secure: false,
        auth: { user: smtp_user, pass: resolvedPass },
      })
      await transport.verify()
      return NextResponse.json({ success: true, message: 'Conexão SMTP verificada com sucesso.' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha na conexão'
      return NextResponse.json({ success: false, message: msg }, { status: 422 })
    }
  }

  // Save — upsert each key
  const updates: { key: EmailKey; value: string }[] = [
    { key: 'smtp_host', value: smtp_host ?? '' },
    { key: 'smtp_port', value: smtp_port ?? '587' },
    { key: 'smtp_user', value: smtp_user ?? '' },
    { key: 'smtp_from', value: smtp_from ?? '' },
    { key: 'smtp_to', value: smtp_to ?? '' },
  ]

  // Only update password if user provided a real value (not the mask)
  if (smtp_pass && smtp_pass !== '••••••••') {
    updates.push({ key: 'smtp_pass', value: smtp_pass })
  }

  await Promise.all(
    updates.map((u) =>
      prisma.systemConfig.upsert({
        where: { key: u.key },
        update: { value: u.value },
        create: { key: u.key, value: u.value },
      })
    )
  )

  return NextResponse.json({ success: true })
}
