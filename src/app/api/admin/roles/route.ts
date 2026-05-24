import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

async function requireAdmin() {
  const s = await getSession()
  return s?.role === 'admin' ? s : null
}

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ message: 'Acesso negado' }, { status: 403 })

  const roles = await prisma.role.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, description: true },
  })

  return NextResponse.json({ roles })
}
