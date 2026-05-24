import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

function getJwtSecret(): Uint8Array {
  const rawSecret = process.env.JWT_SECRET
  if (!rawSecret) throw new Error('JWT_SECRET environment variable must be set')
  return new TextEncoder().encode(rawSecret)
}

const protectedRoutes = ['/dashboard']
const authRoutes = ['/auth/login', '/auth/cadastro', '/auth/recuperar-senha']

export async function middleware(request: NextRequest) {
  const jwtSecret = getJwtSecret()
  const { pathname } = request.nextUrl
  const token = request.cookies.get('solar_auth')?.value

  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r))
  const isAuth = authRoutes.some((r) => pathname.startsWith(r))

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    try {
      await jwtVerify(token, jwtSecret)
    } catch {
      const response = NextResponse.redirect(new URL('/auth/login', request.url))
      response.cookies.delete('solar_auth')
      return response
    }
  }

  if (isAuth && token) {
    try {
      await jwtVerify(token, jwtSecret)
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } catch {
      // invalid token — let them proceed to auth pages
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
}
