import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import { getToken } from 'next-auth/jwt';

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
    const isAdminPage = req.nextUrl.pathname.startsWith('/admin');
    
    // Redirect authenticated admin users to admin dashboard
    if (isAuth && token?.role === 'admin' && req.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    
    // Redirect authenticated admin users from login page to admin dashboard
    if (isAuth && token?.role === 'admin' && isAuthPage) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    
    // Protect admin routes - only allow admin users
    if (isAdminPage) {
      if (!isAuth) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
      if (token?.role !== 'admin') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/', '/admin/:path*', '/auth/:path*'],
};













