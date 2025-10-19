import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
// Rate limiting temporarily disabled due to build issues

export async function apiSecurityMiddleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // Skip non-API routes
  if (!path.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Get client IP for rate limiting
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  
  try {
    // Apply CORS headers for API routes
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_SITE_URL || '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return response;
    }
    
    // Check for authentication on protected routes
    if (
      path.startsWith('/api/admin') || 
      path.startsWith('/api/orders') ||
      path.startsWith('/api/profile') ||
      path.startsWith('/api/checkout') ||
      path.includes('/api/products/import') ||
      path.includes('/api/products/export')
    ) {
      const token = await getToken({ req });
      
      // Require authentication for protected routes
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      // Require admin role for admin routes
      if (path.startsWith('/api/admin') && token.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      
      // Rate limiting temporarily disabled
    }
    
    // Add security headers
    response.headers.set('Content-Security-Policy', "default-src 'self'");
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    return response;
  } catch (error) {
    console.error('API Security Middleware Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}