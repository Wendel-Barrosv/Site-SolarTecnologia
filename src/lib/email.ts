import nodemailer from 'nodemailer'
import { prisma } from '@/lib/prisma'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

export interface ContactEmailData {
  name: string
  company: string
  email: string
  phone: string
  serviceType: string
  description: string
}

const SERVICE_LABELS: Record<string, string> = {
  monitoramento: 'Monitoramento de usinas',
  crm: 'CRM Solar',
  financeiro: 'Faturamento & Cobrança',
  portal: 'Portal do Cliente',
  completo: 'Plataforma completa',
  outro: 'Outro',
}

async function resolveSmtpConfig() {
  const rows = await prisma.systemConfig.findMany({
    where: { key: { in: ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_from', 'smtp_to'] } },
  })
  const db: Record<string, string> = {}
  for (const r of rows) db[r.key] = r.value

  return {
    host: db.smtp_host || process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(db.smtp_port || process.env.SMTP_PORT || '587'),
    user: db.smtp_user || process.env.SMTP_USER || '',
    pass: db.smtp_pass || process.env.SMTP_PASS || '',
    from: db.smtp_from || process.env.SMTP_FROM || db.smtp_user || process.env.SMTP_USER || '',
    to: db.smtp_to || process.env.SMTP_TO || 'contato@solartecnologia.com',
  }
}

export async function sendContactNotification(data: ContactEmailData) {
  const smtp = await resolveSmtpConfig()

  if (!smtp.user || !smtp.pass) {
    throw new Error('SMTP não configurado. Acesse Dashboard → Configurações para ativar o envio de e-mails.')
  }

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: false,
    auth: { user: smtp.user, pass: smtp.pass },
  })

  const serviceLabel = escapeHtml(SERVICE_LABELS[data.serviceType] ?? data.serviceType)
  const safeName = escapeHtml(data.name)
  const safeCompany = escapeHtml(data.company)
  const safeEmail = escapeHtml(data.email)
  const safePhone = escapeHtml(data.phone)
  const safeDescription = escapeHtml(data.description)

  await transporter.sendMail({
    from: `"Solar Tecnologia" <${smtp.from}>`,
    to: smtp.to,
    subject: `Novo lead: ${data.name} — ${data.company}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
        <div style="background:#1e3a5f;padding:24px 28px">
          <h2 style="color:#fff;margin:0;font-size:20px">Nova solicitação de apresentação</h2>
          <p style="color:#93c5fd;margin:4px 0 0;font-size:13px">Solar Tecnologia — Solar Wave</p>
        </div>
        <div style="padding:28px;background:#fff">
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:8px 0;color:#6b7280;width:140px">Nome</td><td style="padding:8px 0;font-weight:600;color:#111">${safeName}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280">Empresa</td><td style="padding:8px 0;font-weight:600;color:#111">${safeCompany}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280">E-mail</td><td style="padding:8px 0"><a href="mailto:${safeEmail}" style="color:#2563eb">${safeEmail}</a></td></tr>
            <tr><td style="padding:8px 0;color:#6b7280">Telefone</td><td style="padding:8px 0"><a href="tel:${safePhone}" style="color:#2563eb">${safePhone}</a></td></tr>
            <tr><td style="padding:8px 0;color:#6b7280">Serviço</td><td style="padding:8px 0">${serviceLabel}</td></tr>
          </table>
          <div style="margin-top:20px;padding:16px;background:#f9fafb;border-radius:6px;border-left:3px solid #2563eb">
            <p style="margin:0 0 6px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em">Descrição da necessidade</p>
            <p style="margin:0;color:#111;font-size:14px;line-height:1.6">${safeDescription}</p>
          </div>
        </div>
        <div style="background:#f3f4f6;padding:16px 28px;font-size:12px;color:#9ca3af;text-align:center">
          Recebido via formulário do site solartecnologia.com.br
        </div>
      </div>
    `,
    text: `
Novo lead — Solar Tecnologia

Nome: ${data.name}
Empresa: ${data.company}
E-mail: ${data.email}
Telefone: ${data.phone}
Serviço: ${SERVICE_LABELS[data.serviceType] ?? data.serviceType}

Necessidade:
${data.description}
    `.trim(),
  })
}
