import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Redirect to /login if not authenticated and trying to access protected page
  if (!token && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is logged in and tries to go to /login, redirect them to home
  if (token && pathname === '/login'||token && pathname === '/signup') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  if(!token && pathname ==='/interview')
  {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/dashboard', '/profile','/interview'], // add protected routes here
};
