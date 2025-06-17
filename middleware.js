import { NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  // Get the path of the request
  const path = request.nextUrl.pathname;

  // Check if the path is for the admin dashboard (excluding login)
  if (path.startsWith('/admin') && !path.includes('/admin/login')) {
    // Check for authentication token
    const adminAuthToken = request.cookies.get('admin_auth_token')?.value;

    if (!adminAuthToken) {
      // If not authenticated, redirect to admin login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Check if the path is for the mentor dashboard (excluding login)
  if (path.startsWith('/mentor') && !path.includes('/mentor/login')) {
    // Check for authentication token
    const mentorAuthToken = request.cookies.get('mentor_auth_token')?.value;

    if (!mentorAuthToken) {
      // If not authenticated, redirect to mentor login
      return NextResponse.redirect(new URL('/mentor/login', request.url));
    }
  }

  // Check if the path is for the student dashboard
  if (path.startsWith('/dashboard') ||
      path.startsWith('/home') ||
      path.startsWith('/explore') ||
      path.startsWith('/learn') ||
      path.startsWith('/reels') ||
      path.startsWith('/profile')) {
    // Check for authentication token
    const studentAuthToken = request.cookies.get('student_auth_token')?.value;

    if (!studentAuthToken) {
      // If not authenticated, redirect to student login
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Continue with the request if authentication checks pass
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/admin/:path*',
    '/mentor/:path*',
    '/dashboard/:path*',
    '/home',
    '/explore',
    '/learn',
    '/reels',
    '/profile',
  ],
};