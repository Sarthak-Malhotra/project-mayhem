import { NextRequest } from 'next/server'

// In-memory rate limiting map
// Maps key (e.g. "IP:action") -> { count, resetTime }
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>()

/**
 * Checks if a client IP is rate limited for a specific action.
 * @param ip The client IP address.
 * @param limit Max number of requests allowed in the window.
 * @param windowMs The window duration in milliseconds.
 * @param actionName The action context name.
 */
export function isRateLimited(ip: string, limit: number, windowMs: number, actionName: string = 'global'): boolean {
  const now = Date.now()
  const key = `${ip}:${actionName}`
  const data = ipRequestCounts.get(key)
  
  if (!data || now > data.resetTime) {
    ipRequestCounts.set(key, {
      count: 1,
      resetTime: now + windowMs
    })
    return false
  }
  
  data.count++
  if (data.count > limit) {
    return true
  }
  
  return false
}

/**
 * Retrieves the primary client IP address from request headers.
 */
export function getClientIp(request: NextRequest): string {
  const xForwardedFor = request.headers.get('x-forwarded-for')
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim()
  }
  const xRealIp = request.headers.get('x-real-ip')
  if (xRealIp) return xRealIp.trim()
  return '127.0.0.1'
}

/**
 * Validates request Origin or Referer against the Host header to mitigate CSRF attacks.
 */
export function verifyCsrf(request: NextRequest): boolean {
  // Safe HTTP methods do not require CSRF verification
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return true
  }

  const host = request.headers.get('host')
  if (!host) {
    return false
  }

  const origin = request.headers.get('origin')
  if (origin) {
    try {
      const originUrl = new URL(origin)
      return originUrl.host === host
    } catch {
      return false
    }
  }

  const referer = request.headers.get('referer')
  if (referer) {
    try {
      const refererUrl = new URL(referer)
      return refererUrl.host === host
    } catch {
      return false
    }
  }

  // Fallback: If neither origin nor referer is sent (e.g. API clients),
  // we allow it, but browsers will always send at least one for state-changing requests.
  return true
}
