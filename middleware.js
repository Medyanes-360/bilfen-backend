import { NextResponse } from "next/server";

export function middleware(request) {
  const response = NextResponse.next();

  // CORS headers
  response.headers.set("Access-Control-Allow-Origin", "https://bilfen-frontend.vercel.app");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Allow-Credentials", "true");

  // OPTIONS request için özel yanıt
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: response.headers,
    });
  }

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
