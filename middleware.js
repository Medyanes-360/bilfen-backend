import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];

// Auth middleware’i sarıyoruz
const authMiddleware = withAuth(
  function middleware(req) {
    return NextResponse.next(); // Auth başarılıysa devam et
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token && token.role === 'admin',
    },
    pages: {
      signIn: '/login',
    },
  }
);

// Asıl middleware fonksiyonumuz
export function mainMiddleware(req) {
  const origin = req.headers.get('origin') || '';
  const method = req.method;

  // Preflight (OPTIONS) isteği için CORS ayarları
  if (method === 'OPTIONS') {
    const res = new NextResponse(null, { status: 204 });
    if (allowedOrigins.includes(origin)) {
      res.headers.set('Access-Control-Allow-Origin', origin);
      res.headers.set('Access-Control-Allow-Credentials', 'true');
      res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
    return res;
  }

  // Auth middleware'i çağır
  const response = authMiddleware(req);

  // CORS header'larını her response'a ekle
  if (allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  return response;
}

// Middleware hangi yolları kapsayacak?
export const config = {
  matcher: ['/admin/:path*', '/api/:path*'], // Admin sayfaları ve API route'ları
};
