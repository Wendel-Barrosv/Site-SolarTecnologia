export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: { name: string }
  client?: { companyName: string }
  isActive: boolean
  createdAt: Date
}

export interface Ticket {
  id: string
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  category?: string
  clientId: string
  creatorId: string
  assigneeId?: string
  createdAt: Date
  updatedAt: Date
  closedAt?: Date
}

export interface TicketComment {
  id: string
  content: string
  isInternal: boolean
  ticketId: string
  authorId: string
  createdAt: Date
}

export interface Client {
  id: string
  companyName: string
  cnpj?: string
  email?: string
  phone?: string
  city?: string
  state?: string
  isActive: boolean
}

export const STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: 'Aberto',
  IN_PROGRESS: 'Em andamento',
  RESOLVED: 'Resolvido',
  CLOSED: 'Fechado',
}

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
  CRITICAL: 'Crítica',
}

export const STATUS_CLASSES: Record<TicketStatus, string> = {
  OPEN: 'status-open',
  IN_PROGRESS: 'status-progress',
  RESOLVED: 'status-resolved',
  CLOSED: 'status-closed',
}

export const PRIORITY_CLASSES: Record<TicketPriority, string> = {
  LOW: 'priority-low',
  MEDIUM: 'priority-medium',
  HIGH: 'priority-high',
  CRITICAL: 'priority-critical',
}
