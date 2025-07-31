import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

// Simple in-memory rate limiting (use Redis in production)
const rateLimit = new Map()

function getRateLimitKey(ip: string, path: string): string {
  return `${ip}:${path}`
}

function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const requests = rateLimit.get(key) || []
  
  // Remove expired requests
  const validRequests = requests.filter((time: number) => now - time < windowMs)
  
  if (validRequests.length >= limit) {
    return true
  }
  
  validRequests.push(now)
  rateLimit.set(key, validRequests)
  
  return false
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    const isOnboardingPage = req.nextUrl.pathname.startsWith('/onboarding')
    const isApiRoute = req.nextUrl.pathname.startsWith('/api')
    const isPublicPage = ['/', '/demo'].includes(req.nextUrl.pathname)

    // Rate limiting for API routes
    if (isApiRoute) {
      const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
      let limit = 100 // Default: 100 requests per hour
      let windowMs = 60 * 60 * 1000 // 1 hour

      if (req.nextUrl.pathname.startsWith('/api/auth/')) {
        limit = 10 // Auth: 10 requests per 15 minutes
        windowMs = 15 * 60 * 1000
      } else if (req.nextUrl.pathname.startsWith('/api/user/')) {
        limit = 50 // User operations: 50 requests per hour
      } else if (req.nextUrl.pathname.startsWith('/api/responses') || 
                 req.nextUrl.pathname.startsWith('/api/evaluate-assessment') ||
                 req.nextUrl.pathname.startsWith('/api/assessments/')) {
        limit = 200 // Assessment operations: 200 requests per hour (higher for assessment workflows)
        windowMs = 60 * 60 * 1000
      } else if (req.nextUrl.pathname.startsWith('/api/generate-live-environment') ||
                 req.nextUrl.pathname.startsWith('/api/assessment-chatbot')) {
        limit = 300 // AI/simulation operations: 300 requests per hour (these can be intensive)
        windowMs = 60 * 60 * 1000
      }

      const key = getRateLimitKey(ip, req.nextUrl.pathname)
      
      if (isRateLimited(key, limit, windowMs)) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429 }
        )
      }
      
      return NextResponse.next()
    }

    // Allow public pages
    if (isPublicPage) {
      return NextResponse.next()
    }

    if (isAuthPage) {
      if (isAuth) {
        if (!token.role) {
          return NextResponse.redirect(new URL('/onboarding', req.url))
        }
        // Redirect to appropriate dashboard based on role
        const dashboardUrl = token.role === 'recruiter' ? '/recruiter' : '/candidate'
        return NextResponse.redirect(new URL(dashboardUrl, req.url))
      }
      return NextResponse.next()
    }

    if (isOnboardingPage) {
      if (!isAuth) {
        return NextResponse.redirect(new URL('/auth', req.url))
      }
      if (token.role) {
        // User already has a role, redirect to dashboard
        const dashboardUrl = token.role === 'recruiter' ? '/recruiter' : '/candidate'
        return NextResponse.redirect(new URL(dashboardUrl, req.url))
      }
      return NextResponse.next()
    }

    if (!isAuth) {
      return NextResponse.redirect(new URL('/auth', req.url))
    }

    if (!token.role) {
      return NextResponse.redirect(new URL('/onboarding', req.url))
    }

    // Role-based route protection
    const pathname = req.nextUrl.pathname
    
    if (pathname.startsWith('/recruiter') && token.role !== 'recruiter') {
      return NextResponse.redirect(new URL('/candidate', req.url))
    }
    
    if (pathname.startsWith('/candidate') && token.role !== 'candidate') {
      return NextResponse.redirect(new URL('/recruiter', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => true, // Let the middleware function handle authorization
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
