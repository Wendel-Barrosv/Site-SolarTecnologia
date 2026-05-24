import { z } from 'zod'

// ─── Auth ────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  identifier: z.string().min(3, 'Informe seu e-mail ou CPF/CNPJ'),
  password: z.string().min(1, 'Senha obrigatória'),
})

export const strongPassword = z.string()
  .min(8, 'Mínimo 8 caracteres')
  .regex(/[A-Z]/, 'Deve conter letra maiúscula')
  .regex(/[a-z]/, 'Deve conter letra minúscula')
  .regex(/[0-9]/, 'Deve conter número')
  .regex(/[!@#$%^&*(),.?":{}|<>_\-+=]/, 'Deve conter caractere especial')

export const selfRegisterSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('E-mail inválido'),
  cpfCnpj: z.string().min(11, 'CPF ou CNPJ obrigatório'),
  phone: z.string().optional(),
  password: strongPassword,
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
})

// kept for backward compat with existing imports
export const registerSchema = selfRegisterSchema

export const forgotPasswordSchema = z.object({
  email: z.string().email('E-mail inválido'),
})

// ─── Tickets ─────────────────────────────────────────────────────────
export const ticketSchema = z.object({
  title: z.string().min(5, 'Título deve ter pelo menos 5 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  category: z.string().optional(),
})

export const commentSchema = z.object({
  content: z.string().min(1, 'Comentário não pode ser vazio'),
  isInternal: z.boolean().optional().default(false),
})

// ─── Contact ─────────────────────────────────────────────────────────
export const contactSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  company: z.string().min(2, 'Empresa obrigatória'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone obrigatório'),
  serviceType: z.string().min(1, 'Selecione um serviço'),
  description: z.string().min(10, 'Descreva sua necessidade'),
})

// ─── Admin user management ────────────────────────────────────────────
export const adminCreateUserSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('E-mail inválido'),
  cpfCnpj: z.string().optional(),
  phone: z.string().optional(),
  roleId: z.string().min(1, 'Perfil obrigatório'),
  status: z.enum(['PENDING', 'ACTIVE', 'INACTIVE', 'BLOCKED', 'REJECTED']).default('ACTIVE'),
  password: z.string().min(8, 'Mínimo 8 caracteres').optional().or(z.literal('')),
  mustChangePassword: z.boolean().default(false),
})

export const adminUpdateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  cpfCnpj: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  roleId: z.string().optional(),
  status: z.enum(['PENDING', 'ACTIVE', 'INACTIVE', 'BLOCKED', 'REJECTED']).optional(),
  mustChangePassword: z.boolean().optional(),
})

export const resetPasswordSchema = z.object({
  password: strongPassword.optional().or(z.literal('')),
  mustChangePassword: z.boolean().default(true),
})

// ─── Types ───────────────────────────────────────────────────────────
export type LoginInput = z.infer<typeof loginSchema>
export type SelfRegisterInput = z.infer<typeof selfRegisterSchema>
export type RegisterInput = z.infer<typeof selfRegisterSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type TicketInput = z.infer<typeof ticketSchema>
export type CommentInput = z.infer<typeof commentSchema>
export type ContactInput = z.infer<typeof contactSchema>
export type AdminCreateUserInput = z.infer<typeof adminCreateUserSchema>
export type AdminUpdateUserInput = z.infer<typeof adminUpdateUserSchema>
