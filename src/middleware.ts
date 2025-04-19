// Add this at the top of the file
export const config = {
  matcher: [
    // Add _next/image to matcher
    '/_next/image/:path*',
    // Match exact paths from your protectedRoutes
    '/admin',
    '/add/category',
    '/admin/:path*',
    '/:categorySlug/edit',
  ],
}

import { ROLES } from '@/utils/consts'
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

// Role checking helper
function hasRequiredRole(userRoles: number[], requiredRoles: number[]) {
  return userRoles.some((role) => requiredRoles.includes(role))
}

// Path to role mapping
const protectedRoutes = {
  '/admin': [ROLES.ADMIN],
  '/add/category': [ROLES.ADMIN],
  '/:categorySlug/edit': [ROLES.ADMIN],
}

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })

  // Check path against required roles
  for (const [path, requiredRoles] of Object.entries(protectedRoutes)) {
    if (request.nextUrl.pathname.startsWith(path)) {
      const userRoles = (token?.roles ?? []) as number[]

      if (!hasRequiredRole(userRoles, requiredRoles)) {
        return NextResponse.redirect(new URL('/not-found', request.url))
      }
    }
  }

  return NextResponse.next()
}
