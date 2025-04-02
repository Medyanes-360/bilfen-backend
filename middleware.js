// middleware.js
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const allowedOrigins = ['http://localhost:3000','http://localhost:3001','http://localhost:3002'];

const authMiddleware = withAuth(
  function middleware(req) {
    // auth işlemleri withAuth içinde
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

export default async function mainMiddleware(req) {
  const origin = req.headers.get('origin') || '';
  const method = req.method;

  // OPTIONS preflight isteği
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

  // Normal isteklerde auth middleware’i çalıştır
  const response = await authMiddleware(req);

  // CORS header'larını ekle
  if (allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'], // Hem admin sayfaları hem API route’ları
};
