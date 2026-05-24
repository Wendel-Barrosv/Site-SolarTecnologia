import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const roles = [
    { name: 'admin',       description: 'Administrador do sistema' },
    { name: 'operador',    description: 'Operador' },
    { name: 'financeiro',  description: 'Financeiro' },
    { name: 'comercial',   description: 'Comercial' },
    { name: 'client',      description: 'Cliente' },
    { name: 'investidor',  description: 'Investidor' },
    { name: 'support',     description: 'Suporte técnico' },
  ]

  const roleMap: Record<string, { id: string }> = {}
  for (const r of roles) {
    const role = await prisma.role.upsert({
      where: { name: r.name },
      update: { description: r.description },
      create: r,
    })
    roleMap[r.name] = role
  }

  const adminPass = await bcrypt.hash('Admin@2024', 12)
  await prisma.user.upsert({
    where: { email: 'admin@solartecnologia.com.br' },
    update: { status: 'ACTIVE', isActive: true },
    create: {
      name: 'Administrador Solar',
      email: 'admin@solartecnologia.com.br',
      password: adminPass,
      status: 'ACTIVE',
      isActive: true,
      emailVerified: true,
      roleId: roleMap['admin'].id,
    },
  })

  const demoClient = await prisma.client.upsert({
    where: { cnpj: '00.000.000/0001-00' },
    update: {},
    create: {
      companyName: 'Empresa Demo LTDA',
      cnpj: '00.000.000/0001-00',
      phone: '(85) 99999-9999',
      email: 'demo@empresademo.com.br',
      city: 'Fortaleza',
      state: 'CE',
      isActive: true,
    },
  })

  const clientPass = await bcrypt.hash('Cliente@2024', 12)
  await prisma.user.upsert({
    where: { email: 'cliente@empresademo.com.br' },
    update: { status: 'ACTIVE', isActive: true },
    create: {
      name: 'João Silva',
      email: 'cliente@empresademo.com.br',
      password: clientPass,
      status: 'ACTIVE',
      isActive: true,
      emailVerified: true,
      roleId: roleMap['client'].id,
      clientId: demoClient.id,
    },
  })

  console.log('Seed concluído!')
  console.log('Admin:   admin@solartecnologia.com.br / Admin@2024')
  console.log('Cliente: cliente@empresademo.com.br  / Cliente@2024')
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
