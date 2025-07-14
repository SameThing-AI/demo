import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    const isOnboardingPage = req.nextUrl.pathname.startsWith('/onboarding')
    const isApiRoute = req.nextUrl.pathname.startsWith('/api')
    const isPublicPage = ['/', '/demo'].includes(req.nextUrl.pathname)

    // Allow API routes to handle their own auth
    if (isApiRoute) {
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
