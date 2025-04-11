import { NextResponse } from "next/server";

export function middleware(request) {
  const origin = request.headers.get("origin") || "";

  // You can add domain checks here if needed
  const allowedOrigin = origin.includes("localhost")
    ? "http://localhost:3000"
    : "https://bilfen-frontend.vercel.app";

  const headers = new Headers({
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  });

  // Handle preflight requests (OPTIONS)
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers,
    });
  }

  const response = NextResponse.next();
  headers.forEach((value, key) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
