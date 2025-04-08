import { NextResponse } from "next/server";

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
];

export default function middleware(req) {
  const origin = req.headers.get("origin") || "";
  const method = req.method;

  // OPTIONS isteği için preflight cevabı
  if (method === "OPTIONS") {
    const res = new NextResponse(null, { status: 204 });
    if (allowedOrigins.includes(origin)) {
      res.headers.set("Access-Control-Allow-Origin", origin);
      res.headers.set("Access-Control-Allow-Credentials", "true");
      res.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      res.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );
    }
    return res;
  }

  // Normal response (auth başarılıysa burası çalışır)
  const response = NextResponse.next();

  // CORS header ekle
  if (allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};