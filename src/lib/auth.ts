import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'solar_auth'

function getJwtSecret(): Uint8Array {
  const rawSecret = process.env.JWT_SECRET
  if (!rawSecret) throw new Error('JWT_SECRET environment variable must be set')
  return new TextEncoder().encode(rawSecret)
}

export interface JWTPayload {
  sub: string
  email: string
  name: string
  role: string
  clientId?: string
  status?: string
  mustChangePassword?: boolean
}

export async function signJWT(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getJwtSecret())
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  const jwtSecret = getJwtSecret()

  try {
    const { payload } = await jwtVerify(token, jwtSecret)
    return payload as unknown as JWTPayload
  } catch {
    return null
  }
}

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyJWT(token)
}

export function setAuthCookie(token: string): { name: string; value: string; options: Record<string, unknown> } {
  return {
    name: COOKIE_NAME,
    value: token,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    },
  }
}

export const COOKIE_NAME_EXPORT = COOKIE_NAME
