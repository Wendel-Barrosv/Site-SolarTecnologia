interface RateLimitEntry {
  count: number
  resetAt: number
}

// In-memory store — adequate for single-server Docker deployments.
// For multi-instance setups, replace with a Redis-backed implementation.
const store = new Map<string, RateLimitEntry>()

setInterval(() => {
  const now = Date.now()
  store.forEach((entry, key) => {
    if (entry.resetAt < now) store.delete(key)
  })
}, 10 * 60 * 1000)

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfter?: number
}

export function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1 }
  }

  if (entry.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    }
  }

  entry.count++
  return { allowed: true, remaining: maxRequests - entry.count }
}

export function getClientIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}
